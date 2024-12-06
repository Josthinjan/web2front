"use client";
import Button from "@/components/shared/Button/Button";
import DashboardSumaryCard from "./components/cards/DashboardSumaryCard";
import LateralNavbar from "@/components/ui/lateralNavbar/LateralNavbar";
import React, { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import Label from "@/components/ui/label/Label";

const Page = () => {
  const [usuarios, setUsuarios] = useState<number>(0);
  const [retornos, setRetornos] = useState<number>(0);
  const [sitios, setSitios] = useState<number>(0);
  const [proveedores, setProveedores] = useState<number>(0);
  const [comprobantes, setComprobantes] = useState<number>(0);
  const { data: providerData, error: providerError, loading: providerLoading } = useFetch({
    url: "/api/provider",
  });

  const { data: userData, error: userError, loading: userLoading } = useFetch({
    url: "/api/users",
  }); 

  const { data: comprobanteData, error: comprobanteError, loading: comprobanteLoading } = useFetch({
    url: "/api/dashboard",
  });

  const { data: retornoData, error: retornoError, loading: retornoLoading } = useFetch({
    url: "/api/dashboard",
  });

  const { data: sitioData, error: sitioError, loading: sitioLoading } = useFetch({
    url: "/api/sitio",
  });

  

  /* 
  const [productosRecientes, setProductosRecientes] = useState<any[]>([]);
 
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const usuariosData = await fetchUsuarios();
        const productosData = await fetchProductosRecientes();
        const proveedoresData = await fetchProveedores();
        const comprobantesData = await fetchComprobantes();
        const retornosData = await fetchRetornos();
        const sitiosData = await fetchSitios();

        setUsuarios(usuariosData.total);
        setProveedores(proveedoresData.total);
        setProductosRecientes(productosData);
        setComprobantes(comprobantesData.total);
        setRetornos(retornosData.total);
        setSitios(sitiosData.total);
      } catch (err) {
        setError("Error al cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
 */
  // Datos para el gráfico de barras
  const barData = {
    labels: ['Usuarios', 'Proveedores', 'Comprobantes', 'Retornos', 'Sitios'],
    datasets: [
      {
        label: 'Estadísticas Generales',
        data: [usuarios, proveedores, comprobantes, retornos, sitios],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <main className="flex justify-center items-start p-0 m-0 w-full min-h-[calc(100vh-80px)]">
      <LateralNavbar />
      <div className="w-full flex flex-col justify-start items-center h-full p-3">
        {userLoading && <Label type="info" text="Cargando usuarios..." />}
        {providerLoading && <Label type="info" text="Cargando proveedores..." />}
        {comprobanteLoading && <Label type="info" text="Cargando comprobantes..." />}
        {retornoLoading && <Label type="info" text="Cargando retornos..." />}
        {sitioLoading && <Label type="info" text="Cargando sitios..." />}
        {userError && <Label type="error" text="Error al cargar los usuarios" />}
        {providerError && <Label type="error" text="Error al cargar los proveedores" />}
        {comprobanteError && <Label type="error" text="Error al cargar los comprobantes" />}
        {retornoError && <Label type="error" text="Error al cargar los retornos" />}
        {sitioError && <Label type="error" text="Error al cargar los sitios" />}

        <div className="text- text-gray-600 w-full">
          <h1 className="text-2xl font-bold">Administracion general</h1>
        </div>
        <div className="flex gap-3 justify-start w-full items-center py-10">
          <DashboardSumaryCard label="Total Usuarios" value={usuarios} labelForegound={'text-yellow-400'} />
          <DashboardSumaryCard label="Total Proveedores" value={proveedores} labelForegound={'text-red-400'} />
          <DashboardSumaryCard label="Total Comprobantes" value={comprobantes} labelForegound={'text-green-400'} />
          <DashboardSumaryCard label="Total Retornos" value={retornos} labelForegound={'text-blue-400'} />
          <DashboardSumaryCard label="Total Sitios" value={sitios} labelForegound={'text-purple-400'} />
        </div>
        <div className="flex flex-col justify-center items-center w-full">
          <h2 className="font-bold text-xl text-gray-600 py-3">Lista de productos recientes</h2>
          
        </div>
      </div>
    </main>
  );
};

export default Page;
