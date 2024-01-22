import { validateRequest } from "zod-express-middleware";
import express, { Request, Response } from "express";

export const teamController = express.Router();

teamController.get(
  "/",
  validateRequest({}),
  function (req: Request, res: Response) {
    res.status(200);
    res.json({ test: "ok" });
  },
);
