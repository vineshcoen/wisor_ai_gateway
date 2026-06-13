import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function QuoteConfidence({ confidence = 0, size = 60 }) {
  const percentage = Math.round((confidence ?? 0) * 100);

  const getStatusColor = () => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={percentage}
        size={size}
        color={getStatusColor()}
        thickness={4.5}
        sx={{
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.04)',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" component="div" sx={{ fontWeight: 800 }}>
          {percentage}%
        </Typography>
      </Box>
    </Box>
  );
}

export default QuoteConfidence;
