import { Box, Typography, Button } from "@mui/material";

interface SimulateInputProps {
  bstat: string;
  onBStatChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function SlanjeArtikalaSim({
  bstat,
  onBStatChange,
  onSubmit,
}: SimulateInputProps) {
  return (
    <Box
      sx={{
        border: "1px solid black",
        marginTop: 25,
        p: 5,
        borderRadius: 2,
        display: "flex",
      }}
    >
      <Typography variant="h4" sx={{ m: 1 }}>
        Simulate:
      </Typography>
      <input
        type="text"
        value={bstat}
        onChange={onBStatChange}
        placeholder="Input BStat"
      />
      <Button onClick={onSubmit} variant="contained" color="primary">
        Send BStat
      </Button>
    </Box>
  );
}
