import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, Alert, Stack, Snackbar } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router-dom';

import api from '../services/api';
import RFQList from '../components/rfq/RFQList';
import RFQDetail from '../components/rfq/RFQDetail';
import QuoteDialog from '../components/quotes/QuoteDialog';
import QuoteExplanationDialog from '../components/quotes/QuoteExplanationDialog';
import CreateRFQDialog from '../components/rfq/CreateRFQDialog';

function RFQInbox() {
  const location = useLocation();

  const [rfqList, setRfqList] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  const [selectedRfqDetails, setSelectedRfqDetails] = useState(null);
  
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [error, setError] = useState(null);
  const [lastGeneratedQuote, setLastGeneratedQuote] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Quote Generation & Explanation States
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationData, setExplanationData] = useState(null);

  // Create RFQ Dialog State
  const [isCreateRFQOpen, setIsCreateRFQOpen] = useState(false);

  // Fetch all RFQs from index endpoint
  const fetchRFQList = async (autoSelectFirst = false) => {
    setLoadingList(true);
    setError(null);
    try {
      const res = await api.get('/api/rfq');
      const data = res.data || [];
      setRfqList(data);
      
      if (data.length > 0) {
        if (autoSelectFirst || !selectedRfqId) {
          // Select the first item in the list automatically
          setSelectedRfqId(data[0].rfq_id);
        }
      } else {
        setSelectedRfqId(null);
        setSelectedRfqDetails(null);
      }
    } catch (err) {
      console.error('Error fetching RFQ list:', err);
      setError('Unable to load RFQ inbox. Please try again later.');
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch detail fields for the selected RFQ
  const fetchRFQDetails = async (rfqId) => {
    if (!rfqId) return;
    setLoadingDetails(true);
    try {
      const res = await api.get(`/api/rfq/${rfqId}`);
      setSelectedRfqDetails(res.data);
    } catch (err) {
      console.error(`Error loading RFQ details for ${rfqId}:`, err);
      setToastMessage(`Failed to load details for RFQ ${rfqId}`);
    } finally {
      setLoadingDetails(false);
    }
  };

  // On mount, load list and select the first element
  // If navigated here with a newRfqId (from RFQ creation), auto-select it
  useEffect(() => {
    const newRfqId = location.state?.newRfqId;
    if (newRfqId) {
      // Load list first then select the new RFQ
      fetchRFQList(false).then(() => {
        setSelectedRfqId(newRfqId);
      });
    } else {
      fetchRFQList(true);
    }
  }, []);

  // When selected RFQ changes, fetch details
  useEffect(() => {
    if (selectedRfqId) {
      fetchRFQDetails(selectedRfqId);
    } else {
      setSelectedRfqDetails(null);
    }
  }, [selectedRfqId]);

  // Action: Mark complete
  const handleMarkComplete = async (rfqId) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/api/rfq/${rfqId}/complete`);
      console.log('Mark complete response:', res.data);
      setToastMessage(`RFQ ${rfqId} marked as completed.`);
      
      // Refresh list locally
      await fetchRFQList(false);
      // Reload details to show updated state
      await fetchRFQDetails(rfqId);
    } catch (err) {
      console.error('Error completing RFQ:', err);
      setToastMessage('Failed to complete RFQ.');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Delete RFQ
  const handleDelete = async (rfqId) => {
    if (!window.confirm(`Are you sure you want to delete RFQ ${rfqId}?`)) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.delete(`/api/rfq/${rfqId}`);
      console.log('Delete response:', res.data);
      setToastMessage(`RFQ ${rfqId} deleted successfully.`);
      
      const remainingRfqs = rfqList.filter((item) => item.rfq_id !== rfqId);
      if (remainingRfqs.length > 0) {
        setSelectedRfqId(remainingRfqs[0].rfq_id);
      } else {
        setSelectedRfqId(null);
        setSelectedRfqDetails(null);
      }
      
      // Reload list
      await fetchRFQList(false);
    } catch (err) {
      console.error('Error deleting RFQ:', err);
      setToastMessage('Failed to delete RFQ.');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: Generate Quote
  const handleGenerateQuote = async (rfqId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/api/quote/generate', { rfq_id: rfqId });
      console.log('Quote generated response:', res.data);
      setLastGeneratedQuote(res.data);
      setToastMessage(`Quote Generated Successfully. Quote ID: ${res.data.quote_id}`);
      setIsQuoteOpen(true); // Open the quote dialog
      
      // Generating a quote will change the RFQ status to 'quoted'.
      // Reload both list and details.
      await fetchRFQList(false);
      await fetchRFQDetails(rfqId);
    } catch (err) {
      console.error('Error generating quote:', err);
      setToastMessage('Failed to generate quote. Check rates indexes.');
    } finally {
      setActionLoading(false);
    }
  };

  // Action: View AI Explanation
  const handleViewExplanation = async (quoteId) => {
    setExplanationLoading(true);
    try {
      const res = await api.post('/api/quote/explanation', { quote_id: quoteId });
      console.log('Quote explanation response:', res.data);
      setExplanationData(res.data);
      setIsExplanationOpen(true);
    } catch (err) {
      console.error('Error fetching quote explanation:', err);
      setToastMessage('Failed to load pricing explanation.');
    } finally {
      setExplanationLoading(false);
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      {/* Header Summary */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
            RFQ Inbox
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Process freight emails, review parsed values, validate requirements, and trigger quotes.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateRFQOpen(true)}
            sx={{ fontWeight: 700, boxShadow: '0 4px 14px 0 rgba(91, 192, 190, 0.25)' }}
          >
            Create RFQ
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => fetchRFQList(true)}
            disabled={loadingList}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Main Panel Layout */}
      {error ? (
        <Card variant="outlined" sx={{ p: 4, borderColor: 'error.main', bgcolor: 'rgba(231, 76, 60, 0.05)', textAlign: 'center' }}>
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <ErrorIcon color="error" sx={{ fontSize: 48 }} />
              <Typography variant="h6" color="error" sx={{ fontWeight: 600 }}>
                {error}
              </Typography>
              <Button variant="contained" color="error" onClick={() => fetchRFQList(true)}>
                Retry
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Left Panel: RFQ List (35%) */}
          <Grid item xs={12} md={4.2}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Incoming Queries ({rfqList.length})
              </Typography>
            </Box>
            <RFQList
              rfqs={rfqList}
              selectedId={selectedRfqId}
              onSelect={setSelectedRfqId}
              loading={loadingList}
              onCreateRFQ={() => setIsCreateRFQOpen(true)}
            />
          </Grid>

          {/* Right Panel: Detail View (65%) */}
          <Grid item xs={12} md={7.8}>
            <RFQDetail
              rfq={selectedRfqDetails}
              loading={loadingDetails}
              actionLoading={actionLoading}
              onGenerateQuote={handleGenerateQuote}
              onMarkComplete={handleMarkComplete}
              onDelete={handleDelete}
            />

            {/* Display stored quote data (Optionally visible for debug or audit) */}
            {lastGeneratedQuote && lastGeneratedQuote.rfq_id === selectedRfqId && (
              <Alert severity="success" sx={{ mt: 3, borderRadius: 2 }}>
                Quote <strong>{lastGeneratedQuote.quote_id}</strong> is active in system memory. Total: <strong>{lastGeneratedQuote.currency} {lastGeneratedQuote.total.toLocaleString()}</strong>.
              </Alert>
            )}
          </Grid>
        </Grid>
      )}

      {/* Quote Dialog */}
      <QuoteDialog
        open={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        quote={lastGeneratedQuote}
        onViewExplanation={handleViewExplanation}
        explanationLoading={explanationLoading}
      />

      {/* AI Explanation Dialog */}
      <QuoteExplanationDialog
        open={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        explanation={explanationData}
        currency={lastGeneratedQuote?.currency || 'USD'}
      />

      {/* Create RFQ Dialog */}
      <CreateRFQDialog
        open={isCreateRFQOpen}
        onClose={() => setIsCreateRFQOpen(false)}
        onSuccess={(newRfqId) => {
          // After creation, the dialog navigates to /rfq with state.
          // But if user is already on /rfq, manually refresh and select.
          setIsCreateRFQOpen(false);
          fetchRFQList(false).then(() => {
            setSelectedRfqId(newRfqId);
            setToastMessage(`RFQ ${newRfqId} created successfully!`);
          });
        }}
      />

      {/* Action status snackbar */}
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={5000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
    </Box>
  );
}

export default RFQInbox;
