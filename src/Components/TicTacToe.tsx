import { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

const TicTacToe = ({ setWinCounts, singlePlayer }: any) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<string>('X'); 
  const [gameOver, setGameOver] = useState<boolean>(false);

  const checkWin = (board: string[], player: string): boolean => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6],  
    ];
    return winPatterns.some((pattern) => 
      pattern.every(index => board[index] === player)
    );
  };

  const handleClick = (index: number) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    if (checkWin(newBoard, currentPlayer)) {
      setGameOver(true);
      setWinCounts((prevCounts: any) => ({
        ...prevCounts,
        [currentPlayer]: prevCounts[currentPlayer] + 1,
      }));
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';  
    setCurrentPlayer(nextPlayer);
  };

  const getAiMove = (board: string[], _player: string): number => {
    const availableMoves = board
      .map((cell, index) => (cell === '' ? index : -1))
      .filter((index) => index !== -1);

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    return randomMove;
  };

  useEffect(() => {
    if (singlePlayer && currentPlayer === 'O' && !gameOver) {  
      const aiMove = getAiMove(board, 'O');
      setTimeout(() => handleClick(aiMove), 500);  
    }
  }, [currentPlayer, board, singlePlayer]);

  const handleRestart = () => {
    setBoard(Array(9).fill('')); 
    setCurrentPlayer('X');        
    setGameOver(false);          
  };

  return (
    <Box>
      <Grid container spacing={1} justifyContent="center">
        {board.map((cell, index) => (
          <Grid item xs={4} key={index}>
            <Button 
              fullWidth 
              variant="outlined" 
              onClick={() => handleClick(index)}
              sx={{
                height: 100, 
                fontSize: '2rem', 
                fontWeight: 'bold',
                color: cell === 'X' ? 'red' : 'blue', 
              }}
            >
              {cell}
            </Button>
          </Grid>
        ))}
      </Grid>
      {gameOver && <Typography variant="h6">Game Over! {currentPlayer} Wins!</Typography>}
      
      <Box sx={{ marginTop: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRestart}
          sx={{ width: '100%' }}
        >
          Restart Game
        </Button>
      </Box>
    </Box>
  );
};

export default TicTacToe;
