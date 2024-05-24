import { Contribution } from '../../types';
import DateDisplay from '../date-display';
import { UserNameDisplay } from '../user-name-display';

type ContributionTitleProps = {
  contribution: Contribution;
};

const ContributionTitle = ({ contribution }: ContributionTitleProps) => {
  return (
    <>
      <DateDisplay date={contribution.transactionDate} />
      {' - '}
      <UserNameDisplay user={contribution.profile} />
    </>
  );
};

export default ContributionTitle;
