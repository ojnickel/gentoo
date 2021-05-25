/**
 * @author blife
 * @email blife450@gmail.com
 *
 * Copyright 2016-2020 Blife Authors
 * https://custom-cursor.com
 */
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
}
class Localize {
    init() {
        $("[data-i18n]").each(function (element) {
            let message = chrome.i18n.getMessage($(this).attr('data-i18n'));
            $(this).html(message)
        });
        $("[data-i18n-title]").each(function (element) {
            let message = chrome.i18n.getMessage($(this).attr('data-i18n-title'));
            $(this).attr('title', capitalize(message))
        });
        $("[data-i18n-placeholder]").each(function (element) {
            let message = chrome.i18n.getMessage($(this).attr('data-i18n-placeholder'));
            $(this).attr('placeholder', capitalize(message))
        });

    }
}