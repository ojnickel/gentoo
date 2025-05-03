
function get_param( name )
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );

	if ( results == null )
		return "";
	else
		return results[1];
}

window.addEventListener("load", function()
{
	document.getElementById("idnovideo1").innerHTML = chrome.i18n.getMessage("idnovideo1");
	document.getElementById("idnovideo2").innerHTML = chrome.i18n.getMessage("idnovideo2");
    var url = get_param("url");
    var o = document.getElementById("idSubmit");
    o.addEventListener('click', function(data)
    {
		window.open("https://www.videodownloaderultimate.com/?p=submit&url="+url);
        //UploadUrl( url);
    });
    
}, false);
