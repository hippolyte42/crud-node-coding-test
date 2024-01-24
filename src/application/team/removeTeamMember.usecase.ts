import { MemberRepositoryPort } from "../../repositories/ports/member.repository.port";
import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";

export class RemoveTeamMemberUsecase {
  constructor(
    private readonly teamRepository: TeamRepositoryPort,
    private readonly memberRepository: MemberRepositoryPort,
  ) {}

  async execute(teamId: string, memberId: string) {
    const teamMember = await this.memberRepository.getMember(memberId);
    if (!teamMember) {
      return {
        code: 404,
        res: `Member not found for id: ${memberId}`,
      };
    }

    const team = await this.teamRepository.getTeam(teamId);
    if (!team) {
      return {
        code: 404,
        res: `Team not found for id: ${teamId}`,
      };
    }

    const memberIds = team.memberIds;
    const indexToRemove = memberIds
      .map((memberId) => memberId.toString())
      .indexOf(memberId);
    if (indexToRemove === -1) {
      return {
        code: 200,
        res: `Member already not in team.`,
      };
    }

    memberIds.splice(indexToRemove, 1);
    const res = await this.teamRepository.updateTeam(teamId, {
      memberIds,
    });
    return {
      code: 200,
      res,
    };
  }
}
