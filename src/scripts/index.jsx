// dependencies --------------------------------------------------------------

import React                    from 'react';
import Navbar                   from './nav/navbar.jsx';
import userActions              from './user/user.actions.js';
import bowser                   from 'bowser';
import Happybrowser             from './common/partials/happybrowser.jsx';
import 'babel-polyfill';

// component setup -----------------------------------------------------------

let App = React.createClass({

// life cycle methods --------------------------------------------------------

    componentDidMount () {
        userActions.initOAuth();
    },

    render () {

        let pageClasses = ' ';
        let routes = this.props.routes;

        for (let route of routes) { pageClasses += route.name + ' '; }
        let is_front        = this.props.history.isActive('signIn');

        return (
            <div className={is_front ? 'page is-front' + pageClasses : 'page' + pageClasses}>
                {!bowser.chrome ?  <Happybrowser /> : null }
                <div className="full-col">
                    <Navbar routes={routes} />
                    <div className="main view container">
                        <div className="route-wrapper">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

export default App;