const FETCH_TASKS = 'FETCH_TASKS';
const UPDATE_TASK = 'UPDATE_TASK';

export const fetchTasks = () => {
  return (dispatch) => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    dispatch({
      type: FETCH_TASKS,
      payload: storedTasks,
    });
  };
};

export const updateTask = (updatedTask, index) => {
  return (dispatch, getState) => {
    const { tasks } = getState().Task;
    const updatedTasks = tasks.map((task, i) =>
      i === index ? updatedTask : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    dispatch({
      type: UPDATE_TASK,
      payload: { updatedTask, index },
    });
  };
};

export const deleteTask = (index) => {
  return (dispatch, getState) => {
    const { tasks } = getState().Task;
    const updatedTasks = tasks.filter((_, i) => {
      return i !== index
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    dispatch({ type: 'DELETE_TASK', payload: updatedTasks });
  }
};

export const reorderTasks = (tasks) => {
  return (dispatch) => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    dispatch({ type: 'REORDER_TASK', payload: tasks });
  };
};






