import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

function ExplanationCard({ name, amount, reason, currency = 'USD' }) {
  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amt);
  };

  return (
    <Card variant="outlined" sx={{ bgcolor: 'rgba(255, 255, 255, 0.01)', mb: 2 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.light' }}>
            {formatAmount(amount)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <HelpIcon color="secondary" sx={{ fontSize: 18, mt: 0.25 }} />
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
              AI PRICING RATIONALE
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {reason}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ExplanationCard;
