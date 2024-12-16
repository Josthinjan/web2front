export interface IUser {
  id_usuario: number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo_electronico: string;
  telefono: string;
  created_at: string;
  updated_at: string;
  rol_id: string; // Asegúrate de que sea el tipo correcto, por ejemplo, string o number
  isActive: boolean;
  password: string; // Agregado para el campo de contraseña
}
