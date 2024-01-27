import { TeamEntity } from "../../repositories/entities/team.entity";
import { TeamRepositoryPort } from "../../repositories/ports/team.repository.port";

export class ChangeTeamParentUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(teamId: string, newParentTeamId: string) {
    const team = await this.teamRepository.getTeam(teamId);

    if (!team) {
      return {
        code: 200,
        res: "Team not found.",
      };
    }
    const parentTeam = await this.teamRepository.getTeam(newParentTeamId);
    if (!parentTeam) {
      return {
        code: 200,
        res: "Parent team not found.",
      };
    }
    const teamOldPath = team.path;
    const teamNewPath = `${parentTeam.path || ","}${newParentTeamId},`;

    const teamChildren = await this.teamRepository.getTeamChildren(teamId);

    const updateManyTeamsInput: {
      teamId: string;
      updateTeamInput: Partial<Omit<TeamEntity, "id">>;
    }[] = [];
    updateManyTeamsInput.push({
      teamId,
      updateTeamInput: {
        path: teamNewPath,
      },
    });
    teamChildren.map((teamChild) => {
      const teamChildNewPath = teamChild.path.replace(
        teamOldPath,
        `${teamNewPath}${teamId}` + ",",
      );
      updateManyTeamsInput.push({
        teamId: teamChild.id,
        updateTeamInput: {
          path: teamChildNewPath,
        },
      });
    });

    const res =
      await this.teamRepository.updateManyTeamsInTrx(updateManyTeamsInput);

    return {
      code: 200,
      res,
    };
  }
}
