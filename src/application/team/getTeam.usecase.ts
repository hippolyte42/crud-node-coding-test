import { TeamEntity } from "../../entities/team.entity";
import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";

export class GetTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(teamId: string) {
    const team = await this.teamRepository.getTeam(teamId);

    if (team) {
      const res: {
        parent: TeamEntity | null;
        firstChildren: TeamEntity[] | null;
      } = {
        firstChildren: [],
        parent: null,
      };
      if (team.path.length) {
        const path = team.path.split(",");
        const topmostParentId = path[path.length - 1];
        const parent = await this.teamRepository.getTeam(topmostParentId);
        res.parent = parent;
      }

      const firstChildren =
        await this.teamRepository.getTeamFirstChildren(teamId);
      res.firstChildren = firstChildren;

      return {
        code: 200,
        res,
      };
    }

    return {
      code: 200,
      res: null,
    };
  }
}
