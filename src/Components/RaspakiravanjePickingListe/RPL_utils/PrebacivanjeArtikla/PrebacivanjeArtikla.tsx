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
import { useTranslation } from "react-i18next";

interface Kontejner {
  UID: string;
  SRCC: string;
  QTY: number;
  MATNR: string;
  WEIGHT: number;
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
  const { t } = useTranslation();

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
          WEIGHT: item.WEIGHT,
         TotalWeight: Number("0.1") * item.QTY
        }));
        console.log("Mapped data:", mappedData);
        setRows(mappedData);
        setRowsDest([]);
      })
      .catch((error) => console.error("Error fetching Artikli.json:", error));
  }, []);
  

  useEffect(() => {
    if (destKontejner) {
      localStorage.setItem("NoviKarton_" + destKontejner, destKontejner);
    }
    if (rowsDest.length > 0) {
      localStorage.setItem(
        "RowsDest_" + destKontejner,
        JSON.stringify(rowsDest)
      );
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

      const existingDestRow = rowsDest.find(
        (item) => item.UID === selectedRow.UID
      );

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

  const handleUndo = () => {
    if (selectedRow) {
      const updatedRowsDest = rowsDest
        .map((item) =>
          item.UID === selectedRow.UID
            ? { ...item, QTY: item.QTY - transferQty }
            : item
        )
        .filter((item) => item.QTY > 0);

      const existingSrcRow = rows.find((item) => item.UID === selectedRow.UID);

      if (existingSrcRow) {
        setRows((prevRows) =>
          prevRows.map((item) =>
            item.UID === selectedRow.UID
              ? { ...item, QTY: item.QTY + transferQty }
              : item
          )
        );
      } else {
        setRows((prevRows) => [
          ...prevRows,
          { ...selectedRow, QTY: transferQty },
        ]);
      }

      setRowsDest(updatedRowsDest);
    }
  };

  const handleQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= (selectedRow?.QTY || 0)) {
      setTransferQty(value);
    }
  };

  const handleSave = () =>{
    localStorage.setItem("NoviKartonArtikli_" + destKontejner, JSON.stringify(rowsDest));
  }
  const columns: GridColDef[] = [
    { field: "MATNR", headerName: "MATNR", width: 100 },
    { field: "WEIGHT", headerName: "WEIGHT", width: 100 },
    { field: "QTY", headerName: "QTY", width: 100 },
    { field: "TotalWeight", headerName: "TotalWeight", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog(params.row)}
        >
          {t("prebacivanje")}
        </Button>
      ),
    },
  ];

  const columns1: GridColDef[] = [
    { field: "MATNR", headerName: "MATNR", width: 100 },
    { field: "QTY", headerName: "QTY", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: () => (
        <Button variant="contained" color="primary" onClick={handleUndo}>
          UNDO
        </Button>
      ),
    },
  ];

  return (<>
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "space-between",
        gap: 2,
      }}
    >
      <PrebacivanjeArtiklaHeader />
      <Box>
        <Typography variant="h4" sx={{ marginTop: 10 }}>
          SRC {t("kontejner")}: {srcKontejner}
        </Typography>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          getRowId={(row) => row.UID} 
        />
      </Box>
      <Box>
        <Typography variant="h4" sx={{ width: "auto", marginTop: 10 }}>
          DEST {t("kontejner")}:{" "}
          {destKontejner ? destKontejner : "No data found"}
        </Typography>
        <DataGrid
          rows={rowsDest}
          columns={columns1}
          getRowId={(row) => row.UID}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t("potvrdi")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("prebacuj_iz")} {selectedRow?.MATNR}.
          </Typography>
          <TextField
            label={t("kolicina")}
            type="number"
            value={transferQty}
            onChange={handleQtyChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 1, max: selectedRow?.QTY }}
          />
          <Typography variant="body2">
            {t("dostupna_kolicina")} {selectedRow?.QTY}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant="contained">
            {t("odustani")}
          </Button>
          <Button onClick={handleConfirmTransfer} variant="contained">
            {t("potvrdi")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <Button variant="contained" onClick={handleSave} >{t("spremi")}</Button>
    </Box>
    </>
  );
}
