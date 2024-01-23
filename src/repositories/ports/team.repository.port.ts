import { TeamEntity } from "repositories/entities/team.entity";

export abstract class TeamRepositoryPort {
  abstract createTeam(
    createTeamInput: Pick<TeamEntity, "path" | "memberIds">,
  ): Promise<TeamEntity>;

  abstract getTeam(teamId: string): Promise<TeamEntity | null>;
}
