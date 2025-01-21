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
import { parseBarcode } from "gs1-barcode-parser-mod";

interface Artikl {
  BStat: string;
  GTIN?: string;
  TRGTIN?: string;
  SSCC?: string;
  BATCH?: string;
  SERNUM?: string;
}

type ScanMode = "sekvencijski" | "opcijski";

export default function ArtiklScanTasks() {
  const [artikl] = useState<Artikl | null>(null);
  const [bstat, setBStat] = useState<string>("");
  const [filteredArtikl, setFilteredArtikl] = useState<Artikl | null>(null);
  const { receivedData, setReceivedData } = useBarcodeScannerStore();
  const [scanMode, setScanMode] = useState<ScanMode>("opcijski");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);

  const barcodeFields = [
    { label: "GTIN", key: "GTIN" },
    { label: "TRGTIN", key: "TRGTIN" },
    { label: "SSCC", key: "SSCC" },
    { label: "BATCH", key: "BATCH" },
    { label: "SERNUM", key: "SERNUM" },
  ];

  const [matchedFields, setMatchedFields] = useState<Record<string, boolean>>({});

  const resetMatchedFields = () => {
    const initialMatchedFields = bstat
      .split("")
      .reduce((acc, key) => {
        const fieldKey = bstatMap[key as keyof typeof bstatMap];
        if (fieldKey) acc[fieldKey] = false;
        return acc;
      }, {} as Record<string, boolean>);
    setMatchedFields(initialMatchedFields);
    setCurrentIndex(0);
  };

  const bstatMap: Record<string, keyof Artikl> = {
    B: "GTIN",
    T: "TRGTIN",
    C: "SSCC",
    H: "BATCH",
    S: "SERNUM",
  };


  interface ParsedData {
    parsedCodeItems: any[];
  }

  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  useEffect(() => {
    if (receivedData) {
      try {
        const parsed = parseBarcode(receivedData);
        console.log("Parsed Data: ", parsed);
        setParsedData(parsed);
        setReceivedData(""); 
      } catch (error) {
        console.error("Error parsing barcode:", error);
      }
    }
  }, [receivedData]);

  {/*useEffect parsing items*/}
  useEffect(() => {
    if (parsedData && parsedData.parsedCodeItems) {
      parsedData.parsedCodeItems.forEach((item, index) => {
        console.log(`Parsed Item ${index + 1}:`, item.data);
  
        Object.keys(filteredArtikl || {}).forEach((key) => {
          const fieldValue = filteredArtikl ? filteredArtikl[key as keyof Artikl] : null;
          if (fieldValue && item.data === fieldValue) {
            console.log(`Match found: ${key} = ${item.data}`);
            setMatchedFields((prev) => ({
              ...prev,
              [key]: true,
            }));
          }
        });
      });
    }
  }, [parsedData, filteredArtikl]);
  

  useEffect(() => {
    if (bstat) {
      const filteredKeys = bstat.split("").reduce((acc, key) => {
        if (bstatMap[key]) {
          acc[bstatMap[key]] = artikl?.[bstatMap[key]] || "";
        }
        return acc;
      }, {} as Artikl);

      setFilteredArtikl(filteredKeys);
      resetMatchedFields();
    }
  }, [bstat, artikl]);

  useEffect(() => {
    if (!receivedData || !filteredArtikl || scanMode !== "sekvencijski") return;

    const keys = Object.keys(filteredArtikl);
    if (currentIndex < keys.length) {
      const currentKey = keys[currentIndex];
      const fieldValue = filteredArtikl[currentKey as keyof Artikl];

      if (receivedData === fieldValue) {
        setMatchedFields((prev) => ({
          ...prev,
          [currentKey]: true,
        }));
        setReceivedData("");
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  }, [receivedData, filteredArtikl, currentIndex, scanMode]);

  useEffect(() => {
    if (scanMode === "opcijski" && receivedData && filteredArtikl) {
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
    }
  }, [receivedData, filteredArtikl, scanMode]);

  useEffect(() => {
    const requiredFields = Object.keys(matchedFields);
    const allMatched =
      requiredFields.length > 0 &&
      requiredFields.every((key) => matchedFields[key]);

    if (allMatched) {
      setOpenDialog(true);
    }
  }, [matchedFields]);

  const handleBstatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBstat = event.target.value.toUpperCase();
    setBStat(newBstat);
  };

  const handleScanModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScanMode(event.target.value as ScanMode);
    resetMatchedFields();
  };

  const renderBarcodeItem = (
    label: string,
    value: string | null,
    isMatched: boolean,
    isActive: boolean
  ) => {
    if (!value) return null;
    return (
      <ListItem
        sx={{
          borderRadius: 1,
          m: 1,
          width: "98%",
          backgroundColor: isMatched ? "green" : isActive ? "yellow" : "transparent",
          color: isMatched ? "white" : isActive ? "black" : "black",
        }}
      >
        <ListItemText primary={`${label}: ${value}`} />
        <Divider />
      </ListItem>
    );
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
    resetMatchedFields();
  };

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
      </Box>

      <Box sx={{ gap: 1, margin: 1, borderRadius: 1, boxShadow: "5px 5px 5px 5px lightgray" }}>
        <List>
          {bstat.split("").map((key, index) => {
            const fieldKey = bstatMap[key as keyof typeof bstatMap];
            const fieldValue = filteredArtikl?.[fieldKey];
            const label = barcodeFields.find((field) => field.key === fieldKey)?.label;
            const isMatched = matchedFields[fieldKey] || false;
            const isActive = scanMode === "sekvencijski" && currentIndex === index;
            return label && fieldValue
              ? renderBarcodeItem(label, fieldValue, isMatched, isActive)
              : null;
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
        {barcodeFields.map((field) => (
          <TextField
            key={field.key}
            type="text"
            value={filteredArtikl?.[field.key as keyof Artikl] ?? ""}
            onChange={(e) =>
              setFilteredArtikl((prev) => ({
                ...prev,
                [field.key]: e.target.value,
              } as Artikl))
            }
            placeholder={`Enter ${field.label}`}
          />
        ))}
        <Button onClick={() => console.log("Submit BStat:", filteredArtikl)} variant="contained" color="primary">
          Submit BStat
        </Button>
        <InfoDialog dialogOpen={openDialog} dialogTitle="INFO" dialogClose={onCloseDialog} type="error" duration={3000}/>
        <Typography variant="h6">B: GTIN, T: TRGTIN, C: SSCC, H: BATCH, S: SERNUM</Typography>
      </Box>
    </Container>
  );
}
