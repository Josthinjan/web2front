import React, { useState } from "react";
import Button from "@/components/shared/Button/Button";

interface CreatePlanFormProps {
  onSubmit: (data: any) => void;
}

const CreatePlanForm: React.FC<CreatePlanFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "ACTIVE", // Por defecto ACTIVE, pero se puede cambiar
    price: "10" // Valor por defecto
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Formatear el campo billing_cycles
    const billingCycles = `[{"frequency":{"interval_unit":"MONTH","interval_count":1},"tenure_type":"REGULAR","sequence":3,"total_cycles":12,"pricing_scheme":{"fixed_price":{"value":"${formData.price}","currency_code":"USD"}}}]`;

    // Formatear el campo payment_preferences
    const paymentPreferences = `{"auto_bill_outstanding":true,"setup_fee":{"value":"${formData.price}","currency_code":"USD"},"setup_fee_failure_action":"CONTINUE","payment_failure_threshold":3}`;

    const jsonPayload = {
      product_id: "1",
      name: formData.name,
      status: formData.status,
      billing_cycles: billingCycles,
      payment_preferences: paymentPreferences,
    };

    onSubmit(jsonPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border text-gray-700 border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border text-gray-700 border-gray-300 rounded-md"
          required
        >
          <option value="CREATED">CREATED</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border text-gray-700 border-gray-300 rounded-md"
          min="0"
          step="0.01"
          required
        />
      </div>

      <Button label="Crear Plan" type="submit" variant="primary" />
    </form>
  );
};

export default CreatePlanForm;
