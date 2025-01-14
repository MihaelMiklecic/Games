import { Box, Container, Typography, Button } from "@mui/material";
import { PrebacivanjeArtiklaHeader } from "./PrebacivanjeArtiklaHeader";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useBarcodeScannerStore from "../../../useBarcodeScannerStore";

interface Kontejner {
  UID: string;
  SRCC: string;
  QTY: string;
  MATNR: string;
}

export default function PrebacivanjeArtikla() {
  const [destKontejner, setDestKontejner] = useState<string | null>(null);
  const { startReading, receivedData } = useBarcodeScannerStore();
  const [srcKontejner, setSrcKontejner] = useState<string | null>(null);
  const [rows, setRows] = useState<Kontejner[]>([]);
  const [rowsDest, setRowsDest] = useState<Kontejner[]>([]);

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
  }, []);

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

  const handleTransferRow = (row: Kontejner) => {
    const updatedRows = rows.filter((item) => item.UID !== row.UID);
    setRows(updatedRows);
    setRowsDest((prevRows) => [...prevRows, row]);
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
          onClick={() => handleTransferRow(params.row)}
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
    </Container>
  );
}
