var bg,csTop;(function(){"use strict";var e=[],t=function(t){e.push(t)},n=function(){t=function(t){t()},e.forEach(t),Topics.get(Topics.INITIALIZED).publish(),"function"==typeof webclientInit&&webclientInit(bg)};LPPlatform.requestFramework=new LPBackgroundRequester(LPPlatform.requestFrameworkInitializer,{mainRequestFramework:window===top,interfaceDefinition:Interfaces.ContentScriptInterface,interfaceName:"ContentScriptInterface"});var c={};bg=Interfaces.createInstance(Interfaces.BackgroundInterface,{direct:!1,context:"contentScript",source:c,asyncOnly:!0,requestFunction:function(t){LPPlatform.requestFramework.sendRequest({type:"backgroundRequest",data:t})}}),window===top?csTop=Interfaces.createInstance(Interfaces.ContentScriptInterface,{context:"contentScript",direct:!0,source:this}):Topics.get(Topics.REQUEST_FRAMEWORK_INITIALIZED).subscribe(function(t){var e=parseInt(t.topFrameID);csTop=Interfaces.createInstance(Interfaces.ContentScriptInterface,{direct:!1,context:"contentScript",requestFunction:function(t){LPPlatform.requestFramework.sendRequest({type:"contentScriptRequest",data:t,frameID:e})}})});var r=function(){bg.LPData.getData({context:"contentScript",callback:function(t){for(var e in t)c[e]=t[e];n()}})};Topics.get(Topics.LOGIN).subscribe(function(t){r()}),r()}).call(this);