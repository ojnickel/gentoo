const css = `
<custom-style>
	<style include="iron-flex iron-flex-alignment iron-positioning paper-material-styles">
		* {
			--accent-color: #d23f31;
		}
		app-toolbar {
			color: white;
			background: #3B95D2;
			--app-toolbar-font-size: 16px;
		}

		body.popup app-toolbar {
			color: #333;
			background: #fff;
		}

		paper-dialog {
			--paper-dialog-scrollable: {
				max-height:70vh; /* patch for scroll bar issue when trying to drag it */
			}
		}

		paper-icon-button {
			--iron-icon: {
				opacity:0.5;
			};
		}

		paper-icon-button:hover {
			--iron-icon: {
				opacity:1;
			};
		}

		#newsNotification {
			--iron-icon: {
				opacity:1;
			}
		}

		paper-icon-item {
			--paper-item-icon-width: 40px; /* dupicated value in css below also because --paper-item-icon-width should normally sufice, but when using template to import polyer menu the --p... was not working */
		}

		paper-drawer-panel {
			--paper-drawer-panel-left-drawer-container: { background-color: rgb(238, 238, 238) };
		}

		paper-tab {
			--paper-tab-ink: white;
		}

		paper-tabs {
			--paper-tabs-selection-bar-color: white;
		}

		paper-tooltip {
			--paper-tooltip: {
				font-size:13px;
			};
		}
		
		paper-spinner.white, paper-toast paper-spinner {
			--paper-spinner-layer-1-color: white;
			--paper-spinner-layer-2-color: white;
			--paper-spinner-layer-3-color: white;
			--paper-spinner-layer-4-color: white;
		}

		@media screen and (min-width: 1400px) {
			body:not(.popup) app-toolbar {padding:0 calc(calc(100% - 1366px) / 2)}
		}
		#middle {margin: 0 auto;max-width: 1366px}

		#badgeIcon paper-icon-item {
			--paper-item-icon-width: auto;
		}
		
	</style>
</custom-style>

<style>
    
    @font-face {
        font-family: 'Roboto-Medium'; /* using unique name Roboto-medium instead of Roboto because I only want this font all the time, only for sign in */
        src: url('/Roboto-Medium.ttf');
    }

	[unresolved] {opacity:0}
	[resolved] {opacity:1 !important}
	
    @-moz-document url-prefix() {
        body {font-family: "Segoe UI", Tahoma, sans-serif}
    }
	body[resolved] {transition: opacity 0.15s ease-in-out} /* move transition to [resolved] because attaching it to body alone would take effect when initially hiding fouc so it would fade out then fade in, test it with a longer transitionduration */
	body.popup {opacity:0;width:800px;height:600px;overflow:hidden} /* used to hide bars when zoom level is 150+ */
    body.page-loading-animation {background-image:url("images/ajax-loader.svg");background-repeat: no-repeat;background-position:47vw 44vh} /* issue: when using camel case and the import css */
    
    textarea {font-family:system-ui}
	
	paper-icon-item iron-icon {opacity:0.5}
	
	paper-menu:focus {outline:none}
	
	paper-dropdown-menu {padding:8px !important} /* seems polymer update adding padding:0 ??? previously it was not there */
	
	paper-item {white-space:nowrap}
	paper-item:hover, paper-icon-item:hover {cursor:pointer;background-color:#eee}

	paper-icon-item .content-icon {width:40px !important} /* --paper-item-icon-width above should normally sufice, but when using template to import polyer menu the --p... was not working */

	paper-button > iron-icon {-webkit-margin-end:8px;-moz-margin-end:8px}
    paper-button[raised].colored {background-color:#4285f4 !important;color:#fff}
    
    paper-checkbox {margin:4px 0}

	/* .placeholder is used to prevent flickering of paper-icon-button when inside paper-menu-button, I place one paper-icon-button outside and inside and then swap their visibility when polymer2 is loaded */
	[resolved2] .placeholder {display:none !important}
	[unresolved2] paper-menu-button {display:none}
	
	[unresolved2] paper-dialog {display:none}
	[unresolved2] paper-tooltip, [unresolved2] paper-toast {display:none}

	paper-toast {min-width:auto !important}
	.rtl paper-toast {left:auto;right:12px}
	.toastLink {color:#a1c2fa;background-color:initial}
	.toastLink:hover {color:#bbdefb}
	
	paper-toast {padding:8px 9px 4px 16px}
	
	[main-title] a {-webkit-margin-start:10px;-moz-margin-start:10px;pointer-events:auto;font-size:20px}

	.closeToast {cursor:pointer}
	
	paper-dialog {border-radius:8px}
	paper-dialog .buttons paper-icon-button {color:#333}
	
	paper-dialog-scrollable paper-radio-button {display:block}
	paper-dialog-scrollable paper-radio-button, paper-dialog-scrollable paper-checkbox {margin:2px 0} /* patch to remove scrollbar in paper-dialog-scrollable */

	.separator {height:1px;background:#ddd;margin:8px 0;min-height:0 !important}
	
	#options-menu paper-item, #options-menu paper-icon-item {min-height: 35px}
	#options-menu span {white-space:nowrap}
	
	.share-button {display:none;width:37px;height:37px}
	#share-menu svg {padding:5px 15px;width:19px;height:19px}
	
	.close {position:absolute;margin:0;padding:3px;top:-1px;right:1px;width:24px;height:24px}
	.rtl .close {right:auto;left:1px}
	.inherit, a.inherit {color:inherit}
	.inherit {background-color:inherit;text-decoration:inherit}

	.dialog-close-button {position:absolute;top:0px;right:2px;margin:0;padding:0;z-index:1}
	
</style>
`;

const template = /** @type {!HTMLTemplateElement} */document.createElement('template');
template.setAttribute('style', 'display: none;');
template.innerHTML = css;
document.head.appendChild(template.content);