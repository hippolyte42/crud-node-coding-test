import { TeamEntity } from "../../../entities/team.entity";
import { TeamModel } from "../models/team.model.mongo";

export class TeamMapper {
  toEntity({ _id, memberIds, name, path }: TeamModel): TeamEntity {
    return {
      id: _id.toString(),
      memberIds: memberIds.map((memberObjectId) => memberObjectId.toString()),
      name,
      path,
    };
  }
}
