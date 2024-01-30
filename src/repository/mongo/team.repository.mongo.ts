import { BSON, Collection, MongoClient, ObjectId } from "mongodb";
import { TeamModel } from "./models/team.model.mongo";
import { TeamMapper } from "./mappers/team.mapper.mongo";
import { TeamEntity } from "../../entities/team.entity";
import { TeamRepositoryPort } from "../ports/team.repository.port";

export class TeamRepositoryMongo implements TeamRepositoryPort {
  private teamMapper: TeamMapper;

  constructor(
    private readonly dbclient: MongoClient,
    private readonly teamCollection: Collection<TeamModel>,
  ) {
    this.teamMapper = new TeamMapper();
  }

  async createTeam({ path, memberIds, name }: Omit<TeamEntity, "id">) {
    const { insertedId, acknowledged } = await this.teamCollection.insertOne({
      _id: new ObjectId(),
      path,
      memberIds: memberIds.map((memberId) => new BSON.ObjectId(memberId)),
      name,
    });
    if (!acknowledged) {
      throw new Error();
    }

    const team = await this.teamCollection.findOne({ _id: insertedId });
    if (!team) {
      throw new Error();
    }
    return this.teamMapper.toEntity(team);
  }

  async getTeam(teamId: string) {
    const res = await this.teamCollection.findOne({
      _id: new BSON.ObjectId(teamId),
    });
    return res ? this.teamMapper.toEntity(res) : null;
  }

  async updateTeam(teamId: string, updateTeamInput: Omit<TeamEntity, "id">) {
    const _id = new BSON.ObjectId(teamId);

    const toUpdate: Omit<TeamModel, "_id"> = {
      memberIds: updateTeamInput.memberIds?.map(
        (memberId) => new BSON.ObjectId(memberId),
      ),
      name: updateTeamInput.name,
      path: updateTeamInput.path,
    };

    await this.teamCollection.updateOne(
      { _id },
      {
        $set: toUpdate,
      },
    );
    const res = await this.teamCollection.findOne({ _id });
    if (!res) {
      throw new Error();
    }
    return this.teamMapper.toEntity(res);
  }

  async updateTeamsPath(
    updateTeamsPathInput: {
      teamId: string;
      newPath: string;
    }[],
  ) {
    // todo use mongo driver that supports transactions
    // const transactionResult: any = await this.dbclient.withSession(
    //   async (session) =>
    //     session.withTransaction(async (session) => {
    //       for (const input of updateTeamsPathInput) {
    //         const _id = new BSON.ObjectId(input.teamId);
    //         const updatedTeam = await this.teamCollection.findOneAndUpdate(
    //           { _id },
    //           {
    //             $set: { path: input.newPath },
    //           },
    //           { session },
    //         );
    //         if (updatedTeam.ok !== 1) {
    //           await session.abortTransaction();
    //           throw new Error();
    //         }
    //       }
    //       return true;
    //     }),
    // );
    // return !!transactionResult;

    const bulkUpdateInput = updateTeamsPathInput.map(({ teamId, newPath }) => {
      return {
        updateOne: {
          filter: { _id: new BSON.ObjectId(teamId) },
          update: { $set: { path: newPath } },
        },
      };
    });
    const bulkUpdateInputResult =
      await this.teamCollection.bulkWrite(bulkUpdateInput);
    return !!bulkUpdateInputResult.ok;
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
          path: { $regex: new RegExp(`,${parentTeamId},`) },
        })
        .toArray()
    ).map((teamChildren) => this.teamMapper.toEntity(teamChildren));
  }

  async getTeamFirstChildren(parentTeamId: string) {
    return (
      await this.teamCollection
        .find({
          path: {
            $regex: new RegExp(`[^,]+,${parentTeamId},$`),
          },
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
