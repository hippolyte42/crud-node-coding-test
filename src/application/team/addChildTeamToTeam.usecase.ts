import { BSON } from "mongodb";
import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";

export class AddChildTeamToTeamUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(childTeamId: string, parentTeamId: string) {
    const childTeam = await this.teamRepository.getTeam(childTeamId);
    if (!childTeam) {
      return {
        code: 200,
        res: "Child team not found.",
      };
    }
    if (childTeam.path) {
      return {
        code: 200,
        res: "Child team already has a parent team.",
      };
    }

    const teamChildren = await this.teamRepository.getTeamChildren(childTeamId);

    const promises: Promise<any>[] = [];
    promises.push(
      this.teamRepository.updateTeam(childTeamId, {
        path: `,${parentTeamId},`,
      }),
    );
    teamChildren.map(async (team) => {
      const newPath = `,${parentTeamId}${team.path}`;
      promises.push(
        this.teamRepository.updateTeam(team._id.toString(), {
          path: newPath,
        }),
      );
    });
    await Promise.all(promises);

    return {
      code: 200,
      res: undefined,
    };
  }
}
