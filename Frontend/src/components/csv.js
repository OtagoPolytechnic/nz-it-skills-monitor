export function toCsv(rows = [], columns = []) {
    // columns: array of [label, fieldPath]
    const esc = (v) => {
      if (v == null) return "";
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
  
    const pick = (obj, path) => {
      if (!path) return "";
      return path.split(".").reduce((acc, k) => (acc && acc[k] != null ? acc[k] : ""), obj);
    };
  
    const header = columns.map(([label]) => esc(label)).join(",");
    const lines = rows.map((r) =>
      columns.map(([, field]) => esc(pick(r, field))).join(",")
    );
    return [header, ...lines].join("\n");
  }
  