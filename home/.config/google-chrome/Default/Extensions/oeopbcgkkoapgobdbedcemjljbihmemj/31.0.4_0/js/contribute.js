"use strict";

var amount;
var licenseType = "singleUser";
var licenseSelected;
let minimumDonation; // but being set overwritten when donate buttons are clicked

var donateButtonClicked = null;
var extensionName = getMessage("nameNoTM");
var email;
var stripeLiveMode = true;
var donationPageUrl = location.protocol + "//" + location.hostname + location.pathname;
const stripeCancelOrError = ["stripeCancel", "stripeError"].includes(getUrlValue("action"));

function showLoading() {
	document.body.classList.add("processing");
}

function hideLoading() {
	document.body.classList.remove("processing");
}

if (!extensionName) {
	try {
		extensionName = chrome.runtime.getManifest().name;
	} catch (e) {
		console.error("Manifest has not been loaded yet: " + e);
	}
	
	var prefix = "__MSG_";
	// look for key name to message file
	if (extensionName?.match(prefix)) {
		var keyName = extensionName.replace(prefix, "").replace("__", "");
		extensionName = getMessage(keyName);
	}
}

function isSimilarValueToUS(currencyCode) {
	if (/USD|CAD|EUR|GBP|AUD/i.test(currencyCode)) {
		return true;
	}
}

async function initCurrencyAndMinimums(currencyCode) {
    const minPaymentObj = await Controller.getMinimumPayment();

	if (licenseType == "multipleUsers") {
		byId("currency").selected = "USD"; // hard coded to USD for multipe user license
	} else {
		byId("currency").selected = currencyCode;

        if (isMonthly()) {
            selectorAll("#monthlyAmountSelections paper-button").forEach(el => {
                if (el.getAttribute("amount") <= minPaymentObj.getMonthlyPayment("USD")) {
                    hide(el);
                }
            });

            hide("#onetimeAmountSelections");
            show("#monthlyAmountSelections");
            hide("#yearlyAmountSelections");

            show("#amount");
        } else if (isYearlyForAllExtensions()) {
            const $paperButton = selector("#yearlyAmountSelections paper-button");
            const yearlyAmount = minPaymentObj.getYearlyPayment("USD");
            $paperButton.innerText = yearlyAmount;
            $paperButton.setAttribute("amount", yearlyAmount);

            hide("#onetimeAmountSelections");
            hide("#monthlyAmountSelections");
            show("#yearlyAmountSelections");
            
            hide("#amount");
        } else {
            selectorAll("#onetimeAmountSelections paper-button").forEach(el => {
                if (el.getAttribute("amount") < minPaymentObj.getOneTimePayment("USD")) {
                    hide(el);
                }
            });

            show("#onetimeAmountSelections");
            hide("#monthlyAmountSelections");
            hide("#yearlyAmountSelections");

            show("#amount");
        }
		
		if (isMonthly() || isYearlyForAllExtensions()) {
			if (isPayPalSubscriptionsSupported() && stripeCancelOrError) {
				show("#paypal");
			} else {
				hide("#paypal");
			}
			hide("#alipay");
			hide("#wechat-pay");
		} else {
            if (stripeCancelOrError) {
                show("#paymentMethods paper-button");
            } else {
                show("#paymentMethods paper-button:not(#paypal)");
            }
		}
		
		if (currencyCode == "BTC") {
            niceAlert("Select a fiat currency and an amount then the Coinbase option will appear.");
            byId("currency").selected = "USD";
		} else {
            selectorAll("paper-button[amount]").forEach(el => {
				el.innerText = Controller.convertUSDToOtherCurrency(el.getAttribute("amount"), currencyCode);
			});

            if (isMonthly()) {
                minimumDonation = minPaymentObj.getMonthlyPayment(currencyCode);
            } else if (isYearlyForAllExtensions()) {
                minimumDonation = minPaymentObj.getYearlyPayment(currencyCode);
            } else {
                if (await isEligibleForReducedDonation()) {
                    minimumDonation = minPaymentObj.getOneTimeReducedPayment(currencyCode);
                } else {
                    minimumDonation = minPaymentObj.getOneTimePayment(currencyCode);
                }
            }
		}

        byId("amount").min = minimumDonation;
	}
}
	
