function isFeatureOn(x){return Boolean("undefined"!=typeof reduxApp&&"function"==typeof reduxApp.getState&&reduxApp.getState().settings.features&&reduxApp.getState().settings.features[x])}try{if("function"==typeof importScripts){if("https:"==location.protocol)importScripts("/js-thirdparty/zxcvbn.js"),importScripts("/js/sjcl/sjcl.js"),importScripts("/js/sha256.js");else{var baseUrl=location.pathname.slice(0,-26);importScripts(baseUrl+"/zxcvbn.js"),importScripts(baseUrl+"/sjcl.js"),importScripts(baseUrl+"/sha256.js")}var startTime;function calculateStrength(x,e){if("undefined"==typeof zxcvbn)return console.error("No zxcvbn functionality available"),void sendPostMessage();var a=x?x.substring(0,50):"",s=e?e.substring(0,50).toLowerCase():"",o;return zxcvbn(a,[s,"lastpass","lastpass.com"]).score}function challengegetstrength(x,e){return 25*calculateStrength(e,x)}function challengecomputescore_async(x,e,t,i,l,a,s,o,n,r,d,c,h,u,g,v,f,p,_,m,w,y,S,b,O,P,M,A,k,j,N,T,U,D,E,R,F,C,z,L,W,J){function K(){postMessage({cmd:"report",runtimesec:void 0!==_x?_x:void 0,calcTimeMs:void 0!==startTime?(new Date).getTime()-startTime:void 0,g_totalscore:void 0!==e?e:void 0,g_aSites:void 0!==i?i:void 0,g_numsites:void 0!==l?l:0,g_numblanksites:void 0!==a?a:0,g_avgpasswordlength:void 0!==s?s:0,g_avgstrength:"undefined"!=typeof g_avgstrength?g_avgstrength:0,g_aPasswords:void 0!==o?o:{},g_MAXNUMCOMPUTESCORE:void 0!==n?n:0,g_numduppasswords:void 0!==r?r:0,g_numdupsites:void 0!==d?d:0,g_usernames:void 0!==c?c:[],WEAKPASSWORDSCORE:void 0!==h?h:50,g_strengthscore:void 0!==u?u:0,g_countscore:void 0!==g?g:0,g_numweak:void 0!==v?v:0,sharedavgstrength:void 0!==f?f:[],SharedAccounts:void 0!==p?p:[],g_runtimems:void 0!==_?_:0,sfcounts:void 0!==m?m:[],sharedstrengthscore:void 0!==w?w:[],sharedblanksites:void 0!==y?y:[],sharedweak:void 0!==S?S:[],sharedavgpasswordlength:void 0!==b?b:[],SharedPasswords:void 0!==O?O:[],sharedcountscore:void 0!==P?P:[],NonSharedAccounts:void 0!==M?M:[],g_SFNames:void 0!==A?A:[],AllSFNames:void 0!==k?k:[],sharedtotalscore:void 0!==j?j:[],g_numvulnerablesites:void 0!==N?N:0,g_allPasswords:void 0!==T?T:{},g_reuse:void 0!==U?U:void 0,g_blanksites:void 0!==D?D:void 0,g_allnumduppasswords:void 0!==E?E:0})}if(0!==e)return K(),void console.log("Not processing security score");var X,q=0,B,H,I,Z,G,Q,V;for(R=void 0===R?{}:R,void 0!==i[X=void 0===x?0:x]&&void 0!==i[X].sfname&&(B=i[X].sfname),void 0===B&&(B="nonshared"),void 0===m&&(m=[]),void 0===w&&(w=[]),void 0===y&&(y=[]),void 0===S&&(S=[]),void 0===b&&(b=[]),void 0===O&&(O=[]),void 0===P&&(P=[]),void 0===M&&(M=[]),void 0===A&&(A=[]),void 0===k&&(k=[]),void 0===m[B]&&(m[B]=0),m[B]++,void 0===x&&(g_challengeregexcache=[]);X<l;++X){if("function"==typeof reportprogress&&reportprogress(X,l),B="nonshared",void 0!==i[X].sfname)var B=i[X].sfname;var Y=i[X].usernamedec,$=i[X].passworddec;$=$||"";var xx=i[X].passworddecfix,ex=i[X].domain2lvl,ax=void 0!==i[X].realdomain2lvl?i[X].realdomain2lvl:ex,sx=void 0!==i[X].vulnerable;void 0===a&&(a=0),void 0===N&&(N=0),void 0===y[B]&&(y[B]=0),void 0===w[B]&&(w[B]=0);var ox="function"==typeof get_sitepwlen?get_sitepwlen(ax):1,tx=C&&-1!==Object.values(C).indexOf(i[X].id);if(sx)console.log("challengecomputescore_async : Found vulnerable site domain2lvl="+ex+" sfname="+B),"nonshared"==B&&++N,i[X].challenge_score=0;else if(0<$.length&&$.length<ox)i[X].challenge_score=0;else{i[X].challenge_score=challengegetstrength(Y,$);var nx=z&&-1!==Object.values(z).indexOf(i[X].realdomain2lvl);F&&(nx||tx)&&(i[X].is_excluded=!0)}if(""!=xx){if("nonshared"==B&&(s+=$.length),void 0===b[B]&&(b[B]=0),b[B]+=$.length,void 0===O[B]&&(O[B]=[]),"nonshared"==B&&!tx){void 0===o[xx]&&(o[xx]=[]),(void 0===o[xx][ex]||"function"==typeof o[xx][ex]&&void 0===o[xx][ex].push)&&(o[xx][ex]=[]);try{o[xx][ex].push(X)}catch(x){return void(xx=$=Y="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")}}if(void 0===T&&(T=[]),!tx){void 0===T[xx]&&(T[xx]=[],R[xx]=[]),(void 0===T[xx][ex]||"function"==typeof T[xx][ex]&&void 0===T[xx][ex].push)&&(T[xx][ex]=[],R[xx][ex]={users:[],hasDifferentUser:!1});try{T[xx][ex].push(X),R[xx][ex].hasDifferentUser||R[xx][ex].users.forEach(function(x){x===Y||(R[xx][ex].hasDifferentUser=!0)}),R[xx][ex].users.push(Y)}catch(x){return void(xx=$=Y="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")}}if("nonshared"!=B){void 0===O[B][xx]&&(O[B][xx]=[]),(void 0===O[B][xx][ex]||"function"==typeof O[B][xx][ex]&&void 0===O[B][xx][ex].push)&&(O[B][xx][ex]=[]);try{O[B][xx][ex].push(X)}catch(x){return void(xx=$=Y="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")}}if(++q>n){var rx=null;try{"function"==typeof setTimeout?rx=setTimeout:"undefined"!=typeof LP&&void 0!==LP.mostRecent&&void 0!==LP.mostRecent().setTimeout&&(rx=LP.mostRecent().setTimeout)}catch(x){}var dx=0;return rx(function(){if(999<i.length){var x=Number(((X+1)/i.length*100).toFixed(2));Math.floor(x)==Math.ceil(x)&&console.log(x+"% score calculation done")}challengecomputescore_async(X+1,e,t,i,l,a,s,o,n,r,d,c,h,u,g,v,f,p,_,m,w,y,S,b,O,P,M,A,k,j,N,T,U,D,E,R,F,C,z,L,W,J)},0),void(xx=$=Y="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")}xx=$=Y="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}else"nonshared"==B&&a++,y[B]++,void 0!==D&&D.push(X),xx=$=Y="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}for(V in g_challengeregexcache=[],s=l==a?0:Math.round(10*s/(l-a))/10,o)if(Q=0,o.hasOwnProperty(V)){I=o[V];var ix=!1;for(var lx in I)R[V][lx].hasDifferentUser&&(ix=!0),I.hasOwnProperty(lx)&&Q++;if(1==Q&&!ix||""==V){if(void 0!==U)for(var cx in o[V])for(var hx in o[V][cx])delete U[o[V][cx][hx]];delete o[V]}else{for(var lx in++r,G=0,I)I.hasOwnProperty(lx)&&(G+=o[V][lx].length);for(var lx in d+=G,I)if(I.hasOwnProperty(lx))for(H in Z=o[V][lx])Z.hasOwnProperty(H)&&(X=o[V][lx][H],i[X].challenge_numduplicates=G,i[X].challenge_duplicatescore=i[X].challenge_score/Q)}}function ux(x){var e,a,s,o,t,n;for(n in n="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",void 0===T&&(T={},g_allnumdupsites=l),T)if(T.hasOwnProperty(n)){a=T[n],t=0;var r=!1;for(var d in a)R[n][d].hasDifferentUser&&(r=!0),a.hasOwnProperty(d)&&++t;if(1==t&&!r||""==n)delete T[n];else{for(var d in void 0===E&&(E=0),++E,o=0,"undefined"==typeof g_allnumdupsites&&(g_allnumdupsites=0),a)a.hasOwnProperty(d)&&(o+=T[n][d].length);for(var d in g_allnumdupsites+=o,a)if(a.hasOwnProperty(d))for(var e in s=T[n][d])s.hasOwnProperty(e)&&(X=T[n][d][e],void 0!==i[X]&&x&&(i[X].challenge_numduplicates=o,i[X].challenge_duplicatescore=i[X].challenge_score/t))}}}function gx(e){var a=JSON.parse(t),x=a[e]&&"1"===a[e].last_credential_monitoring_state,s=a[e]&&1<Number(a[e].last_credential_monitoring_state),o=J.filter(function(x){return lp_sha2lib.sha256(a[e].unencryptedUsername)===x.usernameHash&&-1<a[e].url.indexOf(x.url)});return x||o.length&&!s}V="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",ux(L),V="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";var vx=0,fx;for(X=0;X<i.length;++X)void 0!==i[X].sfname&&(B=i[X].sfname),void 0===i[X].sfname&&(B="nonshared"),void 0===S[B]&&(S[B]=0),i[X].challenge_scorefinal=i[X].challenge_score,!i[X].usernamedec||-1===i[X].usernamedec.indexOf("@")||i[X].usernamedec in c||(c[i[X].usernamedec]=[],c[i[X].usernamedec].hash=lp_sha2lib.sha256(i[X].usernamedec),c[i[X].usernamedec].link=i[X].link),void 0===i[X].challenge_dictionary||void 0===i[X].challenge_duplicatescore?void 0===i[X].challenge_dictionary?void 0===i[X].challenge_duplicatescore?(i[X].challenge_score<h&&""!=i[X].passworddecfix&&("nonshared"==B&&++v,"nonshared"!=B&&++S[B]),"nonshared"==B&&(i[X].is_excluded&&!0===i[X].is_excluded&&""!==i[X].passworddec?vx++:u+=W&&gx(i[X].id)?0:i[X].challenge_score,g_avgstrength=l==a?0:Math.round(10*u/(l-a-vx))/10,0!=M.length&&(g_avgstrength=M.length==a?0:Math.round(10*u/(M.length-a-vx))/10)),"nonshared"!=B&&(w[B]+=i[X].challenge_score,f[B]=m[B]==y[B]?0:Math.round(10*w[B]/(p[B].length-y[B]))/10),void 0===P[B]&&(P[B]=0),70<=i[X].challenge_score&&void 0===i[X].sfname&&(g+=2),70<=i[X].challenge_score&&void 0!==i[X].sfname&&(P[B]+=2)):(i[X].challenge_scorefinal=i[X].challenge_duplicatescore,void 0===i[X].sfname&&(u+=W&&gx(i[X].id)?0:i[X].challenge_duplicatescore),void 0!==i[X].sfname&&(w[B]+=i[X].challenge_duplicatescore)):(i[X].challenge_scorefinal=.5*i[X].challenge_scorefinal,"nonshared"==B&&++v,"nonshared"!=B&&++S[B]):(i[X].challenge_scorefinal=.5*i[X].challenge_duplicatescore,"nonshared"==B&&++v,"nonshared"!=B&&++S[B]);if(100<g&&(g=100),100<P[B]&&(P[B]=100),void 0!==M&&0!=M.length&&(l=M.length),0<l-a)if(W){var px=7;(fx=70)<(e=Math.round(u/(l-a-vx)*7)/10)&&(console.error("Password part of total score is over 70"),e=fx)}else(fx=100)<(e=Math.round(10*(u/(l-a-vx)*.8+g/10))/10)&&(e=fx);for(var X=0;X<k.length;X++)B=k[X],void 0===p[B]&&(p[B]=[]),void 0===y[B]&&(y[B]=0),0<p[B].length-y[B]&&(j[B]=Math.round(10*(w[B]/(p[B].length-y[B])*.8+P[B]/10))/10);_=(new Date).getTime()-_;var _x=Math.round(_/1e3);K()}onmessage=function(x){"zxcvbn"===x.data.source&&"challengecomputescore_async"===x.data.cmd&&(startTime=(new Date).getTime(),challengecomputescore_async(x.data.curr,x.data.g_totalscore,JSON.parse(x.data.g_sites),x.data.g_aSites&&x.data.g_aSites.length?x.data.g_aSites:[],x.data.g_numsites,x.data.g_numblanksites,x.data.g_avgpasswordlength,x.data.g_aPasswords,x.data.g_MAXNUMCOMPUTESCORE,x.data.g_numduppasswords,x.data.g_numdupsites,x.data.g_usernames,x.data.WEAKPASSWORDSCORE,x.data.g_strengthscore,x.data.g_countscore,x.data.g_numweak,x.data.sharedavgstrength,x.data.SharedAccounts,x.data.g_runtimems,x.data.sfcounts,x.data.sharedstrengthscore,x.data.sharedblanksites,x.data.sharedweak,x.data.sharedavgpasswordlength,x.data.SharedPasswords,x.data.sharedcountscore,x.data.NonSharedAccounts,x.data.g_SFNames,x.data.AllSFNames,x.data.sharedtotalscore,x.data.g_numvulnerablesites,x.data.g_allPasswords,x.data.g_reuse,x.data.g_blanksites,x.data.g_allnumduppasswords,x.data.equivalentDomainCheckList,x.data.isExcludeSwitchedOn,x.data.excludedPasswords,x.data.domainsForAutomaticPasswordExclude,x.data.countReusedOnSharedItems,x.data.isFeatureEnabledSecurityDashboard2_0,x.data.dwmAlerts))}}else console.info("Zxcvbn-Worker initial phase done")}catch(x){console.error("inside-zxcvbn-worker",x)}