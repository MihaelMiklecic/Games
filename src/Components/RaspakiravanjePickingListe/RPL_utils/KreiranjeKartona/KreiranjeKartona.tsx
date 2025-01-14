import {
  Container,
  Button,
  Typography,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { KreiranjeKartonaHeader } from "./KreiranjeKartonaHeader";
import Dropdown from "../../../Utilities/Dropdown";
import { useState, useMemo, useEffect } from "react";
import useBarcodeScannerStore from "../../../useBarcodeScannerStore";
import { useNavigate } from "react-router-dom";

export default function KreiranjeKartona() {
  const [dropdown1, setDropdown1] = useState<string>("");
  const { startReading, receivedData, setReceivedData } =
    useBarcodeScannerStore();
  const navigate = useNavigate();

  const nextPage = () => {
    navigate("/skeniranje-src");
  };
  useEffect(() => {
    startReading();
    setReceivedData("");
    console.log("received data:", receivedData);
  }, []);

  const dropdownOptions1 = useMemo(
    () => [
      { value: "1", label: "MODEL A" },
      { value: "2", label: "MODEL B" },
      { value: "3", label: "MODEL C" },
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
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <KreiranjeKartonaHeader />
      <Typography variant="h4" sx={{ marginTop: 5 }}>
        Odaberi tip kutije
      </Typography>
      <Dropdown
        label={"TIP"}
        value={dropdown1}
        onChange={handleDropdownChange(setDropdown1)}
        options={dropdownOptions1}
      />
      <Typography variant="h4" sx={{ marginTop: 5 }}>
        Skeniraj SSCC kod
      </Typography>
      <TextField fullWidth disabled value={receivedData}></TextField>
      <Typography sx={{ marginTop: 5 }}>Skenirani/uneseni SSCC kod</Typography>
      <TextField fullWidth disabled></TextField>
      <Button
        variant="contained"
        onClick={nextPage}
        sx={{ position: "absolute", bottom: 0, width: "100%", height: "60px" }}
      >
        {" "}
        kreiraj
      </Button>
    </Container>
  );
}
