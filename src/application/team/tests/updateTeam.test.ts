import { BSON, Collection, Db, MongoClient } from "mongodb";
import { TeamRepositoryPort } from "../../../repository/ports/team.repository.port";
import { UpdateTeamUsecase } from "../updateTeam.usecase";
import { TeamModel } from "../../../repository/mongo/models/team.model.mongo";
import { TeamRepositoryMongo } from "../../../repository/mongo/team.repository.mongo";
import { MONGODB_COLLECTION_TEAMS } from "../../../constants";
import { TeamEntity } from "../../../entities/team.entity";

describe("UpdateTeamUsecase", () => {
  let connection: MongoClient;
  let db: Db;
  let teamCollection: Collection<TeamModel>;
  let teamRepo: TeamRepositoryPort;

  let updateTeamUsecase: UpdateTeamUsecase;
  let team: TeamEntity, teamId: string;

  beforeAll(async () => {
    connection = await MongoClient.connect((global as any).__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    db = connection.db();
    teamCollection = db.collection<TeamModel>(MONGODB_COLLECTION_TEAMS);
    teamRepo = new TeamRepositoryMongo(connection, teamCollection);

    updateTeamUsecase = new UpdateTeamUsecase(teamRepo);
  });

  beforeEach(async () => {
    team = await teamRepo.createTeam({
      memberIds: [],
      path: "",
      name: "Team A1",
    });
    teamId = team.id;
  });
  afterEach(async () => {
    await teamRepo.deleteTeam(teamId);
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Update Team: update all attributes", async () => {
    const updateTeamInput: Omit<TeamEntity, "id"> = {
      memberIds: [new BSON.ObjectId().toString()],
      name: "Team A2",
      path: `,${new BSON.ObjectId()},`,
    };
    const res = await updateTeamUsecase.execute(teamId, updateTeamInput);
    expect(res).toEqual({ ...team, ...updateTeamInput });

    const teamAfter = await teamRepo.getTeam(teamId);
    expect(teamAfter).toEqual({ ...team, ...updateTeamInput });
  });

  test("Update Team: update name", async () => {
    const updateTeamInput = {
      name: "Team A2",
    };
    const res = await updateTeamUsecase.execute(teamId, updateTeamInput);
    expect(res).toEqual({ ...team, ...updateTeamInput });
    const teamAfter = await teamRepo.getTeam(teamId);
    expect(teamAfter).toEqual({ ...team, ...updateTeamInput });
  });
});
