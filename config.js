/**
 * Configuration
 */
export default {

		/**
		 * Scitran
		 */
		scitran: {
			url: process.env.CRN_SERVER_URL + '/api/'
		},

		/**
		 * CRN
		 */
		crn: {
			url: process.env.CRN_SERVER_URL + '/crn/'
		},

		/**
		 * Authentication
		 */
		auth: {
			google: {
				clientID: process.env.SCITRAN_AUTH_CLIENT_ID
			}
		},

		/**
		 * Upload
		 */
		upload: {

			/**
			 * Filenames ignored during upload.
			 */
			blacklist: [
			    '.DS_Store',
			    'Icon\r'
			]
		},

		/**
		* AWS configuration
		*/
		aws: {
			batch: {
				vcpusMax: 4,
				memoryMax: 15360
			}
		},

		analytics: {
			trackingId: process.env.GOOGLE_TRACKING_ID
		}
};
