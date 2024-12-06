export interface IProducts {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoriId: number | null;
  tagId: number | null;
}