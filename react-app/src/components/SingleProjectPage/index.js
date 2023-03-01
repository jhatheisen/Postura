import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { thunkGetProject } from "../../store/project";
import { thunkGetProjectTasks, thunkDeleteTask } from "../../store/tasks";
import OpenModalButton from "../OpenModalButton";
import CreateTaskFormModal from "../CreateTaskFormModal";
import EditTaskFormModal from "../EditTaskFormModal";
import UsersTaskFormModal from "../UsersTaskFormModal";
import './SingleProjectPage.css'

function SingleProjectPage() {

  const dispatch = useDispatch();
  const ulRef = useRef();
  const { projectId } = useParams();
  const project = useSelector(state => state.projects.projectDetails)
  const tasks = useSelector(state => state.tasks.projectTasks);

  const [showMenu, setShowMenu] = useState(false);

  useEffect( () => {
    dispatch(thunkGetProject(projectId))
    dispatch(thunkGetProjectTasks(projectId))

    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, dispatch])

  const closeMenu = () => setShowMenu(false);

  if (!project) return null;
  if (!tasks) return null;

  const handleDeleteTask = async (taskId) => {
    await dispatch(thunkDeleteTask(taskId))
  }

  return (
    <div className="singleProjectPage">
      <h1>Project Page</h1>
      <hr/>
      <p>{project.name}</p>
      <p>{project.description}</p>
      <p>{project.due_date}</p>
      <h2>Users</h2>
      <hr/>
      {project.users.map(user => (
        <div>
          <p>{user.username}</p>
        </div>
      ))}

      <h2>Tasks</h2>
      <OpenModalButton
          buttonText="Create Task"
          onItemClick={closeMenu}
          className="CreateTaskButton cleanButton"
          modalComponent={<CreateTaskFormModal projectId={project.id}/>}
        />
      <div className="allTasks">
        {tasks.map(task => (
          <div className="taskBox" onClick={() => console.log('clicked')}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p>due: {task.due_date}</p>
            <p>started on: {task.creation_date}</p>
            <h3>Asignee(s)</h3>
            { task.users.map(user => (
              <p>{user.username}</p>
            ))}
            <OpenModalButton
              buttonText="Manage Asignees"
              onItemClick={closeMenu}
              className="UsersTaskButton cleanButton"
              modalComponent={<UsersTaskFormModal task={task}/>}
            />
            <OpenModalButton
              buttonText="Edit Task"
              onItemClick={closeMenu}
              className="EditTaskButton cleanButton"
              modalComponent={<EditTaskFormModal task={task}/>}
            />
            <button onClick={() => handleDeleteTask(task.id)} className="cleanButton">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SingleProjectPage;
