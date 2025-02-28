import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const LanguageSelector = ({ changeLanguage }: { changeLanguage: (lng: string) => void }) => {
  return (
    <FormControl
      variant="outlined"
      sx={{
        minWidth: 140,
        position: "absolute",
        left: 10,
        top: 10,
        bgcolor: "#121212", 
        border: "2px solid #00eaff", 
        borderRadius: "8px",
        boxShadow: "0px 0px 10px #00eaff", 
      }}
    >
      <InputLabel
        sx={{
          color: "#00eaff",
          fontFamily: "'Press Start 2P', cursive",
          textShadow: "0px 0px 5px #00eaff",
        }}
      >
        {'Language'}
      </InputLabel>
      <Select
        label="Language"
        defaultValue="en"
        onChange={(e) => changeLanguage(e.target.value)}
        sx={{
          color: "white",
          fontFamily: "'Press Start 2P', cursive",
          bgcolor: "black",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00eaff", 
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ff007f", 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ff007f",
            boxShadow: "0px 0px 10px #ff007f",
          },
        }}
      >
        <MenuItem value="en" sx={{ color: "#00eaff", bgcolor: "black" }}>English</MenuItem>
        <MenuItem value="cro" sx={{ color: "#ff007f", bgcolor: "black" }}>Croatian</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
