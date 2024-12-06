import { NextResponse } from "next/server";

const products = [
  { id: 1, name: "Product 1" },
  { id: 2, name: "Product 2" },
  { id: 3, name: "Product 3" },
];

export async function GET(req: Request, res: Response) {
  return NextResponse.json(products);
}
/* 
 Now, you can access the API at  /api/products  and it will respond with a JSON object. 
 You can also use the  NextResponse  object to send other types of responses. For example, you can send a 404 status code like this:

export function get(req) {
  return NextResponse.error(new Error("Not found"), 404); 
}
*/


