export interface IProducts {
  id_producto?: number; // ID opcional al crear un producto
  nombre_producto: string;
  tipo_producto: string; // Campo que se encuentra en la base de datos
  descripcion_producto: string;
  precio: number;
  isActive: boolean;
  deleted_at?: string | null; // Campo para el soft delete
  created_at?: string; // Fecha de creación
  updated_at?: string; // Fecha de actualización
}
