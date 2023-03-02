import './SplashPage.css'
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from '../../store/session';
import splashPic from './splashPic.jpg'

function SplashPage() {

  const sessionUser = useSelector(state => state.session.user);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleDemo = async () => {
    await dispatch(login('demo@aa.io', 'password'))
    await history.push('/home')
  }

  return (
    <>
    <div className='splashBackground'>
      <div className='leftSplashBox'>
        <h1>The perfect platform for planning your project</h1>
        <div className='smallHr'>
          <hr></hr>
        </div>
        <p>Want to organize your team and stay on top of tasks?
          Do you want to efficiently organize workflow to members of your team?
          Feel like you need a place to plan out and manage all the projects in your life?
        </p>
        <div className='smallHr'>
          <hr></hr>
        </div>
        <p>
          Try out postura and discover a better way to plan tasks, simple, consice, and efficient.
        </p>
        {!sessionUser && (
          <button className='demoButton' onClick={handleDemo}>Try Demo</button>
          )}
      </div>
      <img src={splashPic} className="splashPic"></img>
    </div>
    </>
  )
}

export default SplashPage;
