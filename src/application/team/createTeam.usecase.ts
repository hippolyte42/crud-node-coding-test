import { TeamEntity } from "../../entities/team.entity";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

export class CreateTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(createTeamInput: Omit<TeamEntity, "id">): Promise<TeamEntity> {
    return this.teamRepository.createTeam(createTeamInput);
  }
}
