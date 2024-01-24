import { Db } from "mongodb";
import { MONGODB_COLLECTION_MEMBERS } from "../constants";
import { MONGODB_COLLECTION_TEAMS } from "../constants";
import { TeamRepositoryMongo } from "./mongo/team.repository.mongo";
import { MemberRepositoryMongo } from "./mongo/member.repository.mongo";
import { TeamRepositoryPort } from "./ports/team.repository.port";
import { MemberRepositoryPort } from "./ports/member.repository.port";
import { MemberModel } from "./mongo/models/member.model.mongo";
import { TeamModel } from "./mongo/models/team.model.mongo";
import { TeamMapper } from "./mongo/mappers/team.mapper.mongo";
import { MemberMapper } from "./mongo/mappers/member.mapper.mongo";

export const initRepositories = (
  mongoDBClient: Db,
): {
  teamRepository: TeamRepositoryPort;
  memberRepository: MemberRepositoryPort;
} => {
  // mongo collections
  const teamCollection = mongoDBClient.collection<TeamModel>(
    MONGODB_COLLECTION_TEAMS,
  );
  const memberCollection = mongoDBClient.collection<MemberModel>(
    MONGODB_COLLECTION_MEMBERS,
  );

  // mappers
  const teamMapper = new TeamMapper();
  const memberMapper = new MemberMapper();

  // repositories
  const teamRepository = new TeamRepositoryMongo(teamCollection, teamMapper);
  const memberRepository = new MemberRepositoryMongo(
    memberCollection,
    memberMapper,
  );

  return {
    teamRepository,
    memberRepository,
  };
};
