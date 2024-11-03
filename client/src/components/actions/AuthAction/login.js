import axios from 'axios'
/**
 * @function login [Login action dispatch the login action]
 * @param {object} formData
 */

export function login(formData = {}) {
    return async (dispatch) => {
        dispatch({ type: 'LOGIN_REQUEST' });
        try{
            if(Object.keys(formData).length > 0) {
                const request = {
                    url: '/auth/login',
                    method: 'POST',
                    headers: { 'Access-Control-Allow-Origin': true },
                    data: formData
                };
                axios.request({
                    url: request.url,
                    method: request.method || 'post',
                    baseURL: 'http://localhost:5000',
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
                        const { accessToken, userInfo} = response.data;
                        const { role } = response.data.userInfo;
                        console.log("response====",userInfo)
    
                        localStorage.setItem('authToken', accessToken);
                        localStorage.setItem('userRole', role);
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));

                        dispatch({ type: 'LOGIN_SUCCESS', payload: { accessToken, role} });
                    },
                    (error) => {
                        dispatch({
                            type: 'LOGIN_FAILURE',
                            payload: error.response?.data?.message || 'Login failed',
                          });     
                    }
                )
            } else {
                dispatch ({type: 'LOGIN_RESET', payload: {} });
            }
        } catch(error){
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: error.response?.data?.message || 'Login failed',
              });          
        }
    };
}