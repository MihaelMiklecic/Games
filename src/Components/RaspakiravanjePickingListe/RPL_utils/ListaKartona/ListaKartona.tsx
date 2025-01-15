import { Container, Button, Box, Typography } from "@mui/material";
import { ListaKartonaHeader } from "./ListaKartonaHeader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

interface Data {
  ParentID: string;
  UID: string;
  SRCC: string;
  QTY: string;
  GTIN13: boolean | string;
  MATNR: string;
}

export default function ListaKartona() {
  const [fetchedData, setFetchedData] = useState<Data[]>([]);
  const [localStorageData, setLocalStorageData] = useState<Data[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const UIDdata = localStorage.getItem("ParentID64429942");

    if (UIDdata) {
      fetch("/ListaArtikala.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const filteredData = data.filter((item: any) => item.ParentID === UIDdata);
          const mappedData = filteredData.map((item: any) => ({
            UID: item.UID,
            SRCC: item.SRCC,
            MATNR: item.MATNR,
            QTY: item.QTY,
            GTIN13: item.GTIN13 || "0",
          }));
          setFetchedData(mappedData);
          localStorage.setItem(`kartoni_${UIDdata}`, JSON.stringify(mappedData));
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, []);

  useEffect(() => {
    const storedData = Object.keys(localStorage).filter((key) =>
      key.startsWith("NoviKartonArtikli_")
    );

    if (storedData) {
      try {
        const parsedData: Data[] = storedData.map((key) => JSON.parse(localStorage.getItem(key) || '[]')).flat();
        setLocalStorageData(parsedData);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }
  }, []);

  const noviKarton = () => {
    navigate("/kreiranje-kartona");
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
      <ListaKartonaHeader />
      <Box>
      <Typography>Originalne Kutije:</Typography>
        <DataGrid
          columns={[
            { field: "UID", headerName: "UID", width: 150 },
            { field: "SRCC", headerName: "SRCC", width: 150 },

          ]}
          rows={fetchedData.map((item, index) => ({ id: index, ...item }))}
          autoHeight
        />
      </Box>
      <Box sx={{ marginTop: 10 }}>
        <Typography>Nove Kutije:</Typography>
        <DataGrid
          columns={[
            { field: "UID", headerName: "UID", width: 150 },
            { field: "SRCC", headerName: "SRCC", width: 150 },

          ]}
          rows={localStorageData.map((item, index) => ({ id: index, ...item }))}
          autoHeight
        />
      </Box>
      <Button
        variant="contained"
        sx={{ position: "absolute", bottom: 0, width: "100%", height: "60px" }}
        onClick={noviKarton}
      >
        {t("kreiraj_novi_karton")}
      </Button>
    </Container>
  );
}
