const GET_USER_PROJECTS = "project/GET_PROJECTS"
const CREATE_PROJECT = "project/CREATE_PROJECT"

const getUserProjects = (projects) => ({
  type: GET_USER_PROJECTS,
  payload: projects
});

const createProject = (project) => ({
  type: CREATE_PROJECT,
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

export const thunkCreateProject = (project) => async (dispatch) => {
  const response = await fetch("/api/projects/", {
    method:"POST",
    headers: {
			"Content-Type": "application/json",
		},
    body: JSON.stringify(project)
  });

  const data = await response.json();
  console.log(data)

  if (response.ok) {
		dispatch(createProject(data));
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
      console.log('newState: ',newState)
      newState.push(action.payload)
      return newState;
    default:
      return state
  }
}
