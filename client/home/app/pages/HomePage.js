import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class HomePage extends Component {

    render() {
        return (
            <div>
                Home Page
            </div>
        );
    }
}

const mapStateToProps = state => ({
    screen_size_type: state.app.responsive.type,
});

export default withRouter(
    connect(mapStateToProps)(HomePage)
);
