function ajax(url, type, data, callback){
	var req = new XMLHttpRequest(); 
	req.onreadystatechange = function(){
		if (req.readyState==4 && req.status==200){
			try{
				callback(JSON.parse(req.responseText));
			}
			catch(e){
				callback(req.responseText);
				console.log(e);
			}
		}
	};

	req.open(type, url, true);
	if(type.toLowerCase() == "post"){
		req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		req.send(data);	
	}
	else{
		req.send();
	}
	
}