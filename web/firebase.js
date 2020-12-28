let  config = {
				apiKey: "AIzaSyBPw5M8xysbk6oJo-9VNh_LpXd_Xhf1Ts0",
				authDomain: "myfirstproject-8ceb7.firebaseapp.com",
				databaseURL: "https://myfirstproject-8ceb7.firebaseio.com",
				storageBucket: "gs://myfirstproject-8ceb7.appspot.com",
				messagingSenderId: "1091552206789"
			};
			firebase.initializeApp(config);

			// Get a reference to the database service
			var database = firebase.database();