import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import SplashPage from './components/SplashPage';
import HomePage from './components/HomePage';
import SingleProjectPage from "./components/SingleProjectPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(state => state.session.user);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/projects/:projectId">
            <SingleProjectPage />
          </Route>
          <Route path="/splash">
            <SplashPage />
          </Route>
          <Route path="/">
            { !user &&
             history.push('/splash') }
            { user &&
             history.push('/home')}
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
