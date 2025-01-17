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
} from "@mui/material";
import { Divider } from "@mui/material";
import { ArtiklScanHeader } from "./ArtiklScanUtils/ArtiklScanHeader";
import useBarcodeScannerStore from "../useBarcodeScannerStore";
import { parseBarcode, validateBarcode } from "gs1-barcode-parser-mod";
import { FormControlLabel } from "@mui/material";
import { Radio } from "@mui/material";
import { RadioGroup } from "@mui/material";

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
  const [filteredArtikl, setFilteredArtikl] = useState<Artikl | null>(null);
  const [scannedData, setScannedData] = useState<string[]>([]);
  const { receivedData, setReceivedData } = useBarcodeScannerStore();
  const [, setParsedData] = useState<string[]>([]);
  const [data, setData] = useState<string[]>([]);
  const [scanMode, setScanMode] = useState<"sekvencijski" | "opcijski">("opcijski");
  const [currentStep, setCurrentStep] = useState<keyof Artikl | null>(null);



  {/*Raspakiravanje GS1 barkoda*/}
  useEffect(() => {
    if (receivedData) {
      setScannedData((prev) => [...new Set([...prev, receivedData])]);
    }
    if (validateBarcode(receivedData)) {
      try {
        //console.log("Testing Barcode:", receivedData);
        const parsedResult = parseBarcode(receivedData);
        console.log("Parsed Barcode Data:", parsedResult);
        parsedResult.parsedCodeItems.forEach((item: any) => {
          //console.log(`dataTitle ${item.dataTitle}.`);
          //console.log(`data: ${item.data}.`);
          setData((prev) => [...new Set([...prev, item.data])]);
          //console.log("data", data);
        });
        setParsedData(parsedResult.parsedCodeItems);
      } catch (error) {
        console.error("Error parsing barcode:", error);
      }
      setReceivedData("");
      if(scanMode === "sekvencijski" && currentStep){
        handleNextStep();
      }
    }
  }, [receivedData]);
  const handleNextStep = () => {
    const steps = ["GTIN13", "SERNUM", "BATCH", "SSCC"] as const;
    const nextIndex = steps.indexOf(currentStep as Exclude<keyof Artikl, "BStat">) + 1;
    setCurrentStep(steps[nextIndex] || null);
  };

  {/*promjene vrijednosti barkodova*/}
  const handleBStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBStat(e.target.value);
  };
  const handleGtin13Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGtin13(e.target.value);
  };
  const handleSsccChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSscc(e.target.value);
  };
  const handleBatchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatch(e.target.value);
  };
  const handleScanModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScanMode(event.target.value as "sekvencijski" | "opcijski");
    setCurrentStep(scanMode === "sekvencijski" ? "GTIN13" : null);
  };

  {/*Postavljanje Barkodova za Sken*/}
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

  {/*Artikl Filter Prikaz Barkodova Za Skeniranje*/}
  useEffect(() => {
    if (artikl) {
      let newArtikl: Artikl = {} as Artikl;
      if (bstat.includes("B")) {
        newArtikl = { ...newArtikl, GTIN13: artikl.GTIN13 };
      }
      if (bstat.includes("S")) {
        newArtikl = { ...newArtikl, SERNUM: artikl.SERNUM };
      }
      if (bstat.includes("H")) {
        newArtikl = { ...newArtikl, BATCH: artikl.BATCH };
      }
      if (bstat.includes("C")) {
        newArtikl = { ...newArtikl, SSCC: artikl.SSCC };
      }
      setFilteredArtikl(newArtikl);
    }
  }, [bstat, artikl]);

      {/*Main Content*/}
  return (
    <Container sx={{}}>
      <ArtiklScanHeader />
      <Box>
        <Typography variant="h4">Skeniraj Barkodove: </Typography>
              <RadioGroup
                row
                value={scanMode}
                onChange={handleScanModeChange}
                sx={{ marginBottom: 2 }}
              >
                <FormControlLabel value="opcijski" control={<Radio />} label="Opcijski" />
                <FormControlLabel value="sekvencijski" control={<Radio />} label="Sekvencijski" />
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
          {filteredArtikl?.GTIN13 && (
            <>
              <ListItem
                sx={{
                  borderRadius: 1,
                  m: 1,
                  width: "98%",
                  backgroundColor: (data ?? "").includes(filteredArtikl.GTIN13)
                    ? "green"
                    : "inherit",
                  color: (data ?? "").includes(filteredArtikl.GTIN13)
                    ? "white"
                    : "inherit",
                }}
              >
                <ListItemText primary="GTIN13" />
              </ListItem>
              <Divider />
            </>
          )}

          {filteredArtikl?.SERNUM && (
            <>
              <ListItem
                sx={{
                  borderRadius: 1,
                  m: 1,
                  width: "98%",
                  backgroundColor: scannedData.includes("SERNUM")
                    ? "green"
                    : "inherit",
                  color: scannedData.includes("SERNUM") ? "white" : "inherit",
                }}
              >
                <ListItemText primary="SERNUM" />
              </ListItem>
              <Divider />
            </>
          )}

          {filteredArtikl?.BATCH && (
            <>
              <ListItem
                sx={{
                  borderRadius: 1,
                  m: 1,
                  width: "98%",
                  backgroundColor: scannedData.includes(filteredArtikl.BATCH)
                    ? "green"
                    : "inherit",
                  color: scannedData.includes(filteredArtikl.BATCH)
                    ? "white"
                    : "inherit",
                }}
              >
                <ListItemText primary="BATCH" />
              </ListItem>
              <Divider />
            </>
          )}

          {filteredArtikl?.SSCC && (
            <>
              <ListItem
                sx={{
                  borderRadius: 1,
                  m: 1,
                  width: "98%",
                  backgroundColor: (data ?? "").includes(filteredArtikl.SSCC)
                    ? "green"
                    : "inherit",
                  color: (data ?? "").includes(filteredArtikl.SSCC)
                    ? "white"
                    : "inherit",
                }}
              >
                <ListItemText primary="SSCC" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
          {/*Box za setanje barkodova artikla*/}
      <Box 
        sx={{ border: "1px solid black", marginTop: 25, p: 5, borderRadius: 2 }}
      >
        <TextField
          type="text"
          value={bstat}
          onChange={handleBStatChange}
          placeholder="Enter BStat"
        />
        <TextField
          type="text"
          value={gtin13}
          onChange={handleGtin13Change}
          placeholder="Enter gtin13"
        />
        <TextField
          type="text"
          value={sscc}
          onChange={handleSsccChange}
          placeholder="Enter sscc"
        />
        <TextField
          type="text"
          value={batch}
          onChange={handleBatchChange}
          placeholder="Enter batch"
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit BStat
        </Button>
      </Box>
    </Container>
  );
}
