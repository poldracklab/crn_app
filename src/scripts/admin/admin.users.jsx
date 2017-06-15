// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import userStore  from '../user/user.store';
import Input      from '../common/forms/input.jsx';
import Spinner    from '../common/partials/spinner.jsx';
import adminStore from './admin.store';
import actions    from './admin.actions';
import WarnButton from '../common/forms/warn-button.jsx';
import moment     from 'moment';

let users = React.createClass({

    mixins: [Reflux.connect(adminStore)],

// life cycle events --------------------------------------------------

    render () {
        let users = [];
        this.state.users.map((user) => {
            let adminBadge = user.root ? 'Admin' : null;
            if (user.visible){
                users.push(
                    <div className="fade-in user-panel clearfix panel panel-default" key={user._id}>
                        <div className="col-xs-4 user-col">
                            <h3>
                                <div className="userName">
                                    <span>{user.firstname}</span> &nbsp;
                                    <span>{user.lastname}</span>
                                    <div className="badge">{adminBadge}</div>
                                </div>
                            </h3>
                        </div>
                        <div className="col-xs-4 user-col middle">
                            <h3 className="user-email">{user._id}</h3>
                        </div>
                        {this._userTools(user)}
                        {this._userSummary(user)}
                    </div>
                );
            }
        });

        return (
            <div className="dashboard-dataset-teasers fade-in admin-users clearfix">
                <div className="header-wrap clearfix">
                    <div className="col-sm-9">
                        <h2>Current Users</h2>
                    </div>
                    <div className="col-sm-3">
                        <Input className="pull-right" placeholder="Search Name or Email" onChange={this._searchUser} />
                    </div>
                </div>

                <div className="filters-sort-wrap clearfix">
                    <span>
                        <div className="filters">
                            <label>Filter By:</label>
                            <button className={this.state.adminFilter ? 'active' : null} onClick={actions.filterAdmin}>
                                <span className="filter-admin">
                                    <i className={this.state.adminFilter ? 'fa fa-check-square-o' : 'fa fa-square-o' }></i> Admin
                                </span>
                            </button>
                        </div>
                    </span>
                </div>

                <div>
                    <div className="col-xs-12 users-panel-wrap">
                            <div className="fade-in user-panel-header clearfix" >
                            <div className="col-xs-4 user-col"><label>User</label></div>
                            <div className="col-xs-4 user-col"><label>Email</label></div>
                            <div className="col-xs-4 user-col"><label>Actions</label></div>
                        </div>
                        {users.length != 0 ? users : this._noResults()}
                    </div>
                </div>
            </div>
        );
    },

// custom methods -----------------------------------------------------

    _noResults(){
        return this.state.loadingUsers ? <Spinner active={true} /> : <h4>No Results Found</h4>;
    },

    _userSummary(user) {
        const lastLogin = moment(user.lastlogin ? (user.lastlogin) : user.created);
        const created   = moment(user.created);
        return (
            <div className="panel-heading">
                <div className="minimal-summary">
                    <div className="summary-data">
                        <span><b>Signed Up:</b> {created.format('L')} - {created.fromNow(true)} ago</span>
                    </div>
                    <div className="summary-data">
                        <span><b>Last Signed In:</b> {lastLogin.format('L')} - {lastLogin.fromNow(true)} ago</span>
                    </div>
                </div>
            </div>
        );
    },

    _userTools(user) {
        let adminIcon = user.root ? 'fa-check-square-o' : 'fa-square-o';

        if (user._id !== userStore.data.scitran._id) {
            return (
                <div className="col-xs-4 last dataset-tools-wrap-admin">
                    <div className="tools clearfix">
                        <div className="tool">
                            <WarnButton message='Admin'
                                        icon={adminIcon}
                                        action={actions.toggleSuperUser.bind(this, user)}/>
                        </div>
                        <div className="tool">
                            <WarnButton message='Block'
                                        icon='fa-ban'
                                        warn={false}
                                        action={actions.blacklistModal.bind(this, user)}/>
                        </div>
                    </div>
                </div>
            );
        }
    },

    _newUserError() {
        return this.state.newUserError ? <div className="alert alert-danger">{this.state.newUserError}</div> : null;
    },

    _inputChange(e) {
        actions.inputChange('newUserForm', e.target.name, e.target.value);
    },

    _searchUser(e) {
        actions.searchUser(e.target.value);
    }

});

export default users;