import { Collection, Db, MongoClient } from "mongodb";
import { TeamRepositoryPort } from "../../../repositories/ports/team.repository.port";
import { ChangeTeamParentUsecase } from "../changeTeamParent.usecase";
import { TeamModel } from "../../../repositories/mongo/models/team.model.mongo";
import { TeamRepositoryMongo } from "../../../repositories/mongo/team.repository.mongo";
import { MONGODB_COLLECTION_TEAMS } from "../../../constants";
import { TeamEntity } from "../../../entities/team.entity";

describe("ChangeTeamParentUsecase", () => {
  let connection: MongoClient;
  let db: Db;
  let teamCollection: Collection<TeamModel>;
  let teamRepo: TeamRepositoryPort;

  let changeTeamParentUsecase: ChangeTeamParentUsecase;
  let oldParentTeam: TeamEntity,
    newParentTeam: TeamEntity,
    team: TeamEntity,
    childTeam: TeamEntity;

  beforeAll(async () => {
    connection = await MongoClient.connect((global as any).__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    db = connection.db();
    teamCollection = db.collection<TeamModel>(MONGODB_COLLECTION_TEAMS);
    teamRepo = new TeamRepositoryMongo(connection, teamCollection);

    changeTeamParentUsecase = new ChangeTeamParentUsecase(teamRepo);

    oldParentTeam = await teamRepo.createTeam({
      memberIds: [],
      path: "",
      name: "Team A1",
    });
    newParentTeam = await teamRepo.createTeam({
      memberIds: [],
      path: "",
      name: "Team A2",
    });
    team = await teamRepo.createTeam({
      memberIds: [],
      path: `,${oldParentTeam.id},`,
      name: "Team B",
    });
    childTeam = await teamRepo.createTeam({
      memberIds: [],
      path: `,${oldParentTeam.id},${team.id},`,
      name: "Team C",
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Change Team Parent", async () => {
    const { code, res } = await changeTeamParentUsecase.execute(
      team.id,
      newParentTeam.id,
    );
    expect(code).toEqual(200);
    expect(res).toBeTruthy();

    const updatedTeam = await teamRepo.getTeam(team.id);
    expect(updatedTeam?.path).toEqual(`,${newParentTeam.id},`);

    const updatedChildTeam = await teamRepo.getTeam(childTeam.id);
    expect(updatedChildTeam?.path).toEqual(`,${newParentTeam.id},${team.id},`);
  });
});
