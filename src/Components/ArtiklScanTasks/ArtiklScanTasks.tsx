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

interface Artikl {
  BStat: string;
  GTIN13: string;
  SSCC: string;
  SERNUM: string | null;
  BATCH: string;
}

type ScanMode = "sekvencijski" | "opcijski";

export default function ArtiklScanTasks() {
  const [artikl, setArtikl] = useState<Artikl | null>(null);
  const [bstat, setBStat] = useState<string>("");
  const [gtin13, setGtin13] = useState<string>("");
  const [sscc, setSscc] = useState<string>("");
  const [batch, setBatch] = useState<string>("");
  const [filteredArtikl, setFilteredArtikl] = useState<Artikl | null>(null);
  const { receivedData, setReceivedData } = useBarcodeScannerStore();
  const [scanMode, setScanMode] = useState<ScanMode>("sekvencijski");
  const [currentStep, setCurrentStep] = useState<keyof Artikl | null>("GTIN13");

  const [opcijskiScannedData, setOpcijskiScannedData] = useState<Set<string>>(new Set());
  const [sekvencijskiScannedData, setSekvencijskiScannedData] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (receivedData) {
      const addScannedData = (barcode: string) => {
        if (scanMode === "opcijski") {
          setOpcijskiScannedData((prev) => new Set([...prev, barcode]));
        } else if (scanMode === "sekvencijski" && currentStep) {
          setSekvencijskiScannedData((prev) => new Set([...prev, barcode]));
        }
      };

      try {
        const parsedResult = parseBarcode(receivedData);
        console.log("Parsed Barcode Data:", parsedResult);

        parsedResult.parsedCodeItems.forEach((item: any) => {
          if (scanMode === "opcijski") {
            addScannedData(item.data);
          }
          if (scanMode === "sekvencijski" && item.ai === currentStep) {
            addScannedData(item.data);
          }
        });

        if (scanMode === "sekvencijski" && currentStep) {
          if (currentStep === "GTIN13" && sekvencijskiScannedData.has(gtin13)) {
            handleNextStep();
          } else if (currentStep === "SSCC" && sekvencijskiScannedData.has(sscc)) {
            handleNextStep();
          } else if (currentStep === "BATCH" && sekvencijskiScannedData.has(batch)) {
            handleNextStep();
          }
        }
      } catch (error) {
        console.error("Error parsing barcode:", error);
      }

      setReceivedData("");
    }
  }, [receivedData, scanMode, currentStep, sekvencijskiScannedData]);

  const handleNextStep = () => {
    const steps = ["GTIN13", "SSCC", "BATCH"] as const;
    const nextIndex = steps.indexOf(currentStep as Exclude<keyof Artikl, "BStat" | "SERNUM">) + 1;
    setCurrentStep(steps[nextIndex] || null);
  };

  const handleScanModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as ScanMode;
    setScanMode(newMode);
    setCurrentStep(newMode === "sekvencijski" ? "GTIN13" : null);
  };

  const handleSubmit = () => {
    const newArtikl = {
      BStat: bstat,
      GTIN13: gtin13,
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
      if (bstat.includes("B"))
        newArtikl = { ...newArtikl, GTIN13: artikl.GTIN13 };
      if (bstat.includes("C"))
        newArtikl = { ...newArtikl, SSCC: artikl.SSCC };
      if (bstat.includes("H"))
        newArtikl = { ...newArtikl, BATCH: artikl.BATCH };
      if (bstat.includes("S"))
        newArtikl = { ...newArtikl, SERNUM: artikl.SERNUM };
      setFilteredArtikl(newArtikl);
    }
  }, [bstat, artikl]);

  const renderBarcodeItem = (
    label: string,
    value: string | null,
    step: keyof Artikl
  ) => {
    if (!value) return null;

    const isScanned =
      (scanMode === "opcijski" && opcijskiScannedData.has(value)) ||
      (scanMode === "sekvencijski" &&
        ((step === "GTIN13" && sekvencijskiScannedData.has(value)) ||
          (step === "SSCC" && sekvencijskiScannedData.has(value)) ||
          (step === "BATCH" && sekvencijskiScannedData.has(value))));

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
        <Typography variant="h4">Skeniraj Barkodove:</Typography>
        <RadioGroup
          row
          value={scanMode}
          onChange={handleScanModeChange}
          sx={{ marginBottom: 2 }}
        >
          <FormControlLabel
            value="opcijski"
            control={<Radio />}
            label="Opcijski"
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
              SKENIRAJ: <strong>{currentStep}</strong>
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
          {renderBarcodeItem("GTIN13", filteredArtikl?.GTIN13 ?? null, "GTIN13")}
          {renderBarcodeItem("SSCC", filteredArtikl?.SSCC ?? null, "SSCC")}
          {renderBarcodeItem("BATCH", filteredArtikl?.BATCH ?? null, "BATCH")}
          {renderBarcodeItem("SERNUM", filteredArtikl?.SERNUM ?? null, "SERNUM")}
        </List>
      </Box>
      <Box
        sx={{ border: "1px solid black", marginTop: 25, p: 5, borderRadius: 2 }}
      >
        <TextField
          type="text"
          value={bstat}
          onChange={(e) => setBStat(e.target.value)}
          placeholder="Enter BStat"
        />
        <TextField
          type="text"
          value={gtin13}
          onChange={(e) => setGtin13(e.target.value)}
          placeholder="Enter GTIN13"
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
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit BStat
        </Button>
      </Box>
    </Container>
  );
}
