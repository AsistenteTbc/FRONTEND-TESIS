import React from "react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T; // La clave del objeto (ej: 'name')
  render?: (item: T) => React.ReactNode; // Función opcional para renderizar algo complejo (botones)
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export const Table = <T extends { id: number | string }>({
  data,
  columns,
  emptyMessage = "No hay datos.",
}: TableProps<T>) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
      <table className="w-full text-left">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs font-bold">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`p-4 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-700/50 transition-colors"
              >
                {columns.map((col, idx) => (
                  <td key={idx} className="p-4">
                    {/* Si hay función render, úsala. Si no, muestra el valor directo */}
                    {col.render
                      ? col.render(item)
                      : col.accessorKey
                        ? String(item[col.accessorKey])
                        : "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
