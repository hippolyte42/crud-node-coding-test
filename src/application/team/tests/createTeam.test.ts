import { Collection, Db, MongoClient } from "mongodb";
import { TeamRepositoryPort } from "../../../repositories/ports/team.repository.port";
import { CreateTeamUsecase } from "../createTeam.usecase";
import { TeamModel } from "../../../repositories/mongo/models/team.model.mongo";
import { TeamRepositoryMongo } from "../../../repositories/mongo/team.repository.mongo";
import { MONGODB_COLLECTION_TEAMS } from "../../../constants";

describe("CreateTeamUsecase", () => {
  let connection: MongoClient;
  let db: Db;
  let teamCollection: Collection<TeamModel>;
  let teamRepo: TeamRepositoryPort;

  let createTeamUsecase: CreateTeamUsecase;
  let memberIds: string[], name: string, path: string;

  beforeAll(async () => {
    connection = await MongoClient.connect((global as any).__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    db = connection.db();
    teamCollection = db.collection<TeamModel>(MONGODB_COLLECTION_TEAMS);
    teamRepo = new TeamRepositoryMongo(connection, teamCollection);

    createTeamUsecase = new CreateTeamUsecase(teamRepo);

    memberIds = [];
    name = "Team A";
    path = "";
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Create Team", async () => {
    const { code, res } = await createTeamUsecase.execute({
      memberIds,
      name,
      path,
    });
    expect(code).toEqual(200);
    expect(res).toBeDefined();
    expect(res?.id).toBeDefined();
    expect(res?.memberIds).toEqual(memberIds);
    expect(res?.path).toEqual(path);

    const teamId = res.id;
    const team = await teamRepo.getTeam(teamId);
    expect(team).toBeDefined();
    expect(team?.id).toEqual(teamId);
    expect(team?.memberIds).toEqual(memberIds);
    expect(team?.path).toEqual(path);
  });
});
