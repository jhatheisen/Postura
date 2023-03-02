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
  const [openTask, setOpenTask] = useState(-1);

  const colors = ["black","darkblue","darkgreen","darkred","darkgoldenrod","darkmagenta","darkolivegreen"]

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

    const closeTask = (e) => {
      setOpenTask(-1)
    }

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    }
  }, [showMenu, dispatch])

  const closeMenu = () => setShowMenu(false);

  if (!project) return null;
  if (!tasks) return null;

  const handleDeleteTask = async (taskId) => {
    await dispatch(thunkDeleteTask(taskId))
  }

  return (
    <div className="singleProjectPage">
      <div className="topProjectBar">
        <div className="leftTopBar">
          <h1>{project.name}</h1>
          <hr/>
          {project.description && <p>Description: {project.description}</p> }
          {project.due_date && <p>Due: {project.due_date.slice(0, project.due_date.length - 12)}</p> }
        </div>
        <div className="rightTopBar">
          <h1>Members</h1>
          <hr/>
          {project.users.map(user => (
            <div className="singleProjectMembers">
              <i class="fa-solid fa-circle-user fa-2x"></i>
              <p>{user.username}</p>
            </div>
          ))}
        </div>
      </div>

      <h2>Tasks</h2>
      <hr/>
      <OpenModalButton
          buttonText="Add Task"
          onItemClick={closeMenu}
          className="createTaskButton"
          modalComponent={<CreateTaskFormModal projectId={project.id}/>}
        />
      <div className="allTasks">
        {tasks.map(task => {
          let firstTask = task.id == tasks[0].id
          let lastTask = task.id == tasks[tasks.length-1].id && tasks[tasks.length-1].id != tasks[0].id
        return (
          <div className="importanceDiv">
          {firstTask && <h2>Most important <i class="fa-solid fa-arrow-right-long"></i></h2>}
          {lastTask && <h2><i class="fa-solid fa-arrow-right-long"></i> Least important</h2>}
          {!firstTask && !lastTask && <hr className="topHr"></hr>}
          <div className="taskBox" onClick={() => openTask == task.id ? setOpenTask(-1) : setOpenTask(task.id)} style={{backgroundColor: colors[task.id % colors.length]}}>
            <h3>{task.name}</h3>
            <p>Due: {task.due_date.slice(0, task.due_date.length - 12)}</p>
            { openTask == task.id && (
              <>
                <p>Started on: {task.creation_date.slice(0, task.due_date.length - 12)}</p>
                {task.description && <p>Description: {task.description}</p>}
                <h3>Asignee(s)</h3>
                { task.users.length == 0 &&
                  <p>No one assigned to task :(</p>
                }
                { task.users.map(user => (
                  <div className="taskAssignee">
                  <i class="fa-solid fa-circle-user fa-2x"></i>
                  <p>{user.username}</p>
                  </div>
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
              </>
            )}
          </div>
          </div>
        )})}
      </div>
    </div>
  )
}

export default SingleProjectPage;
