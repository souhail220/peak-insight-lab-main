import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InterfaceData } from "@/lib/parseExcel";

export type Settings = {
  testName: string;
  variantALabel: string;
  variantBLabel: string;
  primaryKpi: string;
  confidenceThreshold: number;
};

export type Group = "all" | "A" | "B";
export type Filters = {
  group: Group;
  persona: string;
  city: string;
};

type State = {
  dataA: InterfaceData | null;
  dataB: InterfaceData | null;
  settings: Settings;
  filters: Filters;
  setData: (a: InterfaceData, b: InterfaceData) => void;
  clear: () => void;
  updateSettings: (s: Partial<Settings>) => void;
  updateFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
};

const defaultFilters: Filters = { group: "all", persona: "all", city: "all" };

export const useABTestStore = create<State>()(
  persist(
    (set) => ({
      dataA: null,
      dataB: null,
      settings: {
        testName: "",
        variantALabel: "Interface A",
        variantBLabel: "Interface B",
        primaryKpi: "",
        confidenceThreshold: 80,
      },
      filters: defaultFilters,
      setData: (a, b) =>
        set((s) => ({
          dataA: a,
          dataB: b,
          settings: {
            ...s.settings,
            testName: s.settings.testName || a.testName || b.testName,
            primaryKpi:
              s.settings.primaryKpi ||
              b.kpis.find((k) => /trip planning success/i.test(k.kpi))?.kpi ||
              b.kpis[0]?.kpi ||
              "",
          },
        })),
      clear: () => set({ dataA: null, dataB: null, filters: defaultFilters }),
      updateSettings: (s) =>
        set((state) => ({ settings: { ...state.settings, ...s } })),
      updateFilters: (f) =>
        set((state) => ({ filters: { ...state.filters, ...f } })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    { name: "peak-insight-ab-test" }
  )
);
