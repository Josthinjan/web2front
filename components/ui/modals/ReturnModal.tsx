import React from "react";
import Modal from "./Modal";
import Button from "@/components/shared/Button/Button";

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir/Editar Retorno">
      <form>
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Código del lote" className="input" />
          <input type="text" placeholder="Nombre del usuario" className="input" />
          <input type="text" placeholder="Nombre del producto" className="input" />
          <input type="number" placeholder="Cantidad" className="input" />
          <textarea placeholder="Motivo del retorno" className="input" rows={3}></textarea>
          <div className="flex justify-end gap-2">
            <Button label="Cancelar" variant="secondary" onClick={onClose} />
            <Button label="Guardar" variant="primary" type="submit" />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ReturnModal;