function initPaymentDetails(buttonClicked) {
	donateButtonClicked = buttonClicked;
	
	slideUp("#multipleUserLicenseIntro");

	if (ITEM_ID == "screenshots" && !email && (isMonthly() || isYearlyForAllExtensions() || buttonClicked == "alipay" || buttonClicked == "wechat")) {
		let promptMessage;
		if (isMonthly() || isYearlyForAllExtensions()) {
			promptMessage = "Enter your email to link the other extensions";
		} else {
			promptMessage = "Enter your email for the receipt";
		}
		email = prompt(promptMessage);
		if (!email) {
			niceAlert("You must enter an email");
			return;
		}
	}

	if (licenseType == "singleUser") {
		initPaymentProcessor(amount);
	} else {
		initPaymentProcessor(licenseSelected.price);
	}
}

function isZeroDecimalCurrency(currencyCode) {
	const zeroDecimalCurrencies = ["bif", "djf", "jpy", "krw", "pyg", "vnd", "xaf", "xpf", "clp", "gnf", "kmf", "mga", "rwf", "vuv", "xof"];
	if (zeroDecimalCurrencies.includes(currencyCode.toLowerCase())) {
		return true;
	}
}

function getAmountNumberOnly() {
	let amount = byId("amount").value;
	
	if (amount.indexOf(".") == 0) {
		amount = "0" + amount;
	}
	
	// make sure 2 decimal positions ie. 0.5 > 0.50
	if (/\..$/.test(amount)) {
		amount += "0";
	}
	
	amount = amount.trim();
	return amount;
}

function hideBeforeSuccessfulPayment() {
	hide("#extraFeatures");
	hide("#paymentArea");
}

async function showSuccessfulPayment() {
	await Controller.processFeatures();
	hideBeforeSuccessfulPayment();

	if (DetectClient.isFirefox()) {
		byId("video").src = "contributeVideo.html";
		byId('video').addEventListener("load", function () {
            onClickReplace(this.contentDocument.querySelector("body"), function() {
				chrome.tabs.create({ url: "https://www.youtube.com/watch?v=Ue-li7gl3LM" });
            });
		});
	} else {
		byId("video").src = "https://www.youtube.com/embed/Ue-li7gl3LM?rel=0&autoplay=1&theme=light";
	}

	show("#extraFeaturesWrapper");
	
	if (localStorage._amountForAllExtensions) {
		show("#unlockOtherExtensions");
	}
	show("#paymentComplete");
}

function getStripeAmount(price, currencyCode) {
	var stripeAmount;

	if (isZeroDecimalCurrency(currencyCode)) {
		stripeAmount = price;
	} else {
		stripeAmount = price * 100;
	}

	stripeAmount = Math.round(stripeAmount) // round to prevent invalid integer error ie. when entering amount 1.1

	return stripeAmount;
}

async function paymentFetch(url, data, options = {}) {
    try {
        return await fetchJSON(url, data, options);
    } catch (error) {
        hideLoading();
        openGenericDialog({
            title: getMessage("theresAProblem") + " - " + error,
            content: getMessage("tryAgainLater") + " " + getMessage("or") + " " + "try another payment method."
        });
        console.error(error);
        throw error;
    }
}

async function validateStripeSource(type) {
	if (getUrlValue("client_secret") == localStorage.stripeClientSecret) {
		showLoading();
		// Since webhook charges are asynchronous let's wait a second before verifying the payment success
        await sleep(seconds(1));
        
        const data = await paymentFetch(`${Controller.DOMAIN}paymentSystems/stripe/ajax.php`, {
                action: "getPaymentStatus",
                sourceId: getUrlValue("source"),
                livemode: stripeLiveMode
            },
            {
                method: "POST"
            }
        );
        hideLoading();
        console.log("payment status", data);
        // possible status: failed, canceled, pending, chargeable, consumed, succeeded
        if (data.status == "failed" || data.status == "canceled") {

            let content = getMessage("tryAgainLater");
            if (isPayPalSubscriptionsSupported()) {
                show("#paypal");
                content += ` ${getMessage("or")} try PayPal instead.`
            }

            openGenericDialog({
                title: "Payment " + data.status,
                content: content
            });
            sendGA("stripe", 'failed or cancelled status: ' + data.status);
        } else {
            localStorage.removeItem("stripeClientSecret");
            showSuccessfulPayment();
        }
	} else {
		niceAlert("JERROR: Client not matched!");
	}
}

