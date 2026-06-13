import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function DashboardHeader({ onCreateRFQ }) {
  return (
    <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
          Wisor AI Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered freight quotation and RFQ management platform
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreateRFQ}
        sx={{
          py: 1,
          px: 2.5,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 14px 0 rgba(91, 192, 190, 0.25)',
        }}
      >
        Create New RFQ
      </Button>
    </Box>
  );
}

export default DashboardHeader;
