import { BSON, Collection } from "mongodb";
import { MemberEntity } from "repositories/entities/member.entity";
import { MemberRepositoryPort } from "repositories/ports/member.repository.port";
import { MemberModel } from "./models/member.model.mongo";
import { MemberMapper } from "./mappers/member.mapper.mongo";

export class MemberRepositoryMongo implements MemberRepositoryPort {
  constructor(
    private readonly memberCollection: Collection<MemberModel>,
    private readonly memberMapper: MemberMapper,
  ) {}

  async getMember(memberId: string): Promise<MemberEntity | null> {
    const res = await this.memberCollection.findOne({
      _id: new BSON.ObjectId(memberId),
    });
    return res ? this.memberMapper.toEntity(res) : null;
  }
}
