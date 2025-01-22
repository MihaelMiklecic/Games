import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        marginTop: 3,
      }}
    >
      <Typography variant="h6">Enter your username to start playing</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default Login;
