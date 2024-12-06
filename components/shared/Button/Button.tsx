import React from 'react'
import styles from './Button.module.css'
import { FaSpinner } from 'react-icons/fa'
type variant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'small'
type buttonType = 'submit' | 'reset' | 'button'

interface IButtonProps { 
  variant: variant
  type: buttonType
  label: string
  onClick?: () => void
  Icon?: React.ComponentType 
  isDisabled?: boolean
  isLoading?: boolean
}

const Button = ({ variant, label, onClick, type, Icon, isLoading, isDisabled }: IButtonProps) => {
  return (
    <button disabled={isDisabled} className={`${styles.button} ${styles[variant]}`} onClick={onClick} type={type}>
      {isLoading ? <FaSpinner className={styles.spinner} /> : <>
        {Icon && <Icon />}
        {label}
      </>}
    </button>
  )
}

export default Button;