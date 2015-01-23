'use strict';

var lng = 103.844;
var lat = 1.2921;

//variables to determine if list results should be loaded
var initialLoad = true;

var previousIndex = {};
previousIndex['search'] = -1;
previousIndex['list'] = -1;

//cache for data
var cache = {};
cache.loggedIn = loggedIn;

//map related variables
var map = null;
var curLocation = null;
var curLocationListener = null;
var curLocationInfoWindow = null;
function initialize() {
    var mapOptions = {
        center: { lat: lat, lng: lng},
        zoom: 18,

    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
    var styles = [
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                { lightness: 50 },
                { visibility: "simplified" }
            ]
        },{
            featureType: "poi",
            elementType: "all",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];
    map.setOptions({styles: styles});

    //current location marker + events
    curLocation = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        draggable:true,
        animation: google.maps.Animation.DROP,
        zIndex: 100
    });
    google.maps.event.addListener(curLocation, 'dragend', function(){
        lat = curLocation.getPosition().lat();
        lng = curLocation.getPosition().lng();
        map.setCenter(curLocation.position);
        getSearchResults();
    });
    curLocationInfoWindow = new google.maps.InfoWindow({
          content: "You are here!"
      });
    curLocationListener = google.maps.event.addListener(curLocation, 'click', function() {
        curLocationInfoWindow.open(map,curLocation);
    });;

}
google.maps.event.addDomListener(window, 'load', initialize);

    
//stores the locations
var randomLocation = [];
var randomLocationInfoWindow = new google.maps.InfoWindow({
    content: 'No content',
    maxWidth: 200
});
var randomLocationListener = [];
//stores what is currently being displayed
var display = null;
function startLocationServices(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            lng = position.coords.longitude;
            lat = position.coords.latitude;
            if(map){
                var center = new google.maps.LatLng(lat, lng);
                map.setCenter(center);
                curLocation.setPosition(center);
                getSearchResults();
            }
            else{
                setTimeout(startLocationServices, 2000)
            }
        }, function(err){
            alert(err.message);
            getSearchResults();
        }, {enableHighAccuracy:true});
    }
}

startLocationServices();

function refreshListsURL(){
    return '/';
}
function locationSearchURL(radius){
    return '/v1/location/near/' + lng + '/' + lat + '/distance/' + document.getElementById('distance-value').value + '/max/' + document.getElementById('num-result-value').value;
}

function getListsURL(){
    return '/v1/user/list/all';
}

function getListURL(id){
    return '/v1/user/list/' + encodeURIComponent(id);
}

function refreshLists(callback){
    ajax(refreshListsURL(), 'GET', null, callback);
}

function getLists(){
    if(!cache.lists || (cache.lists.lastUpdated - Date.now()) / 1000 > 600){
        ajax(getListsURL(), 'GET', null, populateListOptions);
    }
    else{
        populateListOptions(null);
    }
    
}

function populateListOptions(lists){
    if(lists.status == 'failed'){
        refreshLists(getLists);
        return;
    }
    if(lists){
        cache.lists = {};
        cache.lists.data = lists.data;
        cache.lists.lastUpdated = Date.now();
        
    }
    dust.render('app/listSelect', cache.lists, function(err, out){
        document.getElementById('listSelectContainer').innerHTML = out;
        document.getElementById('listSelectContainer').className = 'show';
        document.getElementById('listSelect').addEventListener('change', getList);
    })
    getList();
}

function getList(){
    var id = document.getElementById('listSelect').value;
    if(id != 'rouleatteNearMe' && (!cache.listLocations || !cache.listLocations[id] || (cache.listLocations[id].lastUpdated - Date.now()) / 1000 > 600)){
        ajax(getListURL(id), 'GET', null, populateListDetails);
    }
    else if(id == 'rouleatteNearMe'){
        selectRandomLocationFromResults();
    }
    else{
        populateListDetails(null);
    }
    
}

function populateListDetails(locations){
    var id = document.getElementById('listSelect').value;
    if(locations && locations.status == 'failed'){
        refreshLists(getList);
        return;
    }
    if(!cache.listLocations){
        cache.listLocations = {};
    }
    if(locations){
        cache.listLocations[locations.data.id] = {};
        cache.listLocations[locations.data.id].data = locations.data.list;
        cache.listLocations[locations.data.id].lastUpdated = Date.now();
    }
    if(!initialLoad){
        clearMapMarkers();
        display = id;
        cache.listLocations[id].data.forEach(function(location){
            renderLocation(location);
        });
        selectRandomLocationFromList();
    }
}

