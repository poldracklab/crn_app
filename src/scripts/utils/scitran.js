import request  from './request';
import async    from 'async';
import config   from '../config';

/**
 * Scitran
 *
 * A library for interactions with the
 * scitran service.
 */
export default  {

// User Management ------------------------------------------------------------------------

    /**
     * Get Users
     *
     * Gets a list of all users
     */
    getUsers (callback) {
        request.get(config.scitran.url + 'users', {}, callback);
    },

    /**
     * Verify User
     *
     * Checks if the currently logged in users
     * in in the scitran system and returns a
     * user object.
     */
    verifyUser (callback) {
        request.get(config.scitran.url + 'users/self', {}, callback);
    },

    /**
     * Add User
     *
     * Takes an email, first name, and last name
     * add adds the user.
     */
    addUser (userData, callback) {
        request.post(config.scitran.url + 'users', {body: userData}, (err, res) => {
            this.createGroup(userData._id, userData._id, callback);
        });
    },

    /**
     * Update User
     *
     *
     */
    updateUser (userId, userData, callback) {
        request.put(config.scitran.url + 'users/' + userId, {body: userData}, (err, res) => {
            callback(err, res);
        });
    },

    /**
     * Remove User
     *
     * Takes a userId and removes the user.
     */
     removeUser (userId, callback) {
        request.del(config.scitran.url + 'users/' + userId, (err, res) => {
            callback(err, res);
        });
     },

// Create ---------------------------------------------------------------------------------

    /**
     * Create Group
     *
     * Takes a groupName and a userId and
     * creates a group with that user as the
     * admin.
     */
    createGroup (groupName, userId, callback) {
        let body = {
            _id: groupName,
            roles: [{access: 'admin', _id: userId}]
        };
        request.post(config.scitran.url + 'groups', {body: body}, callback);
    },

    /**
     * Create Project
     *
     * Takes a request body and
     * generates a request to make a project in scitran.
     */
    createProject (body, callback) {
        request.post(config.scitran.url + 'projects', {body: body}, callback);
    },

    /**
     * Create Subject
     *
     */
    // createSubject (projectId, subjectName, callback) {
    //     let body = {label: subjectName, subject_code: 'subject'};
    //     request.post(config.scitran.url + 'projects/' + projectId + '/sessions', {body: body}, callback);
    // },

    createSubject (projectId, subjectName, callback) {
        request.post(config.scitran.url + 'sessions', {
            body: {
                project: projectId,
                label: subjectName,
                metadata: {
                    parentContainerType: 'projects',
                    parentId: projectId
                }
            }
        }, callback);
    },

    /**
     * Create Session
     *
     */
    // createSession (projectId, subjectId, sessionName, callback) {
    //     let body = {label: sessionName, subject_code: subjectId};
    //     request.post(config.scitran.url + 'projects/' + projectId + '/sessions', {body: body}, callback);
    // },

    createSession (projectId, subjectId, sessionName, callback) {
        request.post(config.scitran.url + 'sessions', {
            body: {
                project: projectId,
                label: sessionName,
                metadata: {
                    parentContainerType: 'sessions',
                    parentId: subjectId
                }
            }
        }, callback);
    },

    /**
     * Create Modality
     *
     */
    // createModality (sessionId, modalityName, callback) {
    //     let body = {label: modalityName, datatype: 'modality'};
    //     request.post(config.scitran.url + 'sessions/' + sessionId + '/acquisitions', {body: body}, callback);
    // },
    createModality (sessionId, modalityName, callback) {
        request.post(config.scitran.url + 'acquisitions', {
            body: {
                session: sessionId,
                label: modalityName
            }
        }, callback);
    },

    /**
     * Add Tag
     */
    addTag (containerType, containerId, tag, callback) {
        request.post(config.scitran.url + containerType + '/' + containerId + '/tags', {
            body: {value: 'incomplete'}
        }, callback);
    },

// Read -----------------------------------------------------------------------------------

    /**
     * Get Projects
     *
     */
    getProjects (authenticate, callback) {
        request.get(config.scitran.url + 'projects', {auth: authenticate}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Project
     *
     */
    getProject (projectId, callback) {
        request.get(config.scitran.url + 'projects/' + projectId, {}, (err, res) => {
            callback(res);
        });
    },

    /**
     * Get Sessions
     *
     */
    getSessions (projectId, callback) {
        request.get(config.scitran.url + 'projects/' + projectId + '/sessions', {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Session
     *
     */
    getSession (sessionId, callback) {
        request.get(config.scitran.url + 'sessions/' + sessionId, {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Acquisitions
     *
     */
    getAcquisitions (sessionId, callback) {
        request.get(config.scitran.url + 'sessions/' + sessionId + '/acquisitions', {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get Acquisition
     *
     */
    getAcquisition (acquisitionId, callback) {
        request.get(config.scitran.url + 'acquisitions/' + acquisitionId, {}, (err, res) => {
            callback(res.body);
        });
    },

    /**
     * Get File
     *
     */
    getFile (level, id, filename, callback) {
        request.get(config.scitran.url + level + '/' + id + '/file/' + filename, {}, callback);
    },

    /**
     * Get Download Ticket
     *
     */
    getDownloadTicket (level, id, filename, callback) {
        request.get(config.scitran.url + level + '/' + id + '/files/' + filename, {
            query: {ticket: ''}
        }, callback);
    },

    /**
     * Get BIDS Download Ticket
     *
     */
    getBIDSDownloadTicket (projectId, callback) {
        request.post(config.scitran.url + 'download', {
            query: {format: 'bids'},
            body: {
                nodes:[
                    {_id: projectId, level: 'project'}
                ],
                optional: false
            }
        }, callback);
    },

// Delete ---------------------------------------------------------------------------------

    /**
     * Delete Container
     *
     */
    deleteContainer (type, id, callback) {
        request.del(config.scitran.url + type + '/' + id, (err, res) => {
            callback();
        });
    },

    /**
     * Delete File
     *
     */
    deleteFile (level, containerId, filename, callback) {
        request.del(config.scitran.url + level + '/' + containerId + '/files/' + filename, callback);
    },

// Update ---------------------------------------------------------------------------------

    /**
     * Update Project
     *
     */
    updateProject (projectId, body, callback) {
        request.put(config.scitran.url + 'projects/' + projectId, {body}, (err, res) => {
            callback(err, res);
        });
    },

    /**
     * Update Note
     *
     * Takes a projectId and a note object and
     * upserts the note.
     */
    updateNote (projectId, newNote, callback) {
        let req = {projectId, newNote, callback};
        if (this.noteRequests > 0) {
            this.noteQueue.push(req);
        } else {
            this.noteRequest(req);
        }
    },

    /**
     * Update File
     *
     */
    updateFile (level, id, file, callback) {
        request.post(config.scitran.url + level + '/' + id + '/file/' + file.name, {
            body: file,
            query: {force: true}
        }, callback);
    },

    /**
     * Update File From String
     *
     */
    updateFileFromString (level, id, filename, value, callback) {
        request.post(config.scitran.url + level + '/' + id + '/file/' + filename, {
            body: value,
            query: {force: true}
        }, callback);
    },

    noteQueue: [],
    noteRequests: 0,

    noteRequest(req) {
        this.noteRequests++;
        this.getProject(req.projectId, (res) => {
            let notes = [];
            let currentNotes = res.body.notes ? res.body.notes : [];
            let noteExists   = false;
            for (let currentNote of currentNotes) {
                if (currentNote.author === req.newNote.author) {
                    noteExists = true;
                    notes.push(req.newNote);
                } else {
                    notes.push(currentNote);
                }
            }
            if (!noteExists) {
                notes.push(req.newNote);
            }
            this.updateProject(req.projectId, {notes: notes}, (err, res) => {
                if (req.callback) {req.callback(res);}
                this.noteRequests--;
                if (this.noteQueue.length > 0) {
                    this.noteRequest(this.noteQueue[0]);
                    this.noteQueue.shift();
                }
            });
        });
    }


};