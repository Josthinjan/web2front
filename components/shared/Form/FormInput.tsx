import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
interface ITextInputProps {
  label: string;
  type: string;
  name: string;
  value: string | number;
  idInput: string;
  Icon?: React.ComponentType;
  placeholder?: string;
  className?: string;
  error?: boolean | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  idInput,
  placeholder,
  Icon,
  className,
  error,
}: ITextInputProps) => {

 
 
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex gap-1 items-center justify-start mb-2">
        {Icon && <Icon />}
        <label htmlFor={idInput} className="text-[14px] font-light">{label}</label>
      </div>
      <input
        className={`bg-transparent px-3 py-1 w-full rounded text-gray-600 border focus-within:border-blue-400 focus-within:outline-none text-[14px]
          ${error ? "border-red-400" : "border-gray-400 "}
          `}
        type={type}
        id={idInput}
        value={value}
        onChange={onChange}
        placeholder={placeholder? placeholder : " "}
        name={name}
      />

      <span className="font-light text-red-500 text-sm">{error}</span>
    </div>
  );
};

export default FormInput;
