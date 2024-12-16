export interface ITag {
  id_etiqueta: number;  // El ID de la etiqueta (por ejemplo, auto-incrementado)
  nombre: string;       // El nombre de la etiqueta
  color_hex: string;    // El color en formato hexadecimal
  descripcion?: string; // Descripción de la etiqueta (opcional)
  categoria: string;    // Categoría de la etiqueta
  prioridad: 'alta' | 'media' | 'baja';  // Prioridad de la etiqueta (valor de un enum)
  isActive: boolean;    // Si la etiqueta está activa o no
  deleted_at?: string;  // Fecha de eliminación si está soft-deleted
  created_at: string;   // Fecha de creación
  updated_at: string;   // Fecha de última actualización
}
