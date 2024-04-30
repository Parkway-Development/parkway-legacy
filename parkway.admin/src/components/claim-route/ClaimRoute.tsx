import { AppClaimKeys, useAuth } from '../../hooks/useAuth.tsx';
import { Outlet, RouteProps } from 'react-router-dom';
import { Result } from 'antd';

type ClaimRouteProps = RouteProps & {
  claim: AppClaimKeys;
  allowTeamLeads?: boolean;
};

const ClaimRoute = ({ claim, allowTeamLeads = false }: ClaimRouteProps) => {
  const { isLoggedIn, hasClaim, teamsLed } = useAuth();

  const isAuthorized =
    hasClaim(claim) || (allowTeamLeads && teamsLed.length > 0);

  if (!isLoggedIn || !isAuthorized) {
    return (
      <Result
        status="403"
        title="Unauthorized"
        subTitle="Sorry, you are not authorized to access this page."
      />
    );
  }

  return <Outlet />;
};

export default ClaimRoute;
