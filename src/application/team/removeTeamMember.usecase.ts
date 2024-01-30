import { TeamEntity } from "../../entities/team.entity";
import RessourceConflictError from "../../errors/ressourceConflict.error";
import RessourceNotFoundError from "../../errors/ressourceNotFound.error";
import { MemberRepositoryPort } from "../../repository/ports/member.repository.port";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

export class RemoveTeamMemberUsecase {
  constructor(
    private readonly teamRepository: TeamRepositoryPort,
    private readonly memberRepository: MemberRepositoryPort,
  ) {}

  async execute(teamId: string, memberId: string): Promise<TeamEntity> {
    const teamMember = await this.memberRepository.getMember(memberId);
    if (!teamMember) {
      throw new RessourceNotFoundError({
        message: `RemoveTeamMemberUsecase: member ${memberId} not found.`,
      });
    }

    const team = await this.teamRepository.getTeam(teamId);
    if (!team) {
      throw new RessourceNotFoundError({
        message: `RemoveTeamMemberUsecase: team ${teamId} not found.`,
      });
    }

    const memberIds = team.memberIds;
    const indexToRemove = memberIds
      .map((memberId) => memberId.toString())
      .indexOf(memberId);
    if (indexToRemove === -1) {
      throw new RessourceConflictError({
        message: `RemoveTeamMemberUsecase: member ${memberId} not in team ${teamId}.`,
      });
    }

    memberIds.splice(indexToRemove, 1);

    return this.teamRepository.updateTeam(teamId, {
      ...team,
      memberIds,
    });
  }
}
