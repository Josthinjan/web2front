import { IProducts } from "./IProducts";

export interface IInvoice {
  id: number;
  providerId: number;
  date: string;
  total: number;
  products: IProducts[];
}