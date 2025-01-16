import { Button, Container } from "@mui/material";
import { SSRCHeader } from "./SSRCHeader";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useBarcodeScannerStore from "../../../useBarcodeScannerStore";

export default function SkeniranjeSRCKontejnera() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);
  const { receivedData, startReading } = useBarcodeScannerStore();

  const handleScan = () => {
    setShowLoading(true);
    startReading();
    navigate("/prebacivanje-artikla");
  };

  useEffect(() => {
    if (receivedData) {
      navigate("/prebacivanje-artikla");
    }
  }, [receivedData, navigate]);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <SSRCHeader />
      
        <Button
          variant="contained"
          onClick={handleScan}
          sx={{ marginTop: "25%", width: "250px", height: "250px" }}
        >
          skeniraj src kontejner
    </Button>
    </Container>
  );
}
