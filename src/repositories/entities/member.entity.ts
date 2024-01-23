import { ObjectId } from "mongodb";

export type MemberEntity = {
  _id: ObjectId;
  name: string;
};
