import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkEditProject } from "../../store/project";
import "./UsersProjectForm.css"
import { thunkGetUsers } from "../../store/session";

function UsersProjectFormModal({project}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState();
  const [description, setDescription] = useState(project.description);

  useEffect(() => {
   dispatch(thunkGetUsers())
  },[])

  const projects = useSelector(state => state.projects)

  let date = project.due_date
  // add 8 hours
  date = new Date(date)
  date.setHours(date.getHours()+8)
  // format date
  let year = date.getFullYear()
  let month = ('0'+ (date.getMonth()+1)).slice(-2)
  let day = ('0'+ date.getDate()).slice(-2)
  date = `${year}-${month}-${day}`
  // set date
  const [dueDate, setDueDate] = useState(date);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await dispatch();

    console.log('data:', data)

    if (data.errors) {
      setErrors(data.errors);
    } else {
        closeModal()
    }
  };

  return (
    <div className="membersModal">
      <h1>Manage Users</h1>
      <hr/>
      <form onSubmit={handleSubmit}>
        <h2>Invite by Email</h2>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UsersProjectFormModal;
