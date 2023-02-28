const GET_PROJECT_TASKS = 'project/GET_PROJECT_TASKS';

const getProjectTasks = (projects) => ({
  type: GET_PROJECT_TASKS,
  payload: projects
})

export const thunkGetProjectTasks = (projectId) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}/tasks`);

  const data = await response.json();

  if (response.ok) {
    dispatch(getProjectTasks(data));
  }

  return data;
}

const initialState = [];

export default function tasksReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_PROJECT_TASKS:
      newState = {...state}
      newState.projectTasks = action.payload.Tasks
      return newState;
    default:
      return state
  }
}
