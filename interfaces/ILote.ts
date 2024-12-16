export interface ILote {
  id_lote: number; // ID único del lote
  id_producto: number; // ID del producto asociado al lote
  id_proveedor: number; // ID del proveedor asociado al lote
  id_sitio: number; // ID del sitio donde se almacena el lote (puede ser null o opcional)
  codigo_lote: string; // Código único del lote
  fecha_fabricacion: string; // Fecha de fabricación del lote (formato 'YYYY-MM-DD')
  fecha_caducidad: string; // Fecha de caducidad del lote (formato 'YYYY-MM-DD')
  cantidad: number; // Cantidad del producto en el lote
  expirable: boolean; // Indica si el lote es expirables o no
  created_at: string; // Fecha de creación del lote
  updated_at: string; // Fecha de la última actualización del lote
}
