import { useEffect, useState } from "react";
import {
  Button,
  Container,
  CircularProgress,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import useBarcodeScannerStore from "../../useBarcodeScannerStore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../useAuthStore";
import { useSnackbar } from "notistack";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";
import useInitializeConnection from "../../useInitializeConnection";

export default function LoginDijalog() {
  const [, setOpen] = useState(false);
  const { receivedData, startReading } = useBarcodeScannerStore();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { enqueueSnackbar } = useSnackbar();
  const [showLoading, setShowLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showTextField, setShowTextField] = useState(false);
  const [receivedDataState, setReceivedDataState] = useState("");
  const { t } = useTranslation();
  const { initializeConnection } = useInitializeConnection();

  useEffect(() => {
    console.log("Current receivedData:", receivedData);

    if (receivedData.trim() === "User1" || receivedData.trim() === "User2") {
      console.log("User found:", receivedData);
      login(receivedData);
      console.log("Checked login");
      navigate("/glavni-izbornik");
      enqueueSnackbar(t("loginMessage", { username: receivedData }), {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      setOpen(false);
    }
  }, [receivedData, login, navigate, enqueueSnackbar]);

  const dialogFunction = () => {
    console.log("function called");
    setOpenDialog(true);
    setShowLoading(false);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setShowTextField(false);
    setReceivedDataState("");
  };

  const openManualInput = () => {
    setShowTextField(true);
  };

  const manualLogin = () => {
    if (!receivedDataState) {
      enqueueSnackbar(t("manualLoginSnackbar"), {
        variant: "warning",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return;
    }

    if (receivedDataState === "User1" || receivedDataState === "User2") {
      login(receivedDataState);
      navigate("/glavni-izbornik");
      enqueueSnackbar(t("loginMessage", { username: receivedDataState }), {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      closeDialog();
    } else {
      enqueueSnackbar(t("manualLoginErrorSnacbar"), {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  };

  const handleOpen = async () => {
    setOpen(true);
    setShowLoading(true);
    startReading();
    try {
      await initializeConnection();
      console.log("Timer started for 10 seconds.");
      setTimeout(() => {
        dialogFunction();
      }, 10000);
    } catch (error) {
      console.log("Error during serial port connection or reading:", error);
      enqueueSnackbar(t("errorBarcodeScanner"), {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      setOpen(false);
    }
  };

  return (
    <Container>
      {showLoading ? (
        <Box>
          <CircularProgress size={150} thickness={5} sx={{ p: 2 }} />
          <Typography variant="h5">{t("circularProgressScanning")}</Typography>
        </Box>
      ) : (
        <Button
          onClick={handleOpen}
          onTouchStart={handleOpen}
          variant="contained"
          sx={{ height: "150px" }}
        >
          {t("userLogin")}
        </Button>
      )}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle sx={{ bgcolor: "#c1aba6", color: "black" }}>
          Error
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#c1aba6", color: "black" }}>
          {t("manualInput")}
          {showTextField && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                color: "black",
              }}
            >
              <TextField
                variant="outlined"
                label={t("manualInputField")}
                value={receivedDataState}
                onChange={(e) => setReceivedDataState(e.target.value)}
                sx={{
                  m: 2,
                }}
              />
              <Button variant="contained" onClick={manualLogin}>
                {t("loginManual")}
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#c1aba6" }}>
          <Button variant="contained" onClick={closeDialog}>
            {t("no")}
          </Button>
          <Button variant="contained" autoFocus onClick={openManualInput}>
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
