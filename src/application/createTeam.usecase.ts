import { TeamEntity } from "../repositories/entities/team.entity";
import { TeamRepositoryPort } from "../repositories/ports/team.repository.port";

export class CreateTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(createTeamInput: Pick<TeamEntity, "path" | "memberIds">) {
    const res = await this.teamRepository.createTeam(createTeamInput);
    return {
      code: 200,
      res,
    };
  }
}
