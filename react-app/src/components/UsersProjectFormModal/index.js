import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkAddUser, thunkGetProject, thunkRemoveUser } from "../../store/project";
import "./UsersProjectForm.css"
import { thunkGetUsers } from "../../store/session";

function UsersProjectFormModal({project}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(thunkGetUsers())
    dispatch(thunkGetProject(project.id))
  },[dispatch])

  const users = useSelector(state => state.session.users);
  const currUser = useSelector(state => state.session.user);
  const projectDetails = useSelector(state => state.projects.projectDetails)

  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let foundUser = users.find(user => user.email == email)

    if (!foundUser) return setErrors(["Cannot find user with that email. Please check spelling."]);

    const data = await dispatch(thunkAddUser(project.id, foundUser.id));
    dispatch(thunkGetProject(project.id))

    if (data.errors) {
      setErrors(data.errors);
    }
    else {
      setEmail("")
    }
  };

  const handleRemoveUser = async (user) => {

    const data = await dispatch(thunkRemoveUser(project.id, user.id));
    dispatch(thunkGetProject(project.id))

    if (data.errors) {
      setErrors(data.errors);
    }
    else {
      setEmail("")
    }
  }

  if (!projectDetails) return null

  return (
    <div className="membersModal">
      <h1>Manage Members</h1>
      <hr/>
      <form onSubmit={handleSubmit}>
        <h2>Invite by Email</h2>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </label>
        <button type="submit" className="cleanButton">Submit</button>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      </form>
      <div className="currMembers">
        <hr/>
        <h2>Current Members</h2>
        {projectDetails.users.map(user => {
          if (user.id == currUser.id) return <></>
          return (
            <div className="currentMemberBox">
              <p>{user.username}</p>
              <button onClick={() => handleRemoveUser(user)}>X</button>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default UsersProjectFormModal;
