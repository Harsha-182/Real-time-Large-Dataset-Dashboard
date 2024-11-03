const initialState = {
    error: null,
    success: false
};

export const SignUpReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SIGNUP_REQUEST':
        return {
          ...state,
          status: 'request',
          error: null,
          success: false,
        };
      case 'SIGNUP_SUCCESS':
        return {
          ...state,
          success: true,
          status: 'success',
          error: null,
        };
      case 'SIGNUP_FAILURE':
        return {
          ...state,
          status: 'error',
          success: false,
          error: action.payload,
        };
      case 'SIGNUP_RESET':
        return {
            ...state,
            status: 'reset',
            success: false,
            error: null,
        };
      default:
        return state;
    }
  };
  