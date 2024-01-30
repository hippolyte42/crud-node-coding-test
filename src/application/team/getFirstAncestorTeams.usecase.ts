import { TeamEntity } from "../../entities/team.entity";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

export class GetFirstAncestorTeamsUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(): Promise<
    Array<
      TeamEntity & {
        firstChildren: TeamEntity[];
      }
    >
  > {
    const firstAncestorTeams =
      await this.teamRepository.getFirstAncestorTeams();

    return Promise.all(
      firstAncestorTeams.map(async (team) => {
        const firstChildren = await this.teamRepository.getTeamFirstChildren(
          team.id,
        );
        return {
          ...team,
          firstChildren,
        };
      }),
    );
  }
}
