export type estadoComprobante = "pendiente" | "pagado";

export interface IComprobante {
  fecha_emision: string;   // Fecha de emisión del comprobante
  codigo_lote: string;     // Código único del lote
  usuario_id: string;      // ID del usuario que genera el comprobante
  producto_id: string;     // ID del producto asociado al comprobante
  cantidad: number;        // Cantidad de productos en el comprobante
  precio_total: number;    // Precio total del comprobante
  estado: estadoComprobante; // Estado del comprobante (pendiente, pagado)
}
