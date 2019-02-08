import React, { Component } from 'react';
import styled from 'styled-components';

const ClassicButton = styled.button.attrs({
    type: 'button'
})`
    border-radius: 2px;
    text-align: center;
    color: #FFFFFF;
    height: 40px;
    width: 100%;
    border: #2f5c99;
    margin: 0;
    padding: 0 40px;
    background-color: #2f5c99;
    font-size: 15px;
`;

const FacebookLoginButton = ({ label, login }) => 
	<ClassicButton onClick={response => {
        FB.login(response => {
            if (response.authResponse) {
                // window.console.warn('Facebook Login: ', response);
                const { authResponse: { accessToken, userID } } = response;
                if (accessToken && userID) {
                    login({
                        facebookId: userID,
                        facebookToken: accessToken,
                    });   
                }
            }
        }, {
            scope: 'email, user_likes',
            return_scopes: true,
        });
    }}>
		<span>{label || '以Facebook帳戶登入'}</span>
	</ClassicButton>;

export { FacebookLoginButton };
