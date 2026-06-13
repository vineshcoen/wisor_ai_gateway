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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import QuoteConfidence from './QuoteConfidence';
import ExplanationCard from './ExplanationCard';

function QuoteExplanationDialog({
  open = false,
  onClose,
  explanation = null,
  currency = 'USD',
}) {
  if (!explanation) return null;

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon color="primary" sx={{ fontSize: 24 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              AI Pricing Explanation
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Understand how this quote was calculated. (Quote Ref: {explanation.quote_id})
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {/* Route Flow Summary Card */}
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
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {explanation.route?.split('→')[0]?.trim()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <Divider sx={{ width: 40, borderColor: 'primary.main', borderStyle: 'dashed' }} />
            <SwapHorizIcon sx={{ fontSize: 24 }} />
            <Divider sx={{ width: 40, borderColor: 'primary.main', borderStyle: 'dashed' }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {explanation.route?.split('→')[1]?.trim()}
          </Typography>
        </Box>

        {/* Confidence & Risks Row */}
        <Grid container spacing={3} sx={{ mb: 4 }} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <QuoteConfidence confidence={explanation.quote_confidence} size={70} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  AI Confidence
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Calculated pricing confidence
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
              RISK ASSESSMENT FLAGS
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
              {explanation.risk_flags?.map((flag, idx) => (
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
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Line Item Explanations */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 2 }}>
          Heuristic Explanations by Surcharge Type
        </Typography>

        <Box>
          {explanation.line_items?.map((item, index) => (
            <ExplanationCard
              key={index}
              name={item.name}
              amount={item.amount}
              reason={item.reason}
              currency={currency}
            />
          ))}
        </Box>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button variant="outlined" color="primary" onClick={onClose} sx={{ px: 3 }}>
          Dismiss Explanation
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuoteExplanationDialog;
