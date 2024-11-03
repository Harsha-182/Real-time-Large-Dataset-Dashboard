/**
 * @function UserReducer [Get the user list]
 * @param {object} state
 * @param {object} action
 */

const initialState = {
    tasks: []
  };
  
export const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_USERS':
            return { ...state, userList: action.payload };
        default:
            return state;
    }
};

export const UserDBReducer = (state = {}, action) => {
    switch (action.type) {
        case 'FETCHDBUSER_SUCCESS':
            return { status: 'success', data: action.payload };
        case 'FETCHDBUSER_FAILURE':
            return { status: 'error', data: action.payload };
        default:
            return {...state};
    }
};
