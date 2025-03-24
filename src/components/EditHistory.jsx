import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import dayjs from 'dayjs';

const EditHistory = ({ editHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    field: '',
    prevValue: '',
    newValue: '',
    timestamp: ''
  });

  // Get unique field names for filter dropdown
  const uniqueFields = useMemo(() => {
    if (!editHistory) return [];
    return [...new Set(editHistory.map(edit => edit.field))];
  }, [editHistory]);

  // Filter and sort the history
  const filteredHistory = useMemo(() => {
    if (!editHistory) return [];
    
    // First filter the history
    const filtered = editHistory.filter(edit => {
      const matchesField = !filters.field || edit.field === filters.field;
      const matchesPrevValue = !filters.prevValue || 
        edit.oldValue.toLowerCase().includes(filters.prevValue.toLowerCase());
      const matchesNewValue = !filters.newValue || 
        edit.newValue.toLowerCase().includes(filters.newValue.toLowerCase());
      const matchesTimestamp = !filters.timestamp || 
        dayjs(edit.timestamp).format('DD MMM YYYY').toLowerCase().includes(filters.timestamp.toLowerCase());
      
      return matchesField && matchesPrevValue && matchesNewValue && matchesTimestamp;
    });

    // Then sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [editHistory, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!editHistory || editHistory.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Collapsible Header Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        startIcon={<HistoryIcon />}
        endIcon={isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        variant="contained"
        sx={{
          mb: 2,
          backgroundColor: '#f5f5f5',
          color: '#333',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          width: '100%',
          justifyContent: 'space-between',
          padding: '12px 20px',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
          Edit History ({editHistory.length} changes)
        </Typography>
      </Button>

      {/* Collapsible Content */}
      <Collapse in={isOpen}>
        <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
          {/* Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Field"
              value={filters.field}
              onChange={(e) => handleFilterChange('field', e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Fields</MenuItem>
              {uniqueFields.map(field => (
                <MenuItem key={field} value={field}>{field}</MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Previous Value"
              value={filters.prevValue}
              onChange={(e) => handleFilterChange('prevValue', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="New Value"
              value={filters.newValue}
              onChange={(e) => handleFilterChange('newValue', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              label="Date"
              value={filters.timestamp}
              onChange={(e) => handleFilterChange('timestamp', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* History Table */}
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Field</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Previous Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>New Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date & Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.map((edit, index) => (
                  <TableRow 
                    key={`${edit.field}-${edit.timestamp}-${index}`}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      ...(index === 0 && { 
                        backgroundColor: '#f0f7ff',
                        '&:hover': {
                          backgroundColor: '#e3f2fd'
                        }
                      })
                    }}
                  >
                    <TableCell>{edit.field}</TableCell>
                    <TableCell sx={{ color: '#d32f2f' }}>{edit.oldValue}</TableCell>
                    <TableCell sx={{ color: '#2e7d32' }}>{edit.newValue}</TableCell>
                    <TableCell>
                      {dayjs(edit.timestamp).format("DD MMM YYYY, HH:mm:ss")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EditHistory;