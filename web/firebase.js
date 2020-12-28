let  config = {
				apiKey: "***REMOVED***",
				authDomain: "***REMOVED***",
				databaseURL: "***REMOVED***",
				storageBucket: "***REMOVED***",
				messagingSenderId: "***REMOVED***"
			};
			firebase.initializeApp(config);

			// Get a reference to the database service
			var database = firebase.database();