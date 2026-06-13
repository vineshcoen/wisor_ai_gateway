import React from 'react';
import { Box, Typography, Grid, Card, CardContent, TextField, Button, Slider, Stack, Switch, FormControlLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

function PricingAdmin() {
  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Pricing Admin
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure freight tariffs, standard margin settings, and automated AI pricing parameters.
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
          Save Settings
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Global Auto-Pricing Rules
              </Typography>
              <Stack spacing={3}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable AI Auto-Quoting"
                />
                <Box>
                  <Typography gutterBottom variant="subtitle2">Default Profit Margin (%)</Typography>
                  <Slider defaultValue={12} valueLabelDisplay="auto" step={1} min={1} max={50} />
                </Box>
                <Box>
                  <Typography gutterBottom variant="subtitle2">Maximum AI Quote Auto-Approve Threshold ($)</Typography>
                  <Slider defaultValue={5000} valueLabelDisplay="auto" step={500} min={1000} max={25000} />
                </Box>
                <TextField label="Global Buffer Percentage" variant="outlined" defaultValue="2.5%" fullWidth />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Carrier Rate Index Sync
              </Typography>
              <Stack spacing={3}>
                <TextField label="CCFI Ocean Index Adjustment" variant="outlined" defaultValue="+1.2%" fullWidth />
                <TextField label="Drewry Container Index Buffer" variant="outlined" defaultValue="+$150 / TEU" fullWidth />
                <TextField label="Fuel Surcharge (BAF) Offset" variant="outlined" defaultValue="18.5%" fullWidth />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-update rates based on daily carrier feeds"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PricingAdmin;
