"use client";
import React, { useState } from 'react'
import Modal from './Modal'
import { useChatBotModal } from '@/hooks/modals/useChatBotModal';
import Form from '@/components/shared/Form/Form';
import FormInput from '@/components/shared/Form/FormInput';
import Button from '@/components/shared/Button/Button';


const ChatBotModal = () => {
  const chatBotModal = useChatBotModal();
  const [formData, setFormData] = useState({
    question: '',
    response: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  }

  const bodyModal = (
    <Form onSubmit={handleSubmit}>
      <FormInput 
        idInput='question'
        label='Pregunta'
        name='question'
        onChange={handleChange}
        type='text'
        value={formData.question}
      />
      <FormInput 
        idInput='response'
        label='Respuesta'
        name='response'
        onChange={handleChange}
        type='text'
        value={formData.response}
      />
      <div className='flex items-center justify-center p-3'>
        <Button variant='primary' label='Guardar' type='submit' />
      </div>
    </Form>
  )
  return(
    <Modal
      title='ChatBot'
      isOpen={chatBotModal.isOpen}
      onClose={chatBotModal.onClose}
      body={bodyModal}
    />

  )
}

export default ChatBotModal;