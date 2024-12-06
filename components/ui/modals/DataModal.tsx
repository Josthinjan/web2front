import React from 'react'
import Modal from './Modal'
import { useDataModal } from '@/hooks/modals/useDataModal'
import Button from '@/components/shared/Button/Button';
import { useRouter } from 'next/navigation';

interface DataModalProps {  
  
}

const DataModal = () => {
  const DataModal = useDataModal();
  const router = useRouter();
  const mover = () => {
    router.push('/admin/dashboard?query=2')
  }
  const dataModalbody = (
    <Button variant='primary' label='Mover' onClick={mover} type='button'/>
  )
  return (
    <Modal 
      isOpen={DataModal.isOpen}
      body={dataModalbody}
    />
  )
}

export default DataModal