function selectRandomLocationFromList(){
    var id = document.getElementById('listSelect').value;

    if(!cache.listLocations[id] || (cache.listLocations[id].lastUpdated - Date.now()) / 1000 > 600){
        getList();
        return;
    }
    else{
        if(display != id){
            clearMapMarkers();
            display = id;
            cache.listLocations[id].data.forEach(function(location){
                renderLocation(location);
            });
        }
        var locations = cache.listLocations[id].data;
        var random = Math.floor(Math.random()*locations.length);
        if(locations.length > 1){
            while(random == previousIndex['list']){
                random = Math.floor(Math.random()*locations.length);
            }
        }
        previousIndex['list'] = random;
        google.maps.event.trigger(randomLocation[random], 'click');

    }
}

function getSearchResults(){
    var url = locationSearchURL();
    ajax(url, 'GET', null, receiveSearchResults);
}
function receiveSearchResults(results){
    if(results.data.length == 0){
        alert("No food locations found near you!");
    }
    else{
        cache.search = {};
        cache.search.data = results.data;
        cache.search.lastUpdated = Date.now();
        initialLoad = false;
        clearMapMarkers();
        display = 'search';
        cache.search.data.forEach(function(location){
            renderLocation(location);
        });
        selectRandomLocationFromResults();
    }
}

function selectRandomLocationFromResults(){
    if(!cache.search || !cache.search.data || cache.search.data.length == 0){
        getSearchResults();
        return;
    }
    else{
        if(display != 'search'){
            clearMapMarkers();
            display = 'search';
            cache.search.data.forEach(function(location){
                renderLocation(location);
            });
        }
        var random = Math.floor(Math.random()*cache.search.data.length);
        if(cache.search.data.length > 1){
            while(random == previousIndex['search']){
                random = Math.floor(Math.random()*cache.search.data.length);
            }
        }
        previousIndex['search'] = random;
        google.maps.event.trigger(randomLocation[random], 'click');
    }
}

function selectRandomLocation(){
    var listContainer = document.getElementById('listSelect');
    if(listContainer && listContainer.value !== "rouleatteNearMe"){
        selectRandomLocationFromList();
    }
    else{
        selectRandomLocationFromResults();
    }
}
function updateRandomHintText(){
    var select = document.getElementById('listSelect');
    if(select.value == "rouleatteNearMe"){
        document.getElementById('current-search-list').innerHTML = "places near you";
    }
    else{
        document.getElementById('current-search-list').innerHTML = "the list " + select.options[select.selectedIndex].text;
    }
}
function updateSettings(){
    if(document.getElementById('listSelect').value == "rouleatteNearMe"){
        document.getElementById('distance-slider').className = "show";
        document.getElementById('num-result-slider').className = "show";
        document.getElementById('location-refresh').className = "show";
    }
    else{
        document.getElementById('distance-slider').className = "hide";
        document.getElementById('num-result-slider').className = "hide";
        document.getElementById('location-refresh').className = "hide";
    }
}
function clearMapMarkers(){
    if(randomLocation.length > 0){
        for(var i = 0; i < randomLocation.length; i++){
            randomLocation[i].setMap(null);
            randomLocation[i] = null;
        }
        randomLocation = [];
    }
    if(randomLocationListener.length > 0){
        for(var i = 0; i < randomLocationListener.length; i++){
            google.maps.event.removeListener(randomLocationListener[i]);
            randomLocationListener[i] = null;
        }
        randomLocationListener = [];
    }
}
function renderLocation(location){
    dust.render('app/suggestedLocation', location, function(err, out){
        var coords = new google.maps.LatLng(location.coords[1], location.coords[0]);
        randomLocation.push(new google.maps.Marker({
            optimized: false,
            position: coords,
            map: map,
            zIndex: 0,
            icon: {
                url: location.photo.prefix + "32x32" + location.photo.suffix,
                scaledSize: {
                    width: 32,
                    height: 32
                }
            }
        }));
        var id = randomLocation.length - 1;
        randomLocationListener.push(google.maps.event.addListener(randomLocation[id], 'click', function() {
            randomLocationInfoWindow.setContent(out);
            randomLocationInfoWindow.open(map, randomLocation[id]);
            var center = randomLocation[id].position;
            map.setCenter(center);
        }));
    });
}
if(loggedIn){
    getLists();
}
dust.render('app/buttons', cache, function(err, out){
    document.getElementById('buttonsContainer').innerHTML = out;
});
