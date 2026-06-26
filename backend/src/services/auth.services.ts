import User from "../models/User";

export const checkUserExists = async (email: string) => {
  return await User.findOne({ email });
};

export const checkUserDataExists = async (email: string) => {
  return User.findOne({ email }).select('+password');
};

export const addNewUser = async (firstName: string, lastName: string, email: string, passwordHash: string, verificationToken: string) => {
  return User.create({
    firstName, lastName, email, password: passwordHash, isVerified: false, verificationToken, verificationTokenExpiry: new Date(Date.now() + 30 * 60 * 1000)
  })
}

export const getUserByID = async (id: string) => {
  return await User.findById(id)
}