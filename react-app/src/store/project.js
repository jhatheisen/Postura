const GET_USER_PROJECTS = "project/GET_USER_PROJECTS"
const GET_PROJECT = 'project/GET_PROJECT';
const ADD_USER = 'project/ADD_USER';
const REMOVE_USER = 'project/REMOVE_USER';
const CREATE_PROJECT = "project/CREATE_PROJECT"
const DELETE_PROJECT = 'project/DELETE_PROJECT'
const EDIT_PROJECT = 'project/EDIT_PROJECT'

const getUserProjects = (projects) => ({
  type: GET_USER_PROJECTS,
  payload: projects
});

const getProject = (project) => ({
  type: GET_PROJECT,
  payload: project
})

const addUser = (user) => ({
  type: ADD_USER,
  payload: user
});

const removeUser = (userId) => ({
  type: REMOVE_USER,
  payload: userId
});

const createProject = (project) => ({
  type: CREATE_PROJECT,
  payload: project
})

const deleteProject = (projectId) => ({
  type: DELETE_PROJECT,
  payload: projectId
})

const editProject = (project) => ({
  type: EDIT_PROJECT,
  payload: project
})

export const thunkGetUserProjects = () => async (dispatch) => {
  const response = await fetch("/api/projects/current");

  if (response.ok) {
    const data = await response.json();
		if (data.errors) {
      return data;
		}

		dispatch(getUserProjects(data.Projects));
  }
};

export const thunkGetProject = (projectId) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}`);

  const data = await response.json();

  if (response.ok) {
    dispatch(getProject(data));
  }

  return data;
};

export const thunkAddUser = (projectId, userId) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}/users/${userId}`, {
    method: "POST"
  });

  const data = await response.json();

  if (response.ok) {
    dispatch(addUser(data));
  }

  return data;
};

export const thunkRemoveUser = (projectId, userId) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}/users/${userId}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (response.ok) {
    dispatch(removeUser(userId));
  }

  return data;
};

export const thunkCreateProject = (project) => async (dispatch) => {
  const response = await fetch("/api/projects/", {
    method:"POST",
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(project)
  });

  const data = await response.json();

  if (response.ok) {
		dispatch(createProject(data));
  }

  return data;
}

export const thunkEditProject = (project, projectId) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method:"PUT",
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(project)
  });

  const data = await response.json();

  if (response.ok) {
		dispatch(editProject(data));
    // finish edit project
  }

  return data;
}

export const thunkDeleteProject = (projectId) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (response.ok) {
		dispatch(deleteProject(projectId));
  }

  return data;
}

const initialState = [];

export default function projectReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_USER_PROJECTS:
      newState = {projects: action.payload}
      return newState;
    case GET_PROJECT:
      newState = {...state}
      newState.projectDetails = action.payload
      return newState
    case ADD_USER:
      newState = {...state}
      newState.projectDetails.users = [...newState.projectDetails.users, action.payload]
      return newState
    case REMOVE_USER:
      newState = {...state}
      newState.projectDetails.users = newState.projectDetails.users.filter(user => user.id != action.payload)
      return newState
    case CREATE_PROJECT:
      newState = {...state}
      newState.projects = [...newState.projects, action.payload]
      return newState;
    case EDIT_PROJECT:
      newState = {...state}
      newState.projects = newState.projects.map(project => {
        if (project.id == action.payload.id) return action.payload;
        return project
      })
      return newState
    case DELETE_PROJECT:
      newState = {...state}
      newState.projects = newState.projects.filter(project => project.id != action.payload)
      return newState
    default:
      return state
  }
}
