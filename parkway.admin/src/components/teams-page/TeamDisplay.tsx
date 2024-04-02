import { Team } from '../../types';
import { Descriptions, DescriptionsProps } from 'antd';
import { UserNameDisplayById } from '../user-name-display';
import styles from './TeamDisplay.module.css';

const TeamDisplay = (team: Team) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Description',
      children: team.description
    },
    {
      key: 2,
      label: 'Leader',
      children: <UserNameDisplayById id={team.leader} />
    },
    {
      key: 3,
      label: 'Members',
      children: (
        <ul className={styles.memberDisplay}>
          {team.members.map((member, index) => (
            <li>
              <UserNameDisplayById key={index} id={member} />
            </li>
          ))}
        </ul>
      )
    }
  ];

  return (
    <>
      <Descriptions
        size="small"
        title={team.name}
        items={items}
        bordered
        column={1}
      />
    </>
  );
};

export default TeamDisplay;
