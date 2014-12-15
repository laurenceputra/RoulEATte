function ajax(url, type, data, callback){
	var req = new XMLHttpRequest(); 
	req.onreadystatechange = function(){
		if (req.readyState==4 && req.status==200){
			callback(JSON.parse(req.responseText));
		}
	};

	req.open(type, url, true);
	if(type.toLower() == "post"){
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	}
	req.send(data);	
}