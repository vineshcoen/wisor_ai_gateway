import React from 'react';
import { Card, CardContent, Typography, Box, Divider, LinearProgress, Stack } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

function ConfidencePanel({ confidence = {} }) {
  // Label mapper for confidence object keys
  const getFieldLabel = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Determine MUI color based on score value
  const getProgressColor = (score) => {
    const percentage = score * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

  // Convert confidence object into sorted list (or default items)
  const confidenceItems = Object.entries(confidence);

  return (
    <Card sx={{ borderRadius: '16px' }}>
      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AssessmentIcon color="primary" sx={{ fontSize: 18 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.8rem' }}>
          AI Extraction Confidence Scores
        </Typography>
      </Box>
      <Divider />
      <CardContent sx={{ p: 2 }}>
        {confidenceItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No confidence details available.
          </Typography>
        ) : (
          <Stack spacing={1.25}>
            {confidenceItems.map(([key, score]) => {
              const percentage = Math.round((score ?? 0) * 100);
              const progressColor = getProgressColor(score ?? 0);
              return (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                    flexWrap: 'nowrap',
                  }}
                >
                  {/* Label - fixed width so bars all align */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      flex: '0 0 140px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {getFieldLabel(key)}
                  </Typography>

                  {/* Bar - fills remaining space */}
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    color={progressColor}
                    sx={{
                      flex: '1 1 auto',
                      minWidth: 0,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />

                  {/* Percentage - fixed width, right aligned */}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: `${progressColor}.main`,
                      flex: '0 0 44px',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {percentage}%
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default ConfidencePanel;