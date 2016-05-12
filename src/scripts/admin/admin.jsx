// dependencies -------------------------------------------------------

import React          from 'react';
import {Link}         from 'react-router';
import BlacklistModal from './admin.blacklist.modal.jsx';
import actions        from './admin.actions';

class Dashboard extends React.Component {

// life cycle events --------------------------------------------------

    componentDidMount() {
        actions.getBlacklist();
        actions.getUsers();
        actions.update({showBlacklistModal: false});
    }

    render () {
        return (
            <div className="inner-route clearfix">
                <div className="col-xs-12">
                    <ul className="nav nav-pills tabs">
                        <li><Link to="/admin/users" className="btn-tab">Users</Link></li>
                        <li><Link to="/admin/blacklist" className="btn-tab">Blocked Users</Link></li>
                    </ul>
                    {this.props.children}
                </div>
                <BlacklistModal />
            </div>
        );
    }

}

export default Dashboard;





