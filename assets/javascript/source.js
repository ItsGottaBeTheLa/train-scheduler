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
var trainNumber;
var trainLine;
var trainDestination;
var trainDeparture;
var nextTrain;
var minutesAway;
var trainFrequency;
var trainTiming;
var trainPlatform;
var currentTime = moment().format();
console.log('CURRENT TIME:' + moment(currentTime).format('hh:mm:ss A'));

//Model object with functions for pulling/pushing new data
var model = {
    pushNewTrain: () => {
        database.ref().push({
            trainDeparture: trainDeparture,
            trainDestination: trainDestination,
            trainFrequency: trainFrequency,
            trainLine: trainLine,
            trainNumber: trainNumber,
            trainPlatform: trainPlatform,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        model.pullChildFromDatabase();
    },
    pullChildFromDatabase: () => {
        var filter = database.ref().orderByChild('dateAdded').limitToLast(1)
        filter.once('child_added', function(childSnapshot){
            trainNumber = childSnapshot.val().trainNumber
            trainLine = childSnapshot.val().trainLine
            trainDestination = childSnapshot.val().trainDestination
            trainDeparture = childSnapshot.val().trainDeparture
            trainFrequency = childSnapshot.val().trainFrequency
            trainPlatform = childSnapShot.val().trainPlatform
            console.log(trainNumber, trainLine, trainDestination, trainDeparture, trainFrequency, trainPlatform)
            view.updateTrainScheduleTable();
        });
    },
    initialDatabasePull: () => {
        database.ref().on("value", function(snapshot){
            var trains = snapshot.val();
            console.log(trains);
            $('#train-schedule-body').empty();
            for (var index in trains){
                trainNumber = trains[index].trainNumber
                trainLine = trains[index].trainLine
                trainDestination = trains[index].trainDestination
                trainDeparture = trains[index].trainDeparture
                trainFrequency = trains[index].trainFrequency
                trainPlatform = trains[index].trainPlatform
                controller.nextArrival();
                controller.minutesAway();
                view.updateTrainScheduleTable();
            };
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        
        });
    }
};
//Controller object
let controller = {
    captureFormFields: () => {
        $('body').on("click", ".button-add", () => {
            event.preventDefault();
            trainNumber = $('#train-number').val().trim();
            trainLine = $('#train-line').val().trim();
            trainDestination = $('#train-destination').val().trim();
            trainDeparture = $('#train-departure').val().trim();
            trainFrequency = $('#train-frequency').val().trim();
            trainPlatform = $('#train-platform').val().trim();
            //checking entries in console.log
            console.log(trainNumber)
            console.log(trainLine)
            console.log(trainDestination)
            console.log(trainDeparture)
            console.log(trainFrequency)
            console.log(trainDeparture)
            controller.nextArrival();
            controller.minutesAway();
            //Clear Forms
            $('.form-control').val("");
            model.pushNewTrain();
        });
    },
    //Time Calculation functions
    nextArrival: () => {
        var trainDepartureCoverted = moment(trainDeparture, "hh:mm").subtract(1, 'years');
        var currentTime = moment();
        var diffTime = moment().diff(moment(trainDepartureCoverted), "minutes");
        var timeRemainder = diffTime % trainFrequency;
        var timeInMinutesTillTrain = trainFrequency - timeRemainder;
        nextTrain = moment().add(timeInMinutesTillTrain, 'minutes');
        nextTrain = moment(nextTrain).format('h:mm A');
    },
    minutesAway: () => {
        var trainDepartureCoverted = moment(trainDeparture, "hh:mm").subtract(1, 'years');
        var currentTime = moment();
        var diffTime = moment().diff(moment(trainDepartureCoverted), "minutes");
        var timeRemainder = diffTime % trainFrequency - timeRemainder;
        minutesAway = trainFrequency - timeRemainder;
        minutesAway = moment(minutesAway).format('hh:mm');
    },
    convertFrequency: () => {
        trainFrequency = moment().startOf('day').add(trainFrequency, 'minutes').format('hh:mm')
    }
};
$(document).ready(function(){
    controller.captureFormFields();
    model.initialDatabasePull();
    setInterval(function(){model.initialDatabasePull}, 60000);
    view.updateCurrentTime();
    setInterval(function(){view.updateCurrentTime}, 1000);
});
var view = {
    updateTrainScheduleTable: () => {
        controller.convertFrequency();
        $('#train-schedule-body').append(
            '<tr>'+
                '<th schope ="row">' + trainNumber + '</th>' +
                '<td>' + trainLine + '</td>' +
                '<td>' + trainDestination + '</td>' +
                '<td>' + nextTrain + '</td>' +
                '<td>' + minutesAway + '</td>' +
                '<td>' + trainFrequency + '</td>' +
                '<td>' + trainPlatform + '</td>' +
            '</tr>'
        );
    },
    updateCurrentTime: () => {
        $('.currentTime').text(moment().format('h:mm:ss A'))
    }
};