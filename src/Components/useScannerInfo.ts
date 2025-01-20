import { create } from "zustand";

interface ScannerInfoState {
  dataObj: { device_serial?: string } | null;
  setDataObj: (data: { device_serial?: string }) => void;
}

const useScannerInfo = create<ScannerInfoState>((set) => ({
  dataObj: null,
  setDataObj: (data) => set({ dataObj: data }),
}));

export default useScannerInfo;
