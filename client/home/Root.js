import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './app';
import store from './store';

class Root extends Component {
    constructor(props) {
    	super(props);
    	// window.fbAsyncInit = () => {
        //     FB.init({
        //       appId: FB_ID,
        //       xfbml: true,
        //       cookie: true,
        //       version: 'v2.9',
        //     });
        // }

        //   // Load the SDK asynchronously
        // (function(d, s, id) {
        //     var js, fjs = d.getElementsByTagName(s)[0];
        //     if (d.getElementById(id)) return;
        //     js = d.createElement(s); js.id = id;
        //     js.src = `https://connect.facebook.net/zh_HK/sdk.js#xfbml=1&version=v2.9&appId=${FB_ID}&autoLogAppEvents=1`;
        //     fjs.parentNode.insertBefore(js, fjs);
        // }(document, 'script', 'facebook-jssdk'));
    }
    render() {
    	return (
    		<Provider store={store}>
		        <Router>
		            <App />
		        </Router>
		    </Provider>
    	);
    }
}

export default Root;
