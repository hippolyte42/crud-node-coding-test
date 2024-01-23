import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";

export class DeleteTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(teamId: string) {
    const res = await this.teamRepository.deleteTeam(teamId);

    return {
      code: 200,
      res,
    };
  }
}
