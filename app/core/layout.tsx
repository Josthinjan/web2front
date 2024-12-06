import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Logo from "@/components/ui/logo/Logo";
import React from "react";
import { BsBadgeAdFill } from "react-icons/bs";
import { FaDropbox } from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Sistema de Inventario | ADMIN",
  description: "Sistema de gestion de inventariado",
}; 

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <header className="border-b border-b-gray-300 py-3 px-3 w-[100%] flex items-center justify-between">
        <Logo href={"/core/dashboard"}/>
        <div className="flex justify-between items-center gap-2">
          <span className="font-bold flex justify-center items-center text-sm text-blue-400">
          </span>
        </div>
      </header>
      <div className="flex justify-center items-start w-full min-h-[calc(100vh-80px)]">
        {children}
      </div>
    </div>
  );
};

export default Layout;
