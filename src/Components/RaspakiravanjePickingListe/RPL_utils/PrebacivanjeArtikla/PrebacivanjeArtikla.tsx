import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { PrebacivanjeArtiklaHeader } from "./PrebacivanjeArtiklaHeader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useBarcodeScannerStore from "../../../useBarcodeScannerStore";

interface Kontejner {
  UID: string;
  SRCC: string;
  QTY: number;
  MATNR: string;
}

export default function PrebacivanjeArtikla() {
  const [destKontejner, setDestKontejner] = useState<string | null>(null);
  const { startReading, receivedData } = useBarcodeScannerStore();
  const [srcKontejner, setSrcKontejner] = useState<string | null>(null);
  const [rows, setRows] = useState<Kontejner[]>([]);
  const [rowsDest, setRowsDest] = useState<Kontejner[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<Kontejner | null>(null);
  const [transferQty, setTransferQty] = useState<number>(0);

  useEffect(() => {
    startReading();
    console.log("Received data:", receivedData);
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("NoviKarton_")
    );

    if (keys.length > 0) {
      const latestKey = keys[keys.length - 1];
      const storedValue = localStorage.getItem(latestKey);
      setDestKontejner(storedValue);
    }

    const SRCkontejner = receivedData;
    setSrcKontejner(SRCkontejner);
  }, [receivedData]);

  useEffect(() => {
    fetch("/Artikli.json")
      .then((response) => response.json())
      .then((data: Kontejner[]) => {
        const mappedData = data.map((item: Kontejner) => ({
          UID: item.UID,
          SRCC: item.SRCC,
          MATNR: item.MATNR,
          QTY: item.QTY,
        }));
        setRows(mappedData);
        setRowsDest([]);
      });
  }, []);

  useEffect(() => {
    if (destKontejner) {
      localStorage.setItem("NoviKarton_" + destKontejner, destKontejner);
    }

    if (rowsDest.length > 0) {
      localStorage.setItem("RowsDest_" + destKontejner, JSON.stringify(rowsDest));
    }
  }, [destKontejner, rowsDest]);

  const handleOpenDialog = (row: Kontejner) => {
    setSelectedRow(row);
    setTransferQty(0);
    setOpenDialog(true);
  };

  const handleConfirmTransfer = () => {
    if (selectedRow) {
      const updatedRows = rows.map((item) =>
        item.UID === selectedRow.UID
          ? { ...item, QTY: item.QTY - transferQty }
          : item
      );

      const rowsAfterTransfer = updatedRows.filter((item) => item.QTY > 0);

      const existingDestRow = rowsDest.find((item) => item.UID === selectedRow.UID);
      if (existingDestRow) {
        setRowsDest((prevRows) =>
          prevRows.map((item) =>
            item.UID === selectedRow.UID
              ? { ...item, QTY: item.QTY + transferQty }
              : item
          )
        );
      } else {
        setRowsDest((prevRows) => [
          ...prevRows,
          { ...selectedRow, QTY: transferQty },
        ]);
      }
      setRows(rowsAfterTransfer);
    }
    setOpenDialog(false);
  };

  const handleQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= (selectedRow?.QTY || 0)) {
      setTransferQty(value);
    }
  };

  const columns: GridColDef[] = [
    { field: "MATNR", headerName: "MATNR", width: 300 },
    { field: "QTY", headerName: "QTY", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog(params.row)}
        >
          Prebacivanje
        </Button>
      ),
    },
  ];

  const columns1: GridColDef[] = [
    { field: "MATNR", headerName: "MATNR", width: 300 },
    { field: "QTY", headerName: "QTY", width: 300 },
  ];

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <PrebacivanjeArtiklaHeader />
      <Box>
        <Typography variant="h4" sx={{ marginTop: 10 }}>
          SRC Kontejner: {srcKontejner}
        </Typography>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.UID} />
      </Box>
      <Box>
        <Typography variant="h4" sx={{ width: "auto", marginTop: 5 }}>
          DEST Kontejner: {destKontejner ? destKontejner : "No data found"}
        </Typography>
        <DataGrid
          rows={rowsDest}
          columns={columns1}
          getRowId={(row) => row.UID}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Transfer</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to transfer items from {selectedRow?.MATNR}.
          </Typography>
          <TextField
            label="Quantity to Transfer"
            type="number"
            value={transferQty}
            onChange={handleQtyChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />
          <Typography variant="body2">
            Available Quantity: {selectedRow?.QTY}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            Cancel
          </Button>
          <Button onClick={handleConfirmTransfer} variant="contained">
            Confirm Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
