import { ObjectId } from "mongodb";

export type MemberModel = {
  _id: ObjectId;
  name: string;
};
