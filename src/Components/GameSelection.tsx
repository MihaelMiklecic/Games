import { useState } from 'react';
import { Box, Typography, Button, Switch, TextField } from '@mui/material';
import TicTacToe from './TicTacToe';
import RockPaperScissors from '../Games/RocPaperScizors';

interface GameSelectionProps {
    darkMode: boolean;
    setDarkMode: (mode: boolean) => void;
    t: (key: string) => string;
}

const GameSelection: React.FC<GameSelectionProps> = ({ darkMode, setDarkMode, t }) => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [singlePlayer, setSinglePlayer] = useState<boolean>(false);
    const [player1, setPlayer1] = useState<string>('');
    const [player2, setPlayer2] = useState<string>('');
    const [winCounts, setWinCounts] = useState<{ player1: number; player2: number }>({ player1: 0, player2: 0 });

    const handleGameSelection = (game: string) => {
        setSelectedGame(game);
    };

    const handleStartGame = () => {
        setWinCounts({ player1: 0, player2: 0 });
    };

    const handleChangeGame = () => {
        setSelectedGame("");
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                justifyContent: "center",
                bgcolor: "#121212", 
                p: 3,
                borderRadius: "12px",
                border: "4px solid #00eaff",
                boxShadow: "0px 0px 15px #00eaff",
                textAlign: "center",
                fontFamily: "'Press Start 2P', cursive", 
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, position: "absolute", left: 10, top: 80 }}>
                <Typography sx={{ color: "white", textShadow: "0px 0px 5px #ff00ff" }}>{t('darkMode')}</Typography>
                <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, position: "absolute", left: 10, top: 120 }}>
                <Typography sx={{ color: "white", textShadow: "0px 0px 5px #ff00ff" }}>{t('singlePlayer')}</Typography>
                <Switch checked={singlePlayer} onChange={() => setSinglePlayer(!singlePlayer)} />
            </Box>

            {!selectedGame ? (
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => handleGameSelection('TicTacToe')}
                        sx={{
                            bgcolor: "#ff007f",
                            color: "white",
                            fontFamily: "'Press Start 2P', cursive",
                            textTransform: "uppercase",
                            borderRadius: "8px",
                            boxShadow: "0px 0px 10px #ff007f",
                            "&:hover": {
                                bgcolor: "#ff1493",
                                boxShadow: "0px 0px 15px #ff007f",
                            },
                        }}
                    >
                        {t('ticTacToe')}
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handleGameSelection('RockPaperScissors')}
                        sx={{
                            bgcolor: "#00ffea",
                            color: "black",
                            fontFamily: "'Press Start 2P', cursive",
                            textTransform: "uppercase",
                            borderRadius: "8px",
                            boxShadow: "0px 0px 10px #00ffea",
                            "&:hover": {
                                bgcolor: "#00eaff",
                                boxShadow: "0px 0px 15px #00ffea",
                            },
                        }}
                    >
                        {t('rockPaperScissors')}
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                            label={t('player1Name')}
                            value={player1}
                            onChange={(e) => setPlayer1(e.target.value)}
                            fullWidth
                            margin="normal"
                            sx={{
                                bgcolor: "black",
                                borderRadius: "5px",
                                input: { color: "white" },
                                label: { color: "#00eaff" },
                            }}
                        />
                        <TextField
                            label={t('player2Name')}
                            value={player2}
                            onChange={(e) => setPlayer2(e.target.value)}
                            fullWidth
                            margin="normal"
                            sx={{
                                bgcolor: "black",
                                borderRadius: "5px",
                                input: { color: "white" },
                                label: { color: "#ff007f" },
                            }}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        onClick={handleStartGame}
                        disabled={!player1 || !player2}
                        sx={{
                            bgcolor: "#ff007f",
                            color: "white",
                            fontFamily: "'Press Start 2P', cursive",
                            textTransform: "uppercase",
                            borderRadius: "8px",
                            boxShadow: "0px 0px 10px #ff007f",
                            "&:hover": {
                                bgcolor: "#ff1493",
                                boxShadow: "0px 0px 15px #ff007f",
                            },
                        }}
                    >
                        {t('start')}
                    </Button>

                    {selectedGame === 'TicTacToe' ? (
                        <TicTacToe
                            player1={player1}
                            player2={player2}
                            winCounts={winCounts}
                            setWinCounts={setWinCounts}
                            singlePlayer={singlePlayer}
                        />
                    ) : (
                        <RockPaperScissors />
                    )}

                    <Button
                        variant="contained"
                        onClick={handleChangeGame}
                        sx={{
                            bgcolor: "#00ffea",
                            color: "black",
                            fontFamily: "'Press Start 2P', cursive",
                            textTransform: "uppercase",
                            borderRadius: "8px",
                            boxShadow: "0px 0px 10px #00ffea",
                            "&:hover": {
                                bgcolor: "#00eaff",
                                boxShadow: "0px 0px 15px #00ffea",
                            },
                        }}
                    >
                        {t('selectOtherGame')}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default GameSelection;
