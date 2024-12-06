"use client"
import Button from "@/components/shared/Button/Button";
import NavLinkHeader from "../header/NavLinkHeader";
import { FaCaretRight } from "react-icons/fa";
import Logo from "../logo/Logo";
const Header = () => {
  return (
    <header className="bg-white flex justify-between items-center p-4">
      <Logo />
      <nav className="flex justify-end items-center gap-4 ">
        <NavLinkHeader title="Precios" href="/pricing" />
        <NavLinkHeader title="Productos" href="/pricing" />
        <NavLinkHeader title="Iniciar Sesion" href="/auth/login" />
        <Button variant="primary" label="Contactar ventas" onClick={() => console.log("Hola")} type="button"/>
        <Button variant="outline" label="Empezar" Icon={FaCaretRight} onClick={() => console.log("Hola")} type="button"/>
      </nav>
    </header>
  );
};

export default Header;
