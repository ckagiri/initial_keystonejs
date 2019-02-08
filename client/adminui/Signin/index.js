import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Signin from './Signin';

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Component
                brand={Keystone.brand}
                from={Keystone.from}
                logo={Keystone.logo}
                user={Keystone.user}
                userCanAccessKeystone={Keystone.userCanAccessKeystone}
            />
        </AppContainer>,
        document.getElementById('signin-view')
    );
};

render(Signin);

if (module.hot) {
    module.hot.accept('./Signin', () => {
        render(Signin);
    });
}
