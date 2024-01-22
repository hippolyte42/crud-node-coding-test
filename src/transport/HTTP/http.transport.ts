import express from "express";
import { teamController } from "./controllers/team.transport";

const app = express();
const port = 3000;

export const http = async () => {
  app.use(express.json());

  app.use("/team", teamController);

  const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  return {
    close: () => {
      server.close();
    },
  };
};
