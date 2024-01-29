import { TeamEntity } from "../../entities/team.entity";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

export class GetFirstAncestorTeamsUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(): Promise<TeamEntity[]> {
    return this.teamRepository.getFirstAncestorTeams();
  }
}
