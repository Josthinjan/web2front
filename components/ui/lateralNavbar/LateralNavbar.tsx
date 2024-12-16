import { useState, useEffect } from "react";
import { BsBox2, BsBoxArrowLeft, BsColumnsGap } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdSupport } from "react-icons/md";

import {
  CiAirportSign1,
  CiBoxes,
  CiDollar,
  CiWallet,
} from "react-icons/ci";

import NavLinkItem from "./NavLinkItem";
import Button from "@/components/shared/Button/Button";
import { useRouter } from "next/navigation";
import { GrNote } from "react-icons/gr";

const LateralNavbar = () => {
  const router = useRouter();
  const [role, setRole] = useState(null); // Estado para almacenar el rol del usuario

  // Obtener el rol desde sessionStorage al cargar el componente
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    router.push("/");
  };

  // Mostrar un loader mientras se carga el rol
  if (role === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] bg-transparent h-full px-5 py-4 bg-white border-r border-gray-200">
      <div className="border border-gray-400 rounded px-4 py-2 flex justify-center items-center mb-5 font-bold">
        <span className="flex items-center justify-center text-blue-400">
          INVENTORY
        </span>
        PRO
      </div>
      <nav className="px-3 flex flex-col gap-5">
        {role === "Admin" ? (
          // Menú para Admin
          <div>
            <h3 className="font-bold text-xl mb-3">Administracion</h3>
            <ul>
              <NavLinkItem
                href="/core/dashboard"
                label="Panel de control"
                Icon={BsColumnsGap}
              />
              <NavLinkItem
                href="/core/users"
                label="Usuarios"
                Icon={FaRegUser}
              />
              <NavLinkItem
                href="/core/chatbot"
                label="ChatBot"
                Icon={CiWallet}
              />
              <NavLinkItem
                href="/admin/factura"
                label="Facturas"
                Icon={CiDollar}
              />
              <NavLinkItem
                href="/core/permission"
                label="Roles y Permisos"
                Icon={MdOutlineTaskAlt}
              />
              <li className="text-sm cursor-pointer font-light px-3 py-2 flex justify-start items-center gap-2">
                <br />
                
                <Button
                  label="Salir"
                  type="button"
                  variant="outline"
                  onClick={logout}
                  Icon={BsBoxArrowLeft}
                />
              </li>
            </ul>
          </div>
        ) : (
          // Menú para otros roles
          <div>
            <h3 className="font-bold text-xl mb-3">Usuario</h3>
            <ul>
              <NavLinkItem
                href="/core/dashboard"
                label="Panel de control"
                Icon={BsColumnsGap}
              />
              <NavLinkItem
                href="/core/sitios"
                label="Bodegas y Sitios"
                Icon={CiBoxes}
              />
              <NavLinkItem
                href="/core/users"
                label="Usuarios"
                Icon={FaRegUser}
              />
              <NavLinkItem
                href="/core/products"
                label="Productos"
                Icon={BsBox2}
              />
              <NavLinkItem
                href="/core/tags"
                label="Etiquetas"
                Icon={GrNote}
              />
              <NavLinkItem
                href="/core/providers"
                label="Proveedores"
                Icon={FaRegUser}
              />
              <NavLinkItem href="/core/lotes" label="Lotes" Icon={CiBoxes} />
              <li className="text-sm cursor-pointer font-light px-3 py-2 flex justify-start items-center gap-2">
                <Button
                  label="Salir"
                  type="button"
                  variant="outline"
                  onClick={logout}
                  Icon={BsBoxArrowLeft}
                />
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default LateralNavbar;
