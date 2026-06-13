import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BoltIcon from '@mui/icons-material/Bolt';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';
import RFQForm from './RFQForm';

const INITIAL_FORM = {
  customerName: '',
  customerEmail: '',
  emailBody: '',
};

/**
 * CreateRFQDialog
 *
 * Props:
 *   open          — boolean, controls dialog visibility
 *   onClose       — function, called when dialog is closed/cancelled
 *   onSuccess     — function(rfqId), called after successful creation
 *                   used by RFQ Inbox to auto-select the new RFQ
 */
function CreateRFQDialog({ open, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    if (processing) return; // prevent closing during API call
    setFormValues(INITIAL_FORM);
    setError(null);
    onClose();
  };

  /**
   * Build the email string sent to the backend.
   * The API only accepts { email: string }.
   * We prepend customer metadata as email header lines so the
   * AI extractor can pick up the customer name.
   */
  const buildEmailPayload = () => {
    const { customerName, customerEmail, emailBody } = formValues;
    const headerLines = [];
    if (customerName.trim()) {
      headerLines.push(`From: ${customerName.trim()}${customerEmail.trim() ? ` <${customerEmail.trim()}>` : ''}`);
      headerLines.push(`Subject: Freight Quotation Request`);
      headerLines.push('');
    }
    return headerLines.join('\n') + emailBody.trim();
  };

  const isFormValid = () => formValues.emailBody.trim().length > 20;

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setError('Please provide valid email content (minimum 20 characters).');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const emailPayload = buildEmailPayload();
      const res = await api.post('/api/rfq/process', { email: emailPayload });
      const { rfq_id } = res.data;

      // Reset form state
      setFormValues(INITIAL_FORM);
      setError(null);

      // Close dialog first
      onClose();

      // Notify parent (e.g. RFQ Inbox) of the new ID for auto-selection
      if (onSuccess) {
        onSuccess(rfq_id);
      }

      // Navigate to RFQ Inbox
      navigate('/rfq', { state: { newRfqId: rfq_id } });

    } catch (err) {
      console.error('RFQ creation error:', err);
      const serverMsg = err?.response?.data?.detail;
      setError(
        serverMsg ||
        'Unable to process RFQ. Please verify the email content and try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      {/* Header */}
      <DialogTitle
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BoltIcon color="primary" sx={{ fontSize: 24 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Create Freight RFQ
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Paste a customer freight inquiry email to generate an AI-processed RFQ.
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={processing}
          size="small"
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Form Content */}
      <DialogContent sx={{ p: 3 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }}>
            {error}
          </Alert>
        )}

        {/* AI Processing Info Banner */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(91, 192, 190, 0.04)',
            border: '1px solid rgba(91, 192, 190, 0.15)',
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-start',
          }}
        >
          <BoltIcon color="primary" sx={{ fontSize: 18, mt: 0.25 }} />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.light', display: 'block', mb: 0.25 }}>
              AI-POWERED EXTRACTION
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Wisor AI will automatically extract origin, destination, container type, cargo type, and weight from the email content.
            </Typography>
          </Box>
        </Box>

        <RFQForm
          values={formValues}
          onChange={setFormValues}
          disabled={processing}
        />
      </DialogContent>

      <Divider />

      {/* Actions */}
      <DialogActions sx={{ p: 2.5, px: 3, gap: 1.5 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClose}
          disabled={processing}
          sx={{ px: 3 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={processing || !isFormValid()}
          startIcon={
            processing ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <BoltIcon />
            )
          }
          sx={{
            px: 4,
            fontWeight: 700,
            boxShadow: '0 4px 14px 0 rgba(91, 192, 190, 0.25)',
          }}
        >
          {processing ? 'Processing RFQ...' : 'Process RFQ'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateRFQDialog;
