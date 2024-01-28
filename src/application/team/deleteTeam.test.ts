import { Collection, Db, MongoClient } from "mongodb";
import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";
import { DeleteTeamUsecase } from "./deleteTeam.usecase";
import { TeamModel } from "../../repositories/mongo/models/team.model.mongo";
import { TeamRepositoryMongo } from "../../repositories/mongo/team.repository.mongo";
import { MONGODB_COLLECTION_TEAMS } from "../../constants";

describe("DeleteTeamUsecase", () => {
  let connection: MongoClient;
  let db: Db;
  let teamCollection: Collection<TeamModel>;
  let teamRepo: TeamRepositoryPort;

  let deleteTeamUsecase: DeleteTeamUsecase;
  let memberIds: string[], name: string, path: string;

  beforeAll(async () => {
    connection = await MongoClient.connect((global as any).__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    db = connection.db();
    teamCollection = db.collection<TeamModel>(MONGODB_COLLECTION_TEAMS);
    teamRepo = new TeamRepositoryMongo(connection, teamCollection);

    deleteTeamUsecase = new DeleteTeamUsecase(teamRepo);

    memberIds = [];
    name = "Team A";
    path = "";
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Delete Team", async () => {
    const teamBefore = await teamRepo.createTeam({
      memberIds: [],
      name: "",
      path: "",
    });
    const teamId = teamBefore.id;
    expect(teamBefore).toBeDefined();

    const { code, res } = await deleteTeamUsecase.execute(teamId);
    expect(code).toEqual(200);
    expect(res).toBeTruthy();

    const teamAfter = await teamRepo.getTeam(teamId);
    expect(teamAfter).toBeNull();
  });
});
