import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listTrips } from './actions/TaxiTrip/listTrips';
import { filterTrip } from './actions/TaxiTrip/filterTrips';

import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from '@mui/material';
import { Line, Bar, Scatter, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import axios from 'axios';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ArcElement);

// const socket = io('http://localhost:4000'); // Adjust the URL to your backend server
const socket = io('http://localhost:5000', {
    autoConnect: false
});

const App = () => {
  const taxiData = useSelector((state) => state.TaxiTrip);
  // console.log("taxiData=========", taxiData1);
  const filterTripStatus = useSelector((state) => state.FilterTrip);  
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [passengerCount, setPassengerCount] = useState();
  const [page, setPage] = useState(1);
  const [pieChartField, setPieChartField] = useState('pu_location_id'); // New state for pie chart field selection
  const [fareAmount, setFareAmount] = useState();
  const [startRange, setStartRange] = useState();
  const [endRange, setEndRange] = useState();
  const [timeRange, setTimeRange] = useState();
  const [csvFile, setCsvFile] = useState(null);

  // console.log("filterTrip======", filterTripStatus)
  useEffect(() => {
    dispatch(listTrips({page, startDate, endDate, passengerCount, fareAmount}));
  }, [page, startDate, endDate, passengerCount, fareAmount]);

  // useEffect(() => {
  //   if (taxiData1 && taxiData1.status === 'success') {
  //     // setTaxiData(taxiData1);
  //   }
  // }, [taxiData1]);

  useEffect(() => {
    dispatch(filterTrip({startRange, endRange, timeRange}));
  },[startRange, endRange, timeRange])
  
  useEffect(() => {
    // Connect to socket and listen for events
    socket.on('jobCompleted', (data) => {
      // Display dynamic toast notifications
      toast.info(`New data received: ${data}`);
      console.log("new Data arrived==========================================================================================================================")
      dispatch(listTrips());  // Optionally trigger data fetch if new data arrives
    });

    // Cleanup on unmount
    return () => {
      socket.off('jobCompleted');
    };
  }, []);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) return;
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await axios.post('http://localhost:5000/taxi/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message || "File uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    }
  };

  // Filtering data based on selected filters
  const filteredData = taxiData?.data?.data.filter(trip => {
    const pickupDate = new Date(trip.tpep_pickup_datetime);
    const dropoffDate = new Date(trip.tpep_dropoff_datetime);
    return (
      (!startDate || pickupDate >= new Date(startDate)) &&
      (!endDate || dropoffDate <= new Date(endDate)) &&
      (!passengerCount || trip.passenger_count === passengerCount)
    );
  });

  const handlePageChange = (event, value) => setPage(value);

  // Pie Chart Data Calculation
  const pieChartData = useMemo(() => {
    const dataCount = taxiData.data && taxiData?.data?.data?.reduce((acc, trip) => {
      const key = trip[pieChartField];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: dataCount && Object.keys(dataCount),
      datasets: [
        {
          data: dataCount && Object.values(dataCount),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#4CAF50'
          ],
        },
      ],
    };
  }, [taxiData?.data?.data, pieChartField]);

  // Example chart data and configuration for different charts
  const lineChartData = {
    labels: filterTripStatus?.data && filterTripStatus.data.map(trip => new Date(trip.time_period).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Trips Over Time',
        data: filterTripStatus?.data && filterTripStatus.data.map((trip) => trip.total_trips),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  const barChartData = {
    labels: filterTripStatus?.data && filterTripStatus.data.map(trip => new Date(trip.time_period).toLocaleDateString()),
    datasets: [
      {
        label: 'Average Fare by Day',
        data: filterTripStatus?.data && filterTripStatus.data.map(trip => trip.average_fare),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const scatterChartData = {
    datasets: [
      {
        label: 'Fare Amount vs. Trip Distance',
        data: taxiData.data && taxiData?.data?.data?.map(trip => ({
          x: trip.trip_distance,
          y: trip.fare_amount,
        })),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <Box p={3}>
      {/* <Typography variant="h4" align="center" gutterBottom>NYC Taxi Trip Data Dashboard</Typography> */}
      
      <ToastContainer />

      <Box mb={2} display="flex" justifyContent="end">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="csv-upload"
        />
        <label htmlFor="csv-upload">
          <Button
            variant="contained"
            color="primary"
            size="large"
            component="span"
          >
            Select CSV
          </Button>
        </label>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleFileUpload}
          disabled={!csvFile}
          sx={{ ml: 2 }}
        >
          Upload CSV
        </Button>
      </Box>
{/* Filter Section */}
<Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
    <Typography>Filter by</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start Date"
              type="date"
              value={startRange}
              onChange={e => setStartRange(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="End Date"
              type="date"
              value={endRange}
              onChange={e => setEndRange(e.target.value)}
              fullWidth
              // defaultValue={tenDaysLater}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
          <Select
            label="Filter by"
            name="filterby"
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            fullWidth
            margin="dense"
            defaultValue={'Day'}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={() => { setStartRange(''); setEndRange(''); setTimeRange('');}}>Reset Filters</Button>
          </Grid>
        </Grid>
      </Paper>
      {/* Charts Section */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Total Trips Over Time</Typography>
            <Line data={lineChartData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Average Fare by Day</Typography>
            <Bar data={barChartData} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Filter Section */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value >= startRange ? e.target.value : startRange)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Passenger Count"
              type="number"
              value={passengerCount}
              onChange={e => setPassengerCount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Fare Amount"
              value={fareAmount}
              onChange={e => setFareAmount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={() => { setStartDate(''); setEndDate(''); setPassengerCount(''); setFareAmount('')}}>Reset Filters</Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Dropdown for Pie Chart Field Selection */}
      <Box mb={3}>
        <FormControl fullWidth>
          <InputLabel>Select Pie Chart Field</InputLabel>
          <Select
            value={pieChartField}
            onChange={e => setPieChartField(e.target.value)}
          >
            <MenuItem value="pu_location_id">Pickup Location</MenuItem>
            <MenuItem value="do_location_id">Dropoff Location</MenuItem>
            <MenuItem value="passenger_count">Passenger Count</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6">Fare Amount vs. Trip Distance</Typography>
            <Scatter data={scatterChartData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 5, height: 500 }}>
            <Typography variant="h6">Distribution of Trips by {pieChartField}</Typography>
            <Pie data={pieChartData} />
          </Paper>
        </Grid>
      </Grid>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pickup Date</TableCell>
              <TableCell>Dropoff Date</TableCell>
              <TableCell>Pickup Location ID</TableCell>
              <TableCell>Dropoff Location ID</TableCell>
              <TableCell>Passenger Count</TableCell>
              <TableCell>Fare Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taxiData.data && taxiData?.data?.data?.map((trip, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(trip.tpep_pickup_datetime).toLocaleString()}</TableCell>
                <TableCell>{new Date(trip.tpep_dropoff_datetime).toLocaleString()}</TableCell>
                <TableCell>{trip.pu_location_id}</TableCell>
                <TableCell>{trip.do_location_id}</TableCell>
                <TableCell>{trip.passenger_count}</TableCell>
                <TableCell>${trip.fare_amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={taxiData?.data?.totalPages} page={page} onChange={handlePageChange} sx={{ mt: 3 }} />
    </Box>
  );
};

export default App;
