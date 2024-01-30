import RessourceConflictError from "../../errors/ressourceConflict.error";
import RessourceNotFoundError from "../../errors/ressourceNotFound.error";
import { TeamRepositoryPort } from "../../repository/ports/team.repository.port";

export class ChangeTeamParentUsecase {
  constructor(private readonly teamRepository: TeamRepositoryPort) {}

  async execute(teamId: string, newParentTeamId: string): Promise<boolean> {
    const team = await this.teamRepository.getTeam(teamId);

    if (!team) {
      throw new RessourceNotFoundError({
        message: `ChangeTeamParentUsecase: team ${teamId} not found.`,
      });
    }

    if (team.path) {
      const pathChunk = team.path.split(",");
      const teamFirstParent = pathChunk[pathChunk.length - 2];
      if (teamFirstParent === newParentTeamId) {
        throw new RessourceConflictError({
          message: `ChangeTeamParentUsecase: team ${newParentTeamId} already direct parent of team ${teamId}`,
        });
      }
    }
    const parentTeam = await this.teamRepository.getTeam(newParentTeamId);
    if (!parentTeam) {
      throw new RessourceNotFoundError({
        message: `ChangeTeamParentUsecase: parent team ${newParentTeamId} not found.`,
      });
    }
    const teamOldPath = team.path;
    const teamNewPath = `${parentTeam.path || ","}${newParentTeamId},`;

    const teamChildren = await this.teamRepository.getTeamChildren(teamId);

    const updateTeamsPathInput: {
      teamId: string;
      newPath: string;
    }[] = teamChildren.map((teamChild) => {
      const teamChildNewPath = teamChild.path.replace(
        teamOldPath,
        `${teamNewPath}`,
      );

      return {
        teamId: teamChild.id,
        newPath: teamChildNewPath,
      };
    });

    updateTeamsPathInput.push({
      teamId,
      newPath: teamNewPath,
    });

    return this.teamRepository.updateTeamsPath(updateTeamsPathInput);
  }
}
