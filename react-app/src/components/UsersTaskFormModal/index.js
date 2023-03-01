import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./UsersTaskForm.css"
import { thunkGetUsers } from "../../store/session";

function UsersTaskFormModal({task}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const [errors, setErrors] = useState([]);

  let members = useSelector(state => state.projects.projectDetails.users);
  const assignees = task.users

  const handleRemoveAssignee = async (user) => {

    const data = await dispatch();

    if (data.errors) {
      setErrors(data.errors);
    }
  }

  const handleAddAssignee = async (user) => {

    const data = await dispatch();

    if (data.errors) {
      setErrors(data.errors);
    }
  }

  return (
    <div className="assigneesModal">
      <h1>Manage Assignees</h1>
      <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
      </ul>
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
