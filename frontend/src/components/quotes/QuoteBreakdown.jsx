import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Divider } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

function QuoteBreakdown({ breakdown = [], currency = 'USD' }) {
  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amt);
  };

  return (
    <Card variant="outlined" sx={{ bgcolor: 'rgba(255, 255, 255, 0.01)' }}>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptLongIcon color="primary" sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Itemized Tariffs & Surcharges
        </Typography>
      </Box>
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <Stack divider={<Divider />} spacing={0}>
          {breakdown.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
              }}
            >
              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.reason}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap' }}>
                {formatAmount(item.amount)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default QuoteBreakdown;
