import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, withRouter } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import HomePage from './pages/HomePage';
// Components
import { initApp } from 'app/reducers/appState';
import { getScreenWidthAndHeight } from 'app/reducers/responsive';

class HomeView extends Component {
    // constructor(props) {
    //     super(props);

    // }
    // improve ui concern for loading main app container first

    componentDidMount() {
        this.props.initApp();
        this.props.getScreenWidthAndHeight();
        window.addEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {
        this.props.getScreenWidthAndHeight();
    }

    minWidth = () => {
        const { screen_size_type, screen_width } = this.props;
        if( screen_size_type === 'desktop'){
            return {'minWidth':'1200px', 'overflow': 'hidden'};
        } else {
            return {'maxWidth': `${screen_width}px`}
        }
    }
    
    render() {
        const { screen_size_type } = this.props;
        return (
            <div id="outer-container" style={this.minWidth()}>
                <main id="page-wrap">
                    <Route exact path="/" component={HomePage} />
                </main>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    screen_width: state.app.responsive.width,
    screen_size_type: state.app.responsive.type,
});

const mapDispatchToProps = {
    initApp,
    getScreenWidthAndHeight,
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(HomeView)
);
