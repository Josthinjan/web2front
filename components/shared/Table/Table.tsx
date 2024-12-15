import React, { useState, useEffect } from "react";

interface TableProps {
  data: Array<Record<string, any>>; // Datos completos para la tabla
  columns: number; // Número de columnas a mostrar
  rowsPerPage: number; // Número de filas por página
  onEdit: (row: any) => void; // Función para editar una fila
  onDelete: (id: string | number) => void; // Función para eliminar una fila
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  rowsPerPage,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage); // Cálculo correcto de páginas

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

  useEffect(() => {
    console.log("Table Data:", data); // Log para verificar los datos que se pasan a la tabla
  }, [data]);

  return (
    <div className="overflow-x-auto w-full mt-4">
      {data.length === 0 ? (
        <p className="text-center">No hay datos para mostrar.</p>
      ) : (
        <table className="w-full table-auto border-collapse table-layout-auto">
          <thead>
            <tr>
              {Object.keys(data[0] || {}) // Cambiar paginatedData a data
                .slice(0, columns) // Mostrar solo las primeras 'n' columnas
                .map((key) => (
                  <th key={key} className="border p-2 text-left">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => ( // Usar paginatedData
              <tr key={index}>
                {Object.entries(row)
                  .slice(0, columns) // Solo las primeras 'n' columnas
                  .map(([key, value], colIndex) => (
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
                    onClick={() => onDelete(row.id_producto)} // Asume que id_producto es la clave
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-l"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="px-4 py-2">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            className="px-4 py-2 bg-gray-300 rounded-r"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
