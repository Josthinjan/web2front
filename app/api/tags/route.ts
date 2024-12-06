import { NextResponse } from "next/server";

const tags = [
  {
    id: 1,
    name: 'Electrónica',
    color: 'blue',
    estado: 'Activo'
  },
  {
    id: 2,
    name: 'Ropa'
  },
  {
    id: 3,
    name: 'Hogar'
  }
]

export default function handler(req: Request, res: Response) {
  return NextResponse.json(tags);
}