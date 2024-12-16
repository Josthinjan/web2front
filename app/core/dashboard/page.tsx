"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import DashboardSumaryCard from "./components/cards/DashboardSumaryCard";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import Label from "@/components/ui/label/Label";
import Table from "@/components/shared/Table/Table";
import { useFetch } from "@/hooks/useFetch";
import { config, getTokenFromCookie } from "@/config/config";

const DashboardPage = () => {
  const [role, setRole] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState({
    usuarios: 0,
    proveedores: 0,
    sitios: 0,
    comprobantes: 0,
    retornos: 0,
    planes: 0,
    metodosPago: 0,
    qaBot: 0,
  });
  const [recentItems, setRecentItems] = useState<any[]>([]);

  useEffect(() => {
    const userRole = sessionStorage.getItem("role");
    setRole(userRole);
  }, []);

  // Fetches for non-admin role
  const { data: userData, error: userError, loading: userLoading } = useFetch({ url: "/usuarios" });
  const { data: providerData, error: providerError, loading: providerLoading } = useFetch({ url: "/proveedores" });
  const { data: sitioData, error: sitioError, loading: sitioLoading } = useFetch({ url: "/sitios" });
  const { data: productoData, error: productoError, loading: productoLoading } = useFetch({ url: "/productos" });

  // Fetches for admin role
  const { data: planData, error: planError, loading: planLoading } = useFetch({ url: "/planes" });
  const { data: metodoPagoData, error: metodoPagoError, loading: metodoPagoLoading } = useFetch({ url: "/metodos-pago" });
  const { data: qaData, error: qaError, loading: qaLoading } = useFetch({ url: "/questions" });

  useEffect(() => {
    if (role === "Admin") {
      if (planData && Array.isArray(planData)) setSummaryData((prev) => ({ ...prev, planes: planData.length }));
      if (metodoPagoData && Array.isArray(metodoPagoData)) setSummaryData((prev) => ({ ...prev, metodosPago: metodoPagoData.length }));
      if (qaData && Array.isArray(qaData)) setSummaryData((prev) => ({ ...prev, qaBot: qaData.length }));
      if (planData && planData.length > 0) setRecentItems(planData.slice(0, 5));
    } else {
      if (userData && Array.isArray(userData.data)) setSummaryData((prev) => ({ ...prev, usuarios: userData.data.length }));
      if (providerData && Array.isArray(providerData)) setSummaryData((prev) => ({ ...prev, proveedores: providerData.length }));
      if (sitioData && sitioData.data && Array.isArray(sitioData.data)) setSummaryData((prev) => ({ ...prev, sitios: sitioData.data.length }));
      if (productoData && productoData.length > 0) setRecentItems(productoData.slice(0, 5));
    }
  }, [role, userData, providerData, sitioData, productoData, planData, metodoPagoData, qaData]);

  const handleExport = async (type: "excel" | "sql") => {
    try {
      const token = getTokenFromCookie();
      const tenant = sessionStorage.getItem("X_Tenant");

      if (!tenant) {
        alert("El tenant no está especificado");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "X-Tenant": tenant,
      };

      const response = await fetch(`${config.API_BASE_URL}/exportar/${type}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) throw new Error(`Error al exportar a ${type.toUpperCase()}`);

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${tenant}.${type}`;
      link.click();
    } catch (error) {
      console.error(`Error al exportar a ${type.toUpperCase()}:`, error);
    }
  };

  return (
    <main className="flex justify-start items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col justify-start items-center h-full p-3">
        {(role === "Admin" ? planLoading || metodoPagoLoading || qaLoading : userLoading || providerLoading || sitioLoading || productoLoading) && (
          <Label type="info" text="Cargando datos..." />
        )}

        {(role === "Admin" ? planError || metodoPagoError || qaError : userError || providerError || sitioError || productoError) && (
          <Label type="error" text="Error al cargar los datos" />
        )}

        <div className="text-gray-600 w-full">
          <h1 className="text-2xl font-bold">Administración General</h1>
        </div>
        <div className="flex gap-3 justify-start w-full items-center py-10">
          {role === "Admin" ? (
            <>
              <DashboardSumaryCard label="Total Planes" value={summaryData.planes} labelForegound="text-blue-400" />
              <DashboardSumaryCard label="Total Métodos de Pago" value={summaryData.metodosPago} labelForegound="text-green-400" />
              <DashboardSumaryCard label="Total QA Bot" value={summaryData.qaBot} labelForegound="text-yellow-400" />
            </>
          ) : (
            <>
              <DashboardSumaryCard label="Total Usuarios" value={summaryData.usuarios} labelForegound="text-yellow-400" />
              <DashboardSumaryCard label="Total Proveedores" value={summaryData.proveedores} labelForegound="text-red-400" />
              <DashboardSumaryCard label="Total Sitios" value={summaryData.sitios} labelForegound="text-purple-400" />

              <div className="flex gap-4">
                <Button
                  label="Exportar a Excel"
                  type="button"
                  variant="primary"
                  onClick={() => handleExport("excel")}
                  className="w-[200px] px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-blue-600 hover:to-blue-400 transition duration-300"
                />
                <Button
                  label="Exportar a SQL"
                  type="button"
                  variant="secondary"
                  onClick={() => handleExport("sql")}
                  className="w-[200px] px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-green-600 hover:to-green-400 transition duration-300"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <h2 className="font-bold text-xl text-gray-600 py-3">
            {role === "Admin" ? "Lista de Planes Recientes" : "Lista de Productos Recientes"}
          </h2>
          <Table
            data={recentItems}
            columns={5}
            rowsPerPage={5}
            idField="id"
          />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
