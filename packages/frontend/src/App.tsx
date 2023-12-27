import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';

import './App.css';
import Routes from './Routes';
import { AppContext, AppContextType } from './lib/contextLib';
import { useNavigate } from 'react-router-dom';
import { onError } from './lib/errorLib';
import config from './config';

declare const FB: any;

function App() {
  const nav = useNavigate();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    loadFacebookSDK();
    onLoad();
  }, []);

  function loadFacebookSDK() {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '664350359206277',
        xfbml: true,
        version: 'v18.0',
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      (js as any).src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error) {
      if (error !== 'No current user') {
        onError(error);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    nav('/login');
  }

  return (
    !isAuthenticating && (
      <div className='App container py-3'>
        <Navbar collapseOnSelect bg='light' expand='md' className='mb-3 px-3'>
          <Navbar.Brand className='fw-bold text-muted'>Scratch</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className='justify-content-end'>
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              ) : (
                <>
                  <LinkContainer to='/signup'>
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/login'>
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
