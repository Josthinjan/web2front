import React, { useState } from 'react'
import Modal from './Modal'
import { useInvoiceModal } from '@/hooks/modals/useInoviceModal';
import { IInvoice } from '@/interfaces/IInvoice';
const InvoiceModal = () => {
  const invoiceModal = useInvoiceModal();  
  const [formData, setFormData] = useState<IInvoice>({
    id: 0,
    providerId: 0,
    date: '',
    total: 0,
    products: []
  } as IInvoice);
  return (
    <Modal 
      isOpen={invoiceModal.isOpen}
      onClose={invoiceModal.onClose}
    />
  )
}

export default InvoiceModal