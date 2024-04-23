import { Contribution } from '../../types';
import DateDisplay from '../date-display';
import { UserNameDisplayById } from '../user-name-display';

type ContributionTitleProps = {
  contribution: Contribution;
};

const ContributionTitle = ({ contribution }: ContributionTitleProps) => {
  return (
    <>
      <DateDisplay date={contribution.transactionDate} />
      {' - '}
      <UserNameDisplayById id={contribution.profile} />
    </>
  );
};

export default ContributionTitle;
