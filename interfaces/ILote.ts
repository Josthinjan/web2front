export interface ILote {
  id_lote?: number;
  id_producto: number;
  id_proveedor: number;
  id_sitio: number;
  fecha_fabricacion: string;
  fecha_caducidad: string;
  cantidad: number;
  expirable: boolean;
}