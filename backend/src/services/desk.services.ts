import Desk from "../models/Desk";

export const getAllDesks = async () => {
  return await Desk.find({});
};
