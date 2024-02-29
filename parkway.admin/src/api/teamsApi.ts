import { Team } from '../types/Team.ts';
import { GenericResponse, TypedResponse } from '../hooks/useApi.ts';
import { AxiosInstance } from 'axios';

export type TeamsApiType = {
  createTeam: (payload: Omit<Team, '_id'>) => TypedResponse<Team>;
  deleteTeam: (id: string) => GenericResponse;
  getTeams: () => TypedResponse<Team[]>;
};

const createTeam = (instance: AxiosInstance, payload: Omit<Team, '_id'>) =>
  instance.post('/api/team', payload);

const deleteTeam = (instance: AxiosInstance, id: string) =>
  instance.delete(`/api/team/${id}`);

const getTeams = (instance: AxiosInstance) => instance.get<Team[]>('/api/team');

const addTeamsApi = (instance: AxiosInstance): TeamsApiType => ({
  createTeam: (payload) => createTeam(instance, payload),
  deleteTeam: (id) => deleteTeam(instance, id),
  getTeams: () => getTeams(instance)
});

export default addTeamsApi;
