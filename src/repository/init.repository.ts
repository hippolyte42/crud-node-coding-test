import { MongoClient } from "mongodb";
import {
  MONGODB_COLLECTION_MEMBERS,
  MONGODB_DATABASE_NAME,
} from "../constants";
import { MONGODB_COLLECTION_TEAMS } from "../constants";
import { TeamRepositoryMongo } from "./mongo/team.repository.mongo";
import { MemberRepositoryMongo } from "./mongo/member.repository.mongo";
import { TeamRepositoryPort } from "./ports/team.repository.port";
import { MemberRepositoryPort } from "./ports/member.repository.port";
import { MemberModel } from "./mongo/models/member.model.mongo";
import { TeamModel } from "./mongo/models/team.model.mongo";

export const initRepository = async (): Promise<{
  repositories: {
    teamRepository: TeamRepositoryPort;
    memberRepository: MemberRepositoryPort;
  };
  close: () => Promise<void>;
}> => {
  // mongo
  const url = "mongodb://localhost:27017"; // todo var in .env or sops
  const mongoClient = new MongoClient(url);
  const mongoClientConnected = await mongoClient.connect();
  const mongoDBClient = mongoClientConnected.db(MONGODB_DATABASE_NAME);
  console.log("Connected successfully to server");

  // mongo collections
  const teamCollection = mongoDBClient.collection<TeamModel>(
    MONGODB_COLLECTION_TEAMS,
  );
  const memberCollection = mongoDBClient.collection<MemberModel>(
    MONGODB_COLLECTION_MEMBERS,
  );

  // repositories
  const teamRepository = new TeamRepositoryMongo(
    mongoClientConnected,
    teamCollection,
  );
  const memberRepository = new MemberRepositoryMongo(memberCollection);

  return {
    repositories: {
      teamRepository,
      memberRepository,
    },
    close: async () => {
      await mongoClient.close();
    },
  };
};
