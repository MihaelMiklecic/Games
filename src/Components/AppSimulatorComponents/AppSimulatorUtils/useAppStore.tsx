import { create } from 'zustand';

const useAppStore = create<AppState & AppActions>((set) => ({
    weightChanges: [],
    text: '',
    newValue: '',
    selectedDeviceID: '',
    setWeightChanges: (weightChanges) => set({ weightChanges }),
    setText: (text) => set({ text }),
    setNewValue: (newValue) => set({ newValue }),
    setSelectedDeviceID: (selectedDeviceID) => set({ selectedDeviceID }),
}));

export default useAppStore;

interface WeightChange {
    DeviceID: string;
    Value: string;
}

interface AppState {
    weightChanges: WeightChange[];
    text: string;
    newValue: string;
    selectedDeviceID: string;
}

interface AppActions {
    setWeightChanges: (weightChanges: WeightChange[]) => void;
    setText: (text: string) => void;
    setNewValue: (newValue: string) => void;
    setSelectedDeviceID: (selectedDeviceID: string) => void;
}
