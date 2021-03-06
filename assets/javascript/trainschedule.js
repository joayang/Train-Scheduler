// Initialize Firebase

  var config = {
    apiKey: "AIzaSyDKR5KQ64XBtNVo2qdcBqgFzrBH_ApQ10E",
    authDomain: "train-scheduler-8e048.firebaseapp.com",
    databaseURL: "https://train-scheduler-8e048.firebaseio.com",
    projectId: "train-scheduler-8e048",
    storageBucket: "train-scheduler-8e048.appspot.com",
    messagingSenderId: "327601177808"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  // Button for adding current train sechedule
  $("#add-train-btn").on("click", function(event){
	  event.preventDefault();
      // Grabs user input
      var trainName = $("#train-input").val().trim();
      var destinationName = $("#destination-input").val().trim();
      var timeStart = moment($("#time-input").val().trim(),"HH:mm").format("X");
      var frequencyRate = $("#frequency-input").val().trim();
      // Create local "temporary" object for holding train data
      var newTrain = {
          name: trainName,
          destination: destinationName,
          start: timeStart,
          frequency: frequencyRate
      };
      // uploads train data to the database
      database.ref().push(newTrain);
      // Logs everything to console
      console.log(newTrain.name);
      console.log(newTrain.destination);
      console.log(newTrain.start);
      console.log(newTrain.frequency);
      // Alert
      // alert("train successgully added");
      // Clears all of the text-boxes
      $("#train-input").val("");
      $("#destination-input").val("");
      $("#time-input").val("");
	  $("#frequency-input").val("");
	  return false;
    });
    //Firebase event for adding train to the database and a row in the html
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

	console.log(childSnapshot.val());

	// Store train info into a variable.
	var trainName = childSnapshot.val().name;
	var destinationName = childSnapshot.val().destination;
	var timeStart = childSnapshot.val().start;
	var frequencyRate = childSnapshot.val().frequency;

	// Train Info
	console.log(trainName);
	console.log(destinationName);
	console.log(timeStart);
	console.log(frequencyRate);

	// First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(timeStart, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequencyRate;
    console.log(tRemainder);

     // Minute Until Train
    var tMinutesTillTrain = frequencyRate - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
    var formattedTime = moment(nextTrain).format("HH:mm");
    // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destinationName),
    $("<td>").text(frequencyRate),
    $("<td>").text(formattedTime),
    $("<td>").text(tMinutesTillTrain)
  );
	// Add each train's data into the table
	$("#train-table > tbody").append(newRow);
});