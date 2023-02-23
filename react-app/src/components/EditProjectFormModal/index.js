import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import { thunkEditProject } from "../../store/project";
import "./EditProjectForm.css"

function EditProjectFormModal({project}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

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

    // get date
    const firstDash = dueDate.indexOf('-')
    const year = dueDate.slice(0, firstDash)
    const secondDash = dueDate.indexOf('-', firstDash + 1);
    const month = dueDate.slice(firstDash + 1, secondDash);
    const day = dueDate.slice(secondDash + 1)

    const editedProject = {}
    if (name) editedProject.name = name;
    if (description) editedProject.description = description;
    if (dueDate) editedProject.due_date = `${month}-${day}-${year}`;

    console.log('edited Project:', editedProject)

    let stateI;
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id == project.id) stateI = i;
    }

    const data = await dispatch(thunkEditProject(editedProject, project.id, stateI));

    console.log('data:', data)

    if (data.errors) {
      setErrors(data.errors);
    } else {
        closeModal()
    }
  };

  return (
    <>
      <h1>Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Due Date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default EditProjectFormModal;
