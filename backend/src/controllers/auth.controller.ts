import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User";
import {
  addNewUser,
  checkUserDataExists,
  checkUserExists,
  getUserByID,
} from "../services/auth.services";
import { OAuth2Client } from "google-auth-library";
import { sendVerificationEmail } from "../utils/sendVerificationEmail";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/sendPasswordResetEmail";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface IToken {
  id: string;
  role: "student" | "admin";
}

const generateToken = ({ id, role }: IToken): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// POST /api/auth/google
export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, given_name, family_name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Google data",
      });
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = await User.create({
          firstName: given_name || "User",
          lastName: family_name || "",
          email,
          googleId,
        });
      }
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    return res.status(200).json({
      status: "success",
      message: "Google login successful",
      token,
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Google login failed",
    });
  }
};

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All input fields are required",
      });
    }

    if (!email.endsWith("@live.unilag.edu.ng")) {
      return res.status(400).json({
        status: "error",
        message: "Please register with your official Unilag student email",
      });
    }

    const existingUser = await checkUserExists(email);

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await addNewUser(
      firstName,
      lastName,
      email,
      passwordHash,
      verificationToken,
    );

    if (!newUser) {
      return res.status(404).json({
        status: "error",
        message: "User registration error occured",
      });
    }
    console.log("BEFORE VERIFICATION");
    await sendVerificationEmail(email, verificationToken);
    console.log("AFTER VERIFICATION");

    return res.status(201).json({
      status: "success",
      message:
        "User account created successfully. Please check your email for verification",
      // user: {
      //   id: newUser._id.toString(),
      //   firstName: firstName,
      //   lastName: lastName,
      //   email: newUser.email,
      //   role: newUser.role,
      // },
    });
  } catch (error) {
    console.error(`Error occured during sign up: ${error}`);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    const user = await checkUserDataExists(email);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Password is incorrect",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        status: "error",
        message: "Please verify your email before logging in",
      });
    }

    const token = generateToken({ id: user._id.toString(), role: user.role });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token: token,
      user: {
        id: user._id.toString(),
        name: user.firstName + " " + user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`Error occured during login: ${error}`);
    return res.status(400).json({
      status: "error",
      message: "Server error",
    });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await getUserByID((req as any).user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error(`An internal server error occured: ${error}`);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "Token is required",
      });
    }
    const user = await User.findOne({ verificationToken: token }).select(
      "+verificationToken +verificationTokenExpiry",
    );

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid verification link" });
    }

    if (user.verificationTokenExpiry! < new Date()) {
      return res
        .status(400)
        .json({ status: "error", message: "Verification link expired" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return res
      .status(200)
      .json({ status: "success", message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

// POST /auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        status: "success",
        message:
          "If an account exists with this email, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    return res.status(200).json({
      status: "success",
      message:
        "If an account exists with this email, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};

// PATCH /auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    const { password } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ status: "error", message: "Token is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Password must be at least 6 characters",
        });
    }

    // find user with this token
    const user = await User.findOne({
      resetPasswordToken: token,
    }).select("+resetPasswordToken +resetPasswordTokenExpiry +password");

    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid or expired reset link" });
    }

    // check token hasn't expired
    if (user.resetPasswordTokenExpiry! < new Date()) {
      return res
        .status(400)
        .json({ status: "error", message: "Reset link has expired" });
    }

    // hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ status: "error", message: "Server error" });
  }
};