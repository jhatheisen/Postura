import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./UsersTaskForm.css"
import { thunkGetUsers } from "../../store/session";
import { thunkAddUserTask, thunkDelUserTask, thunkGetProjectTasks } from "../../store/tasks";

function UsersTaskFormModal({task}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [errors, setErrors] = useState([]);

  let members = useSelector(state => state.projects.projectDetails.users);
  const [assignees, setAssignees] = useState(task.users)
  const [loadPage, setLoadPage] = useState(false)

  useEffect(() => {
    return () => {
      setErrors([])
      setLoadPage(false)
    }
  },[dispatch, loadPage])

  const handleRemoveAssignee = async (user) => {

    const data = await dispatch(thunkDelUserTask(user, task.id));
    if (data.errors) {
      return setErrors(data.errors);
    }
    await dispatch(thunkGetProjectTasks(task.project_id))

    let delAssigneeI;
    for(let i = 0; i < assignees.length;i++) {
      if (assignees[i].id == user.id) {
        delAssigneeI = i;
        break;
      }
    }
    let tempAssignees = assignees;
    tempAssignees.splice(delAssigneeI, 1);
    setAssignees([...tempAssignees])
    setLoadPage(true)
  }

  const handleAddAssignee = async (user) => {

    const data = await dispatch(thunkAddUserTask(user, task.id));

    if (data.errors) {
      return setErrors(data.errors);
    }

    dispatch(thunkGetProjectTasks(task.project_id))
    setAssignees([...assignees, user])
    setLoadPage(true)
  }

  return (
    <div className="assigneesModal">
      <h1>Manage Assignees</h1>
      <ul>
          {errors.map((error, idx) => (
            <li key={idx} className="errorText">{error}</li>
          ))}
      </ul>
      { assignees.length == 0 &&
        <h3>No one assigned to task, add a user below...</h3>
      }
      {assignees.map(assignee => (
        <div className="currentAssigneeBox">
          <p>{assignee.username}</p>
        <button onClick={() => handleRemoveAssignee(assignee)}>X</button>
      </div>
      ))}
      <hr/>
      {members.map(member => (
        <div className="member" onClick={() => handleAddAssignee(member)}>
          <p>{member.username}</p>
        </div>
      ))}
    </div>
  );
}

export default UsersTaskFormModal;
