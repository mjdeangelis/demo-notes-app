import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import LoaderButton from './LoaderButton';
import { onError } from '../lib/errorLib';

interface FacebookButtonProps {
  onLogin: any;
}

function waitForInit() {
  return new Promise<void>((res, rej) => {
    const hasFbLoaded = () => {
      if ((window as any).FB) {
        res();
      } else {
        setTimeout(hasFbLoaded, 300);
      }
    };
    hasFbLoaded();
  });
}

export default class FacebookButton extends React.Component<
  FacebookButtonProps,
  any
> {
  constructor(props: FacebookButtonProps) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  async componentDidMount() {
    await waitForInit();
    this.setState({ isLoading: false });
  }

  statusChangeCallback = (response: any) => {
    if (response.status === 'connected') {
      this.handleResponse(response.authResponse);
    } else {
      this.handleError(response);
    }
  };

  checkLoginState = () => {
    (window as any).FB.getLoginStatus(this.statusChangeCallback);
  };

  handleClick = () => {
    (window as any).FB.login(this.checkLoginState, {
      scope: 'public_profile,email',
    });
  };

  handleError(error: any) {
    onError(JSON.stringify(error));
  }

  async handleResponse(data: any) {
    const { email, accessToken: token, expiresIn } = data;
    const expires_at = expiresIn * 1000 + new Date().getTime();
    const user = { email };

    this.setState({ isLoading: true });

    try {
      const response = await Auth.federatedSignIn(
        'facebook',
        { token, expires_at },
        user as any,
      );
      this.setState({ isLoading: false });
      this.props.onLogin(response);
    } catch (e) {
      this.setState({ isLoading: false });
      this.handleError(e);
    }
  }

  render() {
    return (
      <LoaderButton
        size='lg'
        variant='primary'
        className='FacebookButton'
        onClick={this.handleClick}
        disabled={(this.state as any).isLoading}
      >
        Login with Facebook
      </LoaderButton>
    );
  }
}
