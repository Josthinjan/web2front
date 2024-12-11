export type status = "Activo" | "Inactivo";

export interface IClient {
  name: string;
  email: string;
  status: status;
}
