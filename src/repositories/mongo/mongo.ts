import { MongoClient } from "mongodb";
import { MONGODB_DATABASE_NAME } from "../../constants";

export const mongo = async () => {
  const url = "mongodb://localhost:27017";
  const mongoClient = new MongoClient(url);
  const mongoDBClient = await mongoClient.connect();
  console.log("Connected successfully to server");

  return {
    close: async () => {
      await mongoClient.close();
    },
    client: mongoDBClient.db(MONGODB_DATABASE_NAME),
  };
};
