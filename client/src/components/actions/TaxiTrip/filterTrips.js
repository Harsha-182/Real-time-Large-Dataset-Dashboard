import axios from 'axios'
/**
 * @function FilterTips
 */

export function filterTrip({startRange, endRange, timeRange},isReset = false) {
    return async (dispatch) => {
        if (isReset) {
            dispatch({ type: 'FILTER_TAXI_TRIP_RESET', payload: {} });
        } else {
            try{
                    const params = new URLSearchParams();

                    if (startRange) params.append('startDate', startRange);
                    if (endRange) params.append('endDate', endRange);
                    if (timeRange) params.append('groupBy', timeRange);

                    const url = `/taxi/trips/aggregate?${params.toString()}`;
                    
                    const request = {
                        url,
                        method: 'GET',
                        // headers: { 'Access-Control-Allow-Origin': true },
                    };
                    axios.request({
                        url: request.url,
                        method: request.method || 'GET',
                        baseURL: 'https://real-time-large-dataset-dashboard-ojk3.vercel.app',
                        headers: {
                            ...{
                                'Content-Type': 'application/json',
                            },
                            ...request.headers,
                        },
                        timeout: 40000,
                        // data: request.data
                    }).then(
                        (response) => {
                            console.log("response-filter=taxitrip===",response.data)
                            dispatch({ type: 'FILTER_TAXI_TRIP_SUCCESS', payload: response.data });
                        },
                        (error) => {
                            dispatch({
                                type: 'FILTER_TAXI_TRIP_ERROR',
                                payload: error.response?.data?.message,
                            });     
                        }
                    )
            } catch(error){
                dispatch({
                    type: 'FILTER_TAXI_TRIP_ERROR',
                    payload: error.response?.data?.message,
                });          
            }
        }
    };
}