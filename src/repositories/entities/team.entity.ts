import { ObjectId } from "mongodb";

export type TeamEntity = {
  _id: ObjectId;
  name: string;
  path: string;
  memberIds: string[];
};
