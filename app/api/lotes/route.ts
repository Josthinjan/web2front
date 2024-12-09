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
  },
  {
    productId: 102,
    providerId: 203,
    expirationDate: "2024-11-15",
    isExpirable: true,
    manufactoringDate: "2023-05-10",
    loteCode: "LT12346",
    quantity: 150
  },
  {
    productId: 103,
    providerId: 204,
    expirationDate: "2026-01-20",
    isExpirable: true,
    manufactoringDate: "2023-08-01",
    loteCode: "LT12347",
    quantity: 200
  },
  {
    productId: 104,
    providerId: 205,
    expirationDate: "2024-06-30",
    isExpirable: true,
    manufactoringDate: "2023-03-12",
    loteCode: "LT12348",
    quantity: 75
  },
  {
    productId: 105,
    providerId: 206,
    expirationDate: "2025-09-25",
    isExpirable: true,
    manufactoringDate: "2023-07-20",
    loteCode: "LT12349",
    quantity: 120
  },
  {
    productId: 106,
    providerId: 207,
    expirationDate: "2026-05-01",
    isExpirable: true,
    manufactoringDate: "2023-04-10",
    loteCode: "LT12350",
    quantity: 300
  },
  {
    productId: 107,
    providerId: 208,
    expirationDate: "2024-12-01",
    isExpirable: true,
    manufactoringDate: "2023-02-18",
    loteCode: "LT12351",
    quantity: 40
  },
  {
    productId: 108,
    providerId: 209,
    expirationDate: "2025-10-10",
    isExpirable: true,
    manufactoringDate: "2023-09-05",
    loteCode: "LT12352",
    quantity: 90
  },
  {
    productId: 109,
    providerId: 210,
    expirationDate: "2026-03-18",
    isExpirable: true,
    manufactoringDate: "2023-01-01",
    loteCode: "LT12353",
    quantity: 500
  },
  {
    productId: 110,
    providerId: 211,
    expirationDate: "2025-07-14",
    isExpirable: true,
    manufactoringDate: "2023-10-30",
    loteCode: "LT12354",
    quantity: 250
  }
];


export async function GET(req: Request, res: Response) {
  return NextResponse.json(lotes);
}