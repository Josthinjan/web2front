import React from 'react'

interface ITagProps {
  name: string
  color: string
}

const Tag = ({ name, color }: ITagProps) => {
  return (
    <div 
      style={{backgroundColor: color}} 
      title={name} 
      className={`text-white text-sm font-light py-[2px] px-[6px] rounded-md border-none`}
    >
      {name}
    </div>
  )
}

export default Tag