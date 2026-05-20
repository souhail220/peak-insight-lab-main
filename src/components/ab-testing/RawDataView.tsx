import { useMemo } from "react";
import { useABTestStore } from "@/store/abTestStore";
import { getFilteredData } from "@/lib/segments";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { UploadScreen } from "@/components/ABTestingUpload";

export function RawDataView() {
  const { dataA: rawA, dataB: rawB, filters } = useABTestStore();
  const filtered = useMemo(
    () => (rawA && rawB ? getFilteredData(rawA, rawB, filters) : null),
    [rawA, rawB, filters]
  );
  const dataA = filtered?.dataA;
  const dataB = filtered?.dataB;

  if (!dataA || !dataB) return <UploadScreen />;

  const allData = [...dataA.rawData.slice(0, 10), ...dataB.rawData.slice(0, 10)];

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();

    const fullDataA = dataA.rawData.map((row) => {
      const newRow: Record<string, string | number | null> = {};
      dataA.rawColumns.forEach((col) => {
        newRow[col] = row[col] ?? "";
      });
      return newRow;
    });

    const fullDataB = dataB.rawData.map((row) => {
      const newRow: Record<string, string | number | null> = {};
      dataB.rawColumns.forEach((col) => {
        newRow[col] = row[col] ?? "";
      });
      return newRow;
    });

    const wsA = XLSX.utils.json_to_sheet(fullDataA);
    const wsB = XLSX.utils.json_to_sheet(fullDataB);
    XLSX.utils.book_append_sheet(workbook, wsA, "Variant A");
    XLSX.utils.book_append_sheet(workbook, wsB, "Variant B");

    const timestamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `AB_Test_Raw_Data_${timestamp}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Raw Data</h3>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Download className="size-4" />
          Export to Excel
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-secondary/50 border-b border-border">
            <tr>
              {dataA.rawColumns.slice(0, 6).map((col) => (
                <th key={col} className="px-3 py-2 text-left font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allData.map((row, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30">
                {dataA.rawColumns.slice(0, 6).map((col) => (
                  <td key={col} className="px-3 py-2 text-muted-foreground">
                    {row[col] != null ? String(row[col]).slice(0, 20) : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
