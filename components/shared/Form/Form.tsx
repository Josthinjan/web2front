import React from 'react'

interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
  className?: string
}

const Form = ({ onSubmit, children, className }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  )
}

export default Form;