function openMobilePayDialog(params) {
	const $dialog = initTemplate("mobilePayDialogTemplate");

    const $img = document.createElement("img");
    $img.src = `https://jasonsavard.com/qrcode?data=${encodeURIComponent(params.url)}`;

    emptyAppend($dialog.querySelector(".dialogDescription"), 
        params.message,
        document.createElement("br"),
        document.createElement("br"),
        $img
    );

    onClickReplace($dialog.querySelector(".continue"), () => {
		showLoading();
		Controller.verifyPayment(ITEM_ID, email).then(response => {
			hideLoading();
			if (response.unlocked) {
				$dialog.close();
				showSuccessfulPayment();
			} else {
                const content = new DocumentFragment();

                const $link = document.createElement("a");
                $link.href = "https://jasonsavard.com/contact";
                $link.textContent = "contact";

                content.append("You must scan the code and complete the payment first.", createBR(), createBR(), "If you did this then ", $link, " the developer!");

				niceAlert(content);
			}
		}).catch(error => {
			$dialog.close();
			hideLoading();
			// show success anyways because they might just have extensions preventing access to my server
			showSuccessfulPayment();
			sendGA(params.type, 'failure ' + error + ' but show success anyways');
		});
    });
	openDialog($dialog);
}

async function initPaymentProcessor(price) {
	if (donateButtonClicked == "paypal") {
		sendGA("paypal", 'start');
		
		showLoading();

		// seems description is not used - if item name is entered, but i put it anyways
		const data = {
			itemId:			ITEM_ID,
			itemName:		extensionName,
			currency:		getCurrencyCode(),
			price:			price,
			description:	extensionName,
			successUrl:		`${donationPageUrl}?action=paypalSuccess`,
			errorUrl:		`${donationPageUrl}?action=paypalError`,
			cancelUrl:		`${Controller.DOMAIN}tools/redirectToExtension.php?url=${encodeURIComponent(donationPageUrl)}`
		};

		if (email) {
			data.email = email;
		}
		
		if (licenseType == "multipleUsers") {
			data.license = licenseSelected.number;
			data.action = "recurring";
		} else if (isMonthly() || isYearlyForAllExtensions()) {
			data.action = "recurring";
		}
        
        location.href = await paymentFetch(Controller.DOMAIN + "paymentSystems/paypal/createPayment.php", data, {method: "POST"});
	} else if (donateButtonClicked == "stripe" || donateButtonClicked == "wechat") {
		sendGA("stripe", 'start');
		
		function addFormField(form, name, value) {
            const $input = document.createElement("input");
            $input.name = name;
            $input.value = value;
            $input.type = "hidden";

            form.append($input);
		}

        const form = document.createElement("form");
        form.action = 'https://jasonsavard.com/payment';
        form.method = DetectClient.isChromium() ? 'post' : 'get' // seems firefox cross domain post

        addFormField(form, "paymentType",   donateButtonClicked);
		addFormField(form, "amount", 		price);
		addFormField(form, "currency", 		getCurrencyCode());
		addFormField(form, "itemId",		ITEM_ID);
		addFormField(form, "itemName",		extensionName);
		addFormField(form, "description", 	extensionName);
		addFormField(form, "livemode", 		stripeLiveMode);
		addFormField(form, "returnUrl", 	donationPageUrl);
		        
		if (email) {
			addFormField(form, "email", email);
		}

		if (licenseType == "multipleUsers") {
			addFormField(form, "license", licenseSelected.number);
			addFormField(form, "billingPeriod", "monthly");
		} else if (isMonthly()) {
			addFormField(form, "billingPeriod", "monthly");
		} else if (isYearlyForAllExtensions()) {
            addFormField(form, "billingPeriod", "yearly");
        }
		        
        document.body.append(form);
        form.submit();
        form.remove();
	} else if (donateButtonClicked == "applePay") {
		sendGA("applePay", 'start');
		
		let url = "https://jasonsavard.com/contribute?action=applePay";

		function appendParam(url, name, value) {
			return url + "&" + name + "=" + encodeURIComponent(value);
		}

		url = appendParam(url, "amount", price);	
		url = appendParam(url, "currency", getCurrencyCode());
		url = appendParam(url, "itemId", ITEM_ID);
		url = appendParam(url, "itemName", extensionName);
		url = appendParam(url, "description", extensionName);

		if (window.email) {
			url = appendParam(url, "email", window.email);
		}
		
		if (licenseType == "multipleUsers") {
			url = appendParam(url, "license", licenseSelected.number);
			url = appendParam(url, "billingPeriod", "monthly");
		} else if (isMonthly()) {
			url = appendParam(url, "billingPeriod", "monthly");
		} else if (isYearlyForAllExtensions()) {
            url = appendParam(url, "billingPeriod", "yearly");
        }

		openMobilePayDialog({
			message:	"Scan this QR code with your mobile.",
			url:		url,
			type:		"applePay"
		});
	} else if (donateButtonClicked == "coinbase") {
		sendGA("coinbase", 'start');
		
		var data = {
			action: "createCoinbaseCharge",
			name: extensionName,
			amount: price,
			currency: getCurrencyCode(),
			itemId: ITEM_ID,
			redirectUrl: `${Controller.DOMAIN}tools/redirectToExtension.php?url=${encodeURIComponent(donationPageUrl + "?action=coinbaseSuccess")}`
		}

		if (window.email) {
			data.email = window.email;
		}

		if (licenseType == "multipleUsers") {
			data.license = licenseSelected.number;
		}
			
        showLoading();
		data = await paymentFetch(`${Controller.DOMAIN}paymentSystems/coinbase/ajax.php`, data, {method: "post"});
        location.href = data.url;
	} else {
		openGenericDialog({
			title: getMessage("theresAProblem"),
			content: 'invalid payment process'
		});
	}
}

