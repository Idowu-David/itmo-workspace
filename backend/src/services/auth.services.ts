import User from "../models/User";

export const checkUserExists = async (email: string) => {
  return await User.findOne({ email });
};

export const checkUserDataExists = async (email: string) => {
  return User.findOne({ email }).select('+password');
};

export const addNewUser = async (firstName: string, lastName: string, email: string, passwordHash: string) => {
  return User.create({
    firstName, lastName, email, password: passwordHash
  })
}

export const getUserByID = async (id: string) => {
  return await User.findById(id)
}