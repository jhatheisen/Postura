import React from 'react';
import { NavLink, useHistory, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){

  const sessionUser = useSelector(state => state.session.user);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const onSplash = location.pathname == '/splash';

	return (
		<div className='NavBar'>
      { !onSplash &&
        <NavLink exact to="/home"><img src={process.env.PUBLIC_URL + "/logo-no-background.png"} className="logo"></img></NavLink>
      }
      { onSplash &&
        <NavLink exact to="/splash"><img src={process.env.PUBLIC_URL + "/logo-no-background.png"} className="logo"></img></NavLink>
      }
      <div className='about'>
      <p>Created By: Jhass Theisen</p>
      <a target='_blank' href="https://github.com/jhatheisen"><i className="fa-brands fa-github fa-xl"/> Github</a>
      <a target='_blank' href="https://www.linkedin.com/in/jhass-theisen-a92863202/"><i className="fa-brands fa-linkedin fa-xl"/> LinkedIn</a>
      </div>
			{isLoaded && (
					<ProfileButton user={sessionUser} />
			)}
		</div>
	);
}

export default Navigation;
