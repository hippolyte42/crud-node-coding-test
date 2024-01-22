import { MongoClient } from "mongodb";
import { TeamEntity } from "./entities/team.entity";
import { MemberEntity } from "./entities/member.entity";
import { MONGODB_COLLECTION_MEMBERS } from "../constants";
import { MONGODB_COLLECTION_TEAMS } from "../constants";
import { TeamRepositoryMongo } from "./mongo/team.repository.mongo";
import { MemberRepositoryMongo } from "./mongo/member.repository.mongo";

export const initRepositories = (mongoDBClient: MongoClient) => {
  // mongo collections
  const teamCollection = mongoDBClient
    .db()
    .collection<TeamEntity>(MONGODB_COLLECTION_TEAMS);
  const memberCollection = mongoDBClient
    .db()
    .collection<MemberEntity>(MONGODB_COLLECTION_MEMBERS);

  // repositories
  const teamRepository = new TeamRepositoryMongo(teamCollection);
  const memberRepository = new MemberRepositoryMongo(memberCollection);
};
