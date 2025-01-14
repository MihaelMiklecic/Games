import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Container, TextField, Grid } from "@mui/material";
import useBarcodeScannerStore from "../../useBarcodeScannerStore";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";

interface RučniUnosDialogProps {
  onInputSubmit: (value: string) => void;
}

export default function RučniUnosDialog({
  onInputSubmit,
}: RučniUnosDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { startReading, receivedData } = useBarcodeScannerStore();
  const [scannedValue, setScannedValue] = useState("");
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
    startReading();
    setScannedValue(receivedData);
    scannedValue && setInputValue(scannedValue);
  };

  const handleClose = () => {
    setOpen(false);
    setInputValue("");
  };

  const handleReset = () => {
    setInputValue("");
  };

  const handleUnesi = () => {
    console.log("Upisano:", inputValue);
    onInputSubmit(inputValue);
    setOpen(false);
    setInputValue("");
  };

  const handleButtonClick = (label: string) => {
    setInputValue((prevValue) => prevValue + label);
  };

  const numberButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const actionButtons = [".", "0"];
  const controlButtons = ["RESET", t("UNESI"), t("ZATVORI")];

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        p: 1,
      }}
    >
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{
          height: "70px",
          width: "250px",
        }}
      >
        {t("manualInputLabel")}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: "center" }}>
          {t("manualInputLabel")}
        </DialogTitle>

        <DialogContent>
          <TextField
            disabled
            value={inputValue || ""}
            id="filled-Basic"
            label={t("codeInput")}
            variant="outlined"
            sx={{ width: "100%", mb: 2 }}
          />

          <Grid container spacing={1} sx={{ mb: 2 }}>
            {numberButtons.map((label) => (
              <Grid item xs={4} key={label}>
                <Button
                  fullWidth
                  onClick={() => handleButtonClick(label)}
                  variant="contained"
                  sx={{ height: "50px" }}
                >
                  {label}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={1} sx={{ mb: 2 }}>
            {actionButtons.map((label) => (
              <Grid item xs={6} key={label}>
                <Button
                  fullWidth
                  onClick={() => handleButtonClick(label)}
                  variant="contained"
                  sx={{ height: "50px" }}
                >
                  {label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          {controlButtons.map((label) => (
            <Button
              key={label}
              onClick={
                label === "RESET"
                  ? handleReset
                  : label === "UNESI"
                  ? handleUnesi
                  : label === "INPUT"
                  ? handleUnesi
                  : label === "CLOSE"
                  ? handleClose
                  : () => {}
              }
              variant="contained"
              sx={{
                width: "300px",
                backgroundColor:
                  label === "RESET"
                    ? "orange"
                    : label === "UNESI"
                    ? "green"
                    : label === "ZATVORI"
                    ? "red"
                    : label === "INPUT"
                    ? "green"
                    : label === "CLOSE"
                    ? "red"
                    : "",
              }}
            >
              {label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </Container>
  );
}
