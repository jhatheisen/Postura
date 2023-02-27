import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetProject } from "../../store/project";
import './SingleProjectPage.css'

function SingleProjectPage() {

  const dispatch = useDispatch();
  const { projectId } = useParams();
  const project = useSelector(state => state.projects.projectDetails)

  useEffect( () => {
    dispatch(thunkGetProject(projectId))
  }, [])

  if (!project) return null;

  return (
    <div className="singleProjectPage">
      <h1>Project Page</h1>
      <hr/>
      <p>{project.name}</p>
      <p>{project.description}</p>
      <p>{project.due_date}</p>
      <h2>Users</h2>
      <hr/>
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
