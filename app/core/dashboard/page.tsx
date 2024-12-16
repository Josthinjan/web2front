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
  const [usuarios, setUsuarios] = useState<number>(0);
  const [retornos, setRetornos] = useState<number>(0);
  const [sitios, setSitios] = useState<number>(0);
  const [proveedores, setProveedores] = useState<number>(0);
  const [comprobantes, setComprobantes] = useState<number>(0);
  const [productosRecientes, setProductosRecientes] = useState<any[]>([]);

  // Fetching data
  const { data: providerData, error: providerError, loading: providerLoading } = useFetch({ url: "/proveedores" });
  const { data: userData, error: userError, loading: userLoading } = useFetch({ url: "/usuarios" });
  const { data: comprobanteData, error: comprobanteError, loading: comprobanteLoading } = useFetch({ url: "/comprobantes" });
  const { data: retornoData, error: retornoError, loading: retornoLoading } = useFetch({ url: "/retornos" });
  const { data: sitioData, error: sitioError, loading: sitioLoading } = useFetch({ url: "/sitios" });
  const { data: productoData, error: productoError, loading: productoLoading } = useFetch({ url: "/productos" });

  useEffect(() => {
    if (userData && Array.isArray(userData.data)) setUsuarios(userData.data.length);
    if (providerData && Array.isArray(providerData)) setProveedores(providerData.length);
    if (sitioData && sitioData.data && Array.isArray(sitioData.data)) setSitios(sitioData.data.length);
  }, [userData, providerData, comprobanteData, retornoData, sitioData]);

  useEffect(() => {
    if (productoData && productoData.length > 0) {
      setProductosRecientes(productoData.slice(0, 5)); // Show only the first 5 products
    }
  }, [productoData]);

  const handleExportExcel = async () => {
    try {
      const token = getTokenFromCookie();  // Obtén el token desde la cookie
      const tenant = sessionStorage.getItem("X_Tenant");  // Obtén el tenant desde sessionStorage

      if (!tenant) {
        alert("El tenant no está especificado");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "X-Tenant": tenant,
      };

      const response = await fetch(`${config.API_BASE_URL}/exportar/excel`, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Error al exportar a Excel");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${tenant}.xlsx`; // Usamos el nombre del tenant como nombre de archivo
      link.click();
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
    }
  };

  const handleExportSQL = async () => {
    try {
      const token = getTokenFromCookie();  // Obtén el token desde la cookie
      const tenant = sessionStorage.getItem("X_Tenant");  // Obtén el tenant desde sessionStorage

      if (!tenant) {
        alert("El tenant no está especificado");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "X-Tenant": tenant,
      };

      const response = await fetch(`${config.API_BASE_URL}/exportar/sql`, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Error al exportar a SQL");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${tenant}.sql`; // Usamos el nombre del tenant como nombre de archivo
      link.click();
    } catch (error) {
      console.error("Error al exportar a SQL:", error);
    }
  };

  return (
    <main className="flex justify-start items-start w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col justify-start items-center h-full p-3">
        {userLoading && <Label type="info" text="Cargando usuarios..." />}
        {providerLoading && <Label type="info" text="Cargando proveedores..." />}
        {sitioLoading && <Label type="info" text="Cargando sitios..." />}
        {productoLoading && <Label type="info" text="Cargando productos..." />}
        
        {userError && <Label type="error" text="Error al cargar los usuarios" />}
        {providerError && <Label type="error" text="Error al cargar los proveedores" />}
        {sitioError && <Label type="error" text="Error al cargar los sitios" />}
        {productoError && <Label type="error" text="Error al cargar los productos" />}

        <div className="text-gray-600 w-full">
          <h1 className="text-2xl font-bold">Administración General</h1>
        </div>
        <div className="flex gap-3 justify-start w-full items-center py-10">
          <DashboardSumaryCard 
            label="Total Usuarios" 
            value={usuarios || 0} 
            labelForegound={usuarios === 0 ? 'text-gray-400' : 'text-yellow-400'} 
          />
          <DashboardSumaryCard 
            label="Total Proveedores" 
            value={proveedores || 0} 
            labelForegound={proveedores === 0 ? 'text-gray-400' : 'text-red-400'} 
          />
          <DashboardSumaryCard 
            label="Total Sitios" 
            value={sitios || 0} 
            labelForegound={sitios === 0 ? 'text-gray-400' : 'text-purple-400'} 
          />
          
          {/* Contenedor de botones al lado de las Summary Cards */}
          <div className="flex gap-4">
            <Button 
              label="Exportar a Excel" 
              type="button" 
              variant="primary" 
              onClick={handleExportExcel}
              className="w-[200px] px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-blue-600 hover:to-blue-400 transition duration-300"
            />
            <Button 
              label="Exportar a SQL" 
              type="button" 
              variant="secondary" 
              onClick={handleExportSQL}
              className="w-[200px] px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-green-600 hover:to-green-400 transition duration-300"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          <h2 className="font-bold text-xl text-gray-600 py-3">Lista de Productos Recientes</h2>

          {/* Mostrar la tabla de productos recientes sin el panel de acciones */}
          <Table
            data={productosRecientes}
            columns={5}  // Definimos las columnas explícitamente
            rowsPerPage={5}  // Para mostrar solo 5 productos (sin paginación)
            idField="id"  // Usar el campo 'id' como identificador
          />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
