import { Container } from "@mui/material";
import { HeaderOtpremnica } from "./OtpremnicaUtils/HeaderOtpremnica";
import { TablicaOtpremnice } from "./OtpremnicaUtils/TablicaOtpremnice";
import { IspisButton } from "./OtpremnicaUtils/IspisButtonOtpremnica";

export const Otpremnica = () => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <HeaderOtpremnica />
      <TablicaOtpremnice />
      <IspisButton />
    </Container>
  );
};
