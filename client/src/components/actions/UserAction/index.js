import axios from 'axios'

export const fetchUser = () => {
  return (dispatch) => {
    const userList = JSON.parse(localStorage.getItem('userInfo')) || [];

    dispatch({
      type: 'FETCH_USERS',
      payload: userList,
    });
  };
};

/**
 * @function signup [Get Users]
 * @param {object} formData
 */

export function fetchUserFromDB(formData = {}) {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_DBUSER' });
        try{
                const request = {
                    url: '/user/list',
                    method: 'GET',
                    headers: { 'Access-Control-Allow-Origin': true },
                    data: formData
                };
                axios.request({
                    url: request.url,
                    method: request.method || 'get',
                    baseURL: 'https://real-time-large-dataset-dashboard-ojk3-li3m7wc8a.vercel.app',
                    headers: {
                        ...{
                            'Content-Type': 'application/json',
                        },
                        ...request.headers,
                    },
                    timeout: 40000,
                    data: request.data
                }).then(
                    (response) => {
                        dispatch({ type: 'FETCHDBUSER_SUCCESS', payload: response.data });
                    },
                    (error) => {
                        dispatch({
                            type: 'FETCHDBUSER_FAILURE',
                            payload: error.response?.data?.message || 'User not found ',
                          });     
                    }
                )
        } catch(error){
            dispatch({
                type: 'FETCHDBUSER_FAILURE',
                payload: error.response?.data?.message || 'User not found',
              });          
        }
    };
}