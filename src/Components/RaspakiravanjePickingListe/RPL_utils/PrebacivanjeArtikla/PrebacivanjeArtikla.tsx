import { Box, Container, Typography, Button } from "@mui/material";
import { PrebacivanjeArtiklaHeader } from "./PrebacivanjeArtiklaHeader";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

export default function PrebacivanjeArtikla() {
  const rows: GridRowsProp = [
    { id: 1, MATNR: "Some", col2: "In" },
    { id: 2, MATNR: "Frikin", col2: "Data" },
    { id: 3, MATNR: "Data", col2: "Grid" },
  ];

  const handleButtonClick = (params: any) => {
    alert(`Button clicked for row with ID: ${params.id}`);
  };

  const columns: GridColDef[] = [
    { field: "MATNR", headerName: "MATNR", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleButtonClick(params)}
        >
          Ručno dodavanje
        </Button>
      ),
    },
  ];

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <PrebacivanjeArtiklaHeader />
      <Box>
        <Typography variant="h4" sx={{ marginTop: 10 }}>
          SRC Kontejner
        </Typography>
        <DataGrid rows={rows} columns={columns} />
      </Box>
      <Box>
        <Typography variant="h4" sx={{ width: "auto" }}>
          DEST Kontejner
        </Typography>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Container>
  );
}
