import { Enum } from '../../types';

const EnumDisplay = ({ name, values }: Enum) => {
  return (
    <>
      <h3>{name}</h3>
      <ul>{values?.map((value, index) => <li key={index}>{value}</li>)}</ul>
    </>
  );
};

export default EnumDisplay;
