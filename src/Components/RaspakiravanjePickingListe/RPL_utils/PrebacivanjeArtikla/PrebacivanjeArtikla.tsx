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
  Chip,
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
  WEIGHT: string;
  image: string;
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
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [totalWeightDest, setTotalWeightDest] = useState<number>(0);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [undoQty, setUndoQty] = useState<number>(0);
  const [undoDialogOpen, setUndoDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const calculateTotalWeight = rows.reduce(
      (acc, row) => acc + parseFloat(row.WEIGHT.replace(",", ".")) * row.QTY,
      0
    );
    setTotalWeight(calculateTotalWeight);
    console.log("Total weight:", calculateTotalWeight);
  }, [rows]);

  useEffect(() => {
    const calculateTotalWeightDest = rowsDest.reduce(
      (acc, row) => acc + parseFloat(row.WEIGHT.replace(",", ".")) * row.QTY,
      0
    );
    setTotalWeightDest(calculateTotalWeightDest);
    console.log("Total weight dest:", calculateTotalWeightDest);
  }, [rowsDest]);

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
          WEIGHT: item.WEIGHT +" kg",
          image: item.image,
          TotalWeight: parseFloat(item.WEIGHT.replace(",", ".")) * item.QTY + " kg",
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
  const handleOpenUndoDialog = (row: Kontejner) => {
    setSelectedRow(row);
    setUndoQty(0);
    setUndoDialogOpen(true);
  };

  const handleOpenDialog = (row: Kontejner) => {
    setSelectedRow(row);
    setTransferQty(0);
    setOpenDialog(true);
  };

  const handleInfoOpen = (row: Kontejner) =>{
    setSelectedRow(row);
    setInfoOpen(true);
  }

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
  const handleUndoQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= (selectedRow?.QTY || 0)) {
      setUndoQty(value);
    }
  };

  const handleConfirmUndo = () => {
    if (selectedRow) {
      const updatedRowsDest = rowsDest
        .map((item) =>
          item.UID === selectedRow.UID
            ? { ...item, QTY: item.QTY - undoQty }
            : item
        )
        .filter((item) => item.QTY > 0);
  
      const existingSrcRow = rows.find((item) => item.UID === selectedRow.UID);
  
      if (existingSrcRow) {
        setRows((prevRows) =>
          prevRows.map((item) =>
            item.UID === selectedRow.UID
              ? { ...item, QTY: item.QTY + undoQty }
              : item
          )
        );
      } else {
        setRows((prevRows) => [
          ...prevRows,
          { ...selectedRow, QTY: undoQty },
        ]);
      }
  
      setRowsDest(updatedRowsDest);
    }
    setUndoDialogOpen(false);
  };

  const handleQtyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (value >= 0 && value <= (selectedRow?.QTY || 0)) {
      setTransferQty(value);
    }
  };

  const handleSave = () => {
    if(totalWeight ||totalWeightDest > 1){
      alert("Prebacivanje nije moguce jer je totalna tezina prebacivanja veca od 1kg!")
    } else{
    localStorage.setItem(
      "NoviKartonArtikli_" + destKontejner,
      JSON.stringify(rowsDest)
    );};
  };
  const columns: GridColDef[] = [
    { field: "MATNR", headerName: "MATNR", width: 100 },
    { field: "WEIGHT", headerName: "WEIGHT", width: 75 },
    { field: "QTY", headerName: "QTY", width: 50 },
    { field: "TotalWeight", headerName: "TotalWeight", width: 75 },
    {
      field: "image",
      headerName: "IMAGE",
      width: 150,
      renderCell: (params) => (
        <img
          src={params.row.image}
          style={{width: "100px", height: "auto", objectFit: "cover", borderRadius: "4px"}}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box sx={{display: "flex", gap:1}}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog(params.row)}
        >
          {t("prebacivanje")}
        </Button>
        <Button
          variant="contained"
          onClick={() => handleInfoOpen(params.row)}
        >
          info
        </Button>
        </Box>
      ),
    },
  ];

  const columns1: GridColDef[] = [
    { field: "MATNR", headerName: "MATNR", width: 100 },
    { field: "WEIGHT", headerName: "WEIGHT", width: 75 },
    { field: "QTY", headerName: "QTY", width: 50 },
    { field: "TotalWeight", headerName: "TotalWeight", width: 75 },
    {
      field: "image",
      headerName: "IMAGE",
      width: 200,
      renderCell: (params) => (
        <img
          src={params.row.image}
          style={{ width: "100px", height: "100px" }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box sx={{display: "flex", gap:1, justifyContent:"center"}}>
        <Button variant="contained" color="primary" onClick={()=>handleOpenUndoDialog(params.row)}>
          UNDO
        </Button>
        <Button variant="contained" onClick={()=>handleInfoOpen(params.row)}>
          INFO
        </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
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
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <Box sx={{ height: "auto" }}>
            <Typography variant="h4" sx={{ marginTop: 10 }}>
              SRC {t("kontejner")}: {srcKontejner}
            </Typography>
            <Chip
              sx={{
                backgroundColor: totalWeight > 1.0 ? "red" : "lightgreen",
                width: 35,
              }}
            />
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.UID}
              hideFooter
            />
          </Box>
          <Box sx={{ height: "auto" }}>
            <Typography variant="h4" sx={{ width: "auto", marginTop: 10 }}>
              DEST {t("kontejner")}:{" "}
              {destKontejner ? destKontejner : "No data found"}
            </Typography>
            <Chip
              sx={{
                backgroundColor: totalWeightDest > 1.0 ? "red" : "lightgreen",
                width: 35,
              }}
            />
            <DataGrid
              rows={rowsDest}
              columns={columns1}
              getRowId={(row) => row.UID}
              hideFooter
              sx={{ height: "auto" }}
            />
          </Box>
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
        
        <Dialog open={infoOpen} onClose={() => setInfoOpen(false)}>
  <DialogTitle>INFO</DialogTitle>
  <DialogContent>
    {selectedRow && (
      <>
        <Typography variant="h6">SRCC: {selectedRow.SRCC}</Typography>
        <Typography variant="h6">QTY: {selectedRow.QTY}</Typography>
        <Typography variant="h6">MATNR: {selectedRow.MATNR}</Typography>
        <Typography variant="h6">WEIGHT: {selectedRow.WEIGHT}</Typography>
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <img
            src={selectedRow.image}
            alt={`${selectedRow.MATNR} image`}
            style={{
              width: "150px",
              height: "auto",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        </Box>
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setInfoOpen(false)} variant="contained">
      {t("close")}
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={undoDialogOpen} onClose={() => setUndoDialogOpen(false)}>
  <DialogTitle>{t("Undo Quantity")}</DialogTitle>
  <DialogContent>
    <Typography>
      {t("Returning items for")} {selectedRow?.MATNR}.
    </Typography>
    <TextField
      label={t("Quantity")}
      type="number"
      value={undoQty}
      onChange={handleUndoQtyChange}
      fullWidth
      margin="normal"
      inputProps={{ min: 1, max: selectedRow?.QTY }}
    />
    <Typography variant="body2">
      {t("Available to undo")}: {selectedRow?.QTY}
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setUndoDialogOpen(false)} variant="contained">
      {t("Cancel")}
    </Button>
    <Button onClick={handleConfirmUndo} variant="contained">
      {t("Confirm")}
    </Button>
  </DialogActions>
</Dialog>;

      </Container>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 2,
          padding: 2,
          backgroundColor: "white",
        }}
      >
        <Typography>Box SRC weight: </Typography>
        <TextField value={totalWeight.toFixed(3)} />
        <Button variant="contained" onClick={handleSave}>
          {t("spremi")}
        </Button>
        <Typography>Box DEST weight: </Typography>
        <TextField value={totalWeightDest.toFixed(3)} />
      </Box>
    </>
  );
}
