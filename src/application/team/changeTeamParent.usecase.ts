import { TeamEntity } from "../../entities/team.entity";
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
    const parentTeam = await this.teamRepository.getTeam(newParentTeamId);
    if (!parentTeam) {
      throw new RessourceNotFoundError({
        message: `ChangeTeamParentUsecase: parent team ${newParentTeamId} not found.`,
      });
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

    return this.teamRepository.updateManyTeamsInTrx(updateManyTeamsInput);
  }
}
