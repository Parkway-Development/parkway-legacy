import { Song } from '../../types';
import { Card, Descriptions, DescriptionsProps } from 'antd';
import { UserNameDisplayById } from '../user-name-display';
import styles from './SongDisplay.module.css';

const SongDisplay = (song: Song) => {
  const items: DescriptionsProps['items'] = [
    {
      key: 1,
      label: 'Subtitle',
      children: song.subtitle
    },
    {
      key: 2,
      label: 'Tempo',
      children: song.tempo
    },
    {
      key: 3,
      label: 'Time Signature',
      children: song.timeSignature
    },
    {
      key: 4,
      label: 'Artists',
      children: song.artists?.join(', ')
    },
    {
      key: 5,
      label: 'CCLI License',
      children: song.ccliLicense
    },
    {
      key: 6,
      label: 'Copyrights',
      children: song.copyrights?.join(', ')
    }
  ];

  const arrangements = song.arrangements?.length
    ? song.arrangements.map((arrangement, index) => {
        const arrangmentItems: DescriptionsProps['items'] = [
          {
            key: 1,
            label: 'Vocalist',
            children: <UserNameDisplayById id={arrangement.vocalist} />
          },
          {
            key: 2,
            label: 'Key',
            children: arrangement.key
          },
          {
            key: 3,
            label: 'Description',
            children: arrangement.arrangementDescription
          }
        ];

        return (
          <Card key={index} className={styles.arrangement}>
            <Descriptions
              size="small"
              title={arrangement.arrangementName}
              items={arrangmentItems}
              bordered
              column={1}
            />
          </Card>
        );
      })
    : 'No arrangements';

  return (
    <>
      <Descriptions
        size="small"
        title={song.title}
        items={items}
        bordered
        column={1}
      />
      <br />
      <h4>Arrangements</h4>
      {arrangements}
    </>
  );
};

export default SongDisplay;
