import { BSON, Collection, ObjectId } from "mongodb";
import { TeamEntity } from "repositories/entities/team.entity";
import { TeamRepositoryPort } from "repositories/ports/team.repository.port";
import { TeamModel } from "./models/team.model.mongo";
import { TeamMapper } from "./mappers/team.mapper.mongo";

export class TeamRepositoryMongo implements TeamRepositoryPort {
  constructor(
    private readonly teamCollection: Collection<TeamModel>,
    private readonly teamMapper: TeamMapper,
  ) {}

  async createTeam({ path, memberIds, name }: Omit<TeamEntity, "id">) {
    const { insertedId } = await this.teamCollection.insertOne({
      _id: new ObjectId(),
      path,
      memberIds: memberIds.map((memberId) => new BSON.ObjectId(memberId)),
      name,
    });

    const team = await this.teamCollection.findOne({ _id: insertedId });
    if (!team) {
      throw new Error("createTeam error");
    }
    return this.teamMapper.toEntity(team);
  }

  async getTeam(teamId: string) {
    const res = await this.teamCollection.findOne({
      _id: new BSON.ObjectId(teamId),
    });
    return res ? this.teamMapper.toEntity(res) : null;
  }

  async updateTeam(
    teamId: string,
    updateTeamInput: Partial<Omit<TeamEntity, "id">>,
  ): Promise<TeamEntity> {
    const _id = new BSON.ObjectId(teamId);

    const toUpdate: Partial<Omit<TeamModel, "_id">> = {};
    if (updateTeamInput.memberIds) {
      toUpdate.memberIds = updateTeamInput.memberIds?.map(
        (memberId) => new BSON.ObjectId(memberId),
      );
    }
    if (updateTeamInput.name) {
      toUpdate.name = updateTeamInput.name;
    }
    if (updateTeamInput.path) {
      toUpdate.path = updateTeamInput.path;
    }

    await this.teamCollection.updateOne(
      { _id },
      {
        $set: toUpdate,
      },
    );
    const res = await this.teamCollection.findOne({ _id });
    if (!res) {
      throw new Error("updateTeam error");
    }
    return this.teamMapper.toEntity(res);
  }

  async deleteTeam(teamId: string): Promise<boolean> {
    const _id = new BSON.ObjectId(teamId);
    const { acknowledged } = await this.teamCollection.deleteOne({ _id });
    return acknowledged;
  }

  async getTeamChildren(parentTeamId: string): Promise<TeamEntity[]> {
    return (
      await this.teamCollection
        .find({
          path: { $regex: "/," + parentTeamId + ",/" },
        })
        .toArray()
    ).map((teamChildren) => this.teamMapper.toEntity(teamChildren));
  }
}
