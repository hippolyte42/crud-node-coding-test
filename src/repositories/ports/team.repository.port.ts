import { TeamEntity } from "repositories/entities/team.entity";

export abstract class TeamRepositoryPort {
  abstract createTeam(
    createTeamInput: Pick<TeamEntity, "path" | "memberIds">,
  ): Promise<TeamEntity>;

  abstract getTeam(teamId: string): Promise<TeamEntity | null>;

  abstract updateTeam(
    teamId: string,
    updateTeamInput: Partial<Omit<TeamEntity, "_id">>,
  ): Promise<TeamEntity>;
}
