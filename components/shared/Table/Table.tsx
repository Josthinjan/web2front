import React, { useState } from "react";

interface TableProps {
  data: Array<Record<string, any>>; // Datos completos para la tabla
  columns: number; // Número de columnas a mostrar
  rowsPerPage: number; // Número de filas por página
  onEdit: (row: any) => void; // Función para editar un usuario
  onDelete: (id: string | number) => void; // Acepta tanto 'string' como 'number'
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  rowsPerPage,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const totalPages = Math.ceil(data.length / rowsPerPage); // Número total de páginas

  // Datos paginados
  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Cambiar de página
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="overflow-x-auto w-full mt-4">
      <table className="w-full table-auto border-collapse table-layout-auto">
        <thead>
          <tr>
            {Object.keys(paginatedData[0] || {}).slice(0, columns).map((key) => (
              <th key={key} className="border p-2 text-left">
                {key}
              </th>
            ))}
            <th className="border p-2">Acciones</th> {/* Columna de acciones */}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {Object.entries(row).slice(0, columns).map(([key, value], colIndex) => (
                <td key={colIndex} className="border p-2 break-words whitespace-normal">
                  {value}
                </td>
              ))}
              <td className="border p-2 flex justify-center space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => onEdit(row)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => onDelete(row.codigo_lote)} // Llamar con el parámetro adecuado
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
