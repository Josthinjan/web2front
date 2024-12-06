import React from 'react'

const loading = () => {
  return (
    <div className='w-full flex justify-center items-center min-h-[calc(100vh-80px)]'>
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
  )
}

export default loading