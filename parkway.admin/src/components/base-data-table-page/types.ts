import { BaseApiTypes, QueryType } from '../../hooks/useApi.tsx';
import { To } from 'react-router-dom';

export interface SharedBasePageProps {
  queryKey: QueryType;
  baseApiType: keyof BaseApiTypes;
  mainPage: To;
}
