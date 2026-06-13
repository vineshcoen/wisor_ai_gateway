import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Skeleton, Stack, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function RFQList({ rfqs = [], selectedId = null, onSelect, loading = false, onCreateRFQ }) {
  // Map status to MUI Chip colors
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

  // Loading skeletons
  if (loading) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Skeleton width={80} height={20} />
                <Skeleton variant="rectangular" width={70} height={20} sx={{ borderRadius: 1 }} />
              </Box>
              <Skeleton width="60%" height={24} sx={{ mb: 1 }} />
              <Skeleton width="80%" height={16} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  // Empty state with actionable CTA
  if (!rfqs || rfqs.length === 0) {
    return (
      <Card
        variant="outlined"
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'background.paper',
          borderStyle: 'dashed',
        }}
      >
        <LocalShippingIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.75 }}>
          No RFQs found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Create your first freight RFQ to begin processing quotations.
        </Typography>
        {onCreateRFQ && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onCreateRFQ}
            sx={{ fontWeight: 700 }}
          >
            Create RFQ
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Stack spacing={2} sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 180px)', pr: 1 }}>
      {rfqs.map((rfq) => {
        const isActive = selectedId === rfq.rfq_id;
        return (
          <Card
            key={rfq.rfq_id}
            onClick={() => onSelect(rfq.rfq_id)}
            sx={{
              cursor: 'pointer',
              border: '1px solid',
              borderColor: isActive ? 'primary.main' : 'divider',
              bgcolor: isActive ? 'rgba(91, 192, 190, 0.05)' : 'background.paper',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: isActive ? 'primary.main' : 'text.disabled',
                transform: 'translateX(4px)',
              },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.05em', color: 'primary.light' }}>
                  {rfq.rfq_id}
                </Typography>
                <Chip
                  label={getStatusLabel(rfq.status)}
                  color={getStatusChipColor(rfq.status)}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: '0.7rem', height: 20 }}
                />
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                {rfq.customer}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Route
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                    {rfq.origin?.split(',')[0] ?? 'Unknown'} → {rfq.destination?.split(',')[0] ?? 'Unknown'}
                  </Typography>
                </Box>
                <ArrowForwardIosIcon sx={{ fontSize: 12, color: isActive ? 'primary.main' : 'text.disabled', mb: 0.5 }} />
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

export default RFQList;
