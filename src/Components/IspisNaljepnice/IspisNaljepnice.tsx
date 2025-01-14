import { Container } from "@mui/material";
import { I_N_Header } from "./I_N_Utilities/I_N_Header";
import { I_N_Body } from "./I_N_Utilities/I_N_Body";

export const IspisNaljepnice = () => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        textAlign: "center",
        p: 1,
      }}
    >
      <I_N_Header />
      <I_N_Body />
    </Container>
  );
};
