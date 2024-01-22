import { Collection } from "mongodb";
import { TeamEntity } from "repositories/entities/team.entity";
import { TeamRepositoryPort } from "repositories/ports/team.repository.port";

export class TeamRepositoryMongo implements TeamRepositoryPort {
  constructor(private readonly teamCollection: Collection<TeamEntity>) {}
}
