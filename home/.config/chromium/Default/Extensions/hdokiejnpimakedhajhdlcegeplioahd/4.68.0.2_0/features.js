LPFeatures=function(){var r="feature-",i="no-feature-",o=$(document.body),t=function(t){var e=bg.get("g_prefoverrides")[t];return void 0===e||"1"===e},a=function(t){var e,n=bg.get("g_prefoverrides");switch(t){case"showcredmon":e=bg.get("g_showcredmon");break;default:e=n&&n[t]}return"boolean"==typeof e&&(e=e?"1":"0"),e},u=function(t,e,n){o.removeClass(i+t),o.removeClass(r+t),void 0!==n&&!0!==n||e?void 0!==n&&!1!==n||!e||o.addClass(r+t):o.addClass(i+t)},g=function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").omaria&&bg.get("LPContentScriptFeatures").omaria},e,c=function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").safari_legacy_messaging&&bg.get("LPContentScriptFeatures").safari_legacy_messaging},n,s,l=function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").emergency_access_restricted&&bg.get("LPContentScriptFeatures").emergency_access_restricted},p,b,_=function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").try_families_enabled&&bg.get("LPContentScriptFeatures").try_families_enabled},d,P=function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").one_to_one_sharing_restricted&&bg.get("LPContentScriptFeatures").one_to_one_sharing_restricted},S=function(){return bg.get("LPContentScriptFeatures")&&!!bg.get("LPContentScriptFeatures").pbkdf2_iterations_migration_enabled},f=function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").download_extension_web_prompt&&bg.get("LPContentScriptFeatures").download_extension_web_prompt},F=function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").emergency_access_repair&&bg.get("LPContentScriptFeatures").emergency_access_repair},m=function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").license_expiration&&bg.get("LPContentScriptFeatures").license_expiration},C,L,v,w;return{updateFeatures:function(t){for(var e in t){var n=a(e);void 0!==n&&u(e,"1"===n,t[e])}u("omaria",g()),u("safariLegacyMessaging",c()),bg.get("g_new_settings_enabled")&&$("#newSettingsMenuItem").addClass("visible")},allowIndividualSharing:function(){return this.allowShare()&&!this.allowShareOnlyFolders()},allowSharedFolders:function(){return this.allowShare()},allowClipboardCopy:function(){return!0},allowImport:function(){return t("import")},allowShare:function(){return t("share")},allowShareOnlyFolders:function(){return"1"===bg.get("g_prefoverrides").share_onlyfolders},allowShareDomain:function(t){return!0},allowPasswordRevert:function(){return t("revert")},allowNotes:function(){return t("show_notes")},allowTwoFactorCode:function(){return t("show_two_factor_code")},allowFingerprint:function(){return t("show_fingerprint")},allowBookmarklets:function(){return t("bookmarklets")},allowHint:function(){return t("hint")},allowGift:function(){return bg.get("LPContentScriptFeatures").gift_menu_item_button},allowBinarylessAttachmentHandling:function(){return bg.get("LPContentScriptFeatures").binaryless_attachment_handling},allowSecurityDashboard:function(){return bg.get("LPContentScriptFeatures").security_dashboard},allowLaunchApplication:function(){return bg.canLaunchApplication()},allowNewSettings:function(){return bg.get("g_new_settings_enabled")},allowTryFamilies:function(){return _()},restrictOneToOneSharing:function(){return P()},pbkdf2IterartionsMigration:function(){return S()},isDownloadExtensionWebPromptEnabled:function(){return f()},restrictEmergencyAccessForFree:function(){return l()},allowLicenseExpiration:function(){return m()},isPromotionVaultSearchEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_vault_search},isPromotionExtensionSearchEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_extension_search},isPromotionVaultSidebarG2aEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_vault_sidebar_g2a},isPromotionVaultSidebarG2wEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_vault_sidebar_g2w},isPromotionVaultSidebarG2mVariantAEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_vault_sidebar_g2m_variant_a},isPromotionVaultSidebarG2mVariantBEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_vault_sidebar_g2m_variant_b},isPromotionMenuItemG2aEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_extension_menu_item_g2a},isPromotionMenuItemG2wEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_extension_menu_item_g2w},isPromotionMenuItemG2mEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_extension_menu_item_g2m},isPromotionDialogG2aEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_extension_dialog_g2a},isPromotionDialogG2wEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_extension_dialog_g2w},isVaultPremiumFeatureIndicatorEnabled:function(){return bg.get("LPContentScriptFeatures").show_vault_premium_feature_indicator},isPromotionPromptEmailVerifyEnabled:function(){return bg.get("LPContentScriptFeatures").promotion_prompt_email_verify},isDeviceLimitNotificationEnabled:function(){return bg.get("LPContentScriptFeatures").show_device_limit_notification},isVaultPremiumPopupsEnabled:function(){return bg.get("LPContentScriptFeatures").vault_premium_popups_enabled},allowOmarIA:g,allowMigrationOptIn:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").migration_opt_in&&bg.get("LPContentScriptFeatures").migration_opt_in},allowFormfillMigration:function(){return!!bg.get("LPContentScriptFeatures").formfill_migration},allowOmarDrawer:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").omardrawer&&bg.get("LPContentScriptFeatures").omardrawer},isDogfood:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").isDogfood&&bg.get("LPContentScriptFeatures").isDogfood},safari_legacy_messaging:c,hide_cloud_apps_policy_enabled:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").hide_cloud_apps_policy_enabled&&bg.get("LPContentScriptFeatures").hide_cloud_apps_policy_enabled},familiesProvisioningUpdate:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").families_provisioning_update&&bg.get("LPContentScriptFeatures").families_provisioning_update},webClientFill:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").web_client_fill&&bg.get("LPContentScriptFeatures").web_client_fill},webClientFillTracking:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").web_client_fill_tracking&&bg.get("LPContentScriptFeatures").web_client_fill_tracking},webClientSave:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").web_client_save&&bg.get("LPContentScriptFeatures").web_client_save},webClientInfield:function(){return null!=bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures")&&void 0!==bg.get("LPContentScriptFeatures").web_client_infield&&bg.get("LPContentScriptFeatures").web_client_infield},canBackgroundOpenPopover:function(){return LPPlatform.canBackgroundOpenPopover()},mixpanelIam:function(){return bg.get("LPContentScriptFeatures").mixpanel_iam}}}();