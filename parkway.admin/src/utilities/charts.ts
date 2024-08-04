const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00c49f'
];

export const getFillColor = (index: number) => {
  return colors[index % colors.length];
};
