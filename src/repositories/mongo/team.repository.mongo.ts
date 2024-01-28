import { BSON, Collection, MongoClient, ObjectId } from "mongodb";
import { TeamRepositoryPort } from "repositories/ports/team.repository.port";
import { TeamModel } from "./models/team.model.mongo";
import { TeamMapper } from "./mappers/team.mapper.mongo";
import { TeamEntity } from "../../entities/team.entity";

export class TeamRepositoryMongo implements TeamRepositoryPort {
  private teamMapper: TeamMapper;

  constructor(
    private readonly dbclient: MongoClient,
    private readonly teamCollection: Collection<TeamModel>,
  ) {
    this.teamMapper = new TeamMapper();
  }

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
  ) {
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

  async updateManyTeamsInTrx(
    updateManyTeamsInput: {
      teamId: string;
      updateTeamInput: Partial<Omit<TeamEntity, "id">>;
    }[],
  ) {
    const txnResult: any = await this.dbclient.withSession(async (session) =>
      session.withTransaction(async (session) => {
        for (const item of updateManyTeamsInput) {
          const _id = new BSON.ObjectId(item.teamId);
          const toUpdate: Partial<Omit<TeamModel, "_id">> = {};
          if (item.updateTeamInput.memberIds) {
            toUpdate.memberIds = item.updateTeamInput.memberIds?.map(
              (memberId) => new BSON.ObjectId(memberId),
            );
          }
          if (item.updateTeamInput.name) {
            toUpdate.name = item.updateTeamInput.name;
          }
          if (item.updateTeamInput.path) {
            toUpdate.path = item.updateTeamInput.path;
          }

          const updatedTeam = await this.teamCollection.findOneAndUpdate(
            { _id },
            {
              $set: toUpdate,
            },
            { session },
          );
          if (updatedTeam.ok !== 1) {
            await session.abortTransaction();
            return false;
          }
        }
        return true;
      }),
    );

    console.log("txnResult ici", txnResult); // todo check txnResult value

    return txnResult;
  }

  async deleteTeam(teamId: string) {
    const _id = new BSON.ObjectId(teamId);
    const { acknowledged } = await this.teamCollection.deleteOne({ _id });
    return acknowledged;
  }

  async getTeamChildren(parentTeamId: string) {
    return (
      await this.teamCollection
        .find({
          path: { $regex: "/," + parentTeamId + ",/" },
        })
        .toArray()
    ).map((teamChildren) => this.teamMapper.toEntity(teamChildren));
  }

  async getTeamFirstChildren(parentTeamId: string) {
    return (
      await this.teamCollection
        .find({
          path: `,${parentTeamId},`,
        })
        .toArray()
    ).map((teamChildren) => this.teamMapper.toEntity(teamChildren));
  }

  async getFirstAncestorTeams() {
    return (await this.teamCollection.find({ path: "" }).toArray()).map(
      (teamChildren) => this.teamMapper.toEntity(teamChildren),
    );
  }
}
