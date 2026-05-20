import express, { Request, Response } from "express";
import { getAllDesks } from "../services/desk.services";


// GET /api/desks
export const getDesks = async (req: Request, res: Response) => {
  try {
    const desks = await getAllDesks();

    if (!desks) {
      return res.status(400).json({
        status: "error",
        message: "Error occured while fetching desks",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Desks fetched successfully",
      data: desks,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error occured: ",
      error,
    });
  }
};
