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
import {parseBarcode} from "gs1-barcode-parser-mod";

interface Artikl {
  BStat: string;
  GTIN13: string;
  SERNUM: string;
  BATCH: string;
  SSCC: string;
}

export default function ArtiklScanTasks() {
  const [artikl, setArtikl] = useState<Artikl | null>(null);
  const [bstat, setBStat] = useState<string>("");
  const [GTIN13, setGTIN13] = useState<string>("");
  const [SERNUM, setSERNUM] = useState<string>("");
  const [BATCH, setBATCH] = useState<string>("");
  const [SSCC, setSSCC] = useState<string>("");
  const [filteredArtikl, setFilteredArtikl] = useState<Artikl | null>(null);
  const [scannedData, setScannedData] = useState<string[]>([]);
  const { receivedData, setReceivedData } = useBarcodeScannerStore();



  const testBarcodeParsing = () => {
    const barcode = "011234567890123410ABC12317250101";
    //console.log("Testing Barcode:", barcode);
 
    try {
      const parsedData = parseBarcode(barcode);
      console.log("Parsed Barcode Data:", parsedData);
    } catch (error) {
      console.error("Error parsing barcode:", error);
    }
  };
 
  useEffect(() => {
    testBarcodeParsing();
  }, []);

  useEffect(() => {
    setReceivedData("");
    const storedBStat = localStorage.getItem("artikl");
    if (storedBStat) {
      const parsedBStat = JSON.parse(storedBStat);
      setArtikl(parsedBStat);
    }
  }, []);

  useEffect(() => {
    const storeValues = localStorage.getItem("artikl");
    if (storeValues) {
      const parsedValues = JSON.parse(storeValues);
      console.log("Values:", parsedValues);
    }
  }, []);

  useEffect(() => {
    if (receivedData) {
      setScannedData((prev) => [...new Set([...prev, receivedData])]);
    }
  }, [receivedData]);

  const handleBStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBStat(e.target.value);
  };
  const handleGTIN13Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGTIN13(e.target.value);
  };
  const handleSERNUMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSERNUM(e.target.value);
  };
  const handleBATCHChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBATCH(e.target.value);
  };
  const handleSSCCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSSCC(e.target.value);
  };
  

  const handleSubmit = () => {
    localStorage.setItem(
      "artikl",
      JSON.stringify({
        BStat: bstat,
        GTIN13: GTIN13,
        SERNUM: SERNUM,
        BATCH: BATCH,
        SSCC: SSCC,
      })
    );
    setArtikl({
      BStat: bstat,
      GTIN13: GTIN13,
      SERNUM: SERNUM,
      BATCH: BATCH,
      SSCC: SSCC,
    });


  };

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

  return (
    <Container sx={{}}>
      <ArtiklScanHeader />
      <Box>
        <Typography variant="h4">Scan Data of Artikl: </Typography>
      </Box>
      <Box
        sx={{ border: "1px solid black", gap: 1, margin: 1, borderRadius: 1 }}
      >
        <List>
          {filteredArtikl?.GTIN13 && (
            <>
              <ListItem
                sx={{
                  backgroundColor: scannedData.includes(filteredArtikl.GTIN13)
                    ? "green"
                    : "inherit",
                  color: scannedData.includes(filteredArtikl.GTIN13)
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
                  backgroundColor: scannedData.includes(filteredArtikl.SSCC)
                    ? "green"
                    : "inherit",
                  color: scannedData.includes(filteredArtikl.SSCC)
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

      <Box
        sx={{ 
            border: "1px solid black", 
            marginTop: 25, 
            p: 5, 
            borderRadius: 2,
            display: "flex",
            gap: 2
        }}
      ><Typography variant="h4"> Unesi BStat: </Typography>
        <TextField
          type="text"
          value={bstat}
          onChange={handleBStatChange}
          placeholder="Enter BStat"
        />
        <TextField
          type="text"
          value={GTIN13}
          onChange={handleGTIN13Change}
          placeholder="Enter GTIN13"
        />
        <TextField
          type="text"
          value={SERNUM}
          onChange={handleSERNUMChange}
          placeholder="Enter SERNUM"
        />
        <TextField
          type="text"
          value={BATCH}
          onChange={handleBATCHChange}
          placeholder="Enter BATCH"
        />
        <TextField
          type="text"
          value={SSCC}
          onChange={handleSSCCChange}
          placeholder="Enter SSCC"
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit BStat
        </Button>
      </Box>
    </Container>
  );
}
