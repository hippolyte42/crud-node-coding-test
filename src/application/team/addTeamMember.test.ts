import { BSON, Collection, Db, MongoClient } from "mongodb";
import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";
import { AddTeamMemberUsecase } from "./addTeamMember.usecase";
import { TeamModel } from "../../repositories/mongo/models/team.model.mongo";
import { MemberModel } from "../../repositories/mongo/models/member.model.mongo";
import { TeamRepositoryMongo } from "../../repositories/mongo/team.repository.mongo";
import { MemberRepositoryMongo } from "../../repositories/mongo/member.repository.mongo";
import {
  MONGODB_COLLECTION_MEMBERS,
  MONGODB_COLLECTION_TEAMS,
} from "../../constants";
import { MemberRepositoryPort } from "../../repositories/ports/member.repository.port";

describe("AddTeamMemberUsecase", () => {
  let connection: MongoClient;
  let db: Db;
  let teamCollection: Collection<TeamModel>,
    memberCollection: Collection<MemberModel>;
  let teamRepo: TeamRepositoryPort, memberRepo: MemberRepositoryPort;

  let addTeamMemberUsecase: AddTeamMemberUsecase;
  let teamId: string, memberId: string;

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

    addTeamMemberUsecase = new AddTeamMemberUsecase(teamRepo, memberRepo);
  });

  afterAll(async () => {
    await connection.close();
  });

  test("Add Team Member", async () => {
    const member = await memberCollection.insertOne({
      _id: new BSON.ObjectId(),
      name: "",
    });
    const memberId = member.insertedId.toString();
    const team = await teamRepo.createTeam({
      memberIds: [],
      name: "Team",
      path: "",
    });
    const teamId = team.id;

    const teamBefore = await teamRepo.getTeam(teamId);
    expect(teamBefore?.memberIds).toEqual([]);

    const { code, res } = await addTeamMemberUsecase.execute(teamId, memberId);
    expect(code).toEqual(200);
    expect(res?.memberIds).toEqual([memberId]);
    expect(res?.id).toEqual(team.id);
    expect(res?.path).toEqual(team.path);
    expect(res?.name).toEqual(team.name);

    const teamAfter = await teamRepo.getTeam(teamId);
    expect(teamAfter?.memberIds).toEqual([memberId]);
  });
});
