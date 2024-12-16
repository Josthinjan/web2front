import React, { useState, useEffect } from "react";

interface TableProps {
  data: Array<Record<string, any>>; // Datos completos para la tabla
  columns: number; // Número de columnas a mostrar
  rowsPerPage: number; // Número de filas por página
  onEdit?: (row: any) => void; // Función para editar una fila
  onDelete?: (id: string | number) => void; // Función para eliminar una fila
  idField: string; // Nombre del campo que contiene el ID
  onShowBarcode?: (id: string | number) => void; // Función para mostrar el código de barras
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  rowsPerPage,
  onEdit,
  onDelete,
  idField, // Recibimos el nombre del campo de ID
  onShowBarcode, // Recibimos la función para mostrar código de barras
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

  return (
    <div className="overflow-x-auto w-full mt-4">
      {data.length === 0 ? (
        <p className="text-center">No hay datos para mostrar.</p>
      ) : (
        <table className="w-full table-auto border-collapse table-layout-auto">
          <thead>
            <tr>
              {Object.keys(data[0] || {})
                .slice(0, columns)
                .map((key) => (
                  <th key={key} className="border p-2 text-left">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </th>
                ))}
              {(onEdit || onDelete || onShowBarcode) && <th className="border p-2">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index}>
                {Object.entries(row)
                  .slice(0, columns)
                  .map(([key, value], colIndex) => (
                    <td key={colIndex} className="border p-2 break-words whitespace-normal">
                      {value}
                    </td>
                  ))}
                {(onEdit || onDelete || onShowBarcode) && (
                  <td className="border p-2 flex justify-center space-x-2">
                    {onEdit && (
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => onEdit(row)}
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                          const id = row[idField];
                          if (id) {
                            onDelete(id);
                          } else {
                            console.error(`El ID (${idField}) no está disponible`);
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                    {onShowBarcode && (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                          const id = row[idField];
                          if (id) {
                            onShowBarcode(id); // Llamamos a la función de código de barras
                          } else {
                            console.error(`El ID (${idField}) no está disponible`);
                          }
                        }}
                      >
                        Mostrar Código de Barras
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="flex justify-between mt-4 w-full">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="px-4 py-2">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
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
