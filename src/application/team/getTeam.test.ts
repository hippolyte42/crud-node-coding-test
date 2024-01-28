import { Collection, Db, MongoClient } from "mongodb";
import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";
import { GetTeamUsecase } from "./getTeam.usecase";
import { TeamModel } from "../../repositories/mongo/models/team.model.mongo";
import { TeamRepositoryMongo } from "../../repositories/mongo/team.repository.mongo";
import { MONGODB_COLLECTION_TEAMS } from "../../constants";
import { TeamEntity } from "../../entities/team.entity";

describe("GetTeamUsecase", () => {
  let connection: MongoClient;
  let db: Db;
  let teamCollection: Collection<TeamModel>;
  let teamRepo: TeamRepositoryPort;

  let getTeamUsecase: GetTeamUsecase;
  let parentTeam: TeamEntity, team: TeamEntity, firstChildTeam: TeamEntity;

  beforeAll(async () => {
    connection = await MongoClient.connect((global as any).__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    db = connection.db();
    teamCollection = db.collection<TeamModel>(MONGODB_COLLECTION_TEAMS);
    teamRepo = new TeamRepositoryMongo(connection, teamCollection);

    getTeamUsecase = new GetTeamUsecase(teamRepo);

    parentTeam = await teamRepo.createTeam({
      memberIds: [],
      path: "",
      name: "Team A",
    });

    team = await teamRepo.createTeam({
      memberIds: [],
      path: `,${parentTeam.id},`,
      name: "Team B",
    });

    firstChildTeam = await teamRepo.createTeam({
      memberIds: [],
      path: `,${parentTeam.id},${team.id},`,
      name: "Team C",
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Get Team", async () => {
    const { code, res } = await getTeamUsecase.execute(team.id);
    expect(code).toEqual(200);
    expect(res).toBeDefined();

    expect(res?.id).toEqual(team.id);
    expect(res?.name).toEqual(team.name);
    expect(res?.memberIds).toEqual(team.memberIds);
    expect(res?.path).toEqual(team.path);

    expect(res?.parent).toEqual(parentTeam);
    expect(res?.firstChildren).toEqual([firstChildTeam]);
  });
});
