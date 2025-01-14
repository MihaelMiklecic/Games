import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Barcode from "./BarcodeNaljepnica";
import useBarcodeScannerStore from "../useBarcodeScannerStore";
import { useEffect } from "react";

interface DialogComponentProps {
    open: boolean;
    onClose(): void;
}

const DialogComponent: React.FC<DialogComponentProps> = ({ open, onClose }) => {
    const { startReading, receivedData: barcodeData } = useBarcodeScannerStore();
     
    useEffect(()=>{
        startReading();
    },[barcodeData]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
            <Barcode data={barcodeData}/>
            </DialogContent>
            <DialogActions/>
        </Dialog>
    );
};

export default DialogComponent;