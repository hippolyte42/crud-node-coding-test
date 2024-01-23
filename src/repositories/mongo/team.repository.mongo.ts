import { BSON, Collection, ObjectId } from "mongodb";
import { TeamEntity } from "repositories/entities/team.entity";
import { TeamRepositoryPort } from "repositories/ports/team.repository.port";

export class TeamRepositoryMongo implements TeamRepositoryPort {
  constructor(private readonly teamCollection: Collection<TeamEntity>) {}

  async createTeam({
    path,
    memberIds,
  }: Pick<TeamEntity, "path" | "memberIds">) {
    const { insertedId } = await this.teamCollection.insertOne({
      _id: new ObjectId(),
      path,
      memberIds,
    });

    const res = await this.teamCollection.findOne({ _id: insertedId });
    if (!res) {
      throw new Error("createTeam error");
    }
    return res;
  }

  async getTeam(teamId: string) {
    const res = await this.teamCollection.findOne({
      _id: new BSON.ObjectId(teamId),
    });
    return res;
  }
}
