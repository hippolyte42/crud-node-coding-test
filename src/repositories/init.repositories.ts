import { Db } from "mongodb";
import { TeamEntity } from "./entities/team.entity";
import { MemberEntity } from "./entities/member.entity";
import { MONGODB_COLLECTION_MEMBERS } from "../constants";
import { MONGODB_COLLECTION_TEAMS } from "../constants";
import { TeamRepositoryMongo } from "./mongo/team.repository.mongo";
import { MemberRepositoryMongo } from "./mongo/member.repository.mongo";
import { TeamRepositoryPort } from "./ports/team.repository.port";
import { MemberRepositoryPort } from "./ports/member.repository.port";

export const initRepositories = (
  mongoDBClient: Db,
): {
  teamRepository: TeamRepositoryPort;
  memberRepository: MemberRepositoryPort;
} => {
  // mongo collections
  const teamCollection = mongoDBClient.collection<TeamEntity>(
    MONGODB_COLLECTION_TEAMS,
  );
  const memberCollection = mongoDBClient.collection<MemberEntity>(
    MONGODB_COLLECTION_MEMBERS,
  );

  // repositories
  const teamRepository = new TeamRepositoryMongo(teamCollection);
  const memberRepository = new MemberRepositoryMongo(memberCollection);

  return {
    teamRepository,
    memberRepository,
  };
};
