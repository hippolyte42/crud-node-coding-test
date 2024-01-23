import { MemberRepositoryPort } from "../repositories/ports/member.repository.port";
import { TeamRepositoryPort } from "../repositories/ports/team.repository.port";
import { CreateTeamUsecase } from "./createTeam.usecase";
import { DeleteTeamUsecase } from "./deleteTeam.usecase";
import { GetTeamUsecase } from "./getTeam.usecase";
import { UpdateTeamUsecase } from "./updateTeam.usecase";

export type Usecases = {
  createTeamUsecase: CreateTeamUsecase;
  getTeamUsecase: GetTeamUsecase;
  updateTeamUsecase: UpdateTeamUsecase;
  deleteTeamUsecase: DeleteTeamUsecase;
};

export const initApplication = ({
  teamRepository,
}: {
  teamRepository: TeamRepositoryPort;
  memberRepository: MemberRepositoryPort;
}): Usecases => {
  const createTeamUsecase = new CreateTeamUsecase(teamRepository);
  const getTeamUsecase = new GetTeamUsecase(teamRepository);
  const updateTeamUsecase = new UpdateTeamUsecase(teamRepository);
  const deleteTeamUsecase = new DeleteTeamUsecase(teamRepository);

  return {
    createTeamUsecase,
    getTeamUsecase,
    updateTeamUsecase,
    deleteTeamUsecase,
  };
};
