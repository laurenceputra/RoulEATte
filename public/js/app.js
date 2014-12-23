'use strict';
var lng = 103.844;
var lat = 1.2921;
var distance = 500;
var previousIndex = {};
previousIndex['search'] = -1;
previousIndex['list'] = -1;
var cache = {};
cache.loggedIn = loggedIn;
var map = null;
var curLocation = null;
var curLocationInfoWindow = new google.maps.InfoWindow({
      content: "You are here!"
  });
var curLocationListener = null;

var randomLocation = [];
var randomLocationInfoWindow = new google.maps.InfoWindow({
    content: 'No content'
});
var randomLocationListener = [];
var display = null;
function startLocationServices(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            lng = position.coords.longitude;
            lat = position.coords.latitude;
            if(map){
                var center = new google.maps.LatLng(lat, lng);
                map.setCenter(center);
                if(!curLocation){
                    curLocation = new google.maps.Marker({
                        position: center,
                        map: map,
                        draggable:true,
                        animation: google.maps.Animation.DROP,
                        zIndex: 100
                    });
                    curLocationListener = google.maps.event.addListener(curLocation, 'click', function() {
                        curLocationInfoWindow.open(map,curLocation);
                    });
                    google.maps.event.addListener(curLocation, 'dragend', function(){
                        lat = curLocation.getPosition().lat();
                        lng = curLocation.getPosition().lng();
                        map.setCenter(curLocation.position);
                        getSearchResults();
                    });
                }
                else{
                    curLocation.setPosition(center);
                }
                getSearchResults();
            }
            else{
                setTimeout(startLocationServices, 2000)
            }
        }, function(err){
            alert(err);
        }, {enableHighAccuracy:true});
    }
}

startLocationServices();

function initialize() {
    var mapOptions = {
        center: { lat: lat, lng: lng},
        zoom: 16,

    };
    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);


function refreshListsURL(){
    return '/';
}
function locationSearchURL(radius){
    if(!radius){
        radius = 500;
    }
    return '/v1/location/near/' + lng + '/' + lat + '/distance/' + radius;
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
    if(!cache.listLocations || !cache.listLocations[id] || (cache.listLocations[id].lastUpdated - Date.now()) / 1000 > 600){
        ajax(getListURL(id), 'GET', null, populateListDetails);
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
    clearMapMarkers();
    display = id;
    cache.listLocations[id].data.forEach(function(location){
        renderLocation(location);
    });
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
            display = 'search';
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
    var url = locationSearchURL(distance);
    ajax(url, 'GET', null, receiveSearchResults);
}
function receiveSearchResults(results){
    cache.search = {};
    cache.search.data = results.data;
    cache.search.lastUpdated = Date.now();
    clearMapMarkers();
    display = 'search';
    cache.search.data.forEach(function(location){
        renderLocation(location);
    });
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
                url: location.photo,
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
        }));
    });
}
if(loggedIn){
    getLists();
}
dust.render('app/buttons', cache, function(err, out){
    document.getElementById('buttonsContainer').innerHTML = out;
});