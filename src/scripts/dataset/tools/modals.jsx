// dependencies -------------------------------------------------------

import React          from 'react';
import Reflux         from 'reflux';
import Share          from './share.jsx';
import Jobs           from './jobs';
import Publish        from './publish.jsx';
import FileDisplay    from '../dataset.file-display.jsx';
import UpdateWarn     from '../dataset.update-warning.jsx';
import datasetStore   from '../dataset.store';
import datasetActions from '../dataset.actions.js';

let ToolModals = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

    render() {
        let apps        = this.state.apps,
            dataset     = this.state.dataset,
            loadingApps = this.state.loadingApps,
            users       = this.state.users,
            modals      = this.state.modals,
            snapshots   = this.state.snapshots;

        return (
            <div>
                <Share dataset={dataset} users={users} show={modals.share} onHide={datasetActions.toggleModal.bind(null, 'share')}/>
                <Jobs
                    dataset={dataset}
                    apps={apps}
                    loadingApps={loadingApps}
                    snapshots={snapshots}
                    show={modals.jobs}
                    onHide={datasetActions.dismissJobsModal} />
                <Publish
                    dataset={dataset}
                    snapshots={snapshots}
                    show={modals.publish}
                    onHide={datasetActions.toggleModal.bind(null, 'publish')} />
                <FileDisplay
                    file={this.state.displayFile}
                    show={modals.displayFile}
                    onHide={datasetActions.toggleModal.bind(null, 'displayFile')} />
                <UpdateWarn
                    show={this.state.modals.update}
                    onHide={datasetActions.toggleModal.bind(null, 'update')}
                    update={this.state.currentUpdate} />
            </div>
        );
    }

});

export default ToolModals;