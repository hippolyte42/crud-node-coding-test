import { TeamEntity } from "../../entities/team.entity";

export abstract class TeamRepositoryPort {
  abstract createTeam(
    createTeamInput: Omit<TeamEntity, "id">,
  ): Promise<TeamEntity>;

  abstract getTeam(teamId: string): Promise<TeamEntity | null>;

  abstract updateTeam(
    teamId: string,
    updateTeamInput: Partial<Omit<TeamEntity, "id">>,
  ): Promise<TeamEntity>;

  abstract deleteTeam(teamId: string): Promise<boolean>;

  abstract getTeamChildren(parentTeamId: string): Promise<TeamEntity[]>;

  abstract updateTeamsPath(
    updateManyTeamsInput: {
      teamId: string;
      newPath: string;
    }[],
  ): Promise<boolean>;

  abstract getFirstAncestorTeams(): Promise<TeamEntity[]>;

  abstract getTeamFirstChildren(parentTeamId: string): Promise<TeamEntity[]>;
}
