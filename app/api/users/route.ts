import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const users = [
    {
      id: 1,
      name: "Juan",
      lastname: "Perez",
      cellphone: "1254656598",
      identity: "1232654598",
      email: "juanperez@mail.com",
      role: "admin",
    },
    {
      id: 2,
      name: "Maria",
      lastname: "Rodriguez",
      cellphone: "1254656598",
      identity: "1232654598",
      email: "marya@mail.com",
      role: "user",
    },
    {
      id: 1,
      name: "Juan",
      lastname: "Perez",
      cellphone: "1254656598",
      identity: "1232654598",
      email: "juanperez@mail.com",
      role: "admin",
    },
    {
      id: 1,
      name: "Juan",
      lastname: "Perez",
      cellphone: "1254656598",
      identity: "1232654598",
      email: "juanperez@mail.com",
      role: "admin",
    },
    {
      id: 1,
      name: "Juan",
      lastname: "Perez",
      cellphone: "1254656598",
      identity: "1232654598",
      email: "juanperez@mail.com",
      role: "admin",
    },
    {
      id: 1,
      name: "Juan",
      lastname: "Perez",
      cellphone: "1254656598",
      identity: "1232654598",
      email: "juanperez@mail.com",
      role: "admin",
    },
    {
      id: 1,
      name: "Juan",
      lastname: "Perez",
      cellphone: "1254656598",
      identity: "1232654598",
      email: "juanperez@mail.com",
      role: "admin",
    },
  ]
  return NextResponse.json(users);
}