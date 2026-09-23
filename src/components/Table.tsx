import React, { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: (row: T) => string;
}

export default function Table<T>({ columns, data, keyField }: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <table className="min-w-full divide-y divide-border/40 text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-4 py-3 text-left font-semibold text-muted-foreground"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30 bg-white">
          {data.map((row) => (
            <tr key={keyField(row)} className="hover:bg-muted/30 transition-colors">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 ${col.className || ''}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

