import { MemberRepositoryPort } from "../repositories/ports/member.repository.port";
import { TeamRepositoryPort } from "../repositories/ports/team.repository.port";
import { AddChildTeamToTeamUsecase } from "./team/addChildTeamToTeam.usecase";
import { AddTeamMemberUsecase } from "./team/addTeamMember.usecase";
import { CreateTeamUsecase } from "./team/createTeam.usecase";
import { DeleteTeamUsecase } from "./team/deleteTeam.usecase";
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
  addChildTeamToTeamUsecase: AddChildTeamToTeamUsecase;
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
  const addChildTeamToTeamUsecase = new AddChildTeamToTeamUsecase(
    teamRepository,
  );

  return {
    createTeamUsecase,
    getTeamUsecase,
    updateTeamUsecase,
    deleteTeamUsecase,
    addTeamMemberUsecase,
    removeTeamMemberUsecase,
    addChildTeamToTeamUsecase,
  };
};
