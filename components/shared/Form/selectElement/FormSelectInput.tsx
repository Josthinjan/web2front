import React from "react";

interface FormSelectInputProps {
  selectId: string;
  label: string;
  selectName: string;
  value: string;
  options: { name: string; value: string | number }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelectInput: React.FC<FormSelectInputProps> = ({
  selectId,
  label,
  selectName,
  value,
  options,
  onChange
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={selectId} className="block text-gray-700 text-sm mb-2">
        {label}
      </label>
      <select
        id={selectId}
        name={selectName}
        value={value}
        onChange={onChange}
        className="border text-gray-700 border-gray-300 rounded-md p-2 w-full"
      >
        <option value="">Seleccione</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelectInput;
