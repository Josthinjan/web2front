import React from 'react';

interface OptionItemProps {
  value: string | number;
  name: string;
}

const OptionItem: React.FC<OptionItemProps> = ({ value, name }) => {
  return (
    <option value={value}>
      {name}
    </option>
  );
};

export default OptionItem;
