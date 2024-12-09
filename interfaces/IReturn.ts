export interface IReturn {
    fechaRetorno: string; // Fecha del retorno en formato de texto
    codigoLote: string;   // Código del lote del producto
    nombreUsuario: string; // Nombre del usuario que realiza el retorno
    nombreProducto: string; // Nombre del producto retornado
    cantidad: number; // Cantidad de productos que se están retornando
    motivoRetorno: string; // Razón o motivo del retorno
    estado: "Pendiente" | "En revisión" | "Procesado" | "Rechazado"; // Estado del retorno
  }
  