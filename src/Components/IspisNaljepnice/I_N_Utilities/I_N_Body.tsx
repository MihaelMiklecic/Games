import { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Container,
  Dialog,
  DialogContent,
  Button,
  Typography,
} from "@mui/material";
import Dropdown from "../../Utilities/Dropdown";
import RučniUnosDialog from "./RučniUnosDialog";
import { IspisButton } from "./I_N_IspisButton";
import { SelectChangeEvent } from "@mui/material/Select";
import { useSnackbar } from "notistack";
import useBarcodeScannerStore from "../../useBarcodeScannerStore";
import Barcode from "../../Utilities/BarcodeNaljepnica";
import "../../Prijevod/i18n";
import { useTranslation } from "react-i18next";

export const I_N_Body = () => {
  const [dropdown1, setDropdown1] = useState<string>("");
  const [dropdown2, setDropdown2] = useState<string>("");
  const [dropdown4, setDropdown4] = useState<string>("");
  const [manualInputValue, setManualInputValue] = useState<string>("");
  const [autocompleteValue, setAutocompleteValue] = useState<number | null>(
    null
  );
  const { enqueueSnackbar } = useSnackbar();
  const { startReading, receivedData, setReceivedData } =
    useBarcodeScannerStore();
  const [receivedDataState, setReceivedDataState] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const { t } = useTranslation();

  const openDialogTemplate = () => {
    setOpenDialog(true);
    console.log("Opening template 1");
  };

  const closeDialogTemplate = () => {
    setOpenDialog(false);
  };

  const openDialogTemplate2 = () => {
    console.log("Opening template 2");
    setOpenDialog2(true);
  };

  const closeDialogTemplate2 = () => {
    setOpenDialog2(false);
  };

  useEffect(() => {
    if (receivedData) {
      setManualInputValue(receivedData);
      setReceivedDataState(receivedData);
      enqueueSnackbar(t("receivedDataMessage", { data: receivedData }), {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    } else {
      startReading();
      setReceivedData("");
    }
  }, [receivedData, startReading, enqueueSnackbar]);

  const clearDropdowns = () => {
    setDropdown1("");
    setDropdown2("");
    setDropdown4("");
    setAutocompleteValue(null);
    if (!receivedData) {
      setManualInputValue("");
      setReceivedDataState("");
    } else {
      setManualInputValue(receivedData);
      setReceivedDataState(receivedData);
      setReceivedData("");
    }
  };

  const logData = () => {
    setReceivedData("");
    const selectedLabel1 =
      dropdownOptions1.find((option) => option.value === dropdown1)?.label ||
      "Null";
    const selectedLabel2 =
      dropdownOptions2.find((option) => option.value === dropdown2)?.label ||
      "Null";
    const selectedLabel4 =
      dropdownOptions4.find((option) => option.value === dropdown4)?.label ||
      "Null";

    console.log("ŠIFRA:", manualInputValue);
    console.log("TIP:", selectedLabel1);
    console.log("TIP KODA:", selectedLabel2);
    console.log("PREDLOŽAK:", selectedLabel4);
    console.log("KOLIČINA NALJEPNICA:", autocompleteValue ?? "Null");
    enqueueSnackbar(t("printMessage"), {
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    setManualInputValue("");
    setReceivedDataState("");
  };

  const dropdownOptions1 = useMemo(
    () => [
      { value: "1", label: t("STANDARD") },
      { value: "2", label: "GS1" },
    ],
    []
  );

  const dropdownOptions2 = useMemo(
    () => [
      { value: "1", label: "SSCC" },
      { value: "2", label: t("LOKACIJA") },
      { value: "3", label: "MATRN" },
      { value: "4", label: "BATCH" },
      { value: "5", label: t("PRAZNO") },
    ],
    []
  );

  const dropdownOptions3 = useMemo(() => {
    return Array.from({ length: 999 }, (_, i) => i + 1);
  }, []);

  const dropdownOptions4 = useMemo(
    () => [
      { value: "1", label: "TEMPLATE 1" },
      { value: "2", label: "TEMPLATE 2" },
    ],
    []
  );

  const handleDropdownChange =
    (setDropdown: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent<string>) => {
      setDropdown(event.target.value);
    };
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
          height: "100vh",
          m: 2,
          p: 2,
        }}
      >
        <Box
          sx={{
            p: 4,
            boxShadow: 3,
            backgroundColor: "white",
            borderRadius: 2,
            width: "800px",
          }}
        >
          <TextField
            disabled
            id="filled-Basic"
            label={t("codeInput")}
            value={manualInputValue && receivedDataState}
            variant="outlined"
            sx={{
              width: "100%",
              mb: 2,
            }}
          />
          <RučniUnosDialog
            onInputSubmit={(input: string) => {
              setManualInputValue(input);
              setReceivedDataState(input);
              startReading();
            }}
          />
          <Dropdown
            label={t("TIP")}
            value={dropdown1}
            onChange={handleDropdownChange(setDropdown1)}
            options={dropdownOptions1}
          />
          <Dropdown
            label={t("codeType")}
            value={dropdown2}
            onChange={handleDropdownChange(setDropdown2)}
            options={dropdownOptions2}
          />
          <Autocomplete
            disablePortal
            autoHighlight
            options={dropdownOptions3}
            sx={{ width: "100%", alignText: "center" }}
            value={autocompleteValue}
            onChange={(_event, newValue) => setAutocompleteValue(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={t("stickerInput")} />
            )}
          />
          <Dropdown
            label={t("templates")}
            value={dropdown4}
            onChange={(event: SelectChangeEvent<string>) => {
              handleDropdownChange(setDropdown4)(event);
              if (event.target.value === "1") {
                openDialogTemplate();
              } else if (event.target.value === "2") {
                openDialogTemplate2();
              }
            }}
            options={dropdownOptions4}
          />

          <Dialog
            open={openDialog}
            onClose={closeDialogTemplate}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                bgcolor: "smokewhite",
              }}
            >
              <Typography variant="h6">Naljepnica : TEMPLATE 1</Typography>
              <Barcode data={receivedData && manualInputValue} gap={1} />
              <Button
                variant="contained"
                onClick={closeDialogTemplate}
                sx={{ bgcolor: "red" }}
              >
                Zatvori
              </Button>
            </DialogContent>
          </Dialog>
          <Dialog
            open={openDialog2}
            onClose={closeDialogTemplate2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                bgcolor: "smokewhite",
              }}
            >
              <Typography variant="h6">Naljepnica : TEMPLATE 2</Typography>
              <Barcode data={receivedData && manualInputValue} gap={100} />
              <Button
                variant="contained"
                onClick={closeDialogTemplate2}
                sx={{ bgcolor: "red" }}
              >
                Zatvori
              </Button>
            </DialogContent>
          </Dialog>
          <IspisButton logData={logData} onClick={clearDropdowns} />
        </Box>
      </Box>
    </Container>
  );
};
