import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';

const EMAIL_PLACEHOLDER = `Dear Team,

Please provide freight rates for the following shipment:

2 x 40FT containers
From: Ahmedabad, India
To: Hamburg, Germany

Cargo: Textile
Weight: 20 Tons
Ready Date: Next Week

Regards,
ABC Exports`;

function RFQForm({ values, onChange, disabled = false }) {
  const handleChange = (field) => (e) => {
    onChange({ ...values, [field]: e.target.value });
  };

  return (
    <Box>
      {/* Section 1: Customer Information */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <PersonIcon color="primary" sx={{ fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Customer Information
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer / Company Name"
              placeholder="e.g. ABC Exports Ltd"
              value={values.customerName}
              onChange={handleChange('customerName')}
              disabled={disabled}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer Email (optional)"
              placeholder="e.g. ops@abcexports.com"
              value={values.customerEmail}
              onChange={handleChange('customerEmail')}
              disabled={disabled}
              fullWidth
              variant="outlined"
              type="email"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {/* Section 2: Email Content */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <DescriptionIcon color="primary" sx={{ fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Freight Inquiry Email Content
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          Paste the raw customer email. Wisor AI will extract shipment data automatically.
        </Typography>
        <TextField
          label="Email Body"
          placeholder={EMAIL_PLACEHOLDER}
          value={values.emailBody}
          onChange={handleChange('emailBody')}
          disabled={disabled}
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default RFQForm;
