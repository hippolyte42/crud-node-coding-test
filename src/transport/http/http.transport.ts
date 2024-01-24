import express from "express";
import { Usecases } from "../../application/init.application";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

const app = express();
const port = 3000;

export const http = async (usecases: Usecases) => {
  app.use(express.json());

  app.post(
    "/team",
    validateRequest({
      body: z.object({
        path: z.string(),
        memberIds: z.array(z.string()),
        name: z.string(),
      }),
    }),
    async function (req, res) {
      const result = await usecases.createTeamUsecase.execute(req.body);

      res.status(result.code);
      res.json(result.res);
    },
  );
  app.get(
    "/team/:teamId",
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
    "/team/:teamId",
    validateRequest({
      params: z.object({
        teamId: z.string(),
      }),
      body: z.object({
        path: z.string().optional(),
        memberIds: z.array(z.string()).optional(),
      }),
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
    "/team/:teamId",
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
    "/add-team-member",
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
    "/remove-team-member",
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
    "/add-child-team-to-team",
    validateRequest({
      body: z.object({
        childTeamId: z.string(),
        parentTeamId: z.string(),
      }),
    }),
    async (req, res) => {
      const result = await usecases.addChildTeamToTeamUsecase.execute(
        req.body.childTeamId,
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
