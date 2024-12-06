export interface ILote {
  productId: number;
  providerId: number;
  loteCode: string;
  manufactoringDate: string;
  expirationDate: string;
  quantity: number;
  isExpirable: boolean;
}