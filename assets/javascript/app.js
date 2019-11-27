var newTrain;
var trainName;
var destination;
var initialTime;
var frequency;

$(document).ready(function() {

    var firebaseConfig = {
        apiKey: "AIzaSyCnvg2ABEJ2es37nQTiIKAnNU0sMHDh73M",
        authDomain: "mike-project-1-f8d15.firebaseapp.com",
        databaseURL: "https://mike-project-1-f8d15.firebaseio.com",
        projectId: "mike-project-1-f8d15",
        storageBucket: "mike-project-1-f8d15.appspot.com",
        messagingSenderId: "373285047978",
        appId: "1:373285047978:web:e9da5808ac8c865a290ad3",
        measurementId: "G-PZ9E4MBMNR"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);

      var database = firebase.database();

    database.ref().on("child_added", function(snapshot) {
        
        var trName = snapshot.val().trainName;
        var trDest = snapshot.val().destination;
        var trFreq = parseInt(snapshot.val().frequency);
        var trArr = snapshot.val().trainTime;

        var convertedTime = moment(trArr,"HH:mm").subtract(1,"years");
        var timeDiff = moment().diff(moment(convertedTime),"minutes");
        var timeApart = timeDiff % trFreq;

        var minutesToArrival = trFreq - timeApart;
        var nextTrain = moment().add(minutesToArrival,"minutes");

        console.log(snapshot.key);

        newTrain = $("<tr>").append(
            $("<td>").text(trName),
            $("<td>").text(trDest),
            $("<td>").text(trFreq),
            $("<td>").text(nextTrain.format("hh:mm a")),
            $("<td>").text(minutesToArrival).attr("id","arrival")
        );
        newTrain.attr("id",snapshot.key);

        $("#data-train").append(newTrain)

    // If any errors are experienced, log them to console.
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    });

        
    $("#btn-submit").on("click", function() {

        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        trainTime = $("#trainTime").val().trim();
        frequency = $("#frequency").val().trim();

        newTrain = {
            trainName,
            destination,
            trainTime,
            frequency
        }

        database.ref().push(newTrain);
    });


});