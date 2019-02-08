import assign from 'object-assign';
import classnames from 'classnames';
import React from 'react';
import xhr from 'xhr';

import SigninView from 'keystone/admin/client/Signin/Signin';
import Alert from 'keystone/admin/client/Signin/components/Alert';
import Brand from 'keystone/admin/client/Signin/components/Brand';
import UserInfo from 'keystone/admin/client/Signin/components/UserInfo';
import LoginForm from 'keystone/admin/client/Signin/components/LoginForm';

class CustomedSigninView extends SigninView {
    handleSubmit(e) {
        e.preventDefault();
        // If either password or mail are missing, show an error
        if (!this.state.email || !this.state.password) {
            return this.displayError(
                'Please enter an email address and password to sign in.'
            );
        }

        xhr(
            {
                url: `${Keystone.adminPath}/api/session/signin`,
                method: 'post',
                json: {
                    email: this.state.email,
                    password: this.state.password
                },
                headers: assign({}, Keystone.csrf.header)
            },
            (err, resp, body) => {
                if (err || (body && body.error)) {
                    return body.error === 'invalid csrf'
                        ? this.displayError(
                              'Something went wrong; please refresh your browser and try again.'
                          )
                        : this.displayError(
                              'The email and password you entered are not valid.'
                          );
                }
                // Redirect to where we came from or to the default admin path
                if (Keystone.redirect) {
                    top.location.href = Keystone.redirect;
                } else {
                    top.location.href = this.props.from
                        ? this.props.from
                        : Keystone.adminPath;
                }
            }
        );
    }
    render() {
        const boxClassname = classnames('auth-box', {
            'auth-box--has-errors': this.state.isAnimating
        });
        return (
            <div className="auth-wrapper">
                <Alert
                    isInvalid={this.state.isInvalid}
                    signedOut={this.state.signedOut}
                    invalidMessage={this.state.invalidMessage}
                />
                <div className={boxClassname}>
                    <h1 className="u-hidden-visually">
                        {this.props.brand ? this.props.brand : 'Keystone'} Sign
                        In{' '}
                    </h1>
                    <div className="auth-box__inner">
                        <Brand
                            logo={this.props.logo}
                            brand={this.props.brand}
                        />
                        {this.props.user
                            ? <UserInfo
                                  adminPath={Keystone.adminPath}
                                  signoutPath={`${Keystone.adminPath}/signout`}
                                  userCanAccessKeystone={
                                      this.props.userCanAccessKeystone
                                  }
                                  userName={this.props.user.name.first}
                              />
                            : <LoginForm
                                  email={this.state.email}
                                  handleInputChange={this.handleInputChange}
                                  handleSubmit={this.handleSubmit}
                                  isAnimating={this.state.isAnimating}
                                  password={this.state.password}
                              />}
                    </div>
                </div>
                <div className="auth-footer">
                    <span>Copyright @2016 </span>
                    <a
                        href="http://4d.com.hk"
                        target="_blank"
                        title="Your Enteprise Solution"
                    >
                        Four Directions Limited
                    </a>
                </div>
            </div>
        );
    }
}

export default CustomedSigninView;
