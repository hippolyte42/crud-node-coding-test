import { BSON, Collection, ObjectId } from "mongodb";
import { TeamEntity } from "repositories/entities/team.entity";
import { TeamRepositoryPort } from "repositories/ports/team.repository.port";

export class TeamRepositoryMongo implements TeamRepositoryPort {
  constructor(private readonly teamCollection: Collection<TeamEntity>) {}

  async createTeam({ path, memberIds, name }: Omit<TeamEntity, "_id">) {
    const { insertedId } = await this.teamCollection.insertOne({
      _id: new ObjectId(),
      path,
      memberIds,
      name,
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

  async updateTeam(
    teamId: string,
    updateTeamInput: Partial<Omit<TeamEntity, "_id">>,
  ): Promise<TeamEntity> {
    const _id = new BSON.ObjectId(teamId);
    await this.teamCollection.updateOne({ _id }, { $set: updateTeamInput });
    const res = await this.teamCollection.findOne({ _id });
    if (!res) {
      throw new Error("updateTeam error");
    }
    return res;
  }

  async deleteTeam(teamId: string): Promise<boolean> {
    const _id = new BSON.ObjectId(teamId);
    const { acknowledged } = await this.teamCollection.deleteOne({ _id });
    return acknowledged;
  }

  async getTeamChildren(parentTeamId: string): Promise<TeamEntity[]> {
    return this.teamCollection
      .find({
        path: { $regex: "/," + parentTeamId + ",/" },
      })
      .toArray();
  }
}
