import { Container, Button, Box } from "@mui/material";
import { ListaKartonaHeader } from "./ListaKartonaHeader";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
//import useBarcodeScannerStore from "../../../useBarcodeScannerStore";

  interface Data {
    UID: string;
    MATNR: string;
    QTY: string;
    collectedVal: boolean | string;
    GTIN13: boolean | string;
}

export default function ListaKartona() {
  const [data, setData] = useState<Data[]>([]);
  const navigate = useNavigate();

 useEffect(() => {
    const savedData = localStorage.getItem("filteredData");
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      fetch("/ListaPickingListi.json")
        .then((response) => response.json())
        .then((fetchedData) => {
          const mappedData = fetchedData.map((item: any) => ({
            UID: item.UID,
            MATNR: item.MATNR,
            QTY: item.QTY,
            collectedVal: item.collectedVal || "0",
            GTIN13: item.GTIN13 || "0",
          }));
          setData(mappedData);        })
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
            { field: 'UID', headerName: 'UID', width: 150 },
            { field: 'MATNR', headerName: 'Material Number', width: 150 },
            { field: 'QTY', headerName: 'Quantity', width: 150 },
            { field: 'collectedVal', headerName: 'Collected Value', width: 150 },
            { field: 'GTIN13', headerName: 'GTIN13', width: 150 },
          ]}
          rows={data.map((item, index) => ({ id: index, ...item }))}
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
