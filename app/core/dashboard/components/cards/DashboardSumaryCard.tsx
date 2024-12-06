import React from 'react'

interface DashboardSumaryCardProps {
  label: string
  value: number
  labelForegound?: string
  
}
const DashboardSumaryCard = ({ label, value, labelForegound }: DashboardSumaryCardProps) => {
  return (
    <div className={`border-gray-400 rounded p-4 border hover:shadow-sm cursor-pointer`}>
      <h2 className={`text-lg font-bold ${labelForegound ? labelForegound : 'text-red-400'}`}>
        {label}
      </h2>
      <p className='text-xl text-gray-600 font-bold'>
        {value}
      </p>
    </div>
  )
}

export default DashboardSumaryCard;