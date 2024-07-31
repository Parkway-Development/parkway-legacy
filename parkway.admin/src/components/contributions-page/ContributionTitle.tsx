import { Contribution } from '../../types';
import DateDisplay from '../date-display';
import { UserNameDisplay } from '../user-name-display';

interface ContributionTitleProps {
  contribution: Contribution;
}

const ContributionTitle = ({ contribution }: ContributionTitleProps) => {
  return (
    <>
      <DateDisplay date={contribution.transactionDate} />
      {' - '}
      <UserNameDisplay user={contribution.contributorProfileId} />
    </>
  );
};

export default ContributionTitle;
