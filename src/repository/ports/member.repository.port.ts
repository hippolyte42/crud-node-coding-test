import { MemberEntity } from "../../entities/member.entity";

export abstract class MemberRepositoryPort {
  abstract getMember(memberId: string): Promise<MemberEntity | null>;
}
