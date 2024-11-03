  /**
 * @function DatashapeListReducer [Set the updated state for taxitrip analytics module]
 * @param {object} state
 * @param {object} action
 */
  export function FilterTripReducer(state = {}, action) {
    switch (action.type) {
    case 'FILTER_TAXI_TRIP_SUCCESS':
        return { status: 'success', data: action.payload };
    case 'FILTER_TAXI_TRIP_FAILURE':
        return { status: 'error', data: action.payload };
    case 'FILTER_TAXI_TRIP_RESET':
        return { status: 'reset' };
    default:
        return { ...state };
    }
}
