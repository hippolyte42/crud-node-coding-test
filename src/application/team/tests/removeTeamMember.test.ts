import { BSON, Collection, Db, MongoClient } from "mongodb";
import { TeamRepositoryPort } from "../../../repository/ports/team.repository.port";
import { RemoveTeamMemberUsecase } from "../removeTeamMember.usecase";
import { TeamModel } from "../../../repository/mongo/models/team.model.mongo";
import { MemberModel } from "../../../repository/mongo/models/member.model.mongo";
import { TeamRepositoryMongo } from "../../../repository/mongo/team.repository.mongo";
import { MemberRepositoryMongo } from "../../../repository/mongo/member.repository.mongo";
import {
  MONGODB_COLLECTION_MEMBERS,
  MONGODB_COLLECTION_TEAMS,
} from "../../../constants";
import { MemberRepositoryPort } from "../../../repository/ports/member.repository.port";

describe("RemoveTeamMemberUsecase", () => {
  let connection: MongoClient;
  let db: Db;
  let teamCollection: Collection<TeamModel>,
    memberCollection: Collection<MemberModel>;
  let teamRepo: TeamRepositoryPort, memberRepo: MemberRepositoryPort;

  let removeTeamMemberUsecase: RemoveTeamMemberUsecase;

  beforeAll(async () => {
    connection = await MongoClient.connect((global as any).__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    db = connection.db();
    teamCollection = db.collection<TeamModel>(MONGODB_COLLECTION_TEAMS);
    teamRepo = new TeamRepositoryMongo(connection, teamCollection);
    memberCollection = db.collection<MemberModel>(MONGODB_COLLECTION_MEMBERS);
    memberRepo = new MemberRepositoryMongo(memberCollection);

    removeTeamMemberUsecase = new RemoveTeamMemberUsecase(teamRepo, memberRepo);
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Remove Team Member", async () => {
    const member = await memberCollection.insertOne({
      _id: new BSON.ObjectId(),
      name: "",
    });
    const memberId = member.insertedId.toString();
    const team = await teamRepo.createTeam({
      memberIds: [memberId],
      name: "Team",
      path: "",
    });
    const teamId = team.id;

    const teamBefore = await teamRepo.getTeam(teamId);
    expect(teamBefore?.memberIds).toEqual([memberId]);

    const res = await removeTeamMemberUsecase.execute(teamId, memberId);
    expect(res?.memberIds).toEqual([]);
    expect(res?.id).toEqual(team.id);
    expect(res?.path).toEqual(team.path);
    expect(res?.name).toEqual(team.name);

    const teamAfter = await teamRepo.getTeam(teamId);
    expect(teamAfter?.memberIds).toEqual([]);
  });
});
