"use client";
import Label from "@/components/ui/label/Label";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import { useFetch } from "@/hooks/useFetch";
import React from "react";

const Page = () => {

  const { data: roles, error: rolesError, loading: rolesLoading } = useFetch({
    url: "/api/roles",
  });

  const { data: permissions, error: permissionsError, loading: permissionsLoading } = useFetch({
    url: "/api/permissions",
  });

  const { data: users, error: usersError, loading: usersLoading } = useFetch({
    url: "/api/users",
  });
  
  return (
    <main className="flex justify-start items-start p-0 m-0 w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col justify-start items-start h-full p-3">
        {rolesError && <Label type="error" text="Error al cargar los roles" />}
        {rolesLoading && <Label type="info" text="Cargando roles..." />}
        {permissionsError && <Label type="error" text="Error al cargar los permisos" />}
        {permissionsLoading && <Label type="info" text="Cargando permisos..." />}
        {usersError && <Label type="error" text="Error al cargar los usuarios" />}
        {usersLoading && <Label type="info" text="Cargando usuarios..." />}
        <h1 className="text-2xl font-bold text-gray-800">
          Roles y Permisos
        </h1>
        <div>
          
        </div>
      </div>
    </main>
  );
};

export default Page;
