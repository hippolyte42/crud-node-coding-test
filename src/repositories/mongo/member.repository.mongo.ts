import { Collection } from "mongodb";
import { MemberEntity } from "repositories/entities/member.entity";
import { MemberRepositoryPort } from "repositories/ports/member.repository.port";

export class MemberRepositoryMongo implements MemberRepositoryPort {
  constructor(private readonly memberCollection: Collection<MemberEntity>) {}
}
