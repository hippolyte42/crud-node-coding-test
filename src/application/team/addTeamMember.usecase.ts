import { TeamEntity } from "../../entities/team.entity";
import BadRequestError from "../../errors/badRequest.error";
import RessourceNotFoundError from "../../errors/ressourceNotFound.error";
import { MemberRepositoryPort } from "../../repository/ports/member.repository.port";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

export class AddTeamMemberUsecase {
  constructor(
    private readonly teamRepository: TeamRepositoryPort,
    private readonly memberRepository: MemberRepositoryPort,
  ) {}

  async execute(teamId: string, memberId: string): Promise<TeamEntity> {
    const teamMember = await this.memberRepository.getMember(memberId);
    if (!teamMember) {
      throw new RessourceNotFoundError({
        message: `AddTeamMemberUsecase: member ${memberId} not found.`,
      });
    }

    const team = await this.teamRepository.getTeam(teamId);
    if (!team) {
      throw new RessourceNotFoundError({
        message: `AddTeamMemberUsecase: team ${teamId} not found.`,
      });
    }

    if (team.memberIds.includes(memberId)) {
      throw new BadRequestError({
        message: `AddTeamMemberUsecase: member ${memberId} already in team ${teamId}.`,
      });
    }

    return this.teamRepository.updateTeam(teamId, {
      memberIds: [...team.memberIds, memberId],
    });
  }
}
