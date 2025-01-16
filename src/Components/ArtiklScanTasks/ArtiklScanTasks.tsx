import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { Divider } from "@mui/material";
import { ArtiklScanHeader } from "./ArtiklScanUtils/ArtiklScanHeader";

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

  useEffect(() => {
    const storedBStat = localStorage.getItem("artikl");
    if (storedBStat) {
      const parsedBStat = JSON.parse(storedBStat);
      setArtikl(parsedBStat);
    }
    console.log("rerendered");
  }, []);

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

  return (
    <Container>
      <ArtiklScanHeader />
      <Box>
        <Typography variant="h4">Artikl: </Typography>
      </Box>
      <Box
        sx={{ border: "1px solid black", gap: 1, margin: 1, borderRadius: 1 }}
      >
        <List>
          {artikl?.GTIN13 && (
            <>
              <ListItem>
                <ListItemText primary="GTIN13" />
                <Checkbox checked={false} />
              </ListItem>
              <Divider />
            </>
          )}

          {artikl?.SERNUM && (
            <>
              <ListItem>
                <ListItemText primary="SERNUM" />
                <Checkbox checked={false} />
              </ListItem>
              <Divider />
            </>
          )}

          {artikl?.BATCH && (
            <>
              <ListItem>
                <ListItemText primary="BATCH" />
                <Checkbox checked={false} />
              </ListItem>
              <Divider />
            </>
          )}

          {artikl?.SSCC && (
            <>
              <ListItem>
                <ListItemText primary="SSCC" />
                <Checkbox checked={false} />
              </ListItem>
            </>
          )}
        </List>
      </Box>

      <Box>
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
