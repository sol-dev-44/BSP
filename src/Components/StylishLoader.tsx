import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

// Create pulsing animation
const pulse = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.98);
  }
`;

// Create rotating animation for the outer ring
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StylishLoader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: '-10vh', // Bring loader up more to eye level
        height: '100vh',
        background: 'transparent',
      }}
    >
      {/* Main loader with gradient */}
      <Box
        sx={{
          position: 'relative',
          animation: `${pulse} 2s infinite ease-in-out`,
        }}
      >
        {/* Background circle */}
        <Box
          sx={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            top: '-10px',
            left: '-10px',
            zIndex: 0,
          }}
        />
        
        {/* Rotating outer ring */}
        <Box
          sx={{
            position: 'absolute',
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: (theme) => theme.palette.primary.main,
            borderRightColor: (theme) => theme.palette.primary.light,
            animation: `${rotate} 2s linear infinite`,
            top: '-5px',
            left: '-5px',
          }}
        />
        
        {/* Main progress circle */}
        <CircularProgress
          size={100}
          thickness={4}
          sx={{
            color: (theme) => theme.palette.secondary.main,
            position: 'relative',
            zIndex: 2,
          }}
        />
        
        {/* Inner circle with different color */}
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: (theme) => theme.palette.primary.light,
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 3,
          }}
        />
      </Box>
      
      {/* Loading text with fade animation */}
      <Typography
        variant="h6"
        sx={{
          mt: 4,
          fontWeight: 500,
          animation: `${pulse} 2s infinite ease-in-out`,
          background: (theme) => 
            `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          letterSpacing: '0.5px',
        }}
      >
        Loading...
      </Typography>
    </Box>
  );
};

export default StylishLoader;