function ensureEmail(closeWindow) {
	if (!email) {
		niceAlert(getMessage("mustSignInToPay")).then(function() {
			if (closeWindow) {
				window.close();
			}
		});
	}
}

function signOut() {
	location.href = Urls.SignOut;
}

function canHaveALicense(email) {
	return isDomainEmail(email) || getUrlValue("testlicense");
}


function isPayPalSubscriptionsSupported() {
	function isInThisLang(thisLang) {
		return locale.includes(thisLang) || chrome.i18n.getUILanguage().includes(thisLang);
	}
	
	if (isInThisLang("de") || isInThisLang("zh")) {
		return false;
	} else {
		return true;
	}
}

function isMonthly() {
	return byId("paymentType").selected == "monthly" || isMonthlyForAllExtensions();
}

function isMonthlyForAllExtensions() {
    return byId("paymentType").selected == "monthly-all-extensions";
}

function isYearlyForAllExtensions() {
    return byId("paymentType").selected == "yearly-all-extensions";
}

function showAmountSelections() {
	hide("#multipleUserLicenseIntro");
	slideDown("#donateAmountWrapper");
	slideUp("#paymentMethods");
}

function getCurrencyCode() {
	return byId("currency").selected;
}

function amountSelected(amount) {
	if (isSimilarValueToUS(getCurrencyCode())) {
        if (isMonthlyForAllExtensions() || isYearlyForAllExtensions()) {
            localStorage._amountForAllExtensions = true;
        } else {
            localStorage.removeItem("_amountForAllExtensions");
        }
	}

	if (amount == "") {
        byId("amount").setCustomValidity(getMessage("enterAnAmount"));
        byId("amount").reportValidity();
		byId("amount").focus();
    } else if (isNaN(amount)) {
        byId("amount").setCustomValidity("Invalid number");
        byId("amount").reportValidity();
        byId("amount").focus();
	} else if (parseFloat(amount) < minimumDonation) {
        byId("amount").setCustomValidity(getMessage("minimumAmount", formatCurrency(minimumDonation, getCurrencyCode())));
        byId("amount").reportValidity();
        byId("amount").focus();
	} else {
		slideDown("#paymentMethods");
		hide("#multipleUserLicenseIntro");
	}
}

