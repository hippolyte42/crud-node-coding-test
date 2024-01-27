import { TeamEntity } from "../../entities/team.entity";
import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";

export class UpdateTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(
    teamId: string,
    updateTeamInput: Partial<Omit<TeamEntity, "_id">>,
  ) {
    const res = await this.teamRepository.updateTeam(teamId, updateTeamInput);
    return {
      code: 200,
      res,
    };
  }
}
