import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import App from './App';
import Home from 'keystone/admin/client/App/screens/Home';
import Item from 'keystone/admin/client/App/screens/Item';
import List from 'keystone/admin/client/App/screens/List';

import store from 'keystone/admin/client/App/store';


// Sync the browser history to the Redux store
const history = syncHistoryWithStore(browserHistory, store);

// Initialise Keystone.User list
import { listsByKey } from 'keystone/admin/client/utils/lists';

Keystone.User = listsByKey[Keystone.userList];

const Root = () =>
    <Provider store={store}>
        <Router key={module.hot && new Date()} history={history}>
            <Route path={Keystone.adminPath} component={App}>
                <IndexRoute component={Home} />
                <Route path=":listId" component={List} />
                <Route path=":listId/:itemId" component={Item} /> */}
            </Route>
        </Router>
    </Provider>;

export default Root;
