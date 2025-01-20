import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  TextField,
} from "@mui/material";
import { ArtiklScanHeader } from "./ArtiklScanUtils/ArtiklScanHeader";
import useBarcodeScannerStore from "../useBarcodeScannerStore";
import { parseBarcode } from "gs1-barcode-parser-mod";
import useSendDataToScanner from "../Utilities/useSendDataToScanner";
import { useTranslation } from "react-i18next";

interface Artikl {
  BStat: string;
  GTIN?: string;
  TRGTIN?: string;
  SSCC: string;
  SERNUM: string | null;
  BATCH: string;
}

type ScanMode = "sekvencijski" | "opcijski";

export default function ArtiklScanTasks() {
  const [artikl, setArtikl] = useState<Artikl | null>(null);
  const [bstat, setBStat] = useState<string>("");
  const [gtin, setGtin] = useState<string>("");
  const [sscc, setSscc] = useState<string>("");
  const [batch, setBatch] = useState<string>("");
  const [trgtin, setTrgtin] = useState<string>("");
  const [filteredArtikl, setFilteredArtikl] = useState<Artikl | null>(null);
  const { receivedData, setReceivedData } = useBarcodeScannerStore();
  const [scanMode, setScanMode] = useState<ScanMode>("sekvencijski");
  const [currentStep, setCurrentStep] = useState<keyof Artikl | null>("GTIN");
  const [showBox, setShowBox] = useState(false);
  const [opcijskiScannedData, setOpcijskiScannedData] = useState<Set<string>>(
    new Set()
  );
  const [sekvencijskiScannedData, setSekvencijskiScannedData] = useState<
    Set<string>
  >(new Set());
  const { t } = useTranslation();

  useEffect(() => {
    if (receivedData) {
      let isValid = false;
      const addScannedData = (barcode: string) => {
        if (scanMode === "sekvencijski" && currentStep) {
          setSekvencijskiScannedData((prev) => new Set([...prev, barcode]));
          isValid = sekvencijskiScannedData.has(barcode);
        } else if (scanMode === "opcijski") {
          setOpcijskiScannedData((prev) => new Set([...prev, barcode]));
          isValid = true;
        }

        setShowBox(!isValid);
      };

      try {
        const parsedResult = parseBarcode(receivedData);
        parsedResult.parsedCodeItems.forEach((item: any) => {
          const stepToCheck =
            currentStep === "GTIN" && bstat.includes("T")
              ? "TRGTIN"
              : currentStep;
          if (
            scanMode === "sekvencijski" &&
            item.dataTitle.replace("/LOT", "") === stepToCheck
          ) {
            addScannedData(item.data);
          }
          if (scanMode === "opcijski") {
            addScannedData(item.data);
          }
        });

        if (scanMode === "sekvencijski" && currentStep) {
          const isGtinScanned =
            sekvencijskiScannedData.has(gtin) ||
            sekvencijskiScannedData.has(trgtin);
          if (
            (currentStep === "GTIN" && isGtinScanned) ||
            sekvencijskiScannedData.has(batch) ||
            sekvencijskiScannedData.has(sscc)
          ) {
            handleNextStep();
          }
        }
      } catch (error) {
        console.error("Error parsing barcode:", error);
      }

      setReceivedData("");
    }
  }, [receivedData, scanMode, currentStep, sekvencijskiScannedData]);

  const areAllFieldsScanned = () => {
    const isGtinScanned =
      sekvencijskiScannedData.has(gtin) || sekvencijskiScannedData.has(trgtin);
    return (
      isGtinScanned &&
      sekvencijskiScannedData.has(sscc) &&
      sekvencijskiScannedData.has(batch) &&
      (scanMode !== "sekvencijski" ||
        filteredArtikl?.SERNUM === null ||
        (filteredArtikl && sekvencijskiScannedData.has(filteredArtikl.SERNUM)))
    );
  };

  useEffect(() => {
    if (areAllFieldsScanned()) {
      useSendDataToScanner();
    }
  }, [sekvencijskiScannedData, scanMode, filteredArtikl, useSendDataToScanner]);

  const handleNextStep = () => {
    const steps: (keyof Artikl)[] = ["GTIN", "TRGTIN", "SSCC", "BATCH"];
    if (currentStep) {
      const nextIndex = steps.indexOf(currentStep) + 1;
      setCurrentStep(steps[nextIndex] || null);
    }
  };

  const handleScanModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as ScanMode;
    setScanMode(newMode);
    const startingStep = bstat.includes("T") ? "TRGTIN" : "GTIN";
    setCurrentStep(newMode === "sekvencijski" ? startingStep : null);
  };

  const handleSubmit = () => {
    const newArtikl = {
      BStat: bstat,
      GTIN: gtin,
      TRGTIN: trgtin,
      SERNUM: null,
      BATCH: batch,
      SSCC: sscc,
    };
    localStorage.setItem("artikl", JSON.stringify(newArtikl));
    setArtikl(newArtikl);
  };

  useEffect(() => {
    if (artikl) {
      let newArtikl: Artikl = {} as Artikl;
      if (bstat.includes("B")) newArtikl = { ...newArtikl, GTIN: artikl.GTIN };
      if (bstat.includes("T"))
        newArtikl = { ...newArtikl, TRGTIN: artikl.TRGTIN };
      if (bstat.includes("C")) newArtikl = { ...newArtikl, SSCC: artikl.SSCC };
      if (bstat.includes("H"))
        newArtikl = { ...newArtikl, BATCH: artikl.BATCH };
      if (bstat.includes("S"))
        newArtikl = { ...newArtikl, SERNUM: artikl.SERNUM };
      setFilteredArtikl(newArtikl);
    }
  }, [bstat, artikl]);

  const showError = "Error: Value not found";

  const renderBarcodeItem = (
    label: string,
    value: string | null,
    step: keyof Artikl
  ) => {
    if (!value) return null;

    const isGtinOrTrgtin =
      step === "GTIN" &&
      (sekvencijskiScannedData.has(gtin) ||
        sekvencijskiScannedData.has(trgtin));
    const isScanned =
      (scanMode === "opcijski" && opcijskiScannedData.has(value)) ||
      (scanMode === "sekvencijski" &&
        (isGtinOrTrgtin || sekvencijskiScannedData.has(value)));

    return (
      <ListItem
        sx={{
          borderRadius: 1,
          m: 1,
          width: "98%",
          backgroundColor: isScanned ? "green" : "white",
          color: isScanned ? "white" : "black",
        }}
      >
        <ListItemText primary={`${label}`} />
        <Divider />
      </ListItem>
    );
  };

  return (
    <Container>
      <ArtiklScanHeader />
      <Box>
        <Typography variant="h4">{t("skeniranje_barkodova")}</Typography>
        <RadioGroup
          row
          value={scanMode}
          onChange={handleScanModeChange}
          sx={{ marginBottom: 2 }}
        >
          <FormControlLabel
            value="opcijski"
            control={<Radio />}
            label={t("opcijski")}
          />
          <FormControlLabel
            value="sekvencijski"
            control={<Radio />}
            label="Sekvencijski"
          />
        </RadioGroup>
        {scanMode === "sekvencijski" && currentStep && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">
              {t("skeniraj")} <strong>REDOSLJEDOM</strong>
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          gap: 1,
          margin: 1,
          borderRadius: 1,
          boxShadow: "5px 5px 5px 5px lightgray",
        }}
      >
        <List>
          {renderBarcodeItem("GTIN", filteredArtikl?.GTIN ?? null, "GTIN")}
          {renderBarcodeItem(
            "TRGTIN",
            filteredArtikl?.TRGTIN ?? null,
            "TRGTIN"
          )}
          {renderBarcodeItem("SSCC", filteredArtikl?.SSCC ?? null, "SSCC")}
          {renderBarcodeItem("BATCH", filteredArtikl?.BATCH ?? null, "BATCH")}
          {renderBarcodeItem(
            "SERNUM",
            filteredArtikl?.SERNUM ?? null,
            "SERNUM"
          )}
        </List>
      </Box>

      {showBox && (
        <Box sx={{ marginTop: 10 }}>
          <Typography variant="h4" hidden={!showError}>
            {showError}
          </Typography>
        </Box>
      )}

      <Box
        sx={{ border: "1px solid black", marginTop: 10, p: 5, borderRadius: 2 }}
      >
        <TextField
          type="text"
          value={bstat}
          onChange={(e) => setBStat(e.target.value)}
          placeholder="Enter BStat"
        />
        <TextField
          type="text"
          value={gtin}
          onChange={(e) => setGtin(e.target.value)}
          placeholder="Enter GTIN"
        />
        <TextField
          type="text"
          value={sscc}
          onChange={(e) => setSscc(e.target.value)}
          placeholder="Enter SSCC"
        />
        <TextField
          type="text"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          placeholder="Enter Batch"
        />
        <TextField
          type="text"
          value={trgtin}
          onChange={(e) => setTrgtin(e.target.value)}
          placeholder="Enter TRGTIN"
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit BStat
        </Button>
      </Box>
    </Container>
  );
}
