import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

export class DeleteTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(teamId: string): Promise<boolean> {
    return this.teamRepository.deleteTeam(teamId);
  }
}
