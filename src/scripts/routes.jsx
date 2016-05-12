// dependencies ----------------------------------------------------------

import React from 'react';
import {IndexRoute, Route} from 'react-router';
// import requireAuth from './utils/requireAuth';

// views
import Index          from './index.jsx';
import Signin         from './user/signin.jsx';

import Admin          from './admin/admin.jsx';
import Users          from './admin/admin.users.jsx';
import Blacklist      from './admin/admin.blacklist.jsx';

import Dashboard      from './dashboard/dashboard.jsx';
import Notifications  from './dashboard/notifications.jsx';
import Jobs           from './dashboard/jobs.jsx';
import Datasets       from './dashboard/datasets.jsx';
import Dataset        from './dataset/dataset.jsx';


import userStore from './user/user.store.js';

// redirects -------------------------------------------------------------

class RedirectDashboard extends React.Component {
    static willTransitionTo(transition) {
        transition.redirect('dashboard');
    }
}

class RedirectNotifications extends React.Component {
    static willTransitionTo(transition) {
        transition.redirect('datasets');
    }
}

class RedirectUsers extends React.Component {
    static willTransitionTo(transition) {
        transition.redirect('users');
    }
}

// routes ----------------------------------------------------------------

// function requireAuth(nextState, replace) {
//   if (!userStore.data.token) {
//     replace({
//       pathname: 'sign-in',
//       state: { nextPathname: nextState.location.pathname }
//     })
//   }
// }

let requireAuth = (nextState, replace) => {
  if (!userStore.data.token) {
    replace({ nextPathname: nextState.location.pathname }, '/sign-in');
  }
};

// authenticated routes
// Dashboard = requireAuth(Dashboard);
// Admin     = requireAuth(Admin, 'admin');

let routes = (
    <Route path="/" component={Index}>
        <Route path="sign-in" component={Signin}/>
        <Route path="dashboard"  component={Dashboard} onEnter={requireAuth} onLeave={() => {}}>
            <Route path="/datasets" component={Datasets}/>
            <Route path="/notifications" component={Notifications}/>
            <Route path="/jobs" component={Jobs}/>
        </Route>
        <Route path="admin" component={Admin}  onEnter={requireAuth}>
            <Route path="users" component={Users} />
            <Route path="blacklist" component={Blacklist} />
            <Route path="*" component={RedirectUsers}/>
        </Route>
        <Route path="datasets" component={Datasets}/>
        <Route path="datasets/:datasetId" component={Dataset} />
        <Route path="datasets/:datasetId/versions/:snapshotId" component={Dataset} />
        <IndexRoute component={Datasets}/>
        <Route path="*" component={Datasets}/>
    </Route>
);

export default routes;

