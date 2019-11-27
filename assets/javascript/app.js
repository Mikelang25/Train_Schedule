var newTrain;
var trainName;
var destination;
var initialTime;
var frequency;
var trainUpdating = false;
var updateRecord;

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

        newTrain = $("<tr>").append(
            $("<td>").text(trName).addClass("train-name"),
            $("<td>").text(trDest).addClass("train-destination"),
            $("<td>").text(trFreq).addClass("frequency"),
            $("<td>").text(nextTrain.format("hh:mm a")).addClass("nextTrain"),
            $("<td>").text(minutesToArrival).addClass("arrival"),
            $("<td>").html("<button class='delete'>Delete</button>"),
            $("<td>").html("<button class='update'>Update</button>")
        );
        newTrain.attr("id",snapshot.key);

        $("#data-train").append(newTrain)

    // If any errors are experienced, log them to console.
    }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    });

        
    $("#btn-submit").on("click", function() {

        if(trainUpdating === true){
            database.ref().child(updateRecord).remove();
        } 

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
        trainUpdating = false;
    });



    //find the parent element two levels up from the button and removes it from the table 
    function removeTrain(){
        console.log($(this).parent().parent().attr("id"));
        var trainSelect = $(this).parent().parent().attr("id")
        $("#"+trainSelect).remove();
        database.ref().child(trainSelect).remove();
    }


    function updateTrain(){
        trainUpdating = true;
        $("#trainName").val($(this).parent().parent().children(".train-name").text());
        $("#destination").val($(this).parent().parent().children(".train-destination").text());
        $("#frequency").val($(this).parent().parent().children(".frequency").text());
        $("#trainTime").val($(this).parent().parent().children(".nextTrain").text());
        updateRecord = $(this).parent().parent().attr("id");
        return updateRecord;
    }


    $(document).on("click", ".delete", removeTrain);
    $(document).on("click", ".update", updateTrain);


});