import './SplashPage.css'
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from '../../store/session';

function SplashPage() {

  const sessionUser = useSelector(state => state.session.user);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleDemo = async () => {
    await dispatch(login('demo@aa.io', 'password'))
    await history.push('/home')
  }

  return (
    <div className='splashBackground'>
      <h1>Splash Page</h1>
      {!sessionUser && (
        <button className='demoButton cleanButton' onClick={handleDemo}>Try Demo</button>
      )}
    </div>
  )
}

export default SplashPage;
