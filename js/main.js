$(function() {
    var places = $('.places');
    var counter = 2;

    var geocoder = map = marker = infoWindow = null;
    var defaultCenter = [40.151127, -74.6521];
    var userCenter = [];
    var markers = [];
    var weights = [];

    $('.another-one').on('click', function(e) {
        e.preventDefault();
        places.append('<label for="place' + counter + '">Place ' + counter + '</label><input id="place'  + counter + '" placeholder="Place ' + counter + '" type="text">');
        counter++;
    });

    $('.submit').on('click', function(e) {
        e.preventDefault();

        var inputs = places.find('input');

        var arr = [];

        for (var i = 0; i < inputs.length; i++) {
            arr.push($(inputs.get(i)).val());
        }

        getUserLocation(arr);
    });

    function getUserLocation(arr) {
        if (window.navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                userCenter[0] = position.coords.latitude;
                userCenter[1] = position.coords.longitude;
                initialize(arr);
            }, function() {
                initialize(arr);
            });
        }
    }

    function addMarker(placeName, lat, lng) {
        marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(lat, lng),
            title: placeName
        });

        markers.push(marker);

        infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', (function(marker) {
            return function() {
                infoWindow.setContent('<div class="infowindow"><h1>' + placeName + '</h1></div>');
                infoWindow.open(map, marker);
            }
        })(marker));
    }

    function codeAddress(address) {
        geocoder.geocode({
            address: address
        }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                addMarker(results[0].formatted_address, results[0].geometry.location.lat(), results[0].geometry.location.lng());
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
}


    function getWeightBw(o, d) {
        var oLat = o.position.lat();
        var oLng = o.position.lng();

        var dLat = d.position.lat();
        var dLng = d.position.lng();

        var origin = new google.maps.LatLng(oLat, oLng);
        var destination = new google.maps.LatLng(dLat, dLng);

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status == google.maps.DistanceMatrixStatus.OK) {
                var origins = response.originAddresses;
                var destinations = response.destinationAddresses;

                for (var i = 0; i < origins.length; i++) {
                    var results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++) {
                        var element = results[j];
                        var distance = element.distance.text;
                        var duration = element.duration.text;
                        var from = origins[i];
                        var to = destinations[j];
                        //console.log('It takes ' + duration + ' long to get from ' + from + ' to ' + to + '!');
                        //my stuff
                        alert("load new content");
                        //document.open();
                        //document.write('It takes ' + duration + ' long to get from ' + from + ' to ' + to + '!');
                        //document.close();
                    }
                }
            }
        });
    }

    function getWeights(markers)
    {
        getWeightBw(markers[0], markers[1]);
    }

    function findMST(graph)
    {

    }


    function initialize(arr) {

        var mapOptions = null;

        if (userCenter.length !== 0) {
            mapOptions = {
                zoom: 14,
                center: new google.maps.LatLng(userCenter[0], userCenter[1])
            };
        } else {
            mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(defaultCenter[0], defaultCenter[1])
            };
        }

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        for (var i = 0; i < arr.length; i++) {
            geocoder = new google.maps.Geocoder();
            codeAddress(arr[i]);
        }
        google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
            getWeights(markers);
        });
    }
});
