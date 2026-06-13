import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Stack,
  IconButton,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GetAppIcon from '@mui/icons-material/GetApp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import QuoteSummary from './QuoteSummary';
import QuoteBreakdown from './QuoteBreakdown';
import QuoteConfidence from './QuoteConfidence';

function QuoteDialog({
  open = false,
  onClose,
  quote = null,
  onViewExplanation,
  explanationLoading = false,
}) {
  if (!quote) return null;

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: quote.currency || 'USD',
    }).format(amt);
  };

  // Plain-text invoice generator download function
  const handleDownload = () => {
    const timestamp = new Date().toLocaleString();
    const invoiceTxt = `==================================================
                 WISOR AI QUOTATION
==================================================
Quote Reference    : ${quote.quote_id}
RFQ Reference      : ${quote.rfq_id}
Date Generated     : ${timestamp}
Billing Currency   : ${quote.currency || 'USD'}
Status             : GENERATED (AI Auto-priced)
--------------------------------------------------
ROUTE DETAILS:
Origin             : ${quote.shipment_summary?.origin || '-'}
Destination        : ${quote.shipment_summary?.destination || '-'}
--------------------------------------------------
SHIPMENT DATA:
Equipment Type     : ${quote.shipment_summary?.container_type || '-'}
Quantity (Units)   : ${quote.shipment_summary?.quantity || '-'}
Cargo Description  : ${quote.shipment_summary?.cargo_type || '-'}
Gross Weight       : ${quote.shipment_summary?.weight || '-'}
--------------------------------------------------
ITEMIZED TARIFFS & SURCHARGES:
${quote.breakdown
  ?.map(
    (item) =>
      `- ${item.name.padEnd(16)}: ${quote.currency || 'USD'} ${item.amount.toLocaleString(
        undefined,
        { minimumFractionDigits: 2 }
      )}\n  Calculated Details: ${item.reason}`
  )
  .join('\n\n')}
--------------------------------------------------
TOTAL QUOTATION VALUE:
>>> ${quote.currency || 'USD'} ${quote.total?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })} <<<
--------------------------------------------------
AI Quotation Confidence : ${Math.round((quote.quote_confidence ?? 0) * 100)}%
Validation Risk Flags   : ${quote.risk_flags?.join(', ') || 'None'}
==================================================
Disclaimer: Generated automatically by Wisor AI pricing systems.`;

    const element = document.createElement('a');
    const file = new Blob([invoiceTxt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Wisor_Quote_${quote.quote_id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundImage: 'none',
          bgcolor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
        },
      }}
    >
      {/* Dialog Header */}
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            Freight Quotation
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
            <Chip label={`Quote ID: ${quote.quote_id}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            <Chip label={`RFQ: ${quote.rfq_id}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            <Chip label={`Currency: ${quote.currency || 'USD'}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            <Chip label={`Generated: ${new Date().toLocaleTimeString()}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
          </Stack>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {/* Route Flow Card */}
        <Box
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.01)',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {quote.shipment_summary?.origin || 'Origin'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <Divider sx={{ width: 50, borderColor: 'primary.main', borderStyle: 'dashed' }} />
            <SwapHorizIcon sx={{ fontSize: 24 }} />
            <Divider sx={{ width: 50, borderColor: 'primary.main', borderStyle: 'dashed' }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'text.primary' }}>
            {quote.shipment_summary?.destination || 'Destination'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column: Shipment Specs + Breakdown */}
          <Grid item xs={12} md={7.5}>
            <Stack spacing={3}>
              <QuoteSummary shipmentSummary={quote.shipment_summary} />
              <QuoteBreakdown breakdown={quote.breakdown} currency={quote.currency} />
            </Stack>
          </Grid>

          {/* Right Column: Total Pricing + Confidence + Risks */}
          <Grid item xs={12} md={4.5}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {/* Prominent Price Total Card */}
              <Card sx={{ bgcolor: 'rgba(91, 192, 190, 0.04)', borderColor: 'primary.main' }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                    TOTAL QUOTED VALUE
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                    {formatAmount(quote.total)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {quote.currency || 'USD'} (All-inclusive)
                  </Typography>
                </CardContent>
              </Card>

              {/* Confidence Meter */}
              <Card variant="outlined" sx={{ bgcolor: 'rgba(255, 255, 255, 0.01)' }}>
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <QuoteConfidence confidence={quote.quote_confidence} size={56} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      Pricing Certainty
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      AI pricing engine confidence score
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Risk Flags Panel */}
              <Card variant="outlined" sx={{ bgcolor: 'rgba(255, 255, 255, 0.01)', flexGrow: 1 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1.5 }}>
                    RISK / VALIDATION FLAGS
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                    {quote.risk_flags?.map((flag, idx) => (
                      <Chip
                        key={idx}
                        label={flag}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />
      {/* Footer Controls */}
      <DialogActions sx={{ p: 2.5, px: 3, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<GetAppIcon />}
          onClick={handleDownload}
          sx={{ fontWeight: 700 }}
        >
          Download Quote
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="primary" onClick={onClose} sx={{ px: 3 }}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AutoAwesomeIcon />}
            onClick={() => onViewExplanation(quote.quote_id)}
            disabled={explanationLoading}
            sx={{
              px: 3,
              fontWeight: 700,
              boxShadow: (theme) => `0 4px 10px 0 rgba(91, 192, 190, 0.25)`,
            }}
          >
            View AI Explanation
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default QuoteDialog;
