import { BSON, Collection } from "mongodb";
import { MemberEntity } from "repositories/entities/member.entity";
import { MemberRepositoryPort } from "repositories/ports/member.repository.port";

export class MemberRepositoryMongo implements MemberRepositoryPort {
  constructor(private readonly memberCollection: Collection<MemberEntity>) {}

  async getMember(memberId: string): Promise<MemberEntity | null> {
    const res = await this.memberCollection.findOne({
      _id: new BSON.ObjectId(memberId),
    });
    return res;
  }
}
