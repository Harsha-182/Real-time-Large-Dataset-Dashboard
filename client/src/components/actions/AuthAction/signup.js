import axios from 'axios'
/**
 * @function signup [Signup action]
 * @param {object} formData
 */

export function signup(formData = {}) {
    console.log("formData", formData)
    return async (dispatch) => {
        dispatch({ type: 'SIGNUP_REQUEST' });
        try{
            if(Object.keys(formData).length > 0) {
                const request = {
                    url: '/auth/signup',
                    method: 'POST',
                    headers: { 'Access-Control-Allow-Origin': true },
                    data: formData
                };
                axios.request({
                    url: request.url,
                    method: request.method || 'post',
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
                        console.log("response", response)
                        dispatch({ type: 'SIGNUP_SUCCESS', payload: {} });
                    },
                    (error) => {
                        console.log("error", error)
                        dispatch({
                            type: 'SIGNUP_FAILURE',
                            payload: error.response?.data?.message || 'Signup failed',
                          });     
                    }
                )
            } else {
                dispatch ({type: 'SIGNUP_RESET', payload: {} });
            }
        } catch(error){
            dispatch({
                type: 'SIGNUP_FAILURE',
                payload: error.response?.data?.message || 'Signup failed',
              });          
        }
    };
}