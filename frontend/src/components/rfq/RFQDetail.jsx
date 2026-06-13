import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Button, Chip, Skeleton, Stack, Divider, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import BoltIcon from '@mui/icons-material/Bolt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import EmailCard from './EmailCard';
import ExtractionCard from './ExtractionCard';
import ConfidencePanel from './ConfidencePanel';
import ValidationPanel from './ValidationPanel';
import RFQHealthCard from './RFQHealthCard';

function RFQDetail({
  rfq = null,
  loading = false,
  actionLoading = false,
  onGenerateQuote,
  onMarkComplete,
  onDelete,
}) {
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'quoted':
        return 'success';
      case 'ready_for_quote':
        return 'info';
      case 'pending':
        return 'warning';
      case 'complete':
        default:
          return 'default';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // 1. Loading Skeletons
  if (loading) {
    return (
      <Box sx={{ p: 1 }}>
        <Card sx={{ mb: 2, borderRadius: '16px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ width: '50%' }}>
                <Skeleton width="40%" height={24} sx={{ mb: 1 }} />
                <Skeleton width="80%" height={40} />
              </Box>
              <Skeleton variant="rectangular" width={260} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </CardContent>
        </Card>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '16px' }} />
          </Grid>
        </Grid>
        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: '16px', mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '16px' }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '16px' }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  // 2. Unselected/Null State
  if (!rfq) {
    return (
      <Box
        sx={{
          height: '100%',
          minHeight: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: '16px',
          bgcolor: 'rgba(255,255,255,0.01)',
        }}
      >
        <LocalOfferIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
          Select an RFQ from the list
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
          Choose an incoming freight query from the left inbox stack to review raw mail transcripts, AI confidence scores, and validation check parameters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* TOP REVIEW HEADER - single horizontal card */}
      <Card sx={{ mb: 2, borderRadius: '16px' }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Identity block */}
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.05em', color: 'primary.light' }}>
                  {rfq.rfq_id}
                </Typography>
                <Chip
                  label={getStatusLabel(rfq.status)}
                  color={getStatusChipColor(rfq.status)}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
                <Typography variant="caption" color="text.secondary">
                  Received: {formatDate(rfq.created_at)}
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }} noWrap>
                {rfq.customer}
              </Typography>
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={1.25} sx={{ flexShrink: 0 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <BoltIcon />}
                onClick={() => onGenerateQuote(rfq.rfq_id)}
                disabled={actionLoading || rfq.status === 'complete'}
                size="small"
                sx={{ fontWeight: 700, boxShadow: '0 4px 14px 0 rgba(91, 192, 190, 0.25)' }}
              >
                {rfq.status === 'quoted' ? 'View Quote' : 'Generate Quote'}
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                onClick={() => onMarkComplete(rfq.rfq_id)}
                disabled={actionLoading || rfq.status === 'complete'}
                size="small"
              >
                Complete
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={actionLoading ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                onClick={() => onDelete(rfq.rfq_id)}
                disabled={actionLoading}
                size="small"
              >
                Delete
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* SECTION 1 - Email (left) + Extraction (right), equal height */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <EmailCard emailBody={rfq.email_body} customer={rfq.customer} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExtractionCard extracted={rfq.extracted} />
        </Grid>
      </Grid>

      {/* SECTION 2 - Confidence Overview, full width */}
      <Box sx={{ mb: 2 }}>
        <ConfidencePanel confidence={rfq.confidence} />
      </Box>

      {/* SECTION 3 + 4 - Validation table + Health Score */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ValidationPanel validation={rfq.validation} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RFQHealthCard confidence={rfq.confidence} validation={rfq.validation} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default RFQDetail;