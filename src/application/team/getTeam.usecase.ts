import { TeamEntity } from "../../entities/team.entity";
import RessourceNotFoundError from "../../errors/ressourceNotFound.error";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";
import { getFirstParentTeamIdFromTeamPath } from "./utils";

export class GetTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(teamId: string): Promise<
    TeamEntity & {
      parent: TeamEntity | null;
      firstChildren: TeamEntity[] | null;
    }
  > {
    const team = await this.teamRepository.getTeam(teamId);

    if (!team) {
      throw new RessourceNotFoundError({
        message: `GetTeamUsecase: team ${teamId} not found.`,
      });
    }

    const result: TeamEntity & {
      parent: TeamEntity | null;
      firstChildren: TeamEntity[];
    } = {
      ...team,
      firstChildren: [],
      parent: null,
    };

    if (team.path) {
      const parentId = getFirstParentTeamIdFromTeamPath(team.path);
      const parent = await this.teamRepository.getTeam(parentId);
      result.parent = parent;
    }

    result.firstChildren =
      await this.teamRepository.getTeamFirstChildren(teamId);

    return result;
  }
}
