// dependencies ------------------------------------------------------------------

import React      from 'react';
import actions    from './dataset.actions';
import WarnButton from '../common/forms/warn-button.jsx';
import moment     from 'moment';
import FileTree   from '../common/partials/file-tree.jsx';
import {Accordion, Panel} from 'react-bootstrap';

import config     from '../../../config.js';

class JobAccordion extends React.Component {

// life cycle methods ------------------------------------------------------------

    render () {
        let run = this.props.run;

        // if ((run.parameters && Object.keys(run.parameters).length > 0) || (run.results && run.results.length > 0) || (run.logs && run.logs.length > 0)) {
            if (run.results && run.results.length > 0) {
            // header with parameters and/or results
            return (
                <span eventKey={run._id}>
                    <Panel className={run.active ? 'job border-flash' : 'job'} header={this._header(run)}>
                        <span className="inner">
                            {this._parameters(run)}
                            {this._results(run, 'results')}
                            {this._logs(run)}
                        </span>
                    </Panel>
                </span>
            );
        } else {
            // header only
            return (
                <span eventKey={run._id}>
                    <div className="job panel panel-default pending">
                        <div className="panel-heading" >
                            <div className="panel-title ">
                                {this._header(run)}
                            </div>
                        </div>
                        <div className="panel-body">
                            <span className="inner">
                                {this._parameters(run)}
                                {run.analysis.status === 'SUCCEEDED' || run.analysis.status === 'FAILED' ? this._logs(run) : null}
                            </span>
                        </div>
                    </div>
                </span>
            );
        }
    }

// template methods --------------------------------------------------------------

    _header (run) {
        let runBy = run.userId ? <span><br/><label>By </label><strong>{run.userId}</strong></span> : null;
        return (
            <div className={(run && run.analysis) ? run.analysis.status.toLowerCase() : 'pending'}>
                <label>Status</label>
                <span className="badge">
                    {this._status(run.analysis.status)}
                </span><br/>
                <span className="meta">
                    <label>Run on </label><strong>{moment(run.analysis.created).format('L')}</strong> at <strong>{moment(run.analysis.created).format('LT')}</strong>
                    {runBy}
                </span><br/>
                <span className="meta">
                    <label>Job ID</label><strong>{run.analysis.analysisId}</strong>
                </span>
                {this._failedMessage(run)}
            </div>
        );
    }

    _results(run, type) {
        if (run[type] && run[type].length > 0) {
            return (
                <Accordion accordion className="results">
                    <Panel className="fade-in" header={type} key={run._id} eventKey={run._id}>
                        <span className="download-all">
                            <WarnButton
                                icon="fa-download"
                                message=" DOWNLOAD All"
                                prepDownload={actions.getResultDownloadTicket.bind(this, run.snapshotId, run._id, {path:'all-' + type})} />
                        </span>
                        <div className="file-structure fade-in panel-group">
                            <div className="panel panel-default">
                                <div className="panel-collapse" aria-expanded="false" >
                                    <div className="panel-body">
                                        <FileTree
                                            tree={run[type]}
                                            treeId={run._id}
                                            editable={false}
                                            getFileDownloadTicket={actions.getResultDownloadTicket.bind(this, run.snapshotId, run._id)}
                                            displayFile={this.props.displayFile.bind(this, run.snapshotId, run._id)}
                                            toggleFolder={this.props.toggleFolder} />
                                   </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Accordion>
            );
        }
    }

    _parameters(run) {
        if (run.parameters && Object.keys(run.parameters).length > 0) {
            let parameters = [];
            for (let key in run.parameters) {
                if(key === 'participant_label') {
                    run.parameters[key] = run.parameters[key].sort((a,b) => {
                        return a-b;
                    });
                }
                parameters.push(
                    <li key={key}>
                        <span className="key">{key}</span>: <span className="value">{run.parameters[key]}</span>
                    </li>
                );
            }

            return (
                <Accordion accordion className="results">
                    <Panel className="fade-in" header="Parameters" key={run._id} eventKey={run._id}>
                        <ul>{parameters}</ul>
                    </Panel>
                </Accordion>
            );
        }
    }

