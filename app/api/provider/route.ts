import { NextResponse } from "next/server";

const providers = [
  { id: 1, name: "Provider 1" },
  { id: 2, name: "Provider 2" },
  { id: 3, name: "Provider 3" },
];

export function GET(req: Request, res: Response) {
  return NextResponse.json(providers);
}