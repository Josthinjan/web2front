"use client";
import Button from "@/components/shared/Button/Button";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  title?: string;
  body?: React.ReactElement;
  actionLabel?: string;
  disabled?: boolean;
  secondaryActionLabel?: string;
  secondaryAction?: () => void;
}

const Modal = ({
  body,
  isOpen,
  onClose,
  onSubmit,
  title,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}: ModalProps) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleCloseModal = useCallback(() => {
    if (disabled) return;

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

/* 
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();  // Evita el comportamiento predeterminado del formulario
      if (disabled) return;
      onSubmit?.(event);  // Llama a la función onSubmit pasada como prop
    },
    [disabled, onSubmit]
  );
  
  const handleSecondaruAction = useCallback(() => {
    if (disabled || !secondaryAction) return;

    secondaryAction();
  }, [disabled, secondaryAction]);
 */
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="justify-center flex items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70 max-h-[100vh]">
        <div className="relative w-full md:w-4/6 xl:w-2/5 lg:w-3/6 my-6 mx-auto h-full lg:h-auto md:h-auto">
          {/*content*/}
          <div
            className={`
            translate 
            duration-300
            h-full
            ${showModal ? "translate-y-0" : "translate-y-full"}   
            ${showModal ? "opacity-100" : "opacity-0"}   
          `}
          >
            <div className="transalte h-full md:h-auto rounded shadow-md flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-center justify-center p-6 relative border-b-[1px]">
                <button
                  className="p-1 border-0 hover:opacity-70 transition absolute right-9 "
                  onClick={handleCloseModal}
                >
                  <IoMdClose size={20} />
                </button>
                <div className="text-lg font-semibold text-gray-700">
                  {title}
                </div>
              </div>
              <div>
                <div className="relative p-6 flex-auto">
                  {body}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
    </>
  );
};

export default Modal;
