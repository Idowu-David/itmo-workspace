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

    const existingUser = await checkUserExists(email);

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await addNewUser(firstName, lastName, email, passwordHash);

    if (!newUser) {
      return res.status(404).json({
        status: "error",
        message: "User registration error occured",
      });
    }

    const token = generateToken({
      id: newUser._id.toString(),
      role: newUser.role,
    });

    return res.status(201).json({
      status: "success",
      message: "User account created successfully",
      token,
      user: {
        id: newUser._id.toString(),
        firstName: firstName,
        lastName: lastName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(`Error occured during sign up: ${error}`);
    res.status(400).json({
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
