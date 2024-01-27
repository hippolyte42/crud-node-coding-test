import { MemberEntity } from "../../../entities/member.entity";
import { MemberModel } from "../models/member.model.mongo";

export class MemberMapper {
  toEntity({ _id, name }: MemberModel): MemberEntity {
    return {
      id: _id.toString(),
      name,
    };
  }
}
