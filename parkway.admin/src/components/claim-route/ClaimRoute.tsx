import { AppClaimKeys, useAuth } from '../../hooks/useAuth.tsx';
import { Outlet, RouteProps } from 'react-router-dom';
import { Result } from 'antd';

type ClaimRouteProps = RouteProps & {
  claim: AppClaimKeys;
};

const ClaimRoute = ({ claim }: ClaimRouteProps) => {
  const { isLoggedIn, hasClaim } = useAuth();

  if (!isLoggedIn || !hasClaim(claim)) {
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
