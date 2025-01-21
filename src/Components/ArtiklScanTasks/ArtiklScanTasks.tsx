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
import { useTranslation } from "react-i18next";
import InfoDialog from "../Utilities/InfoDialog";

interface Artikl {
  BStat: string;
  GTIN?: string;
  TRGTIN?: string;
  SSCC: string;
  BATCH: string;
}

type ScanMode = "sekvencijski" | "opcijski";

export default function ArtiklScanTasks() {
  const [artikl, setArtikl] = useState<Artikl | null>(null);
  const [bstat, setBStat] = useState<string>(""); 
  const [filteredArtikl, setFilteredArtikl] = useState<Artikl | null>(null); 
  const { receivedData, setReceivedData } = useBarcodeScannerStore();
  const [scanMode, setScanMode] = useState<ScanMode>("opcijski");
  const [currentStep, setCurrentStep] = useState<keyof Artikl | null>("GTIN");
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);

  const barcodeFields = [
    { label: "GTIN", key: "GTIN" },
    { label: "TRGTIN", key: "TRGTIN" },
    { label: "SSCC", key: "SSCC" },
    { label: "BATCH", key: "BATCH" },
    { label: "SERNUM", key: "SERNUM" },
  ];

  const [matchedFields, setMatchedFields] = useState<Record<string, boolean>>({
    GTIN: false,
    TRGTIN: false,
    SSCC: false,
    BATCH: false,
  });

  const resetMatchedFields = () => {
    setMatchedFields({
      GTIN: false,
      TRGTIN: false,
      SSCC: false,
      BATCH: false,
    });
  };

  const renderBarcodeItem = (label: string, value: string | null, isMatched: boolean) => {
    if (!value) return null;
    return (
      <ListItem
        sx={{
          borderRadius: 1,
          m: 1,
          width: "98%",
          backgroundColor: isMatched ? "green" : "transparent",
          color: isMatched ? "white" : "black",
        }}
      >
        <ListItemText primary={`${label}: ${value}`} />
        <Divider />
      </ListItem>
    );
  };

  const bstatMap: Record<string, keyof Artikl> = {
    B: "GTIN",
    T: "TRGTIN",
    C: "SSCC",
    H: "BATCH",
  };


  useEffect(() => {
    if (!receivedData || !filteredArtikl) return;

    Object.keys(filteredArtikl).forEach((key) => {
      const fieldValue = filteredArtikl[key as keyof Artikl];
      if (receivedData === fieldValue) {
        setMatchedFields((prev) => ({
          ...prev,
          [key]: true, 
        }));
        setReceivedData("");  
      }
    });
  }, [receivedData, filteredArtikl]);

  useEffect(() => {
    if (artikl) {
      let newArtikl: Artikl = {} as Artikl;

      if (bstat.includes("B")) newArtikl.GTIN = artikl.GTIN;
      if (bstat.includes("T")) newArtikl.TRGTIN = artikl.TRGTIN;
      if (bstat.includes("C")) newArtikl.SSCC = artikl.SSCC;
      if (bstat.includes("H")) newArtikl.BATCH = artikl.BATCH;

      setFilteredArtikl(newArtikl); 
    }
  }, [bstat, artikl]);

  useEffect(() => {
    const allMatched = Object.values(matchedFields).every((matched) => matched);
    if (allMatched) {
      setOpenDialog(true);
      resetMatchedFields();
    }
  }, [matchedFields]);

  const handleBstatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBstat = event.target.value.toUpperCase();
    setBStat(newBstat);
  };

  const handleScanModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScanMode(event.target.value as ScanMode); 
  };

  const goToNextStep = () => {
    const fieldKeys = Object.keys(bstatMap) as (keyof Artikl)[];

    const currentIndex = currentStep ? fieldKeys.indexOf(currentStep) : -1;

    if (currentIndex < fieldKeys.length - 1 && matchedFields[currentStep as string]) {
      const nextFieldKey = fieldKeys[currentIndex + 1];
      setCurrentStep(nextFieldKey);
    }
  };

  useEffect(() => {
    if (scanMode === "sekvencijski" && currentStep) {
      if (matchedFields[currentStep as string]) {
        goToNextStep();
      }
    }
  }, [matchedFields, scanMode, currentStep]);

  const handleSubmitBStat = () => {
    if (filteredArtikl) {
      console.log("Submit BStat:", filteredArtikl);
    }
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
  }

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
          <FormControlLabel value="opcijski" control={<Radio />} label={t("opcijski")} />
          <FormControlLabel value="sekvencijski" control={<Radio />} label="Sekvencijski" />
        </RadioGroup>
        {scanMode === "sekvencijski" && currentStep && (
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">
              {t("skeniraj")} <strong>{currentStep}</strong>
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ gap: 1, margin: 1, borderRadius: 1, boxShadow: "5px 5px 5px 5px lightgray" }}>
        <List>
          {Object.keys(bstatMap).map((key) => {
            if (bstat.includes(key)) {
              const fieldKey = bstatMap[key as keyof typeof bstatMap];
              const fieldValue = filteredArtikl?.[fieldKey];
              const label = barcodeFields.find((field) => field.key === fieldKey)?.label;
              const isMatched = matchedFields[fieldKey] || false;  
              return label && fieldValue ? renderBarcodeItem(label, fieldValue, isMatched) : null;
            }
            return null;
          })}
        </List>
      </Box>

      <Box sx={{ border: "1px solid black", marginTop: 10, p: 5, borderRadius: 2 }}>
        <TextField
          type="text"
          value={bstat}
          onChange={handleBstatChange}
          placeholder="Enter BStat"
        />
        <TextField
          type="text"
          value={filteredArtikl?.GTIN ?? ""}
          onChange={(e) => setFilteredArtikl({ ...filteredArtikl, GTIN: e.target.value })}
          placeholder="Enter GTIN"
        />
        <TextField
          type="text"
          value={filteredArtikl?.SSCC ?? ""}
          onChange={(e) => setFilteredArtikl({ ...filteredArtikl, SSCC: e.target.value })}
          placeholder="Enter SSCC"
        />
        <TextField
          type="text"
          value={filteredArtikl?.BATCH ?? ""}
          onChange={(e) => setFilteredArtikl({ ...filteredArtikl, BATCH: e.target.value })}
          placeholder="Enter Batch"
        />
        <TextField
          type="text"
          value={filteredArtikl?.TRGTIN ?? ""}
          onChange={(e) => setFilteredArtikl({ ...filteredArtikl, TRGTIN: e.target.value })}
          placeholder="Enter TRGTIN"
        />
        <Button onClick={handleSubmitBStat} variant="contained" color="primary">
          Submit BStat
        </Button>
        <InfoDialog dialogOpen={openDialog} dialogTitle="INFO" dialogClose={onCloseDialog} type="error"/>
      </Box>
    </Container>
  );
}
