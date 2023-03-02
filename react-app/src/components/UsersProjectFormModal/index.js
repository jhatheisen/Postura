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
  const [loadPage, setLoadPage] = useState(false)
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(thunkGetUsers())
    dispatch(thunkGetProject(project.id))

    return () => {
      setErrors([])
      setLoadPage(false)
    }
  },[dispatch, loadPage])

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
      setLoadPage(true)
    }
  };

  const handleRemoveUser = async (user) => {

    const data = await dispatch(thunkRemoveUser(project.id, user.id));

    if (data.errors) {
      setErrors(data.errors);
    }
    else {
      setEmail("")
      setLoadPage(true)
    }
  }

  if (!projectDetails) return null

  return (
    <div className="membersBox">
      <h1>Manage Members</h1>
      <hr/>
      <h2>Invite by Email</h2>
      <form onSubmit={handleSubmit} className="membersForm">
        <div className="flexCol">
          <label for="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@email.com"
            required
            />
        </div>
        <button type="submit" className="cleanButton">Submit</button>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx} className="errorText">{error}</li>
          ))}
        </ul>
      </form>
      <hr/>
      <h2>Current Members</h2>
        <div className="allMembers">
          {projectDetails.users.map(user => {
            if (user.id == currUser.id) return <></>
            return (
              <div className="currentMemberBox">
                <i class="fa-solid fa-circle-user fa-2x"></i>
                <p>{user.username}</p>
                <button onClick={() => handleRemoveUser(user)} className="cleanButton"><i class="fa-solid fa-trash fa-xl"></i></button>
              </div>
            )
          })}
          { projectDetails.users.length <= 1 && (
            <h3>No members for project :(</h3>
          )}
        </div>
    </div>
  );
}

export default UsersProjectFormModal;
