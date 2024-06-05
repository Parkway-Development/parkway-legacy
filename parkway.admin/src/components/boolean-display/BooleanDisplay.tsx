import { CheckCircleOutlined } from '@ant-design/icons';

interface BooleanDisplayProps {
  value: boolean;
}

const BooleanDisplay = ({ value }: BooleanDisplayProps) => {
  return value ? <CheckCircleOutlined /> : null;
};

export default BooleanDisplay;
