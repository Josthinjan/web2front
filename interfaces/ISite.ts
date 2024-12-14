export interface ISite {
    id_sitio?: number;       // El ID del sitio, opcional para casos de creación.
    nombre_sitio: string;      // Nombre del sitio.
    direccion: string;   // Dirección del sitio.
    ciudad: string;      // Ciudad donde se encuentra el sitio.
    pais: string;   // País donde se encuentra el sitio.
  }
  