import { MemberRepositoryPort } from "../repositories/ports/member.repository.port";
import { TeamRepositoryPort } from "../repositories/ports/team.repository.port";
import { CreateTeamUsecase } from "./createTeam.usecase";
import { GetTeamUsecase } from "./getTeam.usecase";

export type Usecases = {
  createTeamUsecase: CreateTeamUsecase;
  getTeamUsecase: GetTeamUsecase;
};

export const initApplication = ({
  teamRepository,
}: {
  teamRepository: TeamRepositoryPort;
  memberRepository: MemberRepositoryPort;
}) => {
  const createTeamUsecase = new CreateTeamUsecase(teamRepository);
  const getTeamUsecase = new GetTeamUsecase(teamRepository);

  return {
    createTeamUsecase,
    getTeamUsecase,
  };
};
