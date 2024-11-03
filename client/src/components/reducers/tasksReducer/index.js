/**
 * @function TaskReducer [Set the updated state for task module]
 * @param {object} state
 * @param {object} action
 */

const initialState = {
  tasks: []
};

const FETCH_TASKS = 'FETCH_TASKS';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';
const REORDER_TASK = 'REORDER_TASK';

const TaskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS:
      return { ...state, tasks: action.payload };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task, index) =>
          index === action.payload.index ? action.payload.updatedTask : task
        ),
      };
    case DELETE_TASK:
        return { ...state, tasks: action.payload };
    case REORDER_TASK:
        return { ...state, tasks: action.payload };
    default:
      return state;
  }
};

export default TaskReducer;