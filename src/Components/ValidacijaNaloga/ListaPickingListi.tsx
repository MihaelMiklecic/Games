import { useState, useEffect } from "react";
import { Button, Box, Container, Dialog, DialogContent } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { t } from "i18next";
import SettingsIcon from "@mui/icons-material/Settings";
import { HeaderValidacije } from "./ValidacijaUtils/HeaderValidacije";
import { useNavigate } from "react-router-dom";
import useBarcodeScannerStore from "../useBarcodeScannerStore";
import Chip from "./ValidacijaUtils/Chip";

interface Data {
  DOCID: string;
  DOCNAME: string;
  SRCC: string;
}

export default function FlexGrid() {
  const [filteredData, setFilteredData] = useState<Data[]>(() => {
    const savedData = localStorage.getItem("filteredData");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openRSPSdialog, setOpenRSPSdialog] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { receivedData } = useBarcodeScannerStore();
  const [chipColor, setChipColor] = useState<string>("red");
  const scannedSRCC = receivedData;

  const resetValidation = () => {
    const resetData = localStorage.getItem(`tablicaOtpremnice${selectedDocId}`);
    if (resetData) {
      const parsedResetData = JSON.parse(resetData);
      const updatedData = parsedResetData.map((item: any) => ({
        ...item,
        collectedVal: "0",
      }));
      localStorage.setItem(
        "tablicaOtpremniceData",
        JSON.stringify(updatedData)
      );
      setOpenRSPSdialog(false);
    }
  };

  useEffect(() => {
    if (scannedSRCC) {
      fetch("/ListaPickingListi.json")
        .then((response) => response.json())
        .then((data: Data[]) => {
          const newFiltered = data.filter(
            (item: Data) => item.SRCC === scannedSRCC
          );
          setFilteredData((prevFilteredData) => {
            const updatedData = [...prevFilteredData, ...newFiltered];
            localStorage.setItem("filteredData", JSON.stringify(updatedData));
            return updatedData;
          });
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [scannedSRCC]);

  useEffect(() => {
    const storedData = localStorage.getItem(`tablicaOtpremnice${selectedDocId}`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const allValuesMatch = parsedData.every(
        (item: any) => item.collectedVal === item.QTY 
      );
      setChipColor(allValuesMatch ? "green" : "red");      
    }
  });

  const clearList = () => {
    setFilteredData([]);
    localStorage.removeItem("filteredData");
  };

  const handleOpenDialog = (docId: string) => {
    setSelectedDocId(docId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDocId(null);
  };

  const handleOpenRSPSdialog = () => {
    setOpenRSPSdialog(true);
  };

  const handleCloseRSPSdialog = () => {
    setOpenRSPSdialog(false);
  };

  const openValidacijaListe = () => {
    if (selectedDocId) {
      navigate("/validacija-liste", { state: { docId: selectedDocId } });
    }
  };

  const columns: GridColDef[] = [
    { field: "DOCID", headerName: "DOCID", width: 200 },
    { field: "DOCNAME", headerName: "DOCNAME", width: 300 },
    {
      field: "status",
      headerName: t("PROVJERA"),
      width: 250,
      renderCell: () => <Chip color={chipColor} />,
    },
    {
      field: "actions",
      headerName: t("AKCIJE"),
      width: 300,
      renderCell: (params: GridRenderCellParams<Data>) => (
        <Button
          variant="contained"
          onClick={() => handleOpenDialog(params.row.DOCID)}
          startIcon={<SettingsIcon />}
        >
          {t("AKCIJE")}
        </Button>
      ),
    },
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
      <HeaderValidacije />
      <Box sx={{ width: "100%", height: 500, marginBottom: "20px" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) => row.DOCID}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Button
          onClick={handleOpenRSPSdialog}
          variant="contained"
          sx={{ height: "100px", width: "400px" }}
        >
          {t("resetAll")}
        </Button>
        <Button
          onClick={clearList}
          variant="contained"
          sx={{ height: "100px", width: "400px" }}
        >
          {t("deleteList")}
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Button
              onClick={openValidacijaListe}
              variant="contained"
              disabled={!selectedDocId}
            >
              Validiraj listu
            </Button>
            <Button variant="contained" onClick={resetValidation}>
              RESETIRAJ STATUS PROVJERE
            </Button>
            <Button onClick={handleCloseDialog} variant="contained">
              {t("CLOSE")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={openRSPSdialog} onClose={handleCloseRSPSdialog}>
        <DialogContent>
          <Button onClick={resetValidation}>{t("YES")}</Button>
          <Button onClick={handleCloseRSPSdialog}>{t("NO")}</Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
