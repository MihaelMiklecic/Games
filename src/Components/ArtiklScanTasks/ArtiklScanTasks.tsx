import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { Divider } from "@mui/material";
import { ArtiklScanHeader } from "./ArtiklScanUtils/ArtiklScanHeader";
import useBarcodeScannerStore from "../useBarcodeScannerStore";

interface Artikl {
  BStat: string;
  GTIN13: string;
  SERNUM: boolean;
  BATCH: string;
  SSCC: string;
}

export default function ArtiklScanTasks() {
  const [artikl, setArtikl] = useState<Artikl | null>(null);
  const [bstat, setBStat] = useState<string>("");
  const [filteredArtikl, setFilteredArtikl] = useState<Artikl | null>(null);
  const [scannedData, setScannedData] = useState<string[]>([]);
  const { receivedData, setReceivedData } = useBarcodeScannerStore();

  useEffect(() => {
    setReceivedData("");
    const storedBStat = localStorage.getItem("artikl");
    if (storedBStat) {
      const parsedBStat = JSON.parse(storedBStat);
      setArtikl(parsedBStat);
    }
    console.log("rerendered");
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

  const handleSubmit = () => {
    localStorage.setItem(
      "artikl",
      JSON.stringify({
        BStat: bstat,
        GTIN13: "123456789",
        SERNUM: true,
        BATCH: "BATCH001",
        SSCC: "SSCC001",
      })
    );
    setArtikl({
      BStat: bstat,
      GTIN13: "123456789",
      SERNUM: true,
      BATCH: "BATCH001",
      SSCC: "SSCC001",
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
        <input
          type="text"
          value={bstat}
          onChange={handleBStatChange}
          placeholder="Enter BStat"
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit BStat
        </Button>
      </Box>
    </Container>
  );
}
