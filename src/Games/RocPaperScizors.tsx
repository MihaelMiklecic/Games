import { useState } from 'react';
import { Button, Typography, Box, Card, CardContent, Grid } from '@mui/material';

type Choice = 'Rock' | 'Paper' | 'Scissors';
type Score = {
  player: number;
  computer: number;
};

const RockPaperScissors = () => {
  const choices: Choice[] = ['Rock', 'Paper', 'Scissors'];
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string>('');
  const [score, setScore] = useState<Score>({ player: 0, computer: 0 });

  const getComputerChoice = (): void => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setComputerChoice(randomChoice);
  };

  const getResult = (player: Choice, computer: Choice): string => {
    if (player === computer) return "It's a tie!";
    if (
      (player === 'Rock' && computer === 'Scissors') ||
      (player === 'Scissors' && computer === 'Paper') ||
      (player === 'Paper' && computer === 'Rock')
    ) {
      setScore((prevScore) => ({
        ...prevScore,
        player: prevScore.player + 1,
      }));
      return 'You win!';
    } else {
      setScore((prevScore) => ({
        ...prevScore,
        computer: prevScore.computer + 1,
      }));
      return 'You lose!';
    }
  };

  const handleChoice = (choice: Choice): void => {
    setPlayerChoice(choice);
    getComputerChoice();
    setTimeout(() => {
      if (computerChoice) {
        const roundResult = getResult(choice, computerChoice);
        setResult(roundResult);
      }
    }, 100);
  };

  return (
    <Box sx={{ textAlign: 'center', marginTop: 4, backgroundColor: '#f5f5f5', padding: 4, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
        Rock, Paper, Scissors
      </Typography>

      <Typography variant="h5" gutterBottom sx={{ marginBottom: 4 }}>
        Your Score: {score.player} - Computer's Score: {score.computer}
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: 150,
              height: 100,
              fontSize: '1.5rem',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
            onClick={() => handleChoice('Rock')}
          >
            Rock
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: 150,
              height: 100,
              fontSize: '1.5rem',
              backgroundColor: '#9c27b0',
              '&:hover': {
                backgroundColor: '#7b1fa2',
              },
            }}
            onClick={() => handleChoice('Paper')}
          >
            Paper
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="success"
            sx={{
              width: 150,
              height: 100,
              fontSize: '1.5rem',
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
            onClick={() => handleChoice('Scissors')}
          >
            Scissors
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Player's Choice: {playerChoice}</Typography>
        <Typography variant="h6">Computer's Choice: {computerChoice}</Typography>
      </Box>

      <Card sx={{ maxWidth: 300, margin: 'auto', marginTop: 4, boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: result.includes('win') ? 'green' : result.includes('lose') ? 'red' : 'gray' }}>
            {result}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setPlayerChoice(null);
            setComputerChoice(null);
            setResult('');
          }}
          sx={{
            width: '100%',
            padding: '15px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: '#1976d2',
            },
          }}
        >
          Play Again
        </Button>
      </Box>
    </Box>
  );
};

export default RockPaperScissors;
