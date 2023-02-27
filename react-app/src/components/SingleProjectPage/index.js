
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetProject } from "../../store/project";

function SingleProjectPage() {

  const dispatch = useDispatch();
  const { projectId } = useParams();
  const project = useSelector(state => state.projects.projectDetails)

  useEffect( () => {
    dispatch(thunkGetProject(projectId))
  }, [])

  if (!project) return null;

  return (
    <div>
      <h1>Project Page</h1>
      <p>{project.name}</p>
      <p>{project.description}</p>
      <p>{project.due_date}</p>
      {
      project.users.map(user => (
        <div>
          <p>{user.username}</p>
        </div>
      ))
      }
    </div>
  )
}

export default SingleProjectPage;
