import express from "express";
import { Usecases } from "../../application/init.application";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { TeamEntitySchema } from "../../entities/team.entity";
import { errorHandler } from "./middlewares/http.errors";
require("express-async-errors");

const app = express();
const port = 3000;

export const http = async (usecases: Usecases) => {
  // middlewares
  app.use(express.json());

  // error handling
  app.use(errorHandler);

  app.post(
    "/teams",
    validateRequest({
      body: TeamEntitySchema.omit({ id: true }),
    }),
    async function (req, res) {
      const result = await usecases.createTeamUsecase.execute(req.body);

      res.status(200);
      res.json(result);
    },
  );
  app.get("/teams/first-ancestors", async (req, res) => {
    const result = await usecases.getFirstAncestorTeamsUsecase.execute();

    res.status(200);
    res.json(result);
  });
  app.get(
    "/teams/:teamId",
    validateRequest({
      params: z.object({
        teamId: z.string(),
      }),
    }),
    async (req, res) => {
      const result = await usecases.getTeamUsecase.execute(req.params.teamId);

      res.status(200);
      res.json(result);
    },
  );

  app.delete(
    "/teams/:teamId",
    validateRequest({
      params: z.object({
        teamId: z.string(),
      }),
    }),
    async (req, res) => {
      const result = await usecases.deleteTeamUsecase.execute(
        req.params.teamId,
      );
      res.status(200);
      res.json(result);
    },
  );

  app.post(
    "/teams/:teamId/member",
    validateRequest({
      params: z.object({
        teamId: z.string(),
      }),
      body: z.object({
        memberId: z.string(),
      }),
    }),
    async (req, res) => {
      const result = await usecases.addTeamMemberUsecase.execute(
        req.params.teamId,
        req.body.memberId,
      );
      res.status(200);
      res.json(result);
    },
  );
  app.delete(
    "/teams/:teamId/member",
    validateRequest({
      params: z.object({
        teamId: z.string(),
      }),
      body: z.object({
        memberId: z.string(),
      }),
    }),
    async (req, res) => {
      const result = await usecases.removeTeamMemberUsecase.execute(
        req.params.teamId,
        req.body.memberId,
      );
      res.status(200);
      res.json(result);
    },
  );
  app.patch(
    "/teams/change-team-parent",
    validateRequest({
      body: z.object({
        teamId: z.string(),
        parentTeamId: z.string(),
      }),
    }),
    async (req, res) => {
      const result = await usecases.changeTeamParentUsecase.execute(
        req.body.teamId,
        req.body.parentTeamId,
      );
      res.status(200);
      res.json(result);
    },
  );
  app.put(
    "/teams/:teamId",
    validateRequest({
      params: z.object({
        teamId: z.string(),
      }),
      body: TeamEntitySchema.omit({ id: true }),
    }),
    async (req, res) => {
      const result = await usecases.updateTeamUsecase.execute(
        req.params.teamId,
        req.body,
      );

      res.status(200);
      res.json(result);
    },
  );

  const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  return {
    close: () => {
      server.close();
    },
  };
};
