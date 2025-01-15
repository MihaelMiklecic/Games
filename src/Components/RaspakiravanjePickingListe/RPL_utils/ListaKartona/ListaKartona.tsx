import { Container, Button, Box, Typography } from "@mui/material";
import { ListaKartonaHeader } from "./ListaKartonaHeader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

interface Data {
  ParentID: string;
  DOCID: string;
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
    const storedParentID = Object.keys(localStorage).find(key =>
      key.startsWith("ParentID")
    );
    console.log("Stored ParentID:", storedParentID);
    if (storedParentID) {
      const UIDdata = localStorage.getItem(storedParentID); 

      if (UIDdata) {
        fetch("/ListaArtikala.json")
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const filteredData = data.filter((item: any) => item.ParentID === UIDdata);
            const mappedData = filteredData.map((item: any) => ({
              ParentID: item.ParentID,
              DOCID: item.DOCID,
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
            { field: "DOCID", headerName: "DOCID", width: 300 },
            { field: "SRCC", headerName: "SRCC", width: 300 },
          ]}
          rows={fetchedData.map((item, index) => ({ id: index, ...item }))}
          autoHeight
          hideFooter
        />
      </Box>
      <Box sx={{ marginTop: 10 }}>
        <Typography>Nove Kutije:</Typography>
        <DataGrid
          columns={[
            { field: "DOCID", headerName: "DOCID", width: 300 },
            { field: "SRCC", headerName: "SRCC", width: 300 },
          ]}
          rows={localStorageData.map((item, index) => ({ id: index, ...item }))}
          autoHeight
          hideFooter
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
