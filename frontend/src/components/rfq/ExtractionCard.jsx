import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Grid } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const CARD_HEIGHT = 400;

function ExtractionCard({ extracted = {} }) {
  const fields = [
    { label: 'Origin', value: extracted.origin },
    { label: 'Destination', value: extracted.destination },
    { label: 'Cargo', value: extracted.cargo_type },
    { label: 'Container', value: extracted.container_type },
    { label: 'Weight', value: extracted.weight },
    { label: 'Quantity', value: extracted.quantity },
    { label: 'Ready Date', value: extracted.ready_date },
  ];

  return (
    <Card sx={{ height: CARD_HEIGHT, display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <AutoFixHighIcon color="primary" sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8rem' }}>
          AI Extracted Data
        </Typography>
      </Box>
      <Divider />
      <CardContent
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 },
        }}
      >
        <Grid container spacing={1.25}>
          {fields.map((field, index) => (
            <Grid item xs={6} key={index}>
              <Box
                sx={{
                  p: 1.25,
                  height: '100%',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'rgba(255,255,255,0.015)',
                  transition: 'border-color 0.15s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, display: 'block', mb: 0.25, fontSize: '0.7rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}
                >
                  {field.label}
                </Typography>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontWeight: 700, color: field.value ? 'text.primary' : 'text.disabled', fontSize: '0.85rem' }}
                  title={field.value || 'Not Extracted'}
                >
                  {field.value || 'Not Extracted'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ExtractionCard;