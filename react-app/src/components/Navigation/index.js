import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import { login } from '../../store/session';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleDemo = () => {
    dispatch(login('demo@aa.io', 'password'))
    history.push('/home')
  }

	return (
		<ul>
			<li>
				<NavLink exact to="/">Home</NavLink>
			</li>
			{isLoaded && (
				<li>
					<ProfileButton user={sessionUser} />
				</li>
			)}
      {!sessionUser && (
        <li>
          <button className='demoButton' onClick={handleDemo}>Try Demo</button>
        </li>
      )}
		</ul>
	);
}

export default Navigation;
