'use strict';
var lng = 103.844;
var lat = 1.2921;
var distance = 500;
var previousIndex = {};
previousIndex['search'] = -1;
previousIndex['list'] = -1;
var cache = {};
cache.loggedIn = loggedIn;
function startLocationServices(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            lng = position.coords.longitude;
            lat = position.coords.latitude;

            getSearchResults();

        }, function(err){
            alert(err);
        }, {enableHighAccuracy:true});
    }
}

startLocationServices();
setInterval(startLocationServices, 600000);

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
    document.getElementById('loadingContainer').className = 'show';
    document.getElementById('suggestedLocationContainer').className = 'hide';
    if(!cache.listLocations || !cache.listLocations[id] || (cache.listLocations[id].lastUpdated - Date.now()) / 1000 > 600){
        ajax(getListURL(id), 'GET', null, populateListDetails);
    }
    else{
        populateListDetails(null);
    }
    
}

function populateListDetails(locations){
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
    selectRandomLocationFromList();
}

function selectRandomLocationFromList(){
    var id = document.getElementById('listSelect').value;
    document.getElementById('loadingContainer').className = 'show';
    document.getElementById('suggestedLocationContainer').className = 'hide';

    if(!cache.listLocations[id] || (cache.listLocations[id].lastUpdated - Date.now()) / 1000 > 600){
        getList();
    }
    else{
        var locations = cache.listLocations[id].data;
        var random = Math.floor(Math.random()*locations.length);
        if(locations.length > 1){
            while(random == previousIndex['list']){
                random = Math.floor(Math.random()*locations.length);
            }
        }
        previousIndex['list'] = random;
        var location = locations[random];
        dust.render('app/suggestedLocation', location, function(err, out){
            document.getElementById('suggestedLocationContainer').innerHTML = out;
            document.getElementById('loadingContainer').className = 'hide';
            document.getElementById('suggestedLocationContainer').className = 'show';
        });

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
    if(!loggedIn){
        selectRandomLocationFromResults();
    }
}

function selectRandomLocationFromResults(){
    document.getElementById('loadingContainer').className = 'show';
    document.getElementById('suggestedLocationContainer').className = 'hide';
    if(!cache.search || !cache.search.data || cache.search.data.length == 0){
        getSearchResults();
    }
    else{
        var random = Math.floor(Math.random()*cache.search.data.length);
        if(cache.search.data.length > 1){
            while(random == previousIndex['search']){
                random = Math.floor(Math.random()*cache.search.data.length);
            }
        }
        previousIndex['search'] = random;
        var location = cache.search.data[random];
        dust.render('app/suggestedLocation', location, function(err, out){
            document.getElementById('suggestedLocationContainer').innerHTML = out;
            document.getElementById('loadingContainer').className = 'hide';
            document.getElementById('suggestedLocationContainer').className = 'show';
        });
    }
}

if(loggedIn){
    getLists();
}
dust.render('app/buttons', cache, function(err, out){
    document.getElementById('buttonsContainer').innerHTML = out;
})