import { useEffect, useState } from "react";
import { Container, Button, Dialog, DialogContent } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { RPL_Header } from "./RPL_utils/RPL_Header";
import useBarcodeScannerStore from "../useBarcodeScannerStore";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Data {
  DOCID: string;
  DOCNAME: string;
  SRCC: string;
  UID: string;
}

export const RaspakiravanjePickingListe = () => {
  const [data, setData] = useState<Data[]>([]);
  const { receivedData } = useBarcodeScannerStore();
  const [, setChipColor] = useState<string>("red");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Data | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const prebacivanjeNaListuKartona = (row: Data) => {
    localStorage.setItem(`ParentID`, row.UID);
    console.log("Setted ParentID in localStorage: ", row.UID);
    navigate("/lista-kartona");
  };

  const handleOpenDialog = (row: Data) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    fetch("/ListaPickingListi.json")
      .then((response) => response.json())
      .then((data: Data[]) => {
        setData(data);
        console.log("data", data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (receivedData) {
      const matchingData = data.filter((item) => item.SRCC === receivedData);
      if (matchingData.length > 0) {
        setChipColor("green");
      } else {
        setChipColor("red");
      }
    }
  }, [receivedData, data]);

  const columns: GridColDef[] = [
    { field: "DOCID", headerName: "DOCID", width: 300 },
    { field: "DOCNAME", headerName: "DOCNAME", width: 300 },
    { field: "SRCC", headerName: "SRCC", width: 250 },
    {
      field: "actions",
      headerName: t("AKCIJE"),
      width: 250,
      renderCell: (params: GridRenderCellParams<Data>) => (
        <Button
          variant="contained"
          onClick={() => handleOpenDialog(params.row)}
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
        flexDirection: "column",
      }}
    >
      <RPL_Header />
      <Box style={{ height: "auto", width: "auto", marginTop: 10 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.DOCID}
          hideFooter
        />
      </Box>
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogContent>
          <Button
            sx={{ marginRight: 2 }}
            variant="contained"
            onClick={() => prebacivanjeNaListuKartona(selectedRow!)}
          >
            Raspakiraj
          </Button>
          <Button
            sx={{ marginLeft: 2 }}
            variant="contained"
            onClick={closeDialog}
          >
            ZATVORI
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default RaspakiravanjePickingListe;
