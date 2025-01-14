import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSnackbar } from "notistack";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";

interface Data {
  DOCID: string;
  DOCNUM: string;
  DOCTIME: string;
  DOCNAME: string;
  DOCDESC: string;
  RPT: boolean | null;
  QUEUE: string;
  SRID: boolean | null;
  SRLOC: string;
  SRCC: string;
  WDEV: string;
  DESTLOC: string;
  DESTCC: string;
  CSSTAT: string;
  CESTAT: string;
  DocType: string | null;
  Status: string;
  UID: string;
  MEMO: string | null;
  DateTime: string;
  HodogramUID: string;
  SmartRackUID: string;
  cellDeviceID: string;
  ID: string;
  ID_USER_EXT: string;
  TransUID_CONTSTAT: string | null;
  ParentID: string | null;
  TransUID: string | null;
  currentRealValue: string;
  QTY: string;
  transRecordStatus: string | null;
  rNBoja: string;
}

export const TablicaOtpremnice = () => {
  const [data, setData] = useState<Data[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogInfo, setOpenDialogInfo] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Data | null>(null);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const handlePrintClick = () => {
    console.log("Data to be printed:", selectedRow);
    setOpenPrintDialog(true);
  };
  const closePrintDialog = () => {
    setOpenPrintDialog(false);
    setOpenDialog(true);
  };

  const openActionDialog = (row: Data) => {
    setSelectedRow(row);
    console.log("Selected row:", row);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const openInfoDialog = () => {
    setOpenDialog(false);
    setOpenDialogInfo(true);
    enqueueSnackbar(t("infoDialog"), {
      variant: "info",
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
  };

  const closeInfoDialog = () => {
    setOpenDialogInfo(false);
    setSelectedRow(null);
  };

  const deleteRow = (index: number) => {
    const updatedData = [...data];
    updatedData.splice(index, 1);
    console.log("Updated data:", updatedData);
    setData(updatedData);
    closeDialog();
    enqueueSnackbar(t("deleteOtpremnica"), {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
  };

  useEffect(() => {
    fetch("/ListaPickingListi.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: 2,
          p: 2,
        }}
      >
        <TableContainer>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>DOCID</TableCell>
                <TableCell>DOCNUM</TableCell>
                <TableCell>DOCNAME</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>{t("PROVJERA")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.DOCID}</TableCell>
                  <TableCell>{row.DOCNUM}</TableCell>
                  <TableCell>{row.DOCNAME}</TableCell>
                  <TableCell>
                    <Chip label="s" sx={{ bgcolor: "black" }} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => openActionDialog(row)}
                    >
                      <SettingsIcon />
                      {t("AKCIJE")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Dialog open={openDialog} onClose={closeDialog}>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Button
                variant="contained"
                sx={{ bgcolor: "red" }}
                onClick={() =>
                  deleteRow(data.findIndex((d) => d === selectedRow))
                }
              >
                <DeleteIcon />
                {t("OBRIŠI")}
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "green" }}
                onClick={handlePrintClick}
              >
                <PrintIcon />
                {t("PRINT")}
              </Button>
              <Dialog open={openPrintDialog} onClose={closePrintDialog}>
                <DialogContent>
                  <Box>
                    <Box sx={{ display: "flex" }}>
                      <Checkbox></Checkbox>
                      <Typography variant="h6">{t("document")}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Checkbox></Checkbox>
                      <Typography variant="h6">{t("sticker")}</Typography>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={closePrintDialog}
                      sx={{
                        bgcolor: "green",
                      }}
                    >
                      {t("PRINT")}
                    </Button>
                  </Box>
                </DialogContent>
              </Dialog>
              <Button
                variant="contained"
                sx={{ bgcolor: "blue", width: "300px" }}
                onClick={openInfoDialog}
              >
                <InfoIcon sx={{ color: "white" }} />
                {t("INFO")}
              </Button>

              <Button variant="contained" onClick={closeDialog}>
                <ArrowBackIcon sx={{ color: "white" }} />
                {t("BACK")}
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog open={openDialogInfo} onClose={closeInfoDialog}>
            <DialogContent
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {selectedRow &&
                Object.entries(selectedRow).map(([key, value]) => (
                  <Typography key={key}>
                    <strong>{key}:</strong> {value || "N/A"}
                  </Typography>
                ))}
              <Button variant="contained" onClick={closeInfoDialog}>
                {t("ZATVORI")}
              </Button>
            </DialogContent>
          </Dialog>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default TablicaOtpremnice;
