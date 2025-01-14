import { Button, Container } from "@mui/material";
import { SSRCHeader } from "./SSRCHeader";
import { useNavigate } from "react-router-dom";

export default function SkeniranjeSRCKontejnera() {
  const navigate = useNavigate();

  const nextPage = () => {
    navigate("/prebacivanje-artikla");
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
      <SSRCHeader />
      <Button
        variant="contained"
        onClick={nextPage}
        sx={{ marginTop: "25%", width: "250px", height: "250px" }}
      >
        skeniraj src kontejner
      </Button>
    </Container>
  );
}
