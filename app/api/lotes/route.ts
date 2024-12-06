import { NextResponse } from "next/server";

const lotes = [
  {
  productId: 101,
    providerId: 202,
    expirationDate: "2025-12-31",
    isExpirable: true,
    manufactoringDate: "2023-06-15",
    loteCode: "LT12345",
    quantity: 50
  }
];

export async function GET(req: Request, res: Response) {
  return NextResponse.json(lotes);
}