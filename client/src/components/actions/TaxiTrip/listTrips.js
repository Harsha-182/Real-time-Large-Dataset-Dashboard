import axios from 'axios';

export function listTrips(
  { page = null, startDate = null, endDate = null, passengerCount = null, fareAmount = null },
  isReset = false
) {
  return async (dispatch) => {
    if (isReset) {
      dispatch({ type: 'TAXI_TRIP_RESET', payload: {} });
    } else {
      try {
        // Build query parameters only for defined values
        const params = new URLSearchParams();

        if (page) params.append('page', page);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (passengerCount) params.append('passengerCount', passengerCount);
        if (fareAmount) params.append('fareAmount', fareAmount);

        const url = `/taxi/get?${params.toString()}`;

        console.log("request.url with params", url);

        const response = await axios({
          url,
          method: 'GET',
          baseURL: 'https://real-time-large-dataset-dashboard-ojk3.vercel.app',
          headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': true,
          },
          timeout: 40000,
        });

        dispatch({ type: 'TAXI_TRIP_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({
          type: 'TAXI_TRIP_ERROR',
          payload: error.response?.data?.message || 'An error occurred',
        });
      }
    }
  };
}
