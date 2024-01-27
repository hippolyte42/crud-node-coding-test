import express from "express";
import { Usecases } from "../../application/init.application";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import { TeamEntitySchema } from "../../entities/team.entity";

const app = express();
const port = 3000;

export const http = async (usecases: Usecases) => {
  app.use(express.json());

  app.post(
    "/teams",
    validateRequest({
      body: TeamEntitySchema.omit({ id: true }),
    }),
    async function (req, res) {
      const result = await usecases.createTeamUsecase.execute(req.body);

      res.status(result.code);
      res.json(result.res);
    },
  );
  app.get("/teams/first-ancestors", async (req, res) => {
    const result = await usecases.getFirstAncestorTeamsUsecase.execute();

    res.status(result.code);
    res.json(result.res);
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

      res.status(result.code);
      res.json(result.res);
    },
  );
  app.patch(
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

      res.status(result.code);
      res.json(result.res);
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
      res.status(result.code);
      res.json(result.res);
    },
  );

  app.patch(
    "/teams/add-team-member",
    validateRequest({
      body: z.object({
        teamId: z.string(),
        memberId: z.string(),
      }),
    }),
    async (req, res) => {
      const result = await usecases.addTeamMemberUsecase.execute(
        req.body.teamId,
        req.body.memberId,
      );
      res.status(result.code);
      res.json(result.res);
    },
  );
  app.patch(
    "/teams/remove-team-member",
    validateRequest({
      body: z.object({
        teamId: z.string(),
        memberId: z.string(),
      }),
    }),
    async (req, res) => {
      const result = await usecases.removeTeamMemberUsecase.execute(
        req.body.teamId,
        req.body.memberId,
      );
      res.status(result.code);
      res.json(result.res);
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
      res.status(result.code);
      res.json(result.res);
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
