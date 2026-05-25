import express, { Request, Response } from "express";
import { deskPins, getAllDesks } from "../services/desk.services";
import Desk from "../models/Desk";


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

// GET /api/desks/pins — admin only
export const getDeskPins = async (req: Request, res: Response) => {
  try {
    const desks = await deskPins();

    return res.status(200).json({
      status: 'success',
      data: desks.map(d => ({
        deskNumber: d.deskNumber,
        pin: d.pin
      }))
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};