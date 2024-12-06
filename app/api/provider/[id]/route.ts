import { NextResponse } from "next/server";

const provider = [
  {
    id: 1,
    name: "Provider 1",
    description: "Description 1",
    products: [
      {
        id: 1,
        name: "Product 1",
        description: "Description 1",
        price: 100,
        quantity: 100,
        tagId: 1,
      },
      {
        id: 2,
        name: "Product 2",
        description: "Description 2",
        price: 200,
        quantity: 200,
        tagId: 2,
      },
      {
        id: 3,
        name: "Product 3",
        description: "Description 3",
        price: 300,
        quantity: 300,
        tagId: 3,
      },
    ],
  },
  {
    id: 2,
    name: "Provider 2",
    description: "Description 2",
    products: [
      {
        id: 4,
        name: "Product 4",
        description: "Description 4",
        price: 400,
        quantity: 400,
        tagId: 4,
      },
      {
        id: 5,
        name: "Product 5",
        description: "Description 5",
        price: 500,
        quantity: 500,
        tagId: 5,
      },
      {
        id: 6,
        name: "Product 6",
        description: "Description 6",
        price: 600,
        quantity: 600,
        tagId: 6,
      },
    ],
  },
]
export async function GET(req: Request, res: Response) {
  return NextResponse.json(provider);
}