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
import { useTranslation } from "react-i18next";

export default function KreiranjeKartona() {
  const [dropdown1, setDropdown1] = useState<string>("");
  const { startReading, receivedData, setReceivedData } =
    useBarcodeScannerStore();
  const navigate = useNavigate();
  const [manualInputValue, setManualInputValue] = useState<string>(""); 
  const { t } = useTranslation();

  const handleKreiraj = () => {
    if(receivedData){
    localStorage.setItem(
      `NoviKarton_${receivedData}_${dropdown1}`,
      `${receivedData}_${dropdown1}`
    );
    }else {
      localStorage.setItem(`NoviKarton_${manualInputValue}_${dropdown1}`, `˘${manualInputValue}_${dropdown1}`);
    }
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
        {t("tip_kutije")}
      </Typography>
      <Dropdown
        label={t("tip")}
        value={dropdown1}
        onChange={handleDropdownChange(setDropdown1)}
        options={dropdownOptions1}
      />
      <Typography variant="h4" sx={{ marginTop: 5 }}>
        {t("sken_ssc")}
      </Typography>
      <TextField fullWidth disabled value={receivedData}></TextField>
      <Typography sx={{ marginTop: 5 }}>{t("uneseni_ssc")}</Typography>
      <TextField fullWidth 
                  value={manualInputValue}
                  onChange={(e)=>setManualInputValue(e.target.value)} ></TextField>
      <Button
        variant="contained"
        onClick={handleKreiraj}
        sx={{ position: "absolute", bottom: 0, width: "100%", height: "60px" }}
      >
        {t("kreiraj")}
      </Button>
    </Container>
  );
}
