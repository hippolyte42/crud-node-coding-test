import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";

export class GetTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(teamId: string) {
    const res = await this.teamRepository.getTeam(teamId);

    return {
      code: 200,
      res,
    };
  }
}
