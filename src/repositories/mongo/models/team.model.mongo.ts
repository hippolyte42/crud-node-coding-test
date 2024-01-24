import { ObjectId } from "mongodb";

export type TeamModel = {
  _id: ObjectId;
  name: string;
  path: string;
  memberIds: ObjectId[];
};
