
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
import useUserStore from "@/stores/useUserStore";
import { GrNote } from "react-icons/gr";

const LateralNavbar = () => {
  
  const router = useRouter();
  const user = useUserStore((state) => state.user);


  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    // document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  return (
    <>
      <div className="w-[300px] bg-transparent h-full px-5 py-4 bg-white border-r border-gray-200">
        <div className="border border-gray-400 rounded px-4 py-2 flex justify-center items-center mb-5 font-bold">
          <span className="flex items-center justify-center text-blue-400">
            IVENTORY
          </span>
          PRO
        </div>
        <nav className="px-3 flex flex-col gap-5">
          {user?.role === "admin" && (
            <div>
              <h3 className="font-bold text-xl mb-3">Administracion</h3>
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
                <NavLinkItem
                  href="/core/chatbot"
                  label="ChatBot"
                  Icon={CiWallet}
                />
                <NavLinkItem
                  href="/core/retornos"
                  label="Retornos"
                  Icon={CiAirportSign1}
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
                <NavLinkItem
                  href="/core/settings"
                  label="Configuracion"
                  Icon={IoSettingsOutline}
                />
                <NavLinkItem
                  href="/core/support"
                  label="Soporte"
                  Icon={MdSupport}
                />
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
          {user?.role === "owner" && (
            <div>
              <h3 className="font-bold text-xl mb-3">Propietario</h3>
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
                />core
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
          {user?.role === "user" && (
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
    </>
  );
};

export default LateralNavbar;
