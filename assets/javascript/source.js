// Initialize Firebase
var config = {
apiKey: "AIzaSyBA5GUekJHXZV-fDbIrz94EObICJWWqYnI",
authDomain: "train-scheduler-e4b63.firebaseapp.com",
databaseURL: "https://train-scheduler-e4b63.firebaseio.com",
projectId: "train-scheduler-e4b63",
storageBucket: "train-scheduler-e4b63.appspot.com",
messagingSenderId: "1045085780978"
};
firebase.initializeApp(config);

var database = firebase.database();

//Variables to be passed between objects
