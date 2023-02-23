import React from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import { login } from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const handleDemo = async () => {
    await dispatch(login('demo@aa.io', 'password'))
    await history.push('/home')
  }

  const onSplash = location.pathname == '/splash';

	return (
		<div className='NavBar'>
      { !onSplash &&
        <NavLink exact to="/home">Home</NavLink>
      }
      { onSplash &&
        <NavLink exact to="/splash">Home</NavLink>
      }
      {!sessionUser && (
        <button className='demoButton' onClick={handleDemo}>Try Demo</button>
      )}
			{isLoaded && (
					<ProfileButton user={sessionUser} />
			)}
		</div>
	);
}

export default Navigation;
