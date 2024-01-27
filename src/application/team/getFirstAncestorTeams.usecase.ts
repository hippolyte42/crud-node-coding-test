import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";

export class GetFirstAncestorTeamsUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute() {
    const res = await this.teamRepository.getFirstAncestorTeams();

    return {
      code: 200,
      res,
    };
  }
}
