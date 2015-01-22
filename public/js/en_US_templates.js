!function(){function a(a,b){return b=b.shiftBlocks(c),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(c),a.w('<div id="app" class="pure-g" style="padding-top:36px"><div class="pure-u-1 pure-u-md-1-3"></div><div id="main" class="pure-u-1 pure-u-md-1-3"><h2>About RoulEATte</h2><p>RoulEATte was originally created to help the creator to decide where to go on dates. Since then people have started using RoulEATTE for various other purposes, including discovering food places nearby, as well as deciding on where actually to eat.</p><p>The \'Random\' button, as well as the \'Random from list\' button helps groups make a decision on where to eat.</p><p>RoulEATte is an open source project, so if there are improvements you would like to have, feel free to submit them on <a href="https://github.com/laurenceputra/RoulEATte" target="_blank">Github</a></p></div><div class="pure-u-1 pure-u-md-1-3"></div></div>')}dust.register("app/about",a);var c={body:b};return a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,b){return b=b.shiftBlocks(e),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(e),a.x(b.getPath(!1,["session","user_id"]),b,{"else":c,block:d},{}).w('<div id="map"></div><div id="app" class="pure-g"><div class="pure-u-1 pure-u-md-1-3"></div><div id="main" class="pure-u-1 pure-u-md-1-3"><div id="buttonsContainer" class="show"></div></div><div class="pure-u-1 pure-u-md-1-3"></div></div><div id="settings-icon"><a href="#" onclick="document.getElementById(\'settings\').className=\'show\';"><img src="/img/settings.png"></a></div><div id="settings" class="hide"><div id="settings-close"><a href="#" onclick="document.getElementById(\'settings\').className=\'hide\';">x</a></div><div id="listSelectContainer" class="hide"></div><div id="distance-slider"><!-- 100m to 5km --><h4>Distance</h4><input id="distance-value" name="distance-value" type="range" min="50" max="1000" step="50" value="500" onchange="document.getElementById(\'distance-show-value\').innerHTML=this.value;getSearchResults();"><p style="margin:0px"><span id="distance-show-value">500</span>m</p><script type="text/javascript">document.getElementById(\'distance-show-value\').innerHTML = document.getElementById(\'distance-value\').value;</script></div><div id="num-result-slider"><h4>Number of results</h4><input id="num-result-value" name="num-result-value" type="range" min="5" max="50" step="1" value="20" onchange="document.getElementById(\'num-result-show-value\').innerHTML=this.value;getSearchResults();"><p style="margin:0px"><span id="num-result-show-value">20</span></p><script type="text/javascript">document.getElementById(\'num-result-show-value\').innerHTML = document.getElementById(\'num-result-value\').value;</script></div><div id="location-refresh"><button class="pure-button pure-button-primary" onclick="startLocationServices()">Refresh location</button></div></div><script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=').f(b.get(["mapsAPIKey"],!1),b,"h").w('"></script><script type="text/javascript" src="/js/app.js"></script>')}function c(a,b){return b=b.shiftBlocks(e),a.w('<script type="text/javascript">var loggedIn = false;</script>')}function d(a,b){return b=b.shiftBlocks(e),a.w('<script type="text/javascript">var loggedIn = true;</script>')}dust.register("app/app",a);var e={body:b};return a.__dustBody=!0,b.__dustBody=!0,c.__dustBody=!0,d.__dustBody=!0,a}(),function(){function a(a,c){return a.w('<div style="width:120px; margin:auto"><button class="button pure-button pure-button-primary" style="width:120px; margin:auto" onclick="selectRandomLocation();">Random</button></div><div style="width:200px; margin:auto">').x(c.get(["loggedIn"],!1),c,{block:b},{}).w("</div>")}function b(a){return a.w('<p class="subtitle">Currently searching from <span id="current-search-list">places near you</span>. Change it by pressing the settings gear.</p>')}return dust.register("app/buttons",a),a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,c){return a.w('<h4>Your lists</h4><select id="listSelect" style="width:100%" onchange="updateRandomHintText(); updateSettings();"><option value="rouleatteNearMe">Near me</option>').s(c.get(["data"],!1),c,{block:b},{}).w('</select><script type="text/javascript">updateRandomHintText();</script>')}function b(a,b){return a.w('<option value="').f(b.get(["id"],!1),b,"h").w('">').f(b.get(["name"],!1),b,"h").w("</option>")}return dust.register("app/listSelect",a),a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(c),a.w('<div id="app" class="pure-g" style="padding-top:36px"><div class="pure-u-1 pure-u-md-1-3"></div><div id="main" class="pure-u-1 pure-u-md-1-3"><h2>What do we collect, and how do we use it?</h2><ol><li>When you log in via Foursquare, we will get your saved lists, as well as the locations on the lists.</li><li>Your saved lists will persist up to 6 hours after your last access, after which it will be removed, unless you access the application again.</li><li>Your email, if available is captured from Foursqure, as well as your name and your photo, which will be use to personalise the application in future builds.</li><li>No other information is captured at this point in time.</li></ol></div><div class="pure-u-1 pure-u-md-1-3"></div></div>')}dust.register("app/privacy",a);var c={body:b};return a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,d){return a.w('<div class="locationDetails" class="pure-u-1"><img src="').f(d.getPath(!1,["photo","prefix"]),d,"h").w("100x100").f(d.getPath(!1,["photo","suffix"]),d,"h").w('" class="locationPhoto"><a href="http://foursquare.com/v/').x(d.get(["id"],!1),d,{"else":b,block:c},{}).w('" target="_blank"><h3>').f(d.get(["name"],!1),d,"h").w("</h3></a><h4>").f(d.get(["category"],!1),d,"h").w("</h4><p>").f(d.get(["address"],!1),d,"h").w("</p></div>")}function b(a,b){return a.f(b.get(["_id"],!1),b,"h")}function c(a,b){return a.f(b.get(["id"],!1),b,"h")}return dust.register("app/suggestedLocation",a),a.__dustBody=!0,b.__dustBody=!0,c.__dustBody=!0,a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(c),a.w("<h1>File not found</h1><p>The URL <code>").f(b.get(["url"],!1),b,"h").w("</code> did not resolve to a route.</p>")}dust.register("errors/404",a);var c={body:b};return a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(c),a.w("<h1>Internal server error</h1><p>The URL <code>").f(b.get(["url"],!1),b,"h").w("</code> had the following error <code>").f(b.get(["err"],!1),b,"h").w("</code>.</p>")}dust.register("errors/500",a);var c={body:b};return a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(c),a.w("<h1>Service unavailable</h1><p>The service is unavailable. Please try back shortly.</p>")}dust.register("errors/503",a);var c={body:b};return a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,f){return a.w('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="A layout example that shows off a responsive product landing page."><title>RoulEATte</title><link rel="stylesheet" href="/css/pure-min.css"><!--[if lte IE 8]><link rel="stylesheet" href="/css/grids-responsive-old-ie-min.css"><![endif]--><!--[if gt IE 8]><!--><link rel="stylesheet" href="/css/grids-responsive-min.css"><!--<![endif]--><link rel="stylesheet" href="/css/font-awesome.css"><!--[if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script><![endif]--><link rel="stylesheet" href="/css/custom.css"><script type="text/javascript" src="/js/external.js"></script><script type="text/javascript" src="/js/en_US_templates.js"></script><script type="text/javascript" src="/js/utils.js"></script><script type="text/javascript">function goToNewLink(){var newPage = document.getElementById(\'nav-select\').value;if(newPage == "homepage"){window.location.href = "/";}else if(newPage == "about"){window.location.href = "/about";}else if(newPage == "privacy"){window.location.href = "/privacy";}else if(newPage == "logout"){window.location.href = "/user/logout";}else if(newPage == "login"){window.location.href = "/user/foursquare";}}</script></head><body><div class="header"><div class="home-menu pure-menu pure-menu-open pure-menu-horizontal pure-menu-fixed"><a class="pure-menu-heading" href="/">RoulEATte</a><ul id="nav-bar"><li><a href="/about">About</a></li><li><a href="/privacy">Privacy</a></li>').x(f.getPath(!1,["session","user_id"]),f,{"else":b,block:c},{}).w('</ul><ul id=\'nav-bar-mobile\'><li><select id="nav-select" onchange="goToNewLink()"><option>Menu</option><option value="homepage">Homepage</option><option value="about">About</option><option value="privacy">Privacy</option>').x(f.getPath(!1,["session","user_id"]),f,{"else":d,block:e},{}).w('</select></li></ul></div></div><div id="main-body">').block(f.getBlock("body"),f,{},{}).w("</div></body></html>")}function b(a){return a.w('<li><a href="/user/foursquare">Login/Signup</a></li>')}function c(a){return a.w('<li><a href="/user/logout">Logout</a></li>')}function d(a){return a.w('<option value="login">Login/Signup</option>')}function e(a){return a.w('<option value="logout">Logout</option>')}return dust.register("layouts/master",a),a.__dustBody=!0,b.__dustBody=!0,c.__dustBody=!0,d.__dustBody=!0,e.__dustBody=!0,a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(c),a.w('<div id="app" class="pure-g" style="padding-top:36px"><div class="pure-u-1 pure-u-md-1-3"></div><div id="main" class="pure-u-1 pure-u-md-1-3"><div style="width:300px" class="center"><a href="https://foursquare.com/oauth2/authenticate?client_id=').f(b.getPath(!1,["foursquare","clientId"]),b,"h").w("&response_type=code&redirect_uri=").f(b.getPath(!1,["foursquare","redirect"]),b,"h").w('"><img src="/img/connectToFoursquare.png"></a></div><p style="text-align:center">Connecting with foursquare will allow you to filter only restaurants from your own lists</p></div><div class="pure-u-1 pure-u-md-1-3"></div></div>')}dust.register("user/login-foursquare",a);var c={body:b};return a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(c),a.w('<div style="width:360px; margin-left:auto; margin-right:auto;"><h3>Email sent!</h3><p>Please click on the link sent in your email to complete your login, or enter the token below</p><form class="pure-form" action="/user/token" method="post"><fieldset><input id="token" name="token" style="margin-right:10px" type="text" placeholder="Token"><input type="hidden" name="uid" value="asdasda"><input type="hidden" name="_csrf" value="').f(b.get(["_csrf"],!1),b,"h").w('"><button type="submit" class="pure-button pure-button-primary">Submit</button></fieldset></form></div>')}dust.register("user/login-token",a);var c={body:b};return a.__dustBody=!0,b.__dustBody=!0,a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.p("layouts/master",b,{})}function b(a,b){return b=b.shiftBlocks(c),a.w('<div style="width:360px; margin-left:auto; margin-right:auto;"><h3>Enter your email address to start</h3><form class="pure-form" action="/user/login" method="post"><fieldset><input id="email" name="email" style="margin-right:10px" type="text" placeholder="Email address"><input type="hidden" name="_csrf" value="').f(b.get(["_csrf"],!1),b,"h").w('"><button type="submit" class="pure-button pure-button-primary">Submit</button></fieldset></form></div>')}dust.register("user/login",a);var c={body:b};return a.__dustBody=!0,b.__dustBody=!0,a}();