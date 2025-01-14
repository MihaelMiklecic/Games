import { create } from "zustand";

interface ScannerInfoState {
  dataObj: object | null;
  setDataObj: (data: object) => void;
}
const useScannerInfo = create<ScannerInfoState>((set) => ({
  dataObj: null,
  setDataObj: (data) => set({ dataObj: data }),
}));

export default useScannerInfo;
