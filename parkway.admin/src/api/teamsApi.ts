import { Team } from '../types/Team.ts';
import { GenericResponse, TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';

export type TeamsApiType = {
  createTeam: (payload: Omit<Team, '_id'>) => TypedResponse<Team>;
  updateTeam: (payload: Team) => TypedResponse<Team>;
  deleteTeam: (id: string) => GenericResponse;
  getTeamById: (id: string) => () => TypedResponse<Team>;
  getTeams: () => TypedResponse<Team[]>;
};

const createTeam = (instance: AxiosInstance, payload: Omit<Team, '_id'>) =>
  instance.post('/api/team', payload);

const deleteTeam = (instance: AxiosInstance, id: string) =>
  instance.delete(`/api/team/${id}`);

const getTeams = (instance: AxiosInstance) => instance.get<Team[]>('/api/team');

const getTeam = (instance: AxiosInstance, id: string) =>
  instance.get<Team>(`/api/team/id/${id}`);

const updateTeam = (instance: AxiosInstance, { _id, ...payload }: Team) => {
  return instance.patch(`/api/team/${_id}`, payload);
};

const addTeamsApi = (instance: AxiosInstance): TeamsApiType => ({
  createTeam: (payload) => createTeam(instance, payload),
  deleteTeam: (id) => deleteTeam(instance, id),
  getTeamById: (id) => () => getTeam(instance, id),
  getTeams: () => getTeams(instance),
  updateTeam: (payload) => updateTeam(instance, payload)
});

export default addTeamsApi;
