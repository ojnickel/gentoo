/*
ExpressVPN Browser Extension:
Copyright 2017-2023 Express VPN International Ltd
Licensed GPL v2
*/
let iframe;
chrome.runtime.sendMessage({ canStartKeysTimer: true}, hasLock => {
  if (hasLock) {
    return;
  }

  setTimeout(() => {
    const style = {
      all: 'initial',
      overflow: 'hidden',
      display: 'block',
      padding: 0,
      boxSizing: 'border-box',
      position: 'fixed',
      borderRadius: '10px',
      border: '0.5px solid #ccd2d5',
      boxShadow: '0px 2px 10px 0px rgba(0, 0, 0, 0.1)',
      zIndex: 2147483647,
      top: '20px',
      right: '20px',
      width: '350px',
      height: '330px',
    };
    iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('/html/keysAdoption.html');
  
    for (const prop in style) {
      if (style.hasOwnProperty(prop)) {
        iframe.style[prop] = style[prop];
      }
    }
    document.body.appendChild(iframe);
  }, 20 * 1000);
});



chrome.runtime.onMessage.addListener((message) => {
  if (message.closeKeysModal) {
    iframe?.remove();
  }

  return true;
});