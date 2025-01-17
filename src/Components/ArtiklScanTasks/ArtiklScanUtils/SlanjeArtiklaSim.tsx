import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { Divider } from "@mui/material";
import { parseBarcode } from "gs1-barcode-parser-mod";
import useBarcodeScannerStore from "../../useBarcodeScannerStore";
import { ArtiklScanHeader } from "./ArtiklScanHeader";

interface Artikl {
  BStat: string;
  GTIN13: string;
  SERNUM: string | null;
  BATCH: string;
  SSCC: string;
}

export default function ArtiklScanTasks() {
  const [artikl, setArtikl] = useState<Artikl | null>(null);
  const [bstat, setBStat] = useState<string>("");
  const [gtin13, setGtin13] = useState<string>("");
  const [sscc, setSscc] = useState<string>("");
  const [batch, setBatch] = useState<string>("");
  const [scannedData, setScannedData] = useState<string[]>([]);
  const [scanMode, setScanMode] = useState<"sequential" | "optional">("optional");
  const [currentStep, setCurrentStep] = useState<keyof Artikl | null>(null);
  const { receivedData, setReceivedData } = useBarcodeScannerStore();
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const storedBStat = localStorage.getItem("artikl");
    if (storedBStat) {
      const parsedBStat = JSON.parse(storedBStat);
      setArtikl(parsedBStat);
    }
  }, [receivedData]);

  useEffect(() => {
    if (receivedData) {
      setScannedData((prev) => [...new Set([...prev, receivedData])]);
      try {
        const parsedResult = parseBarcode(receivedData);
        parsedResult.parsedCodeItems.forEach((item: any) => {
          setData((prev) => [...new Set([...prev, item.data])]);
        });
      } catch (error) {
        console.error("Error parsing barcode:", error);
      }
      setReceivedData("");

      if (scanMode === "sequential" && currentStep) {
        handleNextStep();
      }
    }
  }, [receivedData]);

  const handleNextStep = () => {
    const steps = ["GTIN13", "SERNUM", "BATCH", "SSCC"] as const;
    const nextIndex = steps.indexOf(currentStep as Exclude<keyof Artikl, "BStat">) + 1;
    setCurrentStep(steps[nextIndex] || null);
  };

  const handleScanModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScanMode(event.target.value as "sequential" | "optional");
    setCurrentStep(scanMode === "sequential" ? "GTIN13" : null);
  };

  const handleSubmit = () => {
    localStorage.setItem(
      "artikl",
      JSON.stringify({
        BStat: bstat,
        GTIN13: gtin13,
        SERNUM: null,
        BATCH: batch,
        SSCC: sscc,
      })
    );
    setArtikl({
      BStat: bstat,
      GTIN13: gtin13,
      SERNUM: null,
      BATCH: batch,
      SSCC: sscc,
    });
  };

  return (
    <Container>
      <ArtiklScanHeader />
      <Box>
        <Typography variant="h4">Scan Data of Artikl: </Typography>
      </Box>

      {/* Scan Mode Selection */}
      <RadioGroup
        row
        value={scanMode}
        onChange={handleScanModeChange}
        sx={{ marginBottom: 2 }}
      >
        <FormControlLabel value="optional" control={<Radio />} label="Optional" />
        <FormControlLabel value="sequential" control={<Radio />} label="Sequential" />
      </RadioGroup>

      {/* Sequential Mode Prompt */}
      {scanMode === "sequential" && currentStep && (
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">
            Please scan: <strong>{currentStep}</strong>
          </Typography>
        </Box>
      )}

      {/* Data Display */}
      <Box
        sx={{
          gap: 1,
          margin: 1,
          borderRadius: 1,
          boxShadow: "5px 5px 5px 5px lightgray",
        }}
      >
        <List>
          {["GTIN13", "SERNUM", "BATCH", "SSCC"].map((field) => (
            <ListItem
              key={field}
              sx={{
                borderRadius: 1,
                m: 1,
                width: "98%",
                backgroundColor: scannedData.includes(field) ? "green" : "inherit",
                color: scannedData.includes(field) ? "white" : "inherit",
              }}
            >
              <ListItemText primary={field} />
              <Divider />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Input Fields */}
      <Box
        sx={{
          border: "1px solid black",
          marginTop: 25,
          p: 5,
          borderRadius: 2,
        }}
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
          placeholder="Enter gtin13"
        />
        <TextField
          type="text"
          value={sscc}
          onChange={(e) => setSscc(e.target.value)}
          placeholder="Enter sscc"
        />
        <TextField
          type="text"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          placeholder="Enter batch"
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit BStat
        </Button>
      </Box>
    </Container>
  );
}
