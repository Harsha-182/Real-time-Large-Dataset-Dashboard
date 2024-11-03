const initialState = {
  loading: false,
  isAuthenticated: false,
  status: null,
  token: null,
  role: null,
  error: null,
};

export const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        loading: true,
        error: null,
        status: 'request',
        isAuthenticated: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token,
        role: action.payload.role,
        error: null,
        status: 'success'
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        error: action.payload,
        status: 'error'
      };
    default:
      return state;
  }
};
