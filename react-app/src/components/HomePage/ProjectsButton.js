import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { thunkDeleteProject } from "../../store/project";
import EditProjectFormModal from "../EditProjectFormModal";
import { useHistory } from "react-router-dom";
import UsersProjectFormModal from "../UsersProjectFormModal";

function ProjectButton({project}) {

  const dispatch = useDispatch();
  const history = useHistory();
  const ulRef = useRef();

  const [showMenu, setShowMenu] = useState(false);

  const projects = useSelector(state => state.projects)
  const user = useSelector(state => state.session.user)

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const ulClassName = "projectDropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  const handleDeleteProject = async () => {
    await dispatch(thunkDeleteProject(project.id))
  }

  return (
    <div>
      <button onClick={openMenu}><i className="fa-solid fa-gear"/></button>
      <div className={ulClassName} ref={ulRef}>
        {  showMenu &&
        <>
          <OpenModalButton
            buttonText="Manage Members"
            onItemClick={closeMenu}
            className="UsersProjectButton"
            modalComponent={<UsersProjectFormModal project={project}/>}
          />
          <OpenModalButton
            buttonText="Edit Project"
            onItemClick={closeMenu}
            className="EditProjectButton"
            modalComponent={<EditProjectFormModal project={project}/>}
          />
          <button onClick={handleDeleteProject}>Delete</button>
        </>
        }
      </div>
    </div>
  )
}

export default ProjectButton;
