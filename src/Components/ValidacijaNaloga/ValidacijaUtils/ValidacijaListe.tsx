import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { SetStateAction, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";
import { ValidacijaListeHeader } from "./ValidacijaListeHeader";
import { useLocation } from "react-router-dom";
import useBarcodeScannerStore from "../../useBarcodeScannerStore";
import RučniUnosDialog from "../../IspisNaljepnice/I_N_Utilities/RučniUnosDialog";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
interface Data {
  docId: string;
  MATNR: string;
  QTY: string;
  collectedVal: boolean | string;
  GTIN13: boolean | string;
}


export const TablicaOtpremnice = () => {
  const [data, setData] = useState<Data[]>([]);
  const { t } = useTranslation();
  const location = useLocation();
  const { docId } = location.state || {};
  const { receivedData, setReceivedData } = useBarcodeScannerStore();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [mismatchedRows, setMismatchedRows] = useState<Data[]>([]);
  const LOCAL_STORAGE_KEY = `tablicaOtpremnice${docId}`;
  
  const acceptValidation = () => {
    navigate("/validacija-naloga");
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const changeColor = () => (row: Data) => {
    if (row.collectedVal === row.QTY) {
      return { bgcolor: "green" };
    } else if (row.collectedVal > "0") {
      return { bgcolor: "orange" };
    } else {
      return { bgcolor: "#b90c0c" };
    }
  };

  const saveDataToLocalStorage = (data: Data[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  const validateList = () => {
    let isValid = true;
    let mismatched: SetStateAction<Data[]> = [];

    setData((prevData) => {
      const updatedData = prevData.map((item) => {
        if (item.collectedVal !== item.QTY) {
          mismatched.push(item);
          isValid = false;
        }
        return { ...item };
      });

      setMismatchedRows(mismatched);
      saveDataToLocalStorage(updatedData);
      return updatedData;
    });

    if (isValid) {
      enqueueSnackbar(t("VALIDATED"), {
        variant: "success",
        autoHideDuration: 2000,
      });
    } else {
      setOpenDialog(true);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      fetch("/Artikli.json")
        .then((response) => response.json())
        .then((fetchedData) => {
          const mappedData = fetchedData.map((item: any) => ({
            docId: item.docId,
            MATNR: item.MATNR,
            QTY: item.QTY,
            collectedVal: item.collectedVal || "0",
            GTIN13: item.GTIN13 || "0",
          }));
          setData(mappedData);
          saveDataToLocalStorage(mappedData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [docId]);

  const updateCollectedVal = (data: string) => {
    setData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.GTIN13 === data
          ? {
              ...item,
              collectedVal: (
                parseInt(item.collectedVal as string, 10) + 1
              ).toFixed(),
            }
          : item
      );
      saveDataToLocalStorage(updatedData);
      return updatedData;
    });
    enqueueSnackbar(t("skenirano"), {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  const resetCollectedVal = () => {
    setData((prevData) => {
      const resetData = prevData.map((item) => ({
        ...item,
        collectedVal: "0",
      }));
      saveDataToLocalStorage(resetData);
      return resetData;
    });
    enqueueSnackbar(t("reset"), {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  useEffect(() => {
    if (receivedData) {
      updateCollectedVal(receivedData);
      setReceivedData("");
    }
  }, [receivedData]);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <ValidacijaListeHeader />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid black",
          width: "30%",
        }}
      >
        <Typography>DOCID: {docId}</Typography>
      </Box>
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
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell>MATNR</TableCell>
                <TableCell>{t("DETEKTIRANO")}</TableCell>
                <TableCell>{t("PRIKUPLJENO")}</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                  {t("manualInputLabel")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        row.collectedVal === row.QTY
                          ? "green"
                          : row.collectedVal === "0"
                          ? "#b90c0c"
                          : "orange",
                    }}
                  >
                    <TableCell sx={{ color: "white" }}>{row.MATNR}</TableCell>
                    <TableCell sx={{ color: "white" }}>{row.QTY}</TableCell>
                    <TableCell sx={{ color: "white" }}>
                      {row.collectedVal}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label=""
                        sx={{
                          bgcolor: changeColor()(row).bgcolor,
                          borderRadius: 2,
                          marginLeft: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <RučniUnosDialog
                        onInputSubmit={(input: string) => {
                          setData((prevData) =>
                            prevData.map((item, idx) =>
                              idx === index
                                ? {
                                    ...item,
                                    collectedVal: input,
                                  }
                                : item
                            )
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Button
        onClick={validateList}
        variant="contained"
        sx={{ m: 1, height: "50px" }}
      >
        {t("validate")}
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{ height: "auto", width: "auto" }}
      >
        <DialogContent sx={{ bgcolor: "#b90c0c" }}>
          <Typography
            sx={{ bgcolor: "#b90c0c", color: "white", p: 5 }}
            variant="h4"
          >
            Nepotpuni aritkli!!
          </Typography>
          {mismatchedRows.length > 0 ? (
            mismatchedRows.map((row, index) => (
              <Typography key={index} sx={{ color: "white" }}>
                {`MATNR: ${row.MATNR} - QTY: ${row.QTY} | Collected: ${row.collectedVal}`}
              </Typography>
            ))
          ) : (
            <Typography sx={{ color: "white" }}>
              Svi artikli prikupljeni.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#b90c0c" }}>
          <Button variant="contained" onClick={handleCloseDialog}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        onClick={acceptValidation}
        variant="contained"
        sx={{ m: 1, height: "50px" }}
      >
        {t("validateAccept")}
      </Button>
      <Button
        onClick={resetCollectedVal}
        variant="contained"
        sx={{ m: 1, height: "50px" }}
      >
        {t("resetCheck")}
      </Button>
    </Container>
  );
};

export default TablicaOtpremnice;
