import { Breakpoint } from 'antd/lib/_util/responsiveObserver';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const MainBreakpoint: Breakpoint = 'md';

const useResponsive = () => {
  const breakpoints = useBreakpoint(true);
  const aboveBreakpoint = breakpoints[MainBreakpoint] !== false;

  return {
    aboveBreakpoint,
    mainBreakpoint: MainBreakpoint
  };
};

export default useResponsive;
