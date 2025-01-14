import { Box } from "@mui/material";
import LoginDijalog from "./LoginDijalog";
export const PrijavaOperatera: React.FC = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        p: 2,
      }}
    >
      <>
        <LoginDijalog />
      </>
    </Box>
  );
};
