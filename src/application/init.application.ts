import { MemberRepositoryPort } from "../repositories/ports/member.repository.port";
import { TeamRepositoryPort } from "../repositories/ports/team.repository.port";
import { AddTeamMemberUsecase } from "./team/addTeamMember.usecase";
import { ChangeTeamParentUsecase } from "./team/changeTeamParent.usecase";
import { CreateTeamUsecase } from "./team/createTeam.usecase";
import { DeleteTeamUsecase } from "./team/deleteTeam.usecase";
import { GetFirstAncestorTeamsUsecase } from "./team/getFirstAncestorTeams.usecase";
import { GetTeamUsecase } from "./team/getTeam.usecase";
import { RemoveTeamMemberUsecase } from "./team/removeTeamMember.usecase";
import { UpdateTeamUsecase } from "./team/updateTeam.usecase";

export type Usecases = {
  createTeamUsecase: CreateTeamUsecase;
  getTeamUsecase: GetTeamUsecase;
  updateTeamUsecase: UpdateTeamUsecase;
  deleteTeamUsecase: DeleteTeamUsecase;
  addTeamMemberUsecase: AddTeamMemberUsecase;
  removeTeamMemberUsecase: RemoveTeamMemberUsecase;
  changeTeamParentUsecase: ChangeTeamParentUsecase;
  getFirstAncestorTeamsUsecase: GetFirstAncestorTeamsUsecase;
};

export const initApplication = ({
  teamRepository,
  memberRepository,
}: {
  teamRepository: TeamRepositoryPort;
  memberRepository: MemberRepositoryPort;
}): Usecases => {
  const createTeamUsecase = new CreateTeamUsecase(teamRepository);
  const getTeamUsecase = new GetTeamUsecase(teamRepository);
  const updateTeamUsecase = new UpdateTeamUsecase(teamRepository);
  const deleteTeamUsecase = new DeleteTeamUsecase(teamRepository);
  const addTeamMemberUsecase = new AddTeamMemberUsecase(
    teamRepository,
    memberRepository,
  );
  const removeTeamMemberUsecase = new RemoveTeamMemberUsecase(
    teamRepository,
    memberRepository,
  );
  const changeTeamParentUsecase = new ChangeTeamParentUsecase(teamRepository);
  const getFirstAncestorTeamsUsecase = new GetFirstAncestorTeamsUsecase(
    teamRepository,
  );

  return {
    createTeamUsecase,
    getTeamUsecase,
    updateTeamUsecase,
    deleteTeamUsecase,
    addTeamMemberUsecase,
    removeTeamMemberUsecase,
    changeTeamParentUsecase,
    getFirstAncestorTeamsUsecase,
  };
};
