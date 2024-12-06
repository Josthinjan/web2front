import React from 'react'

interface IFormCheckboxProps {
  label: string;
  checked: boolean;
  idCheckbox?: string;
  nameCheckbox?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const FormCheckbox = ({ label, onChange, idCheckbox , nameCheckbox, checked }: IFormCheckboxProps) => {
  return (
    <div className='flex items-center my-4 '>
      <input 
        className='w-4 h-4 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600' 
        type='checkbox' 
        checked={checked} 
        id={idCheckbox } 
        name={nameCheckbox} 
        onChange={onChange}
      />
      <label htmlFor={idCheckbox} className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>{label}</label> 
    </div>
  )
}

export default FormCheckbox