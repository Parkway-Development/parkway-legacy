import { BaseApiTypes, QueryType } from '../../hooks/useApi.ts';
import { To } from 'react-router-dom';

export type SharedBasePageProps = {
  queryKey: QueryType;
  baseApiType: keyof BaseApiTypes;
  mainPage: To;
};
