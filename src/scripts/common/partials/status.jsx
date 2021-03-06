// dependencies --------------------------------------------------------------

import React         from 'react';
import Tooltip       from './tooltip.jsx';
import FileSelect    from '../forms/file-select.jsx';
import actions       from '../../upload/upload.actions';

// component setup -----------------------------------------------------------

export default class Status extends React.Component {

// lifecycle events ----------------------------------------------------------
    render() {
        if (!this.props.display) {return false;}

        let spanClass, tip, iconClass, fileSelect, title;
        let minimal = this.props.minimal;

        switch(this.props.type) {
        case 'public':
            spanClass   = 'dataset-status ds-success';
            tip         = minimal ? 'Viewable to all visitors': null;
            title       = 'Published';
            iconClass   = 'fa fa-globe';
            break;
        case 'incomplete':
            spanClass   = 'dataset-status ds-warning';
            tip         = 'Click resume to try again';
            title       = 'Incomplete';
            iconClass   = 'fa fa-warning';
            fileSelect  = minimal ? <span className="file-wrap clearfix"><FileSelect resume={true} onChange={this._onFileSelect.bind(this)} /></span> : null;
            break;
        case 'shared':
            spanClass   = 'dataset-status ds-info';
            tip         = minimal ? 'Shared with me' : null;
            title       = 'Shared with me';
            iconClass   = 'fa fa-user';
            break;
        case 'inProgress':
            spanClass   = 'dataset-status ds-primary';
            tip         = minimal ? 'Upload in progress' : null;
            title       = 'In progress';
            iconClass   = 'fa fa-spin fa-circle-o-notch';
            break;
        case 'invalid':
            spanClass   = 'dataset-status ds-danger';
            tip         = minimal ? 'Invalid' : null;
            title       = 'Invalid';
            iconClass   = 'fa fa-exclamation-circle';
        }

        let content = (
            <span className="icon-wrap">
                <i className={iconClass}></i>
                {minimal ? null : title}
            </span>
        );

        if (tip) {content = <Tooltip tooltip={tip}>{content}</Tooltip>;}

        return (
            <span className="clearfix status">
                {fileSelect}
                <span>
                    <span className={spanClass}>{content}</span>
                </span>
            </span>
        );
    }

// custom methods ------------------------------------------------------------

    _onFileSelect(files) {
        actions.onResume(files, this.props.dataset.label);
    }

}

Status.propTypes = {
    display: React.PropTypes.bool,
    minimal: React.PropTypes.bool,
    type: React.PropTypes.string,
    dataset: React.PropTypes.object
};


