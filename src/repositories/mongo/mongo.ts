import { MongoClient } from "mongodb";

export const mongo = async () => {
  const url = "mongodb://localhost:27017";
  const mongoClient = new MongoClient(url);
  const mongoDBClient = await mongoClient.connect();

  return {
    close: async () => {
      await mongoClient.close();
    },
    client: mongoDBClient,
  };
};
