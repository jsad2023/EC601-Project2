//function geocodeAddress() {
//	var address = document.getElementById('address').value; // Get the address from an input field
//    address = address.split(' ').join('%20');
//    console.log(address);
//	// Specify the URL you want to make a request to
//    const api_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}key=${API_KEY}`;
//	// Use the fetch function to make a GET request
//    console.log(`URL: ${api_url}`);
//	(async () => {
//    try {
//        var response = await fetch(api_url, {method: 'GET'});
//        var data = await response.json();
//        console.log(data);
//      } catch (e) {
//        console.log('Booo');
//      }
//    })();
//}


function geocodeAddress() {
    var geocoder = new google.maps.Geocoder();
    var address = document.getElementById('address').value; // Get the address from an input field
   
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            const loc = results[0].geometry.location;
            location.lat = loc.lat();
            location.long = loc.lng();
            getSavings(loc.lat(), loc.lng());
            console.log('1 Latitude: ' + loc.lat() + ', Longitude: ' + loc.lng());
        } else {
            console.error('Geocode was not successful for the following reason: ' + status);
        }
    });  

}

function loadScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Event listener for script loading
    script.onload = function() {
        if (callback) {
            callback();
        }
    };

    // Append the script to the document
    document.head.appendChild(script);
}

var scriptURL = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
loadScript(scriptURL, function() {
    // Code to execute after the script has loaded
    console.log('Script has been loaded!');
    // Call functions or perform other tasks related to the loaded script
});


function getSavings(lat, long) {
	// Specify the URL you want to make a request to
    const api_url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${long}&requiredQuality=HIGH&key=${API_KEY}`
	// Use the fetch function to make a GET request
    console.log(`URL: ${api_url}`);
	(async () => {
    try {
        var response = await fetch(api_url, {method: 'GET'});
        var data = await response.json();
        console.log(data.solarPotential.financialAnalyses[22].leasingSavings.savings.savingsLifetime);
        var isViable = data.solarPotential.financialAnalyses[22].leasingSavings.savings.financiallyViable;
        var savingsLifetimeInUSD = data.solarPotential.financialAnalyses[22].leasingSavings.savings.savingsLifetime.units
        //console.log(data.solarPotential.financialAnalyses);
        document.getElementById('savings').value = `${savingsLifetimeInUSD} USD`; 
        document.getElementById('viability').value = isViable ? "Yes" : "No";
      } catch (e) {
            alert("Something went wrong. ... Did you use a USA address?");
            document.getElementById('savings').value = `Waiting ...`; 
            document.getElementById('viability').value = "Waiting ...";
      }
    })();
}
