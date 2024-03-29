import { Collection, Db, MongoClient } from "mongodb";
import { TeamRepositoryPort } from "../../../repository/ports/team.repository.port";
import { GetFirstAncestorTeamsUsecase } from "../getFirstAncestorTeams.usecase";
import { TeamModel } from "../../../repository/mongo/models/team.model.mongo";
import { TeamRepositoryMongo } from "../../../repository/mongo/team.repository.mongo";
import { MONGODB_COLLECTION_TEAMS } from "../../../constants";
import { TeamEntity } from "../../../entities/team.entity";

describe("GetFirstAncestorTeamsUsecase", () => {
  let connection: MongoClient;
  let db: Db;
  let teamCollection: Collection<TeamModel>;
  let teamRepo: TeamRepositoryPort;

  let getFirstAncestorTeamsUsecase: GetFirstAncestorTeamsUsecase;
  let ancestor1Input: Omit<TeamEntity, "id">,
    ancestor2Input: Omit<TeamEntity, "id">,
    childInput: Omit<TeamEntity, "id">;
  let ancestor1: TeamEntity, ancestor2: TeamEntity, child: TeamEntity;

  beforeAll(async () => {
    connection = await MongoClient.connect((global as any).__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    db = connection.db();
    teamCollection = db.collection<TeamModel>(MONGODB_COLLECTION_TEAMS);
    teamRepo = new TeamRepositoryMongo(connection, teamCollection);

    getFirstAncestorTeamsUsecase = new GetFirstAncestorTeamsUsecase(teamRepo);

    ancestor1Input = {
      name: "Team A1",
      memberIds: [],
      path: "",
    };
    ancestor2Input = {
      name: "Team A2",
      memberIds: [],
      path: "",
    };

    ancestor1 = await teamRepo.createTeam(ancestor1Input);
    ancestor2 = await teamRepo.createTeam(ancestor2Input);

    childInput = {
      name: "Team B1",
      memberIds: [],
      path: `,${ancestor1.id},`,
    };
    child = await teamRepo.createTeam(childInput);
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Get First Ancestor Teams", async () => {
    const res = await getFirstAncestorTeamsUsecase.execute();
    expect(res).toEqual([
      { ...ancestor1, firstChildren: [child] },
      { ...ancestor2, firstChildren: [] },
    ]);
  });
});
