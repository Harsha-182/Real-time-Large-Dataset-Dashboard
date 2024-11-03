import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from '@mui/material';
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

import { listTrips } from './actions/TaxiTrip/listTrips';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, ArcElement);

const App = () => {
  const taxiData = useSelector((state) => state.TaxiTrip);
  const dispatch = useDispatch();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [passengerCount, setPassengerCount] = useState();
  const [page, setPage] = useState(1);
  const [fareAmount, setFareAmount] = useState();

  useEffect(() => {
    dispatch(listTrips({page, startDate, endDate, passengerCount, fareAmount}));
  }, [page, startDate, endDate, passengerCount, fareAmount]);

  const handlePageChange = (event, value) => setPage(value);

  return (
    <Box p={3}>
      
      <ToastContainer />

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
