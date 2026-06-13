import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function QuoteSummary({ shipmentSummary = {} }) {
  const fields = [
    { label: 'Container Type', value: shipmentSummary.container_type },
    { label: 'Quantity (TEU/Units)', value: shipmentSummary.quantity },
    { label: 'Cargo Type', value: shipmentSummary.cargo_type },
    { label: 'Total Weight', value: shipmentSummary.weight },
  ];

  return (
    <Card variant="outlined" sx={{ bgcolor: 'rgba(255, 255, 255, 0.01)' }}>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <InfoOutlinedIcon color="primary" sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Cargo & Equipment Specifications
        </Typography>
      </Box>
      <CardContent sx={{ pt: 1, pb: '16px !important' }}>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                  {field.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {field.value ?? '-'}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default QuoteSummary;
