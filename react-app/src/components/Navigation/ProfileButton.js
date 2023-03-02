import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useHistory } from "react-router-dom";
import { login } from "../../store/session";

function ProfileButton({ user }) {
  const sessionUser = useSelector(state => state.session.user);

  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    closeMenu()
    history.push('/splash')
  };

  const handleDemo = async () => {
    await dispatch(login('demo@aa.io', 'password'))
    await history.push('/home')
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <div >
      <button onClick={openMenu} className="profileButton flexRow">
        { !sessionUser && <h3>Get Started</h3>}
        <i className="fas fa-user-circle fa-3x" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="userDetails flexCol">
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={handleLogout} className="cleanButton">Log Out</button>
            </li>
          </div>
        ) : (
          <div className="flexCol">
            <div>
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              className="cleanButton"
            />
            <i className='fa-solid fa-right-to-bracket'></i>
            </div>
            <div>
            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              className="cleanButton"
            />
            <i className="fa-solid fa-user-plus"></i>
            </div>
            {!sessionUser && (
              <button className='demoButton cleanButton' onClick={handleDemo}>Try Demo</button>
            )}
          </div>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
