import { combineReducers } from 'redux';
import { LoginReducer } from './authReducer/login';
import { SignUpReducer } from './authReducer/signup';
import {UserReducer, UserDBReducer} from './userReducer';
import TaskReducer from './tasksReducer';
import {TaxiTripReducer} from './taxiTripReducer/listTrips';
import {FilterTripReducer} from './taxiTripReducer/filterTrips';

const Reducers = combineReducers({
    Task: TaskReducer,
    Login: LoginReducer,
    User: UserReducer,
    Signup: SignUpReducer,
    GetUsers: UserDBReducer,
    TaxiTrip: TaxiTripReducer,
    FilterTrip: FilterTripReducer,
  });
  
export default Reducers;