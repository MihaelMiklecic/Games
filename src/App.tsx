import { useState, useEffect } from 'react';
import { Container, ThemeProvider, createTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './Components/LanguageSelector';
import i18n from './i18n';
import GameSelection from './Components/GameSelection';
import backgroundImage from '../public/Background.webp';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useTranslation();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      background: {
        default: darkMode ? '#121212' : '#fafafa',
        paper: darkMode ? '#1d1d1d' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#bdbdbd' : '#555555',
      },
    },
  });

  useEffect(() => {
    document.body.style.background = `url(${backgroundImage}) no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
  }, [darkMode]);

  const changeLanguage = (lng: any) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs" sx={{ textAlign: 'center', padding: '1rem' }}>
        <GameSelection darkMode={darkMode} setDarkMode={setDarkMode} t={t} />
        <LanguageSelector changeLanguage={changeLanguage} />
      </Container>
    </ThemeProvider>
  );
};

export default App;
