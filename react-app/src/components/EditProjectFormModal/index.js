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

  let date;

  if (project.due_date != null) {
    date = project.due_date
    // add 8 hours
    date = new Date(date)
    date.setHours(date.getHours()+8)
    // format date
    let year = date.getFullYear()
    let month = ('0'+ (date.getMonth()+1)).slice(-2)
    let day = ('0'+ date.getDate()).slice(-2)
    date = `${year}-${month}-${day}`
    // set date
  }
  const [dueDate, setDueDate] = useState(date);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const editedProject = {}
    if (name) editedProject.name = name;
    if (description) editedProject.description = description;
    if (dueDate) editedProject.due_date = dueDate;

    const data = await dispatch(thunkEditProject(editedProject, project.id));

    if (data.errors) {
      setErrors(data.errors);
    } else {
        closeModal()
    }
  };

  return (
    <div className="editProjectBox">
      <h1>Edit Project</h1>
      <form onSubmit={handleSubmit} className="editProjectForm">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx} className="errorText">{error}</li>
          ))}
        </ul>
        <div>
          <label for="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            placeholder="Name"
            maxLength={25}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label for="description">
            Description (optional)
          </label>
          <textarea
            type="textarea"
            id="description"
            value={description}
            placeholder="Description"
            maxLength={250}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label for="dueDate">
            Due Date (optional)
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button type="submit" className="cleanButton">Submit</button>
      </form>
    </div>
  );
}

export default EditProjectFormModal;
