const GET_PROJECT_TASKS = 'project/GET_PROJECT_TASKS';
const CREATE_PROJECT_TASK = 'project/CREATE_PROJECT_TASK';
const DELETE_TASK = 'project/DELETE_TASK';
const EDIT_TASK = 'project/EDIT_TASK';
const ADD_USER_TASK = "project/ADD_USER_TASK";
const DEL_USER_TASK = "project/ADD_USER_TASK";

const getProjectTasks = (projects) => ({
  type: GET_PROJECT_TASKS,
  payload: projects
})

const createProjectTask = (task) => ({
  type: CREATE_PROJECT_TASK,
  payload: task
})

const deleteTask = (task) => ({
  type: DELETE_TASK,
  payload: task
})

const editTask = (task) => ({
  type: EDIT_TASK,
  payload: task
})

const addUserTask = (user, taskId) => ({
  type: ADD_USER_TASK,
  payload: {user, taskId}
})

const delUserTask = (user, taskId) => ({
  type: DEL_USER_TASK,
  payload: {user, taskId}
})

export const thunkGetProjectTasks = (projectId) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}/tasks`);

  const data = await response.json();

  if (response.ok) {
    dispatch(getProjectTasks(data));
  }

  return data;
}

export const thunkCreateProjectTask = (projectId, task) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(task)
  });

  const data = await response.json();

  if (response.ok) {
    dispatch(createProjectTask(data));
  }

  return data;
}

export const thunkDeleteTask = (taskId) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (response.ok) {
    dispatch(deleteTask(taskId));
  }

  return data;
}

export const thunkEditTask = (task, taskId) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method:"PUT",
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(task)
  });

  const data = await response.json();

  if (response.ok) {
		dispatch(editTask(data));
    // finish edit project
  }

  return data;
}

export const thunkAddUserTask = (user, taskId) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}/users/${user.id}`, {
    method:"POST",
  });

  const data = await response.json();

  if (response.ok) {
		dispatch(addUserTask(user, taskId));
    // finish edit project
  }

  return data;
}

export const thunkDelUserTask = (user, taskId) => async (dispatch) => {
  const response = await fetch(`/api/tasks/${taskId}/users/${user.id}`, {
    method:"DELETE",
  });

  const data = await response.json();

  if (response.ok) {
		dispatch(delUserTask(user, taskId));
    // finish edit project
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
    case CREATE_PROJECT_TASK:
      newState = {...state}
      newState.projectTasks = [ ...newState.projectTasks, action.payload]
      return newState;
    case DELETE_TASK:
      newState = {...state}
      newState.projectTasks = newState.projectTasks.filter(task => task.id != action.payload)
      return newState
    case EDIT_TASK:
      newState = {...state}
      newState.projectTasks = newState.projectTasks.map(task => {
        if (task.id == action.payload.id) return action.payload;
        return task
      })
      return newState
    case ADD_USER_TASK:
      newState = {...state}
      let tasks = newState.projectTasks
      for(let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == action.payload.taskId){
          tasks[i].users = [...tasks[i].users, action.payload.user]
        }
      }
      return newState
    case DEL_USER_TASK:
      newState = {...state}
      let delTasks = newState.projectTasks
      for(let i = 0; i < tasks.length; i++) {
        if (delTasks[i].id == action.payload.taskId){
          let users = delTasks[i].users
          users = users.filter(user => user.id != action.payload.user.id)
        }
      }
      return newState
    default:
      return state
  }
}
