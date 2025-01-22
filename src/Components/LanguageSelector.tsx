import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const LanguageSelector = ({ changeLanguage }: { changeLanguage: (lng: string) => void }) => {
  return (
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <InputLabel>{'Language'}</InputLabel>
      <Select
        label="Language"
        defaultValue="en"
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="cro">Croatian</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
