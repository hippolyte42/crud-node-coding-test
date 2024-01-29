import { TeamEntity } from "../../entities/team.entity";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

export class UpdateTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(
    teamId: string,
    updateTeamInput: Partial<Omit<TeamEntity, "_id">>,
  ): Promise<TeamEntity> {
    return this.teamRepository.updateTeam(teamId, updateTeamInput);
  }
}
