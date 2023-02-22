import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { NavLink } from 'react-router-dom';
import { thunkGetUserProjects } from '../../store/project';
import CreateProjectFormModal from '../CreateProjectFormModal';
import OpenModalButton from '../OpenModalButton';
import './HomePage.css'

function HomePage() {

  const dispatch = useDispatch();
  const ulRef = useRef();

  const userProjects = useSelector(state => state.projects);
  const user = useSelector(state => state.session.user);
  const [showMenu, setShowMenu] = useState(false);

  // const openMenu = () => {
  //   if (showMenu) return;
  //   setShowMenu(true);
  // };

  useEffect(() => {
    dispatch(thunkGetUserProjects());

    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  },[showMenu, dispatch])

  const closeMenu = () => setShowMenu(false);

  if (!userProjects) return null;

  const today = new Date()
  const dayWeek = today.toLocaleString('en-us', {  weekday: 'long' });
  const month = today.toLocaleString('en-us', {  month: 'long' });

  return (
    <div className='homePage'>
      <h2>{dayWeek}, {month} {today.getUTCDate()}</h2>
      <h1>Hello, {user.username}</h1>
      <div className='allProjectsBox'>
        <OpenModalButton
          buttonText="Create Project"
          onItemClick={closeMenu}
          className="CreateProjectButton"
          modalComponent={<CreateProjectFormModal/>}
        />
        {
          userProjects.map(project => (
            <div className='projectBox'>
              <NavLink exact to={`/projects/${project.id}`}>{project.name}</NavLink>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default HomePage;
