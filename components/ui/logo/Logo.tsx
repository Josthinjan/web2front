import Link from "next/link";
import React from "react";
import { FaDropbox } from "react-icons/fa";

interface LogoProps {
  href?: string;
}
const Logo = ({ href }: LogoProps) => {
  return (
    <Link
      href={href ? href : "/"}
      className="text-gray-600 flex justify-center items-center gap-2 hover:text-blue-400 hover:bg-blue-100 hover:border-blue-400 p-2 rounded-lg transition"
    >
      <FaDropbox size={35} />
      <h1 className="font-bold">
        Inventory<span className="text-blue-400 font-bold">Pro</span>
      </h1>
    </Link>
  );
};

export default Logo;
