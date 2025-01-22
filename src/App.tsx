import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Switch } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TicTacToe from './Components/TicTacToe';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './Components/LanguageSelector';
import RockPaperScissors from './Games/RocPaperScizors'; 

import i18n from './i18n';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [player1, setPlayer1] = useState<string>('');
  const [player2, setPlayer2] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [, setPlayers] = useState<{ player1: string; player2: string }>({ player1: '', player2: '' });
  const { t } = useTranslation();
  const [winCounts, setWinCounts] = useState<{ [key: string]: number }>({
    player1: 0,
    player2: 0,
  });

  const [darkMode, setDarkMode] = useState(false);
  const [singlePlayer, setSinglePlayer] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#fafafa',
        paper: darkMode ? '#1d1d1d' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#bdbdbd' : '#555555',
      },
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
      h3: {
        fontWeight: 600,
        color: darkMode ? '#ffffff' : '#000000',
        fontSize: '1.8rem',
        '@media (max-width:600px)': {
          fontSize: '1.5rem',
        },
      },
      h6: {
        fontWeight: 500,
        color: darkMode ? '#ffffff' : '#000000',
        fontSize: '1.2rem',
        '@media (max-width:600px)': {
          fontSize: '1rem',
        },
      },
      body1: {
        color: darkMode ? '#ffffff' : '#000000',
        fontSize: '1rem',
      },
    },
  });

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [darkMode, theme.palette.background.default]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleStartGame = (p1: string, p2: string) => {
    setPlayers({ player1: p1, player2: p2 });
    setPlayer1(p1);
    setPlayer2(p2);
    setWinCounts({ player1: 0, player2: 0 });
    setIsLoggedIn(true);
  };

  const handleGameSelection = (game: string) => {
    setSelectedGame(game);
    setIsLoggedIn(false); 
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xs" sx={{ textAlign: 'center', padding: '1rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2, gap: 2 }}>
          <LanguageSelector changeLanguage={changeLanguage} />
          <Typography variant="h3" gutterBottom sx={{ color: 'text.primary' }}>
            {t('naslov')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
              <Typography>{t('darkMode')}</Typography>
              <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} name="darkMode" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
              <Typography>{t('singlePlayer')}</Typography>
              <Switch checked={singlePlayer} onChange={() => setSinglePlayer(!singlePlayer)} name="singlePlayer" />
            </Box>
          </Box>
        </Box>

        {!selectedGame ? (
          <Box sx={{ marginBottom: 3 }}>
            <Button variant="contained" onClick={() => handleGameSelection('TicTacToe')} sx={{ marginTop: 2 }}>
              {t('ticTacToe')}
            </Button>
            <Button variant="contained" onClick={() => handleGameSelection('RockPaperScissors')} sx={{ marginTop: 2 }}>
              {t('rockPaperScissors')}
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ marginBottom: 3 }}>
              <TextField
                label={t('player1Name')}
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                label={t('player2Name')}
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={() => handleStartGame(player1, player2)}
                sx={{ marginTop: 2 }}
                disabled={!player1 || !player2}
              >
                {t('start')}
              </Button>
            </Box>
            {selectedGame === 'TicTacToe' ? (
              <TicTacToe player1={player1} player2={player2} winCounts={winCounts} setWinCounts={setWinCounts} singlePlayer={singlePlayer} />
            ) : (
              <RockPaperScissors/>
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