    _status(status) {
        if (status === 'SUCCEEDED' || status === 'FAILED' || status === 'REJECTED') {
            return status;
        } else {
            return (
                <div className="ellipsis-animation">
                    {status}
                    <span className="one">.</span>
                    <span className="two">.</span>
                    <span className="three">.</span>
                </div>
            );
        }
    }

    _failedMessage(run) {
        if (run.analysis.status === 'FAILED' || run.analysis.status === 'REJECTED') {
            let adminMessage = <span>Please contact the site <a href="mailto:openfmri@gmail.com?subject=Analysis%20Failure" target="_blank">administrator</a> if this analysis continues to fail.</span>;
            let message = run.analysis.message ? run.analysis.message : 'We were unable to complete this analysis.';
            return (
                <div>
                    <h5 className="text-danger">{message} {adminMessage}</h5>
                    <WarnButton
                        icon="fa fa-repeat"
                        message="re-run"
                        warn={false}
                        action={actions.retryJob.bind(this, run._id)} />
                </div>
            );
        }
    }

    _logs(run) {
        let logstreams = [];
        if (run.analysis.hasOwnProperty('logstreams') && run.analysis.logstreams.length > 0) {
            // Group streams by analysis level. If no analysis levels exist (legacy logs) group as "logs"
            let groupedStreams = run.analysis.logstreams.reduce((acc, logstream) => {
                let analysisLevel;
                if(logstream.environment) {
                    analysisLevel = logstream.environment.filter((env) => { return env.name === "BIDS_ANALYSIS_LEVEL" })[0].value;
                } else {
                    analysisLevel = "logs";
                }

                if(!acc[analysisLevel]) {
                    acc[analysisLevel] = [];
                }
                acc[analysisLevel].push(logstream);
                return acc;
            }, {});
            //Generate logstreams jsx grouped by analysis level. How do we want to use exit code?
            Object.keys(groupedStreams).forEach((level) => {
                let streams = groupedStreams[level].map((logstream, index) => {
                    let label, exitCode;
                    if (logstream.environment) {
                        let bidsArgs = logstream.environment.filter((env) => { return env.name === "BIDS_ARGUMENTS" })[0].value;
                        label = bidsArgs;
                    } else {
                        label = "Log #" + (index + 1);
                    }

                    if(typeof logstream.exitCode === 'number') {
                        exitCode = logstream.exitCode;
                    }
                    let exitCodeClass = "exit-code " + (exitCode ? "fail" : ""); // 0 is passing
                    let exit_code;

                    if(exitCode === 0){
                       exit_code =  (<span className="label label-success">SUCCESS</span>);
                    }else{
                        exit_code = (<span><span className="label label-danger">FAIL</span> Exit code {exitCode}</span>);
                    }


                    return (
                        <span className="job-log" key={label}>
                            <WarnButton
                                icon="fa-eye"
                                message={label}
                                warn={false}
                                action={actions.getLogstream.bind(this, logstream.name)} />
                            {exitCode != undefined ? <span className={exitCodeClass}>{exit_code}</span> : null}
                        </span>
                    );
                });
                logstreams.push(<span key={level}>{level.toUpperCase()}{streams}</span>)
            });
        }

        return (
            <Accordion accordion className="results">
                <Panel className="fade-in" header="Logs" key={run._id} eventKey={run._id}>
                    <span className="download-all">
                        <WarnButton
                            icon="fa-download"
                            message=" DOWNLOAD All LOGS"
                            prepDownload={actions.downloadLogs.bind(this, run._id)} />
                    </span>
                    <div className="file-structure fade-in panel-group">
                        <div className="panel panel-default">
                            <div className="panel-collapse" aria-expanded="false" >
                                {logstreams}
                            </div>
                        </div>
                    </div>
                </Panel>
            </Accordion>
        );
    }

}

JobAccordion.propTypes = {
    run: React.PropTypes.object,
    displayFile: React.PropTypes.func,
    toggleFolder: React.PropTypes.func
};

export default JobAccordion;
