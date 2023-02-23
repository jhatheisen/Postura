const GET_USER_PROJECTS = "project/GET_PROJECTS"
const CREATE_PROJECT = "project/CREATE_PROJECT"
const DELETE_PROJECT = 'project/DELETE_PROJECT'
const EDIT_PROJECT = 'project/EDIT_PROJECT'

const getUserProjects = (projects) => ({
  type: GET_USER_PROJECTS,
  payload: projects
});

const createProject = (project) => ({
  type: CREATE_PROJECT,
  payload: project
})

const deleteProject = (stateI) => ({
  type: DELETE_PROJECT,
  payload: stateI
})

const editProject = (project, stateI) => ({
  type: EDIT_PROJECT,
  payload: {project, stateI}
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

export const thunkEditProject = (project, projectId, stateI) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method:"PUT",
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(project)
  });

  const data = await response.json();

  if (response.ok) {
		dispatch(editProject(data, stateI));
    // finish edit project
  }

  return data;
}

export const thunkDeleteProject = (projectId, stateI) => async (dispatch) => {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE"
  });

  const data = await response.json();

  if (response.ok) {
		dispatch(deleteProject(stateI));
  }

  return data;
}

const initialState = [];

export default function projectReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case GET_USER_PROJECTS:
      newState = action.payload
      return newState;
    case CREATE_PROJECT:
      newState = [...state]
      newState.push(action.payload)
      return newState;
    case EDIT_PROJECT:
      newState = [...state]
      newState[action.payload.stateI] = action.payload.project
      return newState
    case DELETE_PROJECT:
      newState = [...state]
      newState.splice(action.payload, 1)
      return newState
    default:
      return state
  }
}
