import { TeamEntity } from "../../entities/team.entity";
import RessourceNotFoundError from "../../errors/ressourceNotFound.error";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

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
    const res: TeamEntity & {
      parent: TeamEntity | null;
      firstChildren: TeamEntity[] | null;
    } = {
      ...team,
      firstChildren: [],
      parent: null,
    };

    if (team.path.length) {
      const path = team.path.split(",");
      const topmostParentId = path[path.length - 2];
      const parent = await this.teamRepository.getTeam(topmostParentId);
      res.parent = parent;
    }

    const firstChildren =
      await this.teamRepository.getTeamFirstChildren(teamId);
    res.firstChildren = firstChildren;

    return res;
  }
}
