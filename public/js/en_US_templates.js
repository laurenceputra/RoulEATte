!function(){function a(a,b){return b=b.shiftBlocks(e),a.partial("layouts/master",b,null)}function b(a,b){return b=b.shiftBlocks(e),a.exists(b.getPath(!1,["session","user_id"]),b,{"else":c,block:d},null).write('<div id="app" class="pure-g"><div class="pure-u-1 pure-u-md-1-3"></div><div id="main" class="pure-u-1 pure-u-md-1-3"><div class="center" style="width:100px"><img src="/img/loading.gif"></div></div><div class="pure-u-1 pure-u-md-1-3"></div></div><script type="text/javascript" src="/js/app.js"></script>')}function c(a,b){return b=b.shiftBlocks(e),a.write('<script type="text/javascript">var loggedIn = false;</script>')}function d(a,b){return b=b.shiftBlocks(e),a.write('<script type="text/javascript">var loggedIn = true;</script>')}dust.register("app/app",a);var e={body:b};return a}(),function(){function a(a,b){return a.write('<div class="pure-u-1"><img src="').reference(b.get(["photo"],!1),b,"h").write('" class="locationPhoto"></div><div class="pure-u-1"><h3>').reference(b.get(["name"],!1),b,"h").write("</h3><h4>").reference(b.get(["category"],!1),b,"h").write("</h4><p>").reference(b.get(["address"],!1),b,"h").write("</p></div>")}return dust.register("app/suggestedLocation",a),a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.partial("layouts/master",b,null)}function b(a,b){return b=b.shiftBlocks(c),a.write("<h1>File not found</h1><p>The URL <code>").reference(b.get(["url"],!1),b,"h").write("</code> did not resolve to a route.</p>")}dust.register("errors/404",a);var c={body:b};return a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.partial("layouts/master",b,null)}function b(a,b){return b=b.shiftBlocks(c),a.write("<h1>Internal server error</h1><p>The URL <code>").reference(b.get(["url"],!1),b,"h").write("</code> had the following error <code>").reference(b.get(["err"],!1),b,"h").write("</code>.</p>")}dust.register("errors/500",a);var c={body:b};return a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.partial("layouts/master",b,null)}function b(a,b){return b=b.shiftBlocks(c),a.write("<h1>Service unavailable</h1><p>The service is unavailable. Please try back shortly.</p>")}dust.register("errors/503",a);var c={body:b};return a}(),function(){function a(a,d){return a.write('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description" content="A layout example that shows off a responsive product landing page."><title>RoulEATte</title><link rel="stylesheet" href="/css/pure-min.css"><!--[if lte IE 8]><link rel="stylesheet" href="/css/grids-responsive-old-ie-min.css"><![endif]--><!--[if gt IE 8]><!--><link rel="stylesheet" href="/css/grids-responsive-min.css"><!--<![endif]--><link rel="stylesheet" href="/css/font-awesome.css"><!--[if lt IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script><![endif]--><link rel="stylesheet" href="/css/custom.css"><script type="text/javascript" src="/js/dust.min.js"></script><script type="text/javascript" src="/js/en_US_templates.js"></script></head><body><div class="header"><div class="home-menu pure-menu pure-menu-open pure-menu-horizontal pure-menu-fixed"><a class="pure-menu-heading" href="">RoulEATte</a><ul><li><a href="/">Home</a></li>').exists(d.getPath(!1,["session","user_id"]),d,{"else":b,block:c},null).write('</ul></div></div><div style="width:100%;padding-top:90px">').block(d.getBlock("body"),d,{},null).write("</div></body></html>")}function b(a){return a.write('<li><a href="/user/foursquare">Login/Signup</a></li>')}function c(a){return a.write('<li><a href="/user/logout">Logout</a></li>')}return dust.register("layouts/master",a),a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.partial("layouts/master",b,null)}function b(a,b){return b=b.shiftBlocks(c),a.write('<div id="app" class="pure-g"><div class="pure-u-1 pure-u-md-1-3"></div><div id="main" class="pure-u-1 pure-u-md-1-3"><div style="width:300px" class="center"><a href="https://foursquare.com/oauth2/authenticate?client_id=').reference(b.getPath(!1,["foursquare","clientId"]),b,"h").write("&response_type=code&redirect_uri=").reference(b.getPath(!1,["foursquare","redirect"]),b,"h").write('"><img src="/img/connectToFoursquare.png"></a></div><p style="text-align:center">Connecting with foursquare will allow you to filter only restaurants from your own lists</p></div><div class="pure-u-1 pure-u-md-1-3"></div></div>')}dust.register("user/login-foursquare",a);var c={body:b};return a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.partial("layouts/master",b,null)}function b(a,b){return b=b.shiftBlocks(c),a.write('<div style="width:360px; margin-left:auto; margin-right:auto;"><h3>Email sent!</h3><p>Please click on the link sent in your email to complete your login, or enter the token below</p><form class="pure-form" action="/user/token" method="post"><fieldset><input id="token" name="token" style="margin-right:10px" type="text" placeholder="Token"><input type="hidden" name="uid" value="asdasda"><input type="hidden" name="_csrf" value="').reference(b.get(["_csrf"],!1),b,"h").write('"><button type="submit" class="pure-button pure-button-primary">Submit</button></fieldset></form></div>')}dust.register("user/login-token",a);var c={body:b};return a}(),function(){function a(a,b){return b=b.shiftBlocks(c),a.partial("layouts/master",b,null)}function b(a,b){return b=b.shiftBlocks(c),a.write('<div style="width:360px; margin-left:auto; margin-right:auto;"><h3>Enter your email address to start</h3><form class="pure-form" action="/user/login" method="post"><fieldset><input id="email" name="email" style="margin-right:10px" type="text" placeholder="Email address"><input type="hidden" name="_csrf" value="').reference(b.get(["_csrf"],!1),b,"h").write('"><button type="submit" class="pure-button pure-button-primary">Submit</button></fieldset></form></div>')}dust.register("user/login",a);var c={body:b};return a}();