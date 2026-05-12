import { useState } from "react";
import { Upload, FileSpreadsheet, Loader2, X } from "lucide-react";
import { parseInterfaceFile } from "@/lib/parseExcel";
import { useABTestStore } from "@/store/abTestStore";

function DropZone({
  label,
  file,
  onFile,
  accent,
}: {
  label: string;
  file: File | null;
  onFile: (f: File | null) => void;
  accent: "gray" | "primary";
}) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`flex-1 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        drag ? "border-primary bg-primary/10" : file ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
      }`}
    >
      <input
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
        accent === "primary" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
      }`}>
        {file ? <FileSpreadsheet className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
      </div>
      <div className="font-medium text-foreground">{label}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {file ? (
          <span className="inline-flex items-center gap-1">
            {file.name}
            <button
              onClick={(e) => { e.preventDefault(); onFile(null); }}
              className="ml-1 text-primary"
            ><X className="w-3 h-3" /></button>
          </span>
        ) : "Drop .xlsx file or click to browse"}
      </div>
    </label>
  );
}

export function UploadScreen() {
  const setData = useABTestStore((s) => s.setData);
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    if (!fileA || !fileB) return;
    setLoading(true);
    setError(null);
    try {
      const [a, b] = await Promise.all([parseInterfaceFile(fileA), parseInterfaceFile(fileB)]);
      setData(a, b);
    } catch (e: any) {
      setError(e?.message || "Failed to parse files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-3xl w-full text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6">
          <Upload className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Upload your test data</h1>
        <p className="mt-2 text-muted-foreground">
          Drop both test variant Excel files to start analyzing your A/B test results.
        </p>
        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <DropZone label="Variant A (.xlsx)" file={fileA} onFile={setFileA} accent="gray" />
          <DropZone label="Variant B (.xlsx)" file={fileB} onFile={setFileB} accent="primary" />
        </div>
        {error && <div className="mt-4 text-sm text-destructive">{error}</div>}
        <button
          onClick={handleLoad}
          disabled={!fileA || !fileB || loading}
          className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Parsing files..." : "Load dashboard"}
        </button>
      </div>
    </div>
  );
}
