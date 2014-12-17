'use strict';
var lng = 103.844;
var lat = 1.2921;
var distance = 500;
var cache = {};
function startLocationServices(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            lng = position.coords.longitude;
            lat = position.coords.latitude;
        }, function(err){
            alert(err);
        });
    }
}

startLocationServices();
setInterval(startLocationServices, 60000);

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



function getLists(){
    if(!cache.lists || (cache.lists.lastUpdated - Date.now()) / 1000 > 600){
        ajax(getListsURL(), 'GET', null, populateListOptions);
    }
    else{
        populateListOptions(null);
    }
    
}

function populateListOptions(lists){
    if(lists){
        cache.lists = {};
        cache.lists.data = lists.data;
        cache.lists.lastUpdated = Date.now();

        //render option with list
    }
    getList(lists.data[0].id);
}

function getList(id){
    if(!cache[id] || (cache[id].lastUpdated - Date.now()) / 1000 > 600){
        ajax(getListURL(id), 'GET', null, populateListDetails);
    }
    else{
        populateListDetails(null);
    }
    
}

function populateListDetails(locations){
    if(locations){
        cache[locations.data.id] = {};
        cache[locations.data.id].data = locations.data.list;
        cache[locations.data.id].lastUpdated = Date.now();
    }
    selectRandomLocationFromList();
}

function selectRandomLocationFromList(){
    //read the list id from option box first
}

function getSearchResults(){
    var url = locationSearchURL(distance);
    ajax(url, 'GET', null, receiveSearchResults);
}
function receiveSearchResults(results){
    cache.search = {};
    cache.search.data = results.data;
    cache.search.lastUpdated = Date.now();

    selectRandomLocationFromResults();
}

function selectRandomLocationFromResults(){
    if(!cache.search || !cache.search.data || cache.search.data.length == 0){
        getSearchResults();
    }
    else{
        var random = Math.floor(Math.random()*cache.search.data.length);
        var location = cache.search.data[random];
    }
}

if(loggedIn){
    getLists();
    setTimeout(getSearchResults, 1000);
}
else{
    setTimeout(getSearchResults, 1000);
}