//Function for initialising the map
function initMap() {

	// The location of Paris
	const paris = {lat: 48.8566, lng: 2.3522};

	// The map, centered at Paris
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: paris,
	});

	// Adds marker position at Paris
	const marker = new google.maps.Marker({
		position: paris,
		map: map,
	});
}

//function for counting down an hour
function countDown() {

	var countDownDate = new Date().getTime() + 3600000;

	// Update the count down every 1 second
	var x = setInterval(function() {

    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    document.getElementById("stopwatch").innerHTML = minutes + "m " + seconds + "s ";
    
    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("stopwatch").innerHTML = "EXPIRED";
    }
}, 1000);
}

$('#submit').click(() => {

	var username = $('#username').val();
	$.post( "http://localhost:1000/username", { username: username } );
	$('#username').val('');

});


window.onload = function() {
	initMap();
}