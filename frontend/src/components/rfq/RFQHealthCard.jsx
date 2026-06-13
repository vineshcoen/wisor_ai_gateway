import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Chip, Stack } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

/**
 * RFQHealthCard
 *
 * Purely presentational summary derived from existing `confidence` and
 * `validation` data already supplied to the page - no new API calls or
 * state are introduced.
 *
 * Props:
 *   confidence — object of field -> score (0-1), same shape used by ConfidencePanel
 *   validation — array of { field, status, message }, same shape used by ValidationPanel
 */
function RFQHealthCard({ confidence = {}, validation = [] }) {
  const formatField = (field) => {
    if (!field) return '';
    return field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Extraction quality = average confidence score across all fields
  const scores = Object.values(confidence || {});
  const qualityPct = scores.length
    ? Math.round((scores.reduce((sum, s) => sum + (s ?? 0), 0) / scores.length) * 100)
    : 0;

  const getQualityColor = (pct) => {
    if (pct >= 80) return 'success';
    if (pct >= 50) return 'warning';
    return 'error';
  };
  const qualityColor = getQualityColor(qualityPct);

  // Missing fields = validation entries flagged as 'missing'
  const missingFields = (validation || [])
    .filter((check) => check.status === 'missing')
    .map((check) => formatField(check.field))
    .filter(Boolean);

  const readyForQuote = missingFields.length === 0;

  // SVG circular progress geometry
  const size = 96;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - qualityPct / 100);

  const colorMap = {
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
  };

  return (
    <Card sx={{ borderRadius: '16px', height: '100%' }}>
      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <HealthAndSafetyIcon color="primary" sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8rem' }}>
          RFQ Health Score
        </Typography>
      </Box>
      <Divider />
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-around" sx={{ mb: 1.5 }}>
          {/* Circular progress */}
          <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={stroke}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={colorMap[qualityColor]}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, color: `${qualityColor}.main` }}>
                {qualityPct}%
              </Typography>
            </Box>
          </Box>

          {/* Quality label + Ready badge */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Extraction Quality
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Ready For Quote
            </Typography>
            <Chip
              label={readyForQuote ? 'YES' : 'NO'}
              color={readyForQuote ? 'success' : 'error'}
              size="small"
              sx={{ fontWeight: 800, letterSpacing: '0.05em' }}
            />
          </Box>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* Missing fields list */}
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Missing Fields
        </Typography>
        {missingFields.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
            All required fields extracted
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {missingFields.map((field, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <FiberManualRecordIcon sx={{ fontSize: 8, color: 'error.main' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.8125rem' }}>
                  {field}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default RFQHealthCard;