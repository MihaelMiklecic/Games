import { Container, Button, Box } from "@mui/material";
import { ListaKartonaHeader } from "./ListaKartonaHeader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

interface Data {
  ParentID: string;
  UID: string;
  SRCC: string;
  QTY: string;
  GTIN13: boolean | string;
  MATNR: string;
}

export default function ListaKartona() {
  const [data, setData] = useState<Data[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const UIDdata = localStorage.getItem("ParentID64429942");
    console.log("ParentID from localStorage: ", UIDdata);

    if (UIDdata) {
      fetch("/ListaArtikala.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((fetchedData) => {
          const filteredData = fetchedData.filter((item: any) => item.ParentID === UIDdata);
          const mappedData = filteredData.map((item: any) => ({
            UID: item.UID,
            SRCC: item.SRCC,
            MATNR: item.MATNR,
            QTY: item.QTY,
            GTIN13: item.GTIN13 || "0",
          }));
          setData(mappedData);
          localStorage.setItem(`kartoni_${UIDdata}`, JSON.stringify(mappedData));
        })
        .catch((error) => console.error("Error fetching data:", error));
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
        <DataGrid
          columns={[
            { field: "UID", headerName: "UID", width: 150 },
            { field: "SRCC", headerName: "SRCC", width: 150 },
            { field: "MATNR", headerName: "MATNR", width: 150 },
            { field: "QTY", headerName: "QTY", width: 150 },
            { field: "GTIN13", headerName: "GTIN13", width: 150 },
          ]}
          rows={data.map((item, index) => ({ id: index, ...item }))}
          autoHeight
        />
      </Box>
      <Button
        variant="contained"
        sx={{ position: "absolute", bottom: 0, width: "100%", height: "60px" }}
        onClick={noviKarton}
      >
        kreiraj novi karton
      </Button>
    </Container>
  );
}