(async () => {

	selectorAll("title, .titleLink").forEach(el => el.textContent = extensionName);
	
	slideUp("#multipleUserLicenseWrapper");

	if (DetectClient.isFirefox()) {
		byId("video").src = "contributeVideo.html";
		byId('video').addEventListener("load", function () {
            onClickReplace(this.contentDocument.querySelector("body"), function() {
				chrome.tabs.create({ url: "https://www.youtube.com/watch?v=fKNZRkhC3OE" });
            });
		});
	} else {
		byId("video").src = "https://www.youtube.com/embed/pN9aec4QjRQ?theme=light&enablejsapi=1";
	}

    await initUI();

	const accountsWithoutErrors = getAccountsWithoutErrors(accounts);
	email = getFirstEmail( accountsWithoutErrors );
	ensureEmail(true);

	initCurrencyAndMinimums(getMessage("currencyCode"));

	/*
	var randomNumber = Math.floor(Math.random() * 2) + 1;
	if (randomNumber == 1) { // Math.random() < 0.5
		localStorage._minMonthlyPayscale = "10-5-3-2";
	} else if (randomNumber == 2) {
		localStorage._minMonthlyPayscale = "10-5-2";
		$("#monthlyAmountSelections [amount='3']").hidden();
	}
	*/

	if (canHaveALicense(email)) {
        hide("#paymentType");
    
        show("#singleUserButton");
        onClick("#singleUserButton", () => {
            slideUp("#singleUserButton");
            slideDown("#paymentType");
        });

        hide("#multipleUserLicenseLink");
        byId("multipleUserLicenseFor").textContent = getMessage("multipleUserLicenseFor", email.split("@")[1]);
        show("#multipleUserLicenseButtonWrapper");
	} else {
		/*
		if (randomNumber == 1) { // Math.random() < 0.5
			localStorage._minOnetimePayscale = "40-20-15-10";
		} else if (randomNumber == 2) {
			localStorage._minOnetimePayscale = "40-20-10";
			$("#onetimeAmountSelections [amount='15']").hidden();
		}
		*/
	}
	
    const action = getUrlValue("action");

    if (action == "paypalSuccess" || action == "stripeSuccess") {
        hideBeforeSuccessfulPayment();
        
        new Promise((resolve, reject) => {
            if (ITEM_ID == "screenshots") {
                resolve();
            } else {
                showLoading();
                Controller.verifyPayment(ITEM_ID, email).then(response => {
                    hideLoading();
                    if (response.unlocked) {
                        resolve();
                    } else {
                        const content = new DocumentFragment();

                        const $link = document.createElement("a");
                        $link.href = "https://jasonsavard.com/contact";
                        $link.textContent = "contact";

                        content.append("Could not match your email, please ", $link, " the developer!");

                        openGenericDialog({
                            title: getMessage("theresAProblem"),
                            content: content
                        });
                    }
                }).catch(error => {
                    hideLoading();
                    // show success anyways because they might just have extensions preventing access to my server
                    showSuccessfulPayment();
                    sendGA("paypal", 'failure ' + error + ' but show success anyways');
                });
            }
        }).then(() => {
            showSuccessfulPayment();
        });
    } else if (action == "paypalError" || action == "stripeError") {
        const error = getUrlValue("error") || "";
        
        openGenericDialog({
            title: getMessage("theresAProblem") + " " + error,
            content: getMessage("tryAgainLater") + " " + getMessage("or") + " " + "try another payment method instead."
        });
        
        if (action == "paypalError") {
            sendGA("paypal", 'failure ' + error);
        } else if (action == "stripeError") {
            sendGA("stripe", 'failure ' + error);
        }
    } else if (action == "stripeCancel") {
        niceAlert("Try another payment method instead.");
        if (isPayPalSubscriptionsSupported()) {
            show("#paypal");
        }
    } else if (action == "coinbaseSuccess") {
        showSuccessfulPayment();
	} else {
		// nothing
	}
	
	if (getUrlValue("ref") == "reducedDonationFromNotif") {
		niceAlert(getMessage("reducedDonationAd_popup", [getMessage("extraFeatures"), formatCurrency(minimumDonation)]), true);
	}
	
	var contributionType = getUrlValue("contributionType");
	
	if (contributionType == "monthly") {
		// nothing
	}
	
    byId("paymentType").addEventListener("paper-radio-group-changed", function() {
		initCurrencyAndMinimums(getCurrencyCode());
		
		if (window.matchMedia && window.matchMedia("(min-height: 800px)").matches) {
			showAmountSelections();
		} else {
                hide("#multipleUserLicenseIntro");
                slideUp("#extraFeaturesWrapper", 800);
			setTimeout(() => {
				showAmountSelections();
			}, 200);
		}
		sendGA("paymentTypeClicked", this.selected);
	});
	
    byId("currency").addEventListener("iron-activate", function(e) {
        const currencyCode = e.detail.selected;
		initCurrencyAndMinimums(currencyCode);
	});
	
    function attachClickToInitPayment(selector, name) {
        onClick(selector, () => {
            initPaymentDetails(name);
            sendGA("paymentProcessorClicked", name);
        });
    }

    attachClickToInitPayment("#paypal", "paypal");
    attachClickToInitPayment("#stripe, #googlePay", "stripe");
    attachClickToInitPayment("#alipay", "alipay");
    attachClickToInitPayment("#wechat-pay", "wechat");
    attachClickToInitPayment("#applePay", "applePay");

    onClick("#coinbase", () => {
		if (isMonthly() || isYearlyForAllExtensions()) {
			niceAlert("Coinbase doesn't support recurring payments, please try the other payment options.");
		} else {
			initPaymentDetails("coinbase");
			sendGA("paymentProcessorClicked", "coinbase");
		}
	});

    onClick(".amountSelections paper-button", event => {
        amount = event.target.getAttribute("amount");
        amount = Controller.convertUSDToOtherCurrency(amount, getCurrencyCode());
        amountSelected(amount)
    });

    onClick("#submitDonationAmount", () => {
        amount = getAmountNumberOnly();
        amountSelected(amount);
    });

    onClick("#amount", function() {
        this.removeAttribute("placeholder");
        slideUp("#paymentMethods");
    });

    byId("amount").addEventListener("input", function() {
        byId("amount").setCustomValidity("");
    });

    byId("amount").addEventListener("keydown", event => {
        if (event.key == 'Enter' && !event.isComposing) {
            byId("submitDonationAmount").click();
        } else {
            byId("submitDonationAmount").classList.add("visible");
        }
    });
	
    onClick("#alreadyDonated", () => {
		if (email) {
			showLoading();
			Controller.verifyPayment(ITEM_ID, email).then(response => {
				hideLoading();
				if (response.unlocked) {
					showSuccessfulPayment();
				} else {
                    const $dialog = initTemplate("noPaymentFoundDialogTemplate");
                    $dialog.querySelector("#noPaymentEmail").textContent = email;
                    openDialog($dialog).then(response => {
						if (response == "ok") {
							
						}
					});
				}
			}).catch(error => {
				hideLoading();
				openGenericDialog({
					title: getMessage("theresAProblem"),
					content: getMessage("tryAgainLater")
				});
			});
		} else {
			ensureEmail();
		}
	});
	
    onClick("#help", () => {
		location.href = "https://jasonsavard.com/wiki/Extra_features_and_contributions";
	});
	
    onClick("#multipleUserLicenseLink, #multipleUserLicenseButton", () => {
        slideUp("#multipleUserLicenseIntro");
        slideUp('#donateAmountWrapper');
		if (email) {
            byId("licenseDomain").textContent = `@${email.split("@")[1]}`;
			if (canHaveALicense(email)) {
                slideUp("#singleUserButton");
                slideUp("#paymentType");
                slideUp("#paymentMethods");
                    
                selectorAll("#licenseOptions paper-item").forEach(el => {
                    var users = el.getAttribute("users");
                    var price = el.getAttribute("price");
					
					var userText;
					var priceText;
					
					if (users == 1) {
						userText = getMessage("Xuser", 1);
						priceText = getMessage("anyAmount");
					} else if (users == "other") {
						// do nothing
					} else {
						if (users == "unlimited") {
							userText = getMessage("Xusers", getMessage("unlimited"));
						} else {
							userText = getMessage("Xusers", users);
						}
						priceText = "$" + price + "/" + getMessage("month").toLowerCase();
					}
					
					if (userText) {
                        el.querySelectorAll("div")[0].textContent = userText;
                        el.querySelectorAll("div")[1].textContent = priceText;
					}
					
                    onClickReplace(el, event => {
						sendGA("license", users + "");
						if (users == 1) {
                            slideDown("#paymentType");
                            slideUp("#paymentMethods");
                            hide("#multipleUserLicenseLink");
                            slideDown("#multipleUserLicenseIntro");
                            slideUp("#multipleUserLicenseWrapper");
						} else if (users == "other") {
							location.href = "https://jasonsavard.com/contact?ref=otherLicense";
						} else {
							if (event.ctrlKey) {
								price = 0.01;
							}
							licenseSelected = {number:users, price:price};

                            byId("paymentType").selected = "monthly";
							licenseType = "multipleUsers";
							initCurrencyAndMinimums(); // called only to set default currency to usd

							//if (isPayPalSubscriptionsSupported()) {
								//initPaymentDetails("paypal");
							//} else {
								initPaymentDetails("stripe");
							//}
						}
                    });
				});
			} else {
                hide("#licenseOnlyValidFor");
                show("#signInAsUserOfOrg");
                hide("#licenseOptions");
                
                const exampleEmail = byId("exampleEmail");
                emptyNode(exampleEmail);
				
                const span = document.createElement("span");
                span.textContent = email.split("@")[0];
            
                const company = document.createElement("b");
                company.textContent = "@mycompany.com";

                exampleEmail.append(span, company);
			}
            slideDown("#multipleUserLicenseWrapper");
		} else {
			ensureEmail();
		}
		
		sendGA("license", "start");
	});
	
    onClick("#changeDomain", () => {
		openGenericDialog({
			content: getMessage("changeThisDomain", getMessage("changeThisDomain2")),
			otherLabel: getMessage("changeThisDomain2")
        }).then(response => {
			if (response == "other") {
				signOut();
			}
		});
	});
	
    onClick("#options", () => {
		location.href = "options.html";
	});
	
	onClick(".signOutAndSignIn", () => {
		signOut();
	});
	
    onClick("#driveExtraFeatures, #driveExtraFeatures-yearly", () => {
		chrome.tabs.create({url:"https://jasonsavard.com/Checker-Plus-for-Google-Drive?ref=contributePage"});
	});

    onClick("#gmailExtraFeatures, #gmailExtraFeatures-yearly", () => {
		chrome.tabs.create({url:"https://jasonsavard.com/Checker-Plus-for-Gmail?ref=contributePage"});
	});

    onClick("#calendarExtraFeatures, #calendarExtraFeatures-yearly", () => {
		chrome.tabs.create({url:"https://jasonsavard.com/Checker-Plus-for-Google-Calendar?ref=contributePage"});
	});

    onClick("#support, #support-yearly", () => {
		chrome.tabs.create({url:"https://jasonsavard.com/forum/?ref=contributePage"});
	});

    addEventListeners("#yearly-extension-icons paper-icon-button", "mouseenter", event => {
        const $target = event.target;
        const tooltipId = $target.id.replace("-yearly", "");
        const $tooltip = selector(`paper-tooltip[for='${tooltipId}']`);
        if ($tooltip) {
            $tooltip.setAttribute("position", "top");
            $tooltip.show();
        }
    });

    addEventListeners("#yearly-extension-icons paper-icon-button", "mouseleave", event => {
        const $target = event.target;
        const tooltipId = $target.id.replace("-yearly", "");
        const $tooltip = selector(`paper-tooltip[for='${tooltipId}']`);
        if ($tooltip) {
            $tooltip.setAttribute("position", "bottom");
            $tooltip.hide();
        }
    });

	// load these things at the end
	
	// prevent jumping due to anchor # and because we can't javascript:; or else content security errors appear
    onClick("a[href='#']", event => {
        event.preventDefault();
	});

})();