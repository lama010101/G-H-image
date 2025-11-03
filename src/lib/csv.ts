const serializeValue = (value: unknown): string => {
  if (value === null || typeof value === "undefined") {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }
  return String(value);
};

const escapeCell = (value: string): string => {
  if (value.includes('"')) {
    value = value.replace(/"/g, '""');
  }
  if (value.includes(",") || value.includes("\n") || value.includes("\r")) {
    return `"${value}"`;
  }
  return value;
};

const createCsv = (rows: Record<string, unknown>[], headerOrder?: string[]): string => {
  if (rows.length === 0) {
    return "";
  }

  const headers = headerOrder && headerOrder.length > 0
    ? headerOrder
    : Object.keys(rows[0]);

  const lines = [headers.map((header) => escapeCell(header)).join(",")];

  for (const row of rows) {
    const line = headers
      .map((header) => {
        const value = serializeValue(row[header]);
        return escapeCell(value);
      })
      .join(",");
    lines.push(line);
  }

  return lines.join("\r\n");
};

export const downloadCsv = (filename: string, rows: Record<string, unknown>[], headerOrder?: string[]): void => {
  const csv = createCsv(rows, headerOrder);
  if (!csv) {
    return;
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
