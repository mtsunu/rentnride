angular.module('templates-app', ['Common/404.tpl.html', 'Common/footer.tpl.html', 'Common/gateway.tpl.html', 'Common/header.tpl.html', 'Common/how_it_works.tpl.html', 'User/change_password.tpl.html', 'User/dashboard.tpl.html', 'User/dashboard_settings.tpl.html', 'User/forgot_password.tpl.html', 'User/login.tpl.html', 'User/register.tpl.html', 'User/user_profile.tpl.html', 'User/user_view.tpl.html', 'Wallets/wallet.tpl.html', 'Home/home.tpl.html', 'Message/message_list.tpl.html', 'Message/message_sidebar.tpl.html', 'Message/message_view.tpl.html', 'Transactions/transaction_list.tpl.html']);

angular.module("Common/404.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Common/404.tpl.html",
    "<div class=\"container\">\n" +
    "	<div class=\"tex-center\">	\n" +
    "		<h3>404 Page Not Found</h3>\n" +
    "	</div>		\n" +
    "</div>\n" +
    "");
}]);

angular.module("Common/footer.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Common/footer.tpl.html",
    "<div class=\"footer\">\n" +
    "	<div class=\"container\">\n" +
    "    	<!-- bottom Banner start-->\n" +
    "        <div banner position=\"bottomBanner\"></div>\n" +
    "        <!-- bottom Banner end-->\n" +
    "    	<div class=\"row\">\n" +
    "            <div class=\"col-md-10 col-md-offset-1\">\n" +
    "            	<div class=\"row footer-menu\">\n" +
    "                    <div class=\"col-sm-3\">\n" +
    "                        <h3 ng-bind-html=\"$root.settings['site.name'] | html\"></h3>      \n" +
    "                        <ul class=\"list-unstyled\">\n" +
    "                            <li ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Vehicles') > -1\">\n" +
    "                                <a title=\"{{'List of Vehicles'|translate}}\" ui-sref=\"all_vehicles\">{{'List of Vehicles'|translate}}</a>\n" +
    "                            </li>\n" +
    "                            <li><a ui-sref=\"howitworks\" title=\"{{'How It Works'|translate}}\" href=\"#\">{{'How It Works'|translate}}</a></li>\n" +
    "                            <li class=\"navbar-btn\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Contacts') > -1\"><div contact-links></div></li>\n" +
    "                        </ul>       	\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-3\">\n" +
    "                        <h3>{{'HELP'|translate}}</h3>\n" +
    "                        <ul class=\"list-unstyled\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Pages') > -1\">\n" +
    "                            <li><div footer-links></div></li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-6 get-app\">\n" +
    "                        <!--<h3>{{'DOWNLOAD APP FOR SCRIPT'|translate}}</h3>\n" +
    "                        <ul class=\"list-inline\">\n" +
    "                            <li><img class=\"img-responsive center-block\" src=\"assets\\img\\app-store.png\" alt=\"app-store\"></li>\n" +
    "                            <li><img class=\"img-responsive center-block\" src=\"assets\\img\\play-store.png\" alt=\"play-store\"></li>\n" +
    "                        </ul>-->\n" +
    "                        <h3>{{'FOLLOW US ON'|translate}}</h3>\n" +
    "                        <ul class=\"list-inline social-icons\">\n" +
    "                            <li ng-show=\"$root.settings['follow.facebook_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.facebook_url']}}\" target=\"_blank\" title=\"{{'Follow me on facebook'| translate}}\">\n" +
    "                                    <i class=\"fa fa-facebook\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.google_plus_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.google_plus_url']}}\" target=\"_blank\" title=\"{{'Follow me on google plus'| translate}}\">\n" +
    "                                    <i class=\"fa fa-google-plus\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.linkedin_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.linkedin_url']}}\" target=\"_blank\" title=\"{{'Follow me on linkedin'| translate}}\">\n" +
    "                                    <i class=\"fa fa-linkedin\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.foursquare_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.foursquare_url']}}\" target=\"_blank\" title=\"{{'Follow me on foursquare'| translate}}\">\n" +
    "                                    <i class=\"fa fa-foursquare\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.pinterest_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.pinterest_url']}}\" target=\"_blank\" title=\"{{'Follow me on pinterest'| translate}}\">\n" +
    "                                    <i class=\"fa fa-pinterest\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.flickr_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.flickr_url']}}\" target=\"_blank\" title=\"{{'Follow me on flickr'| translate}}\">\n" +
    "                                    <i class=\"fa fa-flickr\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.instagram_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.instagram_url']}}\" target=\"_blank\" title=\"{{'Follow me on instagram'| translate}}\">\n" +
    "                                    <i class=\"fa fa-instagram\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.tumblr_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.tumblr_url']}}\" target=\"_blank\" title=\"{{'Follow me on tumblr'| translate}}\">\n" +
    "                                    <i class=\"fa fa-tumblr\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.youtube_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.youtube_url']}}\" target=\"_blank\" title=\"{{'Follow me on youtube'| translate}}\">\n" +
    "                                    <i class=\"fa fa-youtube\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.vimeo_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.vimeo_url']}}\" target=\"_blank\" title=\"{{'Follow me on vimeo'| translate}}\">\n" +
    "                                    <i class=\"fa fa-vimeo\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                            <li ng-show=\"$root.settings['follow.twitter_url']\">\n" +
    "                                <a href=\"{{$root.settings['follow.twitter_url']}}\" target=\"_blank\" title=\"{{'Follow me on twitter'| translate}}\">\n" +
    "                                    <i class=\"fa fa-twitter\"></i>\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                        <div class=\"clearfix\" ng-show=\"$root.settings['user.is_allow_user_to_switch_language'] == 1\">\n" +
    "                            <div ng-translate-language-select></div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "            	</div>\n" +
    "            </div>\n" +
    "      	</div>\n" +
    "        <!--p class=\"text-center\">{{'Copyright'|translate}} &copy; {{'Book or Rent'|translate}}. {{currentYear}} {{'All rights reserved'|translate}}</p-->\n" +
    "        <p class=\"text-muted list-group-item-heading bot-15-mspace text-12\"><span> © {{cdate | date:'yyyy'}}</span> <a href=\"/\" title=\"{{settings.SITE_NAME}}\"\n" +
    "            class=\"text-muted\"> {{settings.SITE_NAME}}</a>, {{'All rights reserved.'|translate}}\n" +
    "            <a href=\"https://www.agriya.com/products/car-rental-script\"\n" +
    "            target=\"_blank\" title=\"{{'Powered by RentNRide'| translate}}\"> <img src=\"assets/img/powered-rentnride.jpg\" alt=\"[Image: {{'Powered by RentnRide'| translate}}]\" title=\"{{'Powered by RentnRide'| translate}}\">                </a> ,{{' v'|translate}}1.0.b1&nbsp;{{'made in '|translate}}&nbsp;\n" +
    "            <a href=\"http://www.agriya.com/\" target=\"_blank\"\n" +
    "            title=\"{{'Agriya Web Development'| translate}}\"> <img src=\"assets/img/powered-by-agriya.png\" alt=\"[Image: {{'Agriya Web Development'| translate}}]\" title=\"{{'Agriya Web Development'| translate}}\"></a>\n" +
    "            <a href=\"http://www.cssilize.com/\" target=\"_blank\" title=\"{{'CSSilized by CSSilize, PSD to XHTML Conversion'| translate}}\">\n" +
    "            <img src=\"assets/img/cssilize.png\" alt=\"[Image: {{'CSSilized by CSSilize, PSD to XHTML Conversion'| translate}}]\"\n" +
    "            title=\"{{'CSSilized by CSSilize, PSD to XHTML Conversion'| translate}}\"> </a>\n" +
    "        </p>        \n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Common/gateway.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Common/gateway.tpl.html",
    "<!-- Admin Gateways index index start -->\n" +
    "<div id=\"get-gateways-index\">\n" +
    "    <div class=\"get-gateways\">\n" +
    "        <div class=\"ver-space\">\n" +
    "            <div id=\"paymentgateways-tab-container\" class=\"navbar-btn\">\n" +
    "                <ul class=\"nav nav-pills\">\n" +
    "                    <!-- paypal tabs -->\n" +
    "                    <li ng-if=\"paypal_enabled\" ng-class='{active:paypal_enabled }'>\n" +
    "                        <a data-target=\"#Paypal\" data-toggle=\"tab\" ng-click=\"paneChanged('paypal')\">\n" +
    "                            <img src=\"assets/img/paypal.png\" data-target=\"#Paypal\"/>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <!-- sudopay tabs -->\n" +
    "                    <li ng-repeat=\"gateway_group in gateway_groups\" ng-class='{active:$first && !paypal_enabled}'>\n" +
    "                        <a data-target=\"#{{gateway_group.id}}\" data-toggle=\"tab\" ng-click=\"paneChanged(gateway_group.display_name)\">\n" +
    "                            <img ng-src=\"{{gateway_group.thumb_url}}\" data-target=\"#{{gateway_group.id}}\"/>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <!-- Wallet tab -->\n" +
    "                    <li ng-if=\"wallet_enabled\" ng-class='{active:wallet_enabled && !paypal_enabled}'>\n" +
    "                        <a data-target=\"#Wallet\" data-toggle=\"tab\" ng-click=\"paneChanged('wallet')\">\n" +
    "                            <img src=\"assets/img/wallet-icon.png\" data-target=\"#Wallet\"/>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"tab-content\">\n" +
    "                <div ng-repeat=\"gateway_group in gateway_groups\" id=\"{{gateway_group.id}}\" class=\"tab-pane\" ng-class='{active:$first && !paypal_enabled }'>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div ng-repeat=\"payment_gateway in payment_gateways\" ng-if=\"payment_gateway.group_id == gateway_group.id\" class=\"col-sm-3\" ng-class=\"{'col-md-12': payment_gateway.group_id == 4922}\">\n" +
    " \n" +
    "                            <div ng-if=\"payment_gateway.group_id == 4922\" class=\"alert alert-info ver-mspace space navbar-btn\">{{'Please enter your credit card details below' | translate}}.</div>\n" +
    "                            <div ng-if=\"payment_gateway.group_id != 4922\" class=\"radio no-mar hor-mspace radio_buttons\">\n" +
    "                                <label class=\"custom-radio\">\n" +
    "                                    <input type=\"radio\" class=\"hide\" name=\"data\" ng-model=\"sel_payment_gateway\" id=\"PaymentGatewayIdSp{{payment_gateway.id}}\" class=\"js-payment-type js-no-pjax pull-left\" value=\"sp_{{payment_gateway.id}}\" ng-click=\"rdoclick(payment_gateway.id, payment_gateway.form_fields)\"/>\n" +
    "                                    <span for=\"PaymentGatewayIdSp{{payment_gateway.id}}\">\n" +
    "                                        <img ng-src=\"{{payment_gateway.thumb_url}}\" alt=\"{{payment_gateway.name}}\"/>\n" +
    "                                        <!--<span class=\"show\">{{payment_gateway.display_name}}</span>-->\n" +
    "                                    </span>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "					</div>\n" +
    "                    <div class=\"js-form clearfix\">\n" +
    "                        <div class=\"js-gatway_form_tpl clearfix\" ng-repeat=\"(key, value) in form_fields_tpls\" id=\"form_tpl_{{key}}\" ng-if=\"gateway_group.id == group_gateway_id\">\n" +
    "                            <div ng-if=\"show_form[key]\">\n" +
    "                                <div class=\"no-mar space clearfix\" ng-if=\"key == 'credit_card'\">\n" +
    "                                    <h4>{{'Credit card Details' | translate}}</h4>\n" +
    "                                    <div ng-include=\"form_fields[key]\" ng-if=\"key === 'credit_card'\" class=\"payment-form cc-section\"></div>\n" +
    "                                </div>\n" +
    "                                <div class=\"no-mar space clearfix\" ng-if=\"key == 'buyer'\">\n" +
    "                                    <h4>{{'Payer Details' | translate}}</h4>\n" +
    "                                    <div ng-include=\"form_fields[key]\" ng-if=\"key === 'buyer'\" class=\"payment-form\"></div>\n" +
    "                                </div>\n" +
    "                                <div class=\"no-mar space clearfix\" ng-if=\"key == 'manual'\">\n" +
    "                                    <h4>{{'Payer Details' | translate}}</h4>\n" +
    "                                    <div ng-include=\"form_fields[key]\" ng-if=\"key === 'manual'\" class=\"payment-form\"></div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                   	<div class=\"ver-space ver-mspace navbar-btn mob-clr col-xs-12 row\">\n" +
    "                        <div class=\"clearfix btn-group m-t-30\">\n" +
    "                            <button type=\"submit\" ng-disabled=\"paynow_is_disabled\" class=\"btn btn-green\" title=\"{{'Pay Now' | translate}}\">{{'Pay Now' | translate}} <span ng-show=\"paynow_is_disabled\"><i class=\"fa fa-spinner fa-pulse fa-lg\"></i></span></button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"terms-service\">\n" +
    "                        <p>{{'By clicking the \"Pay Now\" button, you agree to these '|translate}} <a target=\"_blank\" href=\"#/page/terms-and-conditions\" title=\"{{'Terms of Service'|translate}}\">{{'Terms of Service.'|translate}}</a></p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- paypal form -->\n" +
    "                <div class=\"tab-pane\" ng-class='{active: paypal_enabled}' id=\"Paypal\">\n" +
    "                    <div class=\"js-form col-xs-12 js-form navbar-btn row\">\n" +
    "                        <div class=\"clearfix btn-group m-t-30\">\n" +
    "                            <button type=\"submit\" ng-disabled=\"paynow_is_disabled\" class=\"btn btn-green\" title=\"{{'Pay Now' | translate}}\">{{'Pay Now' | translate}} <span ng-show=\"paynow_is_disabled\"><i class=\"fa fa-spinner fa-pulse fa-lg\"></i></span></button>\n" +
    "                        </div>\n" +
    "                        <div class=\"terms-service\">\n" +
    "                            <p>{{'By clicking the \"Pay Now\" button, you agree to these '|translate}} <a target=\"_blank\" href=\"#/page/terms-and-conditions\" title=\"{{'Terms of Service'|translate}}\">{{'Terms of Service.'|translate}}</a></p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <!-- wallet form -->\n" +
    "                <div class=\"tab-pane\" ng-class='{active: wallet_enabled && !paypal_enabled}' id=\"Wallet\">\n" +
    "                    <div class=\"js-form col-xs-12 js-form navbar-btn row\">\n" +
    "                        <div class=\"clearfix btn-group m-t-30\">\n" +
    "                            <p>{{'Your Available Balance:' | translate}} {{$root.default_currency.symbol}} {{user_available_balance}}</p>\n" +
    "                            <button type=\"submit\" ng-disabled=\"paynow_is_disabled\" class=\"btn btn-green\" title=\"{{'Pay Now' | translate}}\">{{'Pay Now' | translate}} <span ng-show=\"paynow_is_disabled\"><i class=\"fa fa-spinner fa-pulse fa-lg\"></i></span></button>\n" +
    "                        </div>\n" +
    "                        <div class=\"terms-service\">\n" +
    "                            <p>{{'By clicking the \"Pay Now\" button, you agree to these '|translate}} <a target=\"_blank\" href=\"#/page/terms-and-conditions\" title=\"{{'Terms of Service'|translate}}\">{{'Terms of Service.'|translate}}</a></p>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- Admin Gateways_index index end -->\n" +
    "\n" +
    "");
}]);

angular.module("Common/header.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Common/header.tpl.html",
    "<div class=\"navbar\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"navbar-header\">\n" +
    "            <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#navbar-ex-collapse\">\n" +
    "                <span class=\"sr-only\">Toggle navigation</span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "                <span class=\"icon-bar\"></span>\n" +
    "            </button>\n" +
    "            <a class=\"navbar-brand\" href=\"#\"><img ng-src=\"assets/img/logo.png\" alt=\"[Image: {{'BookorRent'| translate}}]\" title=\"{{'BookorRent'| translate}}\"></a>\n" +
    "        </div>\n" +
    "        <div class=\"collapse navbar-collapse\" id=\"navbar-ex-collapse\">\n" +
    "            <ul class=\"nav navbar-nav left-menu\"> \n" +
    "                <li ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Vehicles') > -1\" class=\"\">\n" +
    "                    <a ui-sref=\"all_vehicles\">{{'List Cars'|translate}}</a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a ui-sref=\"howitworks\">{{'How it Works'|translate}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <ul class=\"nav navbar-nav navbar-right\">\n" +
    "                <li class=\"dropdown\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('CurrencyConversions') > -1\">\n" +
    "                    <currency-conversion defaultcurrency=\"$root.default_currency\"></currency-conversion>\n" +
    "                </li>\n" +
    "                <li class=\"dropdown\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Vehicles') > -1\" ng-show=\"model.isAuthenticated() && $root.vehicle_company.is_active == 1\">\n" +
    "                    <a href=\"\" title=\"{{'Hosting' | translate}}\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "                        {{'Hosting' | translate}} <span class=\"fa fa-angle-down\"></span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                        <li ui-sref-active=\"active\">\n" +
    "                        	<a ui-sref=\"vehicleAdd\" title=\"{{'Add Vehicle' | translate}}\"><i class=\"fa fa-car fa-fw\"></i>{{'Add Vehicle' | translate}}</a>\n" +
    "                        </li>\n" +
    "                        <li ui-sref-active=\"active\">\n" +
    "                            <a ui-sref=\"myVehicles\" title=\"{{'My Vehicles' | translate}}\">\n" +
    "                                <i class=\"fa fa-car fa-fw\"></i>{{'My Vehicles' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li ui-sref-active=\"active\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('VehicleRentals') > -1\">\n" +
    "                            <a ui-sref=\"orders({statusID: 0,slug: 'all'})\" title=\"{{'Orders' | translate}}\">\n" +
    "                                <i class=\"fa fa-user-md fa-fw\"></i>{{'Orders' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li ui-sref-active=\"active\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('VehicleRentals') > -1\">\n" +
    "                            <a ui-sref=\"hostCalendar\" title=\"{{'Calendar' | translate}}\">\n" +
    "                                <i class=\"fa fa-calendar fa-fw\"></i>{{'Calendar' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <li class=\"dropdown book-dropdown\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Vehicles') > -1\">\n" +
    "                    <a title=\"{{'Booking' | translate}}\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "                        {{'Booking' | translate}} <span class=\"fa fa-angle-down\"></span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                        <li ui-sref-active=\"active\" ng-if=\"model.isAuthenticated() && $root.settings['site.enabled_plugins'].indexOf('VehicleRentals') > -1\">\n" +
    "                            <a ui-sref=\"vehicle_rental_list_status({statusID: 0,slug: 'all'})\" title=\"{{'Booking' | translate}}\">\n" +
    "                                <i class=\"fa fa-user-md fa-fw\"></i>{{'Bookings' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li ui-sref-active=\"active\" ng-if=\"model.isAuthenticated() && $root.settings['site.enabled_plugins'].indexOf('VehicleRentals') > -1\">\n" +
    "                            <a ui-sref=\"bookingCalendar\" title=\"{{'Calendar' | translate}}\">\n" +
    "                                <i class=\"fa fa-calendar fa-fw\"></i>{{'Calendar' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li ui-sref-active=\"active\">\n" +
    "                            <a ui-sref=\"home\" title=\"{{'Search' | translate}}\">\n" +
    "                                <i class=\"fa fa-search fa-fw\"></i>{{'Search' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "                <li ng-show=\"model.isAuthenticated()\">\n" +
    "                    <a ui-sref=\"message({type: 'inbox'})\" title=\"{{'Messages' | translate}}\">\n" +
    "                        {{'Messages' | translate}}\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li ui-sref-active=\"active\" ng-show=\"!model.isAuthenticated()\">\n" +
    "                    <a ui-sref=\"register\" title=\"{{'Sign Up' | translate}}\" class=\"btn btn-default\">\n" +
    "                        {{'Sign Up' | translate}}\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li ui-sref-active=\"active\" ng-show=\"!model.isAuthenticated()\">\n" +
    "                    <a ui-sref=\"login\" title=\"{{'Sign In' | translate}}\" class=\"btn btn-default\">\n" +
    "                        {{'Sign In' | translate}}\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li class=\"dropdown user-drop\" ng-show=\"model.isAuthenticated()\">\n" +
    "                    <a href=\"javascript:void(0);\" title=\"{{$root.auth.username}}\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "                        <img ng-if=\"$root.auth.user_avatar_source_id != model.ConstSocialLogin.Twitter && $root.auth.user_avatar_source_id != model.ConstSocialLogin.Github\" ng-src=\"{{$root.auth.attachmentable.thumb.small}}\" alt=\"{{$root.auth.username}}\"/>\n" +
    "                        <img ng-if=\"$root.auth.user_avatar_source_id == model.ConstSocialLogin.Twitter || $root.auth.user_avatar_source_id == model.ConstSocialLogin.Github\" ng-src=\"{{$root.auth.attachmentable.thumb.small}}\" alt=\"{{$root.auth.username}}\" height=\"{{model.thumb.small.height}}\" width=\"{{model.thumb.small.width}}\"/>\n" +
    "                        <span class=\"fa fa-angle-down\"></span>\n" +
    "                    </a>\n" +
    "                    <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                        <li ng-if=\"$root.auth.role_id == 1\">\n" +
    "                            <a href=\"ag-admin/#/dashboard\" title=\"{{'Admin Dashboard' | translate}}\" target=\"_blank\">\n" +
    "                                <i class=\"fa fa-user fa-fw\"></i>{{'Admin Dashboard' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <a href=\"#/users/dashboard\" title=\"{{'Dashboard' | translate}}\">\n" +
    "                                <i class=\"fa fa-user-md fa-fw\"></i>{{'Dashboard' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <a href=\"#/users/user_profile\" title=\"{{'Settings' | translate}}\">\n" +
    "                                <i class=\"fa fa-pencil-square-o fa-fw\"></i>{{'Settings' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                        <li>\n" +
    "                            <a href=\"#\" ng-click=\"model.logout()\" title=\"{{'Logout' | translate}}\">\n" +
    "                                <i class=\"fa fa-power-off fa-fw\"></i>{{'Logout' | translate}}\n" +
    "                            </a>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("Common/how_it_works.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Common/how_it_works.tpl.html",
    "<div class=\"page-head\">\n" +
    "    <div class=\"container\">\n" +
    "        <h2 class=\"text-uppercase\">{{'How It Works' | translate }}</h2>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"how-it-works\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-10 col-md-offset-1\">\n" +
    "            	<div class=\"responsive-view\">\n" +
    "                	<div class=\"view-block\">\n" +
    "                        <svg width=\"1000\" height=\"1000\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
    "                            <!-- Created with Method Draw - http://github.com/duopixel/Method-Draw/ --> \n" +
    "                            <g>\n" +
    "                                <g filter=\"url(#svg_1_blur)\" id=\"svg_1\">\n" +
    "                                    <rect x=\"-1\" y=\"-1\" width=\"1002\" height=\"1002\" id=\"canvas_background\" fill=\"#fff\"/>\n" +
    "                                    <g id=\"canvasGrid\" display=\"none\">\n" +
    "                                        <rect id=\"svg_2\" width=\"100%\" height=\"100%\" x=\"0\" y=\"0\" stroke-width=\"0\" fill=\"url(#gridpattern)\"/>\n" +
    "                                    </g>\n" +
    "                                </g>\n" +
    "                                <g id=\"svg_3\">\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"239.5\" y=\"327.5\" width=\"138\" height=\"40\" id=\"svg_4\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#cccccc\" stroke=\"#000\" stroke-width=\"1\" x=\"237.5\" y=\"206.5\" width=\"138\" height=\"40\" id=\"svg_6\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"416.5\" y=\"207.5\" width=\"138\" height=\"40\" id=\"svg_7\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"589.5\" y=\"326.5\" width=\"138\" height=\"40\" id=\"svg_8\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"410.5\" y=\"327.5\" width=\"138\" height=\"40\" id=\"svg_9\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#ff721c\" stroke-width=\"1\" x=\"58.5\" y=\"324.5\" width=\"138\" height=\"40\" id=\"svg_10\" stroke=\"#000\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"586.5\" y=\"207.5\" width=\"138\" height=\"40\" id=\"svg_11\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke-width=\"1\" x=\"765.5\" y=\"326.5\" width=\"136.000011\" height=\"40\" id=\"svg_12\" stroke=\"#000\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"800.5\" y=\"586.5\" width=\"138\" height=\"40\" id=\"svg_13\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"505.5\" y=\"586.5\" width=\"138\" height=\"40\" id=\"svg_14\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"645.5\" y=\"675.5\" width=\"138\" height=\"40\" id=\"svg_15\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"647.5\" y=\"751.5\" width=\"138\" height=\"40\" id=\"svg_16\" rx=\"5\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1.5\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"196.499997\" y1=\"346.5\" x2=\"239.500001\" y2=\"346.5\" id=\"svg_20\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"375.5\" y1=\"346.5\" x2=\"409.5\" y2=\"347.5\" id=\"svg_35\" stroke-linejoin=\"null\" stroke-linecap=\"null\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"547.5\" y1=\"348.5\" x2=\"590.5\" y2=\"348.5\" id=\"svg_36\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\" stroke-dasharray=\"2,2\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"725.5\" y1=\"345.5\" x2=\"763.499999\" y2=\"345.5\" id=\"svg_37\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke-dasharray=\"2,2\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"715.5\" y1=\"715.500001\" x2=\"715.5\" y2=\"748.5\" id=\"svg_40\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"819.5\" y1=\"533.499999\" x2=\"819.5\" y2=\"560.5\" id=\"svg_42\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"574.5\" y1=\"626.5\" x2=\"574.5\" y2=\"651.5\" id=\"svg_55\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke-dasharray=\"2,2\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"854.5\" y1=\"627.5\" x2=\"854.5\" y2=\"651.5\" id=\"svg_56\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke-dasharray=\"2,2\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"574.499994\" y1=\"651.5\" x2=\"853.5\" y2=\"651.5\" id=\"svg_57\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\" stroke-dasharray=\"2,2\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"718.5\" y1=\"650.5\" x2=\"718.5\" y2=\"677.5\" id=\"svg_58\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke-dasharray=\"2,2\"/>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"122.537768\" y=\"457.35485\" id=\"svg_61\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5149886037506577,0,0,0.5288793863225153,27.382888202827917,107.74497784363173) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Rent a Listing' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"288.116307\" y=\"457.961046\" id=\"svg_62\" font-size=\"19\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5098544906011929,0,0,0.5563258528709412,99.01828563547959,96.96359837334603) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Waiting For Acceptance' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"480.673825\" y=\"488.297516\" id=\"svg_63\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.603560174403958,0,0,0.5054413751459428,160.17877897891958,103.88894309666196) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Accepted' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"606.185547\" y=\"460.257605\" id=\"svg_64\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5437878996546814,0,0,0.5170468167694932,270.28795523969467,111.43072431913177) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Attended' | translate }} / {{'Check In' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"845.916423\" y=\"490.289224\" id=\"svg_65\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5608393549919128,0,0,0.48238012194633484,324.75929698348045,112.60658690845594) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Check Out' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"556.552151\" y=\"912.667966\" id=\"svg_66\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5583952835136757,0,0,0.4940183994225045,224.24797536993162,160.8019265155965) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Host Review' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"832.751591\" y=\"799.562497\" id=\"svg_67\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5156604476901938,0,0,0.5925925970077515,395.6463159656178,137.72222083806994) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Booker Review' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"716.236843\" y=\"1020.464128\" id=\"svg_68\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.6146083299609032,0,0,0.4741375539951207,251.9856052479722,214.69552601743789) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Dispute' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"641.742258\" y=\"944.264719\" id=\"svg_69\" font-size=\"17\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5319385528564453,0,0,0.6296296119689941,328.7912262380123,179.81482338905334) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Admin Decision' | translate }}</text>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"308.5\" y=\"841.5\" width=\"138\" height=\"40\" id=\"svg_71\" rx=\"5\"/>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"117.472202\" y=\"1141.64287\" id=\"svg_73\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.6672868341735322,0,0,0.5185185074806212,265.4298419399678,272.9444505870342) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Completed' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"330.772337\" y=\"371.357895\" id=\"svg_74\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.751841104287003,0,0,0.46618726771204777,33.2395625790554,56.85534497732738) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Reject' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"472.991532\" y=\"396.472997\" id=\"svg_75\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.670687170738461,0,0,0.4369377044903595,138.2159295998266,57.9763463292545) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Expired' | translate }}</text>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"651.027458\" y=\"316.812499\" id=\"svg_76\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5684364788339735,0,0,0.5925925970077515,257.226581753991,43.79629582166672) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Canceled' | translate }}</text>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"860.5\" y1=\"559.5\" x2=\"860.5\" y2=\"586.5\" id=\"svg_77\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"571.5\" y1=\"561\" x2=\"861.5\" y2=\"560\" id=\"svg_83\" stroke-linejoin=\"null\" stroke-linecap=\"null\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"572.5\" y1=\"559\" x2=\"572.5\" y2=\"587\" id=\"svg_86\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"301.5\" y1=\"247\" x2=\"301.5\" y2=\"328\" id=\"svg_87\" stroke-linejoin=\"null\" stroke-linecap=\"null\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"819.5\" y1=\"497.999997\" x2=\"819.5\" y2=\"534\" id=\"svg_88\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"819.5\" y1=\"529\" x2=\"208.499996\" y2=\"529\" id=\"svg_90\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke-width=\"1\" x=\"272.499999\" y=\"650.5\" width=\"204.000001\" height=\"40\" id=\"svg_91\" stroke=\"#000\" rx=\"5\"/>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"239.100818\" y=\"760.523354\" id=\"svg_92\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5322346164123246,0,0,0.5563258528709412,165.88457753239697,251.14036450069398) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Waiting For Payment Cleared' | translate }}</text>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"716.499995\" y1=\"860\" x2=\"447.499992\" y2=\"860\" id=\"svg_96\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke-width=\"1\" x=\"88.500009\" y=\"715.499999\" width=\"242.999991\" height=\"37.000002\" id=\"svg_98\" stroke=\"#000\" rx=\"5\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"209.5\" y1=\"529\" x2=\"209.5\" y2=\"713.000019\" id=\"svg_99\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"210.5\" y1=\"752.000006\" x2=\"210.5\" y2=\"860.000007\" id=\"svg_100\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"310.5\" y1=\"860\" x2=\"209.5\" y2=\"860\" id=\"svg_101\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"378.5\" y1=\"528\" x2=\"378.5\" y2=\"647.000003\" id=\"svg_110\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"77.096229\" y=\"705.465471\" id=\"svg_111\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5474123343065203,0,0,0.7169273151033233,49.4737910932666,234.09687545854948) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'After the threshold day  limit - Automated' | translate }}</text>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"720.5\" y1=\"666\" x2=\"474.499998\" y2=\"666\" id=\"svg_115\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke-dasharray=\"2,2\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"848.5\" y1=\"702\" x2=\"848.5\" y2=\"703\" id=\"svg_116\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke=\"#000\" stroke-width=\"1\" x=\"753.5\" y=\"207.5\" width=\"138\" height=\"40\" id=\"svg_119\" rx=\"5\"/>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"740.289427\" y=\"304.15394\" id=\"svg_120\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.5677838921546936,0,0,0.5810491404281493,349.8789393007755,56.75525374948839) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Cancel by Admin' | translate }}</text>\n" +
    "                                    <rect fill=\"#e5e5e5\" stroke-width=\"1\" x=\"728.499991\" y=\"459.5\" width=\"187.000009\" height=\"40\" id=\"svg_125\" stroke=\"#000\" rx=\"5\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"822.5\" y1=\"366.000002\" x2=\"822.5\" y2=\"460.000002\" id=\"svg_126\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\" stroke-dasharray=\"2,2\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"726.499993\" y1=\"477\" x2=\"469.49999\" y2=\"477\" id=\"svg_128\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <text fill=\"#000000\" stroke-width=\"0\" stroke-opacity=\"null\" fill-opacity=\"null\" x=\"781.489655\" y=\"557.367941\" id=\"svg_129\" font-size=\"20\" font-family=\"ProximaNova-regular, serif\" text-anchor=\"start\" xml:space=\"preserve\" transform=\"matrix(0.6365132927894592,0,0,0.5694377422332764,268.0714465677738,167.07833861932158) \" stroke=\"#000\" font-style=\"normal\" font-weight=\"normal\">{{'Waiting for Review' | translate }}</text>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"469.5\" y1=\"367\" x2=\"469.5\" y2=\"477.000003\" id=\"svg_130\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"292.5\" y1=\"690\" x2=\"292.5\" y2=\"717\" id=\"svg_131\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke-dasharray=\"2,2\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"507.5\" y1=\"667\" x2=\"507.5\" y2=\"668\" id=\"svg_135\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"715.5\" y1=\"792\" x2=\"715.5\" y2=\"862\" id=\"svg_137\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"301.5\" y1=\"284\" x2=\"827.5\" y2=\"284\" id=\"svg_138\" stroke-linejoin=\"null\" stroke-linecap=\"null\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"480.5\" y1=\"247\" x2=\"480.5\" y2=\"285\" id=\"svg_139\" stroke-linejoin=\"null\" stroke-linecap=\"null\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"652.5\" y1=\"247\" x2=\"652.5\" y2=\"284\" id=\"svg_140\" stroke-linejoin=\"null\" stroke-linecap=\"null\"/>\n" +
    "                                    <line fill=\"none\" stroke=\"#000\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"692.5\" y1=\"291\" x2=\"693.5\" y2=\"291\" id=\"svg_141\" stroke-linejoin=\"null\" stroke-linecap=\"null\"/>\n" +
    "                                    <line fill=\"none\" stroke-width=\"1\" stroke-opacity=\"null\" fill-opacity=\"null\" x1=\"826.5\" y1=\"248.000001\" x2=\"826.5\" y2=\"285\" id=\"svg_142\" stroke-linejoin=\"null\" stroke-linecap=\"null\" stroke=\"#000\"/>\n" +
    "                                    <rect fill=\"#cccccc\" stroke=\"#000\" stroke-width=\"1\" x=\"60.5\" y=\"249.5\" width=\"138\" height=\"40\" id=\"svg_5\" rx=\"5\"/>\n" +
    "                                    <rect fill=\"#cccccc\" stroke=\"#000\" stroke-width=\"1\" x=\"61.5\" y=\"156.5\" width=\"138\" height=\"40\" id=\"svg_17\" rx=\"5\"/>\n" +
    "                                    <text stroke=\"#000\" transform=\"matrix(0.6135265827178955,0,0,0.6969696879386902,39.999998688697815,57.575759291648865) \" xml:space=\"preserve\" text-anchor=\"start\" font-family=\"ProximaNova-regular, serif\" font-size=\"20\" id=\"svg_18\" y=\"177.695652\" x=\"79.051182\" fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"0\" fill=\"#000000\">{{'Search Item' | translate }}</text>\n" +
    "                                    <text stroke=\"#000\" transform=\"matrix(0.5724501609802246,0,0,0.5563258528709412,39.12081027030945,120.70016524475068) \" xml:space=\"preserve\" text-anchor=\"start\" font-family=\"ProximaNova-regular, serif\" font-size=\"20\" id=\"svg_19\" y=\"274.190031\" x=\"71.790599\" fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"0\" fill=\"#000000\">{{'Make Payment' | translate }}</text>\n" +
    "                                    <line stroke=\"#000\" stroke-linecap=\"null\" stroke-linejoin=\"null\" id=\"svg_21\" y2=\"249\" x2=\"121.5\" y1=\"197\" x1=\"121.5\" fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"1\" fill=\"none\"/>\n" +
    "                                    <line stroke-linecap=\"null\" stroke-linejoin=\"null\" id=\"svg_22\" y2=\"325\" x2=\"118.5\" y1=\"288\" x1=\"118.5\" fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"1\" stroke=\"#000\" fill=\"none\"/>\n" +
    "                                </g>\n" +
    "                            </g>\n" +
    "                        </svg>\n" +
    "            		</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("User/change_password.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("User/change_password.tpl.html",
    "<div class=\"page-head\">\n" +
    "	<div class=\"container\">\n" +
    "        <h2 class=\"text-uppercase pull-left\">{{'Change Password' | translate}}</h2>\n" +
    "        <div class=\"pull-right profile-settings\">\n" +
    "            <dashboard-settings></dashboard-settings>\n" +
    "        </div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "<div class=\"change-password\">\n" +
    "	<div class=\"container\">\n" +
    "        <form method=\"post\" class=\"row\" name=\"changePasswordForm\" ng-submit=\"change_password(changePasswordForm.$valid, user)\" novalidate>\n" +
    "       		<div class=\"form-group col-sm-4\" ng-class=\"{ 'has-error' : ((changePasswordForm.$submitted || changePasswordForm.old_password.$touched) && (changePasswordForm.old_password.$pristine || changePasswordForm.old_password.$invalid)) || user.oldPassErr }\">\n" +
    "             	<label class=\"control-label\">{{'Current Password' | translate}}</label>\n" +
    "                <input class=\"form-control\" type=\"password\" name=\"old_password\" ng-model=\"user.old_password\" placeholder=\"{{'Current Password' | translate}}\" ng-required=\"true\" ng-minlength=\"6\" ng-maxlength=\"40\" ng-change=\"user.oldPassErr=''\">\n" +
    "                <div ng-show=\"((changePasswordForm.$submitted || changePasswordForm.old_password.$touched) && (changePasswordForm.old_password.$pristine || changePasswordForm.old_password.$invalid)) || user.oldPassErr\">\n" +
    "                    <span class=\"error\" ng-show=\"(changePasswordForm.old_password.$error.required)\">{{'Enter Current Password' | translate}}</span>\n" +
    "                    <span class=\"error\" ng-show=\"(changePasswordForm.old_password.$error.minlength)\">{{'Minimum length is' | translate}} 6</span>\n" +
    "                    <span class=\"error\" ng-show=\"user.oldPassErr\">{{user.oldPassErr}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-4\" ng-class=\"{ 'has-error' : ((changePasswordForm.$submitted || changePasswordForm.password.$touched) && (changePasswordForm.password.$pristine || changePasswordForm.password.$invalid)) || user.passwordErr}\">\n" +
    "            	<label class=\"control-label\">{{'New Password' | translate}}</label>\n" +
    "                <input type=\"password\" class=\"form-control\" placeholder=\"{{'New Password' | translate }}\" name=\"password\" ng-model=\"user.password\" ng-required=\"true\" ng-minlength=\"6\" ng-maxlength=\"40\" ng-change=\"user.passwordErr=''\">\n" +
    "                <div ng-show=\"((changePasswordForm.$submitted || changePasswordForm.password.$touched) && (changePasswordForm.password.$pristine || changePasswordForm.password.$invalid)) || user.passwordErr\">\n" +
    "                    <span class=\"error\" ng-show=\"(changePasswordForm.password.$error.required)\">{{ 'Enter New Password' | translate }}</span>\n" +
    "                    <span class=\"error\" ng-show=\"(changePasswordForm.password.$error.minlength)\">{{ 'Minimum length is 6' | translate }}</span>\n" +
    "                    <span class=\"error\" ng-show=\"(changePasswordForm.password.$error.maxlength)\">{{ 'Maximum length is 20' | translate }}</span>\n" +
    "                    <span class=\"error\" ng-show=\"user.passwordErr\">{{user.passwordErr}}</span>\n" +
    "             	</div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-4\" ng-class=\"{ 'has-error' : ((changePasswordForm.$submitted || changePasswordForm.confirmPassword.$touched) && (changePasswordForm.confirmPassword.$pristine || changePasswordForm.confirmPassword.$invalid)) || user.confirmPasswordErr}\">\n" +
    "            	<label class=\"control-label\">{{'Re-type New Password' | translate}}</label>\n" +
    "                <input password-match=\"user.password\" type=\"password\" class=\"form-control\" placeholder=\"{{'Re-type New Password' | translate }}\" name=\"confirmPassword\" ng-model=\"user.confirm_password\" ng-required=\"true\" ng-minlength=\"6\" ng-maxlength=\"40\" ng-change=\"user.confirmPasswordErr=''\">\n" +
    "                <div ng-show=\"((changePasswordForm.$submitted || changePasswordForm.confirmPassword.$touched) && (changePasswordForm.confirmPassword.$pristine || changePasswordForm.confirmPassword.$invalid)) || user.confirmPasswordErr\">\n" +
    "            		<span class=\"error\" ng-show=\"(changePasswordForm.confirmPassword.$error.required)\">{{'Re-type New Password' | translate}}</span>\n" +
    "                    <span class=\"error\" ng-show=\"(changePasswordForm.confirmPassword.$error.minlength)\">{{'Minimum length is 6' | translate}}</span>\n" +
    "                    <span class=\"error\" ng-show=\"(changePasswordForm.confirmPassword.$error.maxlength)\">{{'Maximum length is 20' | translate }}</span>\n" +
    "                    <span class=\"error\" ng-show=\"(changePasswordForm.confirmPassword.$error.compareTo)\">{{'Password Mismatch' | translate }}</span>\n" +
    "                    <span class=\"error\" ng-show=\"user.confirmPasswordErr\">{{user.confirmPasswordErr}}</span>\n" +
    "             	</div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-2 pull-right\">\n" +
    "            	<button class=\"btn btn-orange btn-block\" type=\"submit\">{{'Save' | translate}}</button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("User/dashboard.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("User/dashboard.tpl.html",
    "<div class=\"dashboard-block\">\n" +
    "    <div class=\"container\">\n" +
    "        <!-- <div class=\"clearfix\">\n" +
    "            <div class=\"pull-left\">\n" +
    "                <h2>{{'Dashboard' | translate}}</h2>\n" +
    "            </div>\n" +
    "        </div> -->\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <div class=\"media\">\n" +
    "                    <div class=\"media-left\">\n" +
    "                        <a href=\"#/user/{{user.username}}\" title=\"{{user.username}}\">\n" +
    "                            <img ng-if=\"user.user_avatar_source_id != model.ConstSocialLogin.Twitter && user.user_avatar_source_id != model.ConstSocialLogin.Github\" ng-src=\"{{user.attachmentable.thumb.medium}}\" title=\"{{user.username}}\" alt=\"{{user.username}}\">\n" +
    "                            <img ng-if=\"user.user_avatar_source_id == model.ConstSocialLogin.Twitter || user.user_avatar_source_id == model.ConstSocialLogin.Github\" ng-src=\"{{user.attachmentable.thumb.medium}}\" title=\"{{user.username}}\" alt=\"{{user.username}}\" height=\"{{model.thumb.medium.height}}\" width=\"{{model.thumb.medium.width}}\">\n" +
    "                        </a>\n" +
    "                    </div>\n" +
    "                    <div class=\"media-body\">\n" +
    "                        <h3><a href=\"#/user/{{user.username}}\" title=\"{{user.username}}\">{{user.username}}</a></h3>\n" +
    "                        <p>{{user.user_profile.about_me}}</p>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label>{{'Balance' | translate}}: <span>{{getFormatCurrency(user.available_wallet_amount)}}</span></label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "          	<div class=\"col-md-6 settings-block\">\n" +
    "            	<p class=\"text-right\">\n" +
    "                	<a href=\"#/users/user_profile\" class=\"btn btn-orange\" title=\"{{'Edit User Profile'|translate}}\"><i class=\"fa fa-edit\"></i>{{'Edit'|translate}}</a>\n" +
    "               	</p>\n" +
    "                <dashboard-settings class=\"pull-right\"></dashboard-settings>\n" +
    "                <a href=\"#/wallets\" title=\"{{'Add Amount to Wallet' | translate}}\" class=\"pull-right btn btn-green-d\">{{'Add Amount to Wallet' | translate}}</a>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"clearfix company-details\" ng-if=\"$root.vehicle_company &&  $root.vehicle_company.is_active == 1\">\n" +
    "            <h3 class=\"text-uppercase\">{{'Company Details' | translate}}</h3>\n" +
    "            <div class=\"field car\">\n" +
    "                <p>{{$root.vehicle_company.name}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"field envelope\">\n" +
    "                <p>{{$root.vehicle_company.email}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"field marker\">\n" +
    "                <p>{{$root.vehicle_company.address}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"field mobile\">\n" +
    "                <p>{{$root.vehicle_company.mobile}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"field print\" ng-show=\"$root.vehicle_company.fax\">\n" +
    "                <p>{{$root.vehicle_company.fax}}</p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <!-- <div id=\"tab-container\" class=\"dashborad-tab\">\n" +
    "            <ul class=\"nav nav-pills\">\n" +
    "                <li class=\"active\">\n" +
    "                    <a class=\"show\" data-target=\"#dashboard\" data-toggle=\"tab\">{{'Dashboard'|translate}}</a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Vehicles') > -1 && $root.vehicle_company.is_active == 1\">\n" +
    "                    <a class=\"show\" data-target=\"#myvehicles\" data-toggle=\"tab\">{{'My Vehicles'|translate}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div> -->\n" +
    "        <div class=\"tab-content\">\n" +
    "            <!-- Dashboard view -->\n" +
    "            <div class=\"tab-pane active dashboard_grid\" id=\"dashboard\">\n" +
    "                <div class=\"row\">\n" +
    "                	<div class=\"\" ng-class=\"{'col-md-8 col-md-offset-2': $root.vehicle_company.is_active != 1, 'col-md-6' : $root.vehicle_company.is_active == 1}\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('VehicleRentals') > -1\">\n" +
    "                        <h3 class=\"text-uppercase\">{{'Booking Details' | translate}}</h3>\n" +
    "                        <ul class=\"list-unstyled dashboard-grid-list\">\n" +
    "                            <li class=\"col-md-3 col-xs-4\" ng-repeat=\"booking in model.bookingStats\">\n" +
    "                                <h2>\n" +
    "                                    <a title=\"{{booking.name|translate}}\" href=\"#/booking/{{booking.id}}/{{booking.name|slugify}}\">\n" +
    "                                        {{booking.booking_count}}\n" +
    "                                    </a>\n" +
    "                                </h2>\n" +
    "                                <p>{{booking.name|translate}}</p>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\" ng-show=\"$root.settings['site.enabled_plugins'].indexOf('VehicleRentals') > -1 && $root.vehicle_company.is_active == 1\">\n" +
    "                        <h3 class=\"text-uppercase\">{{'Order Details' | translate}}</h3>\n" +
    "                        <ul class=\"list-unstyled dashboard-grid-list\">\n" +
    "                            <li class=\"col-md-3 col-xs-4\" ng-repeat=\"host in model.hostStats\">\n" +
    "                                <h2>\n" +
    "                                    <a title=\"{{host.name|translate}}\" href=\"#/orders/{{host.id}}/{{host.name|slugify}}\">\n" +
    "                                        {{host.host_count}}\n" +
    "                                    </a>\n" +
    "                                </h2>\n" +
    "                                <p>{{host.name|translate}}</p>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "            <!-- My vehicles view -->\n" +
    "            <!-- <div class=\"tab-pane dashboard_grid vehicle-dashboard\" id=\"myvehicles\" ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Vehicles') > -1 && $root.vehicle_company.is_active == 1\">\n" +
    "                <div ng-include=\"model.myvehicleTpl\"></div>\n" +
    "            </div> -->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"transaction-block\">\n" +
    "    <my-transactions></my-transactions>\n" +
    "</div>\n" +
    "<div class=\"dashboard-feedback\">\n" +
    "    <user-feedback user_id=\"$root.auth.id\"></user-feedback>\n" +
    "</div>");
}]);

angular.module("User/dashboard_settings.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("User/dashboard_settings.tpl.html",
    "<div class=\"dropdown\">\n" +
    "    <a href=\"javascript:void(0);\" title=\"{{'Edit' | translate}}\" class=\"dropdown-toggle btn btn-large\" data-toggle=\"dropdown\">\n" +
    "    	{{'Settings' | translate}}\n" +
    "        <span class=\"fa fa-angle-down\"></span>\n" +
    "    </a>\n" +
    "    <ul class=\"dropdown-menu\">\n" +
    "        <li>\n" +
    "        	<a href=\"#/wallets\" title=\"{{'Add to Wallet' | translate}}\">{{'Add to Wallet' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a href=\"#/users/change_password\" title=\"{{'Change Password' | translate}}\">{{'Change Password' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            <a href=\"#/transactions\" title=\"{{'Transactions' | translate}}\">{{'Transactions' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Withdrawals') > -1\">\n" +
    "            <a href=\"#/money_transfer_account\" title=\"{{'Money Transfer Account' | translate}}\">{{'Money Transfer Account' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"$root.settings['site.enabled_plugins'].indexOf('SocialLogins') > -1\">\n" +
    "            <a href=\"#/social\" title=\"{{'Social' | translate}}\">{{'Social' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Withdrawals') > -1\">\n" +
    "            <a href=\"#/user_cash_withdrawals\" title=\"{{'Withdraw Fund Requests' | translate}}\">{{'Withdraw Fund Requests' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"$root.settings['site.enabled_plugins'].indexOf('Vehicles') > -1\">\n" +
    "            <a href=\"#/vehicle/company\" title=\"{{'Company' | translate}}\">{{'Company' | translate}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("User/forgot_password.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("User/forgot_password.tpl.html",
    "<div class=\"login-bg\">\n" +
    "    <div class=\"container\">\n" +
    "  		<div class=\"user-login forgot-password\">\n" +
    "        	<h2 class=\"text-uppercase\">{{'Forgot your password?' | translate}}</h2>\n" +
    "            <p class=\"alert alert-info\">{{'Please provide the email address. We\\'ll send you an email with new password.' | translate}}</p>\n" +
    "            <form method=\"post\" name=\"forgotPassword\" ng-submit=\"forgot_password(forgotPassword.$valid, user);\" novalidate>\n" +
    "            	<div class=\"form-group username\" ng-class=\"{ 'has-error' : (forgotPassword.$submitted || forgotPassword.email.$touched) && (forgotPassword.email.$pristine || forgotPassword.email.$invalid || forgotPassword.email.$error.email || forgotPassword.email.$error.pattern) }\">\n" +
    "                    <input class=\"form-control input-lg\" id=\"email\" type=\"email\" name=\"email\" ng-model=\"user.email\" placeholder=\"{{'Email your email' | translate}}\" required autofocus>\n" +
    "                    <div ng-show=\"(forgotPassword.$submitted || forgotPassword.email.$touched) && (forgotPassword.email.$pristine || forgotPassword.email.$invalid)\">\n" +
    "                        <span class=\"error\" ng-show=\"(forgotPassword.email.$error.required)\">{{'Required' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(forgotPassword.email.$error.email)\">{{ 'Enter valid email' | translate }}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row login-btn\">\n" +
    "                    <button type=\"submit\" class=\"btn btn-block btn-orange text-uppercase\" value=\"{{'Send' | translate}}\">{{'Send' | translate}}</button>\n" +
    "            	</div>\n" +
    "                <p class=\"text-center account-yet\">{{'Don\\'t have an account yet?'|translate}}<a ng-href=\"#/users/register\">{{'Sign up'|translate}}</a></p>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("User/login.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("User/login.tpl.html",
    "<div class=\"login-bg\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"user-login\">\n" +
    "            <h2 class=\"text-uppercase\">{{'Sign In' | translate}}</h2>\n" +
    "            <form class=\"form-login\" name=\"loginForm\" ng-submit=\"model.login(loginForm.$valid)\" novalidate>\n" +
    "                <div class=\"form-group username\" ng-class=\"{ 'has-error' : (loginForm.$submitted || loginForm.email.$touched) && (loginForm.email.$pristine || loginForm.email.$invalid || loginForm.email.$error.email)}\">\n" +
    "                        <input type=\"email\" class=\"form-control input-lg\" placeholder=\"{{'Email' | translate}}\" name=\"email\" ng-model=\"model.email\" ng-required=\"true\">\n" +
    "                    <div ng-show=\"(loginForm.$submitted || loginForm.email.$touched) && (loginForm.email.$pristine || loginForm.email.$invalid)\">\n" +
    "                        <span class=\"error\" ng-show=\"(loginForm.email.$error.required)\">{{'Required' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(loginForm.email.$error.email)\">{{ 'Enter valid email' | translate }}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group password\" ng-class=\"{ 'has-error' : (loginForm.$submitted || loginForm.password.$touched) && (loginForm.password.$pristine || loginForm.password.$invalid)}\">\n" +
    "                    <input type=\"password\" class=\"form-control input-lg\" placeholder=\"{{'Password' | translate}}\" name=\"password\" ng-model=\"model.password\" ng-required=\"true\" ng-minlength=\"6\" ng-maxlength=\"40\">\n" +
    "                    <div ng-show=\"(loginForm.$submitted || loginForm.password.$touched) && (loginForm.password.$pristine || loginForm.password.$invalid)\">\n" +
    "                        <span class=\"error\" ng-show=\"(loginForm.password.$error.required)\">{{'Required' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(loginForm.password.$error.minlength)\">{{'Minimum length is 6' | translate}}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(loginForm.password.$error.maxlength)\">{{'Maximum length is 40' | translate }}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row login-btn\">\n" +
    "                    <div class=\"col-md-6 for-passwd\">\n" +
    "                        <a href=\"#/users/forgot_password\" title=\"Forgot Password\">{{'Forgot Your password' | translate}}?</a>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <button class=\"btn btn-block btn-orange text-uppercase\" type=\"submit\">{{'Sign In' | translate}}</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "           	<social-login class=\"clearfix\"></social-login>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("User/register.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("User/register.tpl.html",
    "<div class=\"login-bg\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"user-login\">\n" +
    "            <h2 class=\"text-uppercase\">{{'Sign Up' | translate}}</h2>\n" +
    "            <form class=\"form-login\" name=\"signupForm\" ng-submit=\"model.signup(signupForm.$valid)\" novalidate>\n" +
    "                <div class=\"form-group username\" ng-class=\"{ 'has-error' : ((signupForm.$submitted || signupForm.username.$touched) && (signupForm.username.$pristine || signupForm.username.$invalid)) || model.nameErr}\">\n" +
    "                    <input type=\"text\"  class=\"form-control input-lg\" placeholder=\"{{'Username' | translate }}\" name=\"username\" ng-model=\"model.username\" ng-required=\"true\" ng-minlength=\"3\" ng-change=\"model.nameErr=''\" ng-pattern=\"/^[a-zA-Z0-9]*$/\">\n" +
    "                    <div ng-show=\"((signupForm.$submitted || signupForm.username.$touched) && (signupForm.username.$pristine || signupForm.username.$invalid)) || model.nameErr\">\n" +
    "                        <span class=\"error\" ng-show=\"((signupForm.$submitted || signupForm.username.$touched) && (signupForm.username.$pristine || signupForm.username.$invalid || signupForm.username.$error.required)) || model.nameErr\">{{'Required' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"signupForm.username.$error.minlength\">{{ 'Minimum length is 3' | translate }}</span>\n" +
    "                    	<span class=\"error\" ng-show=\"model.nameErr\">{{model.nameErr}}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.username.$error.pattern)\">{{'Enter the Username without blankspace' | translate }}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group envelop\" ng-class=\"{ 'has-error' : ((signupForm.$submitted || signupForm.email.$touched) && (signupForm.email.$pristine || signupForm.email.$invalid || signupForm.email.$error.email))|| model.emailErr}\">\n" +
    "                    <input type=\"email\" class=\"form-control input-lg\" placeholder=\"{{'Email' | translate }}\" name=\"email\" ng-model=\"model.email\" ng-required=\"true\" ng-change=\"model.emailErr=''\">\n" +
    "                    <div ng-show=\"((signupForm.$submitted || signupForm.email.$touched) && (signupForm.email.$pristine || signupForm.email.$invalid)) || model.emailErr\">\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.email.$error.required)\">{{'Required' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.email.$error.email)\">{{'Enter valid email' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"model.emailErr\">{{model.emailErr}}</span>					\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group password\" ng-class=\"{ 'has-error' : ((signupForm.$submitted || signupForm.password.$touched) && (signupForm.password.$pristine || signupForm.password.$invalid)) || model.passwordErr}\">\n" +
    "                    <input type=\"password\" class=\"form-control input-lg\" placeholder=\"{{'Password' | translate }}\" name=\"password\" ng-model=\"model.password\" ng-required=\"true\" ng-minlength=\"6\" ng-maxlength=\"40\" ng-change=\"model.passwordErr=''\">\n" +
    "                    <div ng-show=\"((signupForm.$submitted || signupForm.password.$touched) && (signupForm.password.$pristine || signupForm.password.$invalid)) || model.passwordErr\">\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.password.$error.required)\">{{ 'Required' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.password.$error.minlength)\">{{ 'Minimum length is 6' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.password.$error.maxlength)\">{{ 'Maximum length is 20' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"model.passwordErr\">{{model.passwordErr}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group password\" ng-class=\"{ 'has-error' : ((signupForm.$submitted || signupForm.confirmPassword.$touched) && (signupForm.confirmPassword.$pristine || signupForm.confirmPassword.$invalid)) || model.confirmPasswordErr}\">\n" +
    "                    <input password-match=\"model.password\" type=\"password\" class=\"form-control input-lg\" placeholder=\"{{'Confirm Password' | translate }}\" name=\"confirmPassword\"ng-model=\"model.confirm_password\" ng-required=\"true\" ng-minlength=\"6\" ng-maxlength=\"40\" ng-change=\"model.confirmPasswordErr=''\">\n" +
    "                    <div ng-show=\"((signupForm.$submitted || signupForm.confirmPassword.$touched) && (signupForm.confirmPassword.$pristine || signupForm.confirmPassword.$invalid)) || model.confirmPasswordErr\">\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.confirmPassword.$error.required)\">{{'Required' | translate}}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.confirmPassword.$error.minlength)\">{{'Minimum length is 6' | translate}}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.confirmPassword.$error.maxlength)\">{{'Maximum length is 20' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.confirmPassword.$dirty && signupForm.confirmPassword.$error.compareTo)\">{{'Password Mismatch' | translate }}</span>\n" +
    "                        <span class=\"error\" ng-show=\"model.confirmPasswordErr\">{{model.confirmPasswordErr}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "<!--                <div class=\"form-group\" ng-class=\"{ 'has-error' : model.captchaErr}\">-->\n" +
    "<!--                    <div class=\"g-recaptcha\" vc-recaptcha key=\"model.captcha_site_key\" on-create=\"setRecaptchaId(widgetId)\" on-success=\"model.captchaErr=''\"></div>-->\n" +
    "<!--                    <div class=\"error\" ng-show=\"model.captchaErr\">{{model.captchaErr}}</div>-->\n" +
    "<!--                </div>        -->\n" +
    "                <div class=\"row login-btn\" ng-class=\"{ 'has-error' : (signupForm.$submitted || signupForm.termCondition.$touched) && (signupForm.termCondition.$pristine || signupForm.termCondition.$invalid)}\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <label class=\"checkbox custom-checkbox\" for=\"checkbox1\">\n" +
    "                            <input class=\"hide\" type=\"checkbox\" name=\"termCondition\" ng-model=\"model.terms_conditions\" ng-required=\"true\" id=\"checkbox1\">\n" +
    "                            <span></span>{{'Accept' | translate }}\n" +
    "                            <a title=\"{{'Terms and conditions' | translate}}\" ui-sref=\"pages({ slug: 'terms-and-conditions' })\" target=\"_blank\">{{'Terms and Conditions' | translate}}</a>\n" +
    "                        </label>\n" +
    "                        <span class=\"error\" ng-show=\"(signupForm.$submitted || signupForm.termCondition.$touched) && (signupForm.termCondition.$pristine || signupForm.termCondition.$invalid) && (signupForm.termCondition.$error.required)\">{{'Required' | translate }}</span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <button type=\"submit\" class=\"btn btn-block btn-orange text-uppercase\">{{'Sign Up' | translate }}</button>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form> \n" +
    "        	<social-login class=\"clearfix\"></social-login>  \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("User/user_profile.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("User/user_profile.tpl.html",
    "<div class=\"form-block\">\n" +
    "    <div class=\"page-head\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"pull-left\">\n" +
    "                <h2 class=\"text-uppercase\">{{'Edit Profile' | translate}}</h2>\n" +
    "                <p>{{'Please enter your personal information and company information' | translate}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"pull-right profile-settings\">\n" +
    "                <dashboard-settings></dashboard-settings>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "	<div class=\"form-field\">\n" +
    "        <div class=\"container\">\n" +
    "          	<div class=\"row\">\n" +
    "                <div class=\"col-md-3 pro-pic\">\n" +
    "                    <a href=\"#/user/{{user.username}}\" title=\"{{user.username}}\">\n" +
    "                        <img ng-if=\"user.user_avatar_source_id != model.ConstSocialLogin.Twitter && user.user_avatar_source_id != model.ConstSocialLogin.Github\" ng-src=\"{{user.attachmentable.thumb.large}}\" title=\"{{user.username}}\" alt=\"{{user.username}}\" class=\"img-responsive\">\n" +
    "                        <img ng-if=\"user.user_avatar_source_id == model.ConstSocialLogin.Twitter || user.user_avatar_source_id == model.ConstSocialLogin.Github\" ng-src=\"{{user.attachmentable.thumb.large}}\" title=\"{{user.username}}\" alt=\"{{user.username}}\" height=\"{{model.thumb.medium.height}}\" width=\"{{model.thumb.medium.width}}\" class=\"img-responsive\">\n" +
    "                    </a>\n" +
    "                    <span class=\"input-file text-center\"><a href=\"#/profile_image\"><i class=\"fa fa-cloud-upload\"></i>{{'Change image' | translate }}</a></span>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-9\">\n" +
    "                    <form class=\"\" enctype=\"multipart/form-data\" name=\"userprofileEdit\" ng-submit=\"model.userProfile(userprofileEdit.$valid)\" novalidate>\n" +
    "                        <div class=\"clearfix\">\n" +
    "                            <h4>{{'Personal Info' | translate }}</h4>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : (userprofileEdit.$submitted || userprofileEdit.first_name.$touched) && (userprofileEdit.first_name.$pristine || userprofileEdit.first_name.$invalid) && (userprofileEdit.first_name.$error.required)}\">\n" +
    "                                    <label class=\"control-label\" for=\"first_name\">{{'First Name' | translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"text\" class=\"form-control\" name=\"first_name\" id=\"first_name\" placeholder=\"{{'First Name' | translate}}\" ng-model=\"model.user_profile.first_name\" ng-required=\"true\"/>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.first_name.$touched) && (userprofileEdit.first_name.$pristine || userprofileEdit.first_name.$invalid) && (userprofileEdit.first_name.$error.required)\" class=\"error\">{{'Required' | translate }}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : (userprofileEdit.$submitted || userprofileEdit.last_name.$touched) && (userprofileEdit.last_name.$pristine || userprofileEdit.last_name.$invalid || userprofileEdit.last_name.$error.pattern)}\">\n" +
    "                                    <label class=\"control-label\" for=\"last_name\">{{'Last Name' | translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"text\" class=\"form-control\" name=\"last_name\" id=\"last_name\" ng-pattern=\"/^[a-zA-Z]*$/\" placeholder=\"{{'Last Name' | translate}}\" ng-model=\"model.user_profile.last_name\" ng-required=\"true\"/>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.last_name.$touched) && (userprofileEdit.last_name.$pristine || userprofileEdit.last_name.$invalid) && (userprofileEdit.last_name.$error.required)\" class=\"error\">{{'Required' | translate }}</span>\n" +
    "                                        <span ng-show=\"(userprofileEdit.last_name.$error.pattern)\" class=\"error\">\n" +
    "                                            {{'Enter the Last Name without Numbers and Blankspace'|translate}}\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : (userprofileEdit.$submitted || userprofileEdit.about_me.$touched) && (userprofileEdit.about_me.$pristine || userprofileEdit.about_me.$invalid)}\">\n" +
    "                                    <label class=\"control-label\" for=\"about_me\">{{'About me' | translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <textarea class=\"form-control\" id=\"about_me\" name=\"about_me\" placeholder=\"{{'About me' | translate}}\" ng-model=\"model.user_profile.about_me\" required></textarea>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.about_me.$touched) && (userprofileEdit.about_me.$pristine || userprofileEdit.about_me.$invalid) && (userprofileEdit.about_me.$error.required)\" class=\"error\">{{'Required' | translate }}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : userprofileEdit.file.$error.maxSize}\">\n" +
    "                                    <label class=\"control-label\" for=\"inputFile\">{{'Avatar'|translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"file\" ngf-select ng-model=\"file\" name=\"file\" accept=\".png,.jpg\" ngf-max-size=\"2MB\" id=\"inputFile\">\n" +
    "                                        <span ng-show=\"userprofileEdit.file.$error.maxSize\" class=\"error\">{{'File too large, please upload less than 2MB file'|translate}}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        \n" +
    "                        <div class=\"clearfix social-info\">\n" +
    "                            <h4>{{'Social Info' | translate }}</h4>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : (userprofileEdit.$submitted || userprofileEdit.website.$touched) && (userprofileEdit.website.$pristine || userprofileEdit.website.$invalid) && (userprofileEdit.website.$error.url)}\">\n" +
    "                                    <label class=\"control-label\" for=\"website\">{{'Website' | translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"url\" class=\"form-control\" name=\"website\" id=\"website\" placeholder=\"{{'Website' | translate}}\" ng-model=\"model.user_profile.website\"/>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.website.$touched) && (userprofileEdit.website.$pristine || userprofileEdit.website.$invalid) && (userprofileEdit.website.$error.url)\" class=\"error\">{{'Enter Valid URL' | translate }}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : (userprofileEdit.$submitted || userprofileEdit.facebook_profile_link.$touched) && (userprofileEdit.facebook_profile_link.$pristine || userprofileEdit.facebook_profile_link.$invalid) && (userprofileEdit.facebook_profile_link.$error.url)}\">\n" +
    "                                    <label class=\"control-label\" for=\"facebook_profile_link\">{{'Facebook profile link' | translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"url\" class=\"form-control\" name=\"facebook_profile_link\" id=\"facebook_profile_link\" placeholder=\"{{'Facebook profile link' | translate}}\" ng-model=\"model.user_profile.facebook_profile_link\"/>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.facebook_profile_link.$touched) && (userprofileEdit.facebook_profile_link.$pristine || userprofileEdit.facebook_profile_link.$invalid) && (userprofileEdit.facebook_profile_link.$error.url)\" class=\"error\">{{'Enter Valid URL' | translate }}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : (userprofileEdit.$submitted || userprofileEdit.twitter_profile_link.$touched) && (userprofileEdit.twitter_profile_link.$pristine || userprofileEdit.twitter_profile_link.$invalid) && (userprofileEdit.twitter_profile_link.$error.url)}\">\n" +
    "                                    <label class=\"control-label\" for=\"twitter_profile_link\">{{'Twitter profile link' | translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"url\" class=\"form-control\" name=\"twitter_profile_link\" id=\"twitter_profile_link\" placeholder=\"{{'Twitter profile link' | translate}}\" ng-model=\"model.user_profile.twitter_profile_link\"/>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.twitter_profile_link.$touched) && (userprofileEdit.twitter_profile_link.$pristine || userprofileEdit.twitter_profile_link.$invalid) && (userprofileEdit.twitter_profile_link.$error.url)\" class=\"error\">{{'Enter Valid URL' | translate }}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error': (userprofileEdit.$submitted || userprofileEdit.google_plus_profile_link.$touched) && (userprofileEdit.google_plus_profile_link.$pristine || userprofileEdit.google_plus_profile_link.$invalid) && (userprofileEdit.google_plus_profile_link.$error.url)}\">\n" +
    "                                    <label class=\"control-label\" for=\"google_plus_profile_link\">{{'Google Plus profile link' | translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"url\" class=\"form-control\" name=\"google_plus_profile_link\" id=\"google_plus_profile_link\" placeholder=\"{{'Google Plus profile link' | translate}}\" ng-model=\"model.user_profile.google_plus_profile_link\"/>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.google_plus_profile_link.$touched) && (userprofileEdit.google_plus_profile_link.$pristine || userprofileEdit.google_plus_profile_link.$invalid) && (userprofileEdit.google_plus_profile_link.$error.url)\" class=\"error\">{{'Enter Valid URL' | translate }}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\">\n" +
    "                                 <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : (userprofileEdit.$submitted || userprofileEdit.linkedin_profile_link.$touched) && (userprofileEdit.linkedin_profile_link.$pristine || userprofileEdit.linkedin_profile_link.$invalid) && (userprofileEdit.linkedin_profile_link.$error.url)}\">\n" +
    "                                    <label class=\"control-label\" for=\"linkedin_profile_link\">{{'LinkedIn profile link' | translate}}\n" +
    "                                    </label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"url\" class=\"form-control\" name=\"linkedin_profile_link\" id=\"linkedin_profile_link\" placeholder=\"{{'LinkedIn profile link' | translate}}\" ng-model=\"model.user_profile.linkedin_profile_link\"/>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.linkedin_profile_link.$touched) && (userprofileEdit.linkedin_profile_link.$pristine || userprofileEdit.linkedin_profile_link.$invalid) && (userprofileEdit.linkedin_profile_link.$error.url)\" class=\"error\">{{'Enter Valid URL' | translate }}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : (userprofileEdit.$submitted || userprofileEdit.youtube_profile_link.$touched) && (userprofileEdit.youtube_profile_link.$pristine || userprofileEdit.youtube_profile_link.$invalid) && (userprofileEdit.youtube_profile_link.$error.url) }\">\n" +
    "                                    <label class=\"control-label\" for=\"youtube_profile_link\">{{'Youtube profile link' | translate}}</label>\n" +
    "                                    <div class=\"clearfix\">\n" +
    "                                        <input type=\"url\" class=\"form-control\" name=\"youtube_profile_link\" id=\"youtube_profile_link\" placeholder=\"{{'Youtube profile link' | translate}}\" ng-model=\"model.user_profile.youtube_profile_link\"/>\n" +
    "                                        <span ng-show=\"(userprofileEdit.$submitted || userprofileEdit.youtube_profile_link.$touched) && (userprofileEdit.youtube_profile_link.$pristine || userprofileEdit.youtube_profile_link.$invalid) && (userprofileEdit.youtube_profile_link.$error.url)\" class=\"error\">{{'Enter Valid URL' | translate }}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"clearfix form-footer\">\n" +
    "                            <button class=\"btn btn-orange\" type=\"submit\">{{'Update' | translate }}</button>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "        	</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <vehicle-company></vehicle-company>\n" +
    "</div>\n" +
    "");
}]);

angular.module("User/user_view.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("User/user_view.tpl.html",
    "<div class=\"user-view-details\">\n" +
    "	<div class=\"container\">\n" +
    "    	<div class=\"media\">\n" +
    "            <div class=\"media-left\">\n" +
    "            	<a href=\"#/user/{{model.user.username}}\" title=\"{{model.user.username}}\">\n" +
    "                    <img ng-if=\"model.user.user_avatar_source_id != model.ConstSocialLogin.Twitter && model.user.user_avatar_source_id != model.ConstSocialLogin.Github\" ng-src=\"{{model.user.attachmentable.thumb.medium}}\" title=\"{{model.user.username}}\" class=\"img-responsive\" alt=\"{{model.user.username}}\">\n" +
    "                    <img ng-if=\"model.user.user_avatar_source_id == model.ConstSocialLogin.Twitter || model.user.user_avatar_source_id == model.ConstSocialLogin.Github\" ng-src=\"{{model.user.attachmentable.thumb.medium}}\" title=\"{{model.user.username}}\" class=\"img-responsive\" alt=\"{{model.user.username}}\" height=\"{{model.thumb.medium.height}}\" width=\"{{model.thumb.medium.width}}\">\n" +
    "           		</a>\n" +
    "            </div>\n" +
    "            <div class=\"media-body\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <h3 class=\"clearfix\">\n" +
    "                    	<a href=\"#/user/{{model.user.username}}\" title=\"{{model.user.username}}\" class=\"pull-left\">\n" +
    "                            {{model.user.username}}\n" +
    "                        </a>\n" +
    "                    </h3>\n" +
    "                    <p class=\"clearfix\">\n" +
    "                        {{model.user.user_profile.about_me}}\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "      	</div>\n" +
    "        <div class=\"clearfix\" ng-show=\"model.user.user_profile.website || model.user.user_profile.facebook_profile_link || model.user.user_profile.google_plus_profile_link || model.user.user_profile.twitter_profile_link || model.user.user_profile.linkedin_profile_link || model.user.user_profile.youtube_profile_link\">\n" +
    "        	<h2 class=\"text-uppercase\">{{'Reference' | translate }}</h2>\n" +
    "            <ul class=\"list-inline\">\n" +
    "            	<li ng-if=\"model.user.user_profile.website\">\n" +
    "                    <a href=\"{{model.user.user_profile.website}}\" target=\"_blank\" class=\"globe\"><i class=\"fa fa-globe fa-fw\"></i></a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"model.user.user_profile.facebook_profile_link\">\n" +
    "                    <a href=\"{{model.user.user_profile.facebook_profile_link}}\" target=\"_blank\" class=\"facebook\"><i class=\"fa fa-facebook fa-fw\"></i></a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"model.user.user_profile.google_plus_profile_link\">\n" +
    "                    <a href=\"{{model.user.user_profile.google_plus_profile_link}}\" target=\"_blank\" class=\"google\"><i class=\"fa fa-google-plus fa-fw\"></i></a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"model.user.user_profile.twitter_profile_link\">\n" +
    "                    <a href=\"{{model.user.user_profile.twitter_profile_link}}\" target=\"_blank\" class=\"twitter\"><i class=\"fa fa-twitter fa-fw\"></i> </a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"model.user.user_profile.linkedin_profile_link\">\n" +
    "                    <a href=\"{{model.user.user_profile.linkedin_profile_link}}\" target=\"_blank\" class=\"linkedin\"><i class=\"fa fa-linkedin fa-fw\"></i></a>\n" +
    "                </li>\n" +
    "                <li ng-if=\"model.user.user_profile.youtube_profile_link\">\n" +
    "                    <a href=\"{{model.user.user_profile.youtube_profile_link}}\" target=\"_blank\" class=\"youtube\"><i class=\"fa fa-youtube fa-fw\"></i></a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "        <div class=\"clearfix\" ng-show=\"model.user.providerUser.data.length > 0\">\n" +
    "            <h2 class=\"text-uppercase\">{{'Connect' | translate }}</h2>\n" +
    "            <ul class=\"list-inline\">\n" +
    "                <li ng-repeat=\"provider in model.user.providerUser.data\">\n" +
    "                    <a href=\"javascript:void(0);\" class=\"facebook\" ng-show=\"provider.provider_id == model.ConstSocialLogin.Facebook\">\n" +
    "                        <i class=\"fa fa-facebook fa-fw\"></i>\n" +
    "                    </a>\n" +
    "                    <a href=\"javascript:void(0);\" class=\"twitter\" ng-show=\"provider.provider_id == model.ConstSocialLogin.Twitter\">\n" +
    "                        <i class=\"fa fa-twitter fa-fw\"></i>\n" +
    "                    </a>\n" +
    "                    <a href=\"javascript:void(0);\" class=\"google\" ng-show=\"provider.provider_id == model.ConstSocialLogin.Google\">\n" +
    "                        <i class=\"fa fa-google fa-fw\"></i>\n" +
    "                    </a>\n" +
    "                    <a href=\"javascript:void(0);\" class=\"github\" ng-show=\"provider.provider_id == model.ConstSocialLogin.Github\">\n" +
    "                        <i class=\"fa fa-github fa-fw\"></i>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<user-feedback user_id=\"model.user.id\"></user-feedback>");
}]);

angular.module("Wallets/wallet.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Wallets/wallet.tpl.html",
    "<div class=\"page-head\">\n" +
    "	<div class=\"container\">\n" +
    "    	<h2 class=\"text-uppercase pull-left\">{{'Add to Wallet' | translate}}</h2>\n" +
    "        <div class=\"pull-right profile-settings\">\n" +
    "            <dashboard-settings></dashboard-settings>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"add-wallet\">\n" +
    "	<div class=\"container\">\n" +
    "    	<form role=\"form\" class=\"clearfix\" name=\"PaymentForm\" ng-submit=\"PaymentSubmit(PaymentForm)\" novalidate>\n" +
    "        	<div class=\"row wallet-amount\">\n" +
    "                <div class=\"form-group col-sm-6\" ng-class=\"{ 'has-error' : ((PaymentForm.$submitted || PaymentForm.amount.$touched) && (PaymentForm.amount.$pristine || PaymentForm.amount.$invalid)) || amountErr }\">\n" +
    "                	<div class=\"row\">        \n" +
    "                       	<label class=\"col-sm-3 col-md-2 control-label\" for=\"amount\">{{'Amount' | translate}}({{$root.default_currency.symbol}})</label>\n" +
    "                        <div class=\"col-sm-9 col-md-10\">\n" +
    "                            <input type=\"number\" class=\"form-control\" name=\"amount\" id=\"amount\" placeholder=\"{{'Amount' | translate}}\" ng-model='wallet.amount' ng-required=\"true\" min=\"{{min_wallet_amount}}\" max=\"{{max_wallet_amount}}\" ng-change=\"amountErr=''\"/>\n" +
    "                            <div ng-show=\"((PaymentForm.$submitted || PaymentForm.amount.$touched) && (PaymentForm.amount.$pristine || PaymentForm.amount.$invalid)) || amountErr\">\n" +
    "                                <span class=\"error\" ng-show=\"(PaymentForm.amount.$error.required)\">\n" +
    "                                    {{'Enter Amount'|translate }}\n" +
    "                                </span>\n" +
    "                                <span class=\"error\" ng-show=\"(PaymentForm.amount.$error.number)\">\n" +
    "                                    {{'You did not enter a valid number' | translate}}\n" +
    "                                </span>\n" +
    "                                <span class=\"error\" ng-show=\"(PaymentForm.amount.$error.min)\">\n" +
    "                                    {{'Your field value is lesser than the minimum value' | translate}}\n" +
    "                                </span>\n" +
    "                                <span class=\"error\" ng-show=\"(PaymentForm.amount.$error.max)\">\n" +
    "                                    {{'Your field value is greater than the maximum value' | translate}}\n" +
    "                                </span>\n" +
    "                                <span ng-show=\"amountErr\" class=\"error\">{{amountErr}}</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                  	</div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-sm-2 hide\">\n" +
    "                    <button class=\"btn btn-block btn-orange\" id=\"js-wallet-form-submit\" type=\"submit\">{{'Submit' | translate }}</button>\n" +
    "                </div>\n" +
    "                <div class=\"clearfix\"></div>\n" +
    "            	<ul class=\"list-inline\">\n" +
    "                    <li>{{'Minimum wallet amount'|translate}}:&nbsp;<span>{{getFormatCurrency(min_wallet_amount, 'site')}}</span></li>\n" +
    "                    <li>{{'Maximum wallet amount'|translate}}:&nbsp;<span>{{getFormatCurrency(max_wallet_amount, 'site')}}</span></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"vehicle-payment\">\n" +
    "            	<div class=\"payment-left\">\n" +
    "                    <div class=\"payment-form\">\n" +
    "              			<div ng-include=\"gatewayTpl\"></div>\n" +
    "                    </div>\n" +
    "				</div>\n" +
    "            </div>\n" +
    "            <div class=\"hide\">\n" +
    "                <input type=\"text\" ng-model=\"gateway_id\">\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Home/home.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Home/home.tpl.html",
    "<vehicle-search></vehicle-search>\n" +
    "\n" +
    "<!-- Start: Quote -->\n" +
    "<div class=\"section-quote\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-10 col-md-offset-1 text-center\">\n" +
    "                <!--<p>{{'Booking systems provides our clients with solutions to control, manage and drive their live event businesses forward through our innovative rental management software. Working together we help organisation within the production industries, reduce cost and improve their efficiency giving them a competitive edge and increasing their profitability' | translate}}.</p>\n" +
    "                <ul class=\"list-inline\">\n" +
    "                    <li class=\"active\"><a class=\"btn btn-orange-w\" href=\"#\">{{'Get a Quote'|translate}}</a></li>\n" +
    "                    <li><a href=\"#\" class=\"btn btn-orange-w\"><i class=\"fa fa-fw fa-play\"></i>{{'Watch Video'|translate}}</a></li>\n" +
    "                </ul>-->\n" +
    "                <p>{{'Today\\'s world the scope of vehicle rental was growing big level. With the current marketplace trends, Agriya has developed an impressive as well as comfortable car rental application.' | translate}}.\n" +
    "                </p>\n" +
    "                <p><a ui-sref=\"all_vehicles\" class=\"btn btn-orange-w\" title=\"{{'view all vehicles'|translate}}\">{{'View all vehicles'|translate}}</a></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- End: Quote -->\n" +
    "\n" +
    "<!-- Start: How it works -->\n" +
    "<div class=\"how-it-works text-center\">\n" +
    "	<div class=\"container\">\n" +
    "    	<div class=\"col-md-10 col-md-offset-1\">\n" +
    "        	<h1>{{'How it Works'|translate}}</h1>\n" +
    "            <p>{{'Your most economical ride, it has survived not only five countries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing'|translate}}.</p>\n" +
    "            <div class=\"row icon-img\">\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                	<img class=\"img-responsive center-block\" src=\"assets\\img\\car-icon.png\" alt=\"car-icon\">\n" +
    "                    <h3>{{'Find your Car'|translate}}</h3>\n" +
    "                    <ul class=\"list-unstyled text-left\">\n" +
    "                    	<li>{{'Tell us where you have to go'|translate}}.</li>\n" +
    "                        <li>{{'Choose a date and time'|translate}}.</li>\n" +
    "                        <li>{{'User filters to get the car for you'|translate}}.</li>	\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                	<img class=\"img-responsive center-block\" src=\"assets\\img\\make-payment.png\" alt=\"make-payment\">\n" +
    "                    <h3>{{'Make Payment'|translate}}</h3>\n" +
    "                    <ul class=\"list-unstyled text-left\">\n" +
    "                    	<li>{{'Check to make sure everythings just right'|translate}}.</li>\n" +
    "                        <li>{{'Enter your payment info, and be on the choose your car way to go'|translate}}.</li>\n" +
    "                        <li>{{'If you need anything let us book or rent'|translate}}.</li>	\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-sm-4\">\n" +
    "                	<img class=\"img-responsive center-block\" src=\"assets\\img\\drive.png\" alt=\"drive\">\n" +
    "                    <h3>{{'Drive Yourself'|translate}}</h3>\n" +
    "                    <ul class=\"list-unstyled text-left\">\n" +
    "                    	<li>{{'Get help finding your car and instruction when you drive, all in your way details'|translate}}.</li>\n" +
    "                        <li>{{'Make edit anytime or cancel upto 24 hours before your choose'|translate}}.</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- End: How it works -->\n" +
    "\n" +
    "<!-- Start: Benefits of bookorrent -->\n" +
    "<div class=\"befefits-bookorrent\">\n" +
    "	<div class=\"container\">\n" +
    "        <h1>{{'WHY CHOOSE BOOK OR RENT'|translate}}?</h1>\n" +
    "        <p>{{\"you'll receive competitive cars from our location within minutes\"|translate}}.</p>\n" +
    "        <h3>{{'How do you benefit'|translate}}?</h3>\n" +
    "        <ul class=\"list-unstyled col-md-6\">\n" +
    "            <li>{{\"you'll receive competitive cars from our location within minutes\"|translate}}.</li>\n" +
    "            <li>{{'Keeping up-to-date is easy with our realtime chat, 24/7 support, time tracker and mobile apps'|translate}}.</li>\n" +
    "            <li>{{'pay for work safety and secuirely. Only release payment when you are 100% satified with the work provided'|translate}}!</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- End: Benefits of bookorrent -->\n" +
    "\n" +
    "<vehicle-list></vehicle-list>\n" +
    "<all-feedback></all-feedback>");
}]);

angular.module("Message/message_list.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Message/message_list.tpl.html",
    "<div class=\"page-head\">\n" +
    "	<div class=\"container\">\n" +
    "    	<h2 class=\"text-uppercase\">{{'Messages' | translate}} - \n" +
    "            <span ng-show=\"type == 'inbox'\">{{'Inbox' | translate}}</span>\n" +
    "            <span ng-show=\"type == 'sentmail'\">{{'Sent' | translate}}</span>\n" +
    "            <span ng-show=\"type == 'starred'\">{{'Starred' | translate}}</span>\n" +
    "        </h2>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"message\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-3 col-md-2\">\n" +
    "                <div ng-include=\"sidebar_tpl\" class=\"message-sidebar\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-9 col-md-10\">\n" +
    "                <div class=\"message-view\">\n" +
    "                    <div class=\"table-responsive\">\n" +
    "                        <table class=\"table table-hover\">\n" +
    "                            <tr ng-repeat=\"message in messages\" ng-if=\"_metadata.total > 0\">\n" +
    "                                <td>\n" +
    "                                    <span class=\"fa fa-fw\" ng-class=\"(message.is_starred) == 1 ? 'fa-star' : 'fa-star-o'\" ng-click=\"StarMessage(message.id, message.is_starred)\"></span>\n" +
    "                                </td>\n" +
    "                                <td>\n" +
    "                                    <a href=\"#/user/{{message.from_user.username}}\" title=\"{{message.from_user.username}}\">{{message.from_user.username}}</a>\n" +
    "                                </td>\n" +
    "                                <td width=\"600\" class=\"status-mail\">\n" +
    "                                    <a href=\"#/message/{{message.id}}/{{type}}\" title=\"{{message.message_content.subject}}\"><span ng-bind-html=\"message.message_content.subject\"></span></a>\n" +
    "                                </td>\n" +
    "                                <td>\n" +
    "                                    {{message.created_at}}\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                            <tr class=\"text-center\" ng-show=\"_metadata.total === 0\">\n" +
    "                                <td colspan=\"4\">\n" +
    "                                    <p class=\"alert alert-danger\">{{'No Record Found' |translate}}</p>\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "                    <div class=\"paging clearfix text-center\" ng-show=\"_metadata.total > 0\">\n" +
    "                        <uib-pagination previous-text=\"&#xf0d9\" next-text=\"&#xf0da\" total-items=\"_metadata.total\" num-pages=\"_metadata.total_pages\" ng-model=\"currentPage\" max-size=\"maxSize\" class=\"pagination-sm\" boundary-link-numbers=\"true\" rotate=\"false\" items-per-page=\"_metadata.per_page\" ng-change=\"paginate()\"></uib-pagination>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("Message/message_sidebar.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Message/message_sidebar.tpl.html",
    "<ul class=\"list-unstyled\">\n" +
    "    <li><a ui-sref=\"message({type:'inbox'})\" title=\"{{'Inbox' | translate}}\"><i class=\"fa fa-inbox\"></i>{{'Inbox' | translate}}</a></li>\n" +
    "    <li><a ui-sref=\"message({type:'sentmail'})\" title=\"{{'SentMail' | translate}}\"><i class=\"fa fa-sign-out\"></i>{{'Sent' | translate}}</a></li>\n" +
    "    <li><a ui-sref=\"message({type:'starred'})\" title=\"{{'Starred' | translate}}\"><i class=\"fa fa-star\"></i>{{'Starred' | translate}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("Message/message_view.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Message/message_view.tpl.html",
    "<div class=\"page-head\">\n" +
    "	<div class=\"container\">\n" +
    "    	<h2 class=\"text-uppercase\">{{'Message View' | translate}}</h2>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"message\">\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-3 col-md-2\">\n" +
    "                <div ng-include=\"sidebar_tpl\" class=\"message-sidebar\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-9 col-md-10\">\n" +
    "                <div class=\"mail-view clearfix\">\n" +
    "                    <a class=\"btn btn-orange\" ng-if=\"message_type == 'sentmail'\" ui-sref=\"message({type:'sentmail'})\" title=\"{{'Back to Sent Mail' | translate}}\">{{'Back to Sent Mail' | translate}}</a>\n" +
    "                    <a class=\"btn btn-orange\" ng-if=\"message_type == 'inbox'\" ui-sref=\"message({type:'inbox'})\" title=\"{{'Back to Inbox' | translate}}\">{{'Back to Inbox' | translate}}</a>\n" +
    "                    <a class=\"btn btn-orange\" ng-if=\"message_type == 'starred'\" ui-sref=\"message({type:'starred'})\" title=\"{{'Back to Starred' | translate}}\">{{'Back to Starred' | translate}}</a>\n" +
    "                    <table class=\"table col-xs-12 table-condensed table-hover\">\n" +
    "                        <tr>\n" +
    "                            <td ng-if=\"message.is_sender == 0\"><strong>{{'From: ' | translate }}</strong></td>\n" +
    "                            <td ng-if=\"message.is_sender == 1\"><strong>{{'To: ' | translate }}</strong></td>\n" +
    "                            <td>{{message.from_user.username}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td><strong>{{'Date: ' | translate }}</strong></td>\n" +
    "                            <td>{{message.created_at}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr>\n" +
    "                            <td><strong>{{'Subject: ' | translate }}</strong></td>\n" +
    "                            <td><div ng-bind-html=\"message.message_content.subject | html\"></div></td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-sm-12\" ng-bind-html=\"message.message_content.message | html\"></div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("Transactions/transaction_list.tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("Transactions/transaction_list.tpl.html",
    "<div class=\"transactions\">\n" +
    "    <div class=\"page-head\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"pull-left\">\n" +
    "                <h2 class=\"text-uppercase\">{{'My Transactions' | translate}}</h2>\n" +
    "                <p ng-show=\"transaction_metadata.total > 0\">{{'We found '|translate}} {{transaction_metadata.total}} {{' results provides our transaction listed'| translate}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"pull-right profile-settings\">\n" +
    "                <dashboard-settings></dashboard-settings>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"container\">\n" +
    "        <div class=\"col-xs-12 transaction-tab\">\n" +
    "            <div id=\"transactions-tab-container\" class=\"clearfix\">\n" +
    "                <ul class=\"nav nav-pills pull-right\">\n" +
    "                    <li ng-class=\"{active : activeMenu === 'all'}\">\n" +
    "                        <a class=\"show\" ng-click=\"filterTransaction('all')\" data-target=\"#\" data-toggle=\"tab\">{{'All' | translate }}</a>\n" +
    "                    </li>\n" +
    "                    <li ng-class=\"{active : activeMenu === 'today'}\">\n" +
    "                        <a class=\"show\" ng-click=\"filterTransaction('today')\" data-target=\"#\" data-toggle=\"tab\">{{'Today' | translate }}</a>\n" +
    "                    </li>\n" +
    "                    <li ng-class=\"{active : activeMenu === 'this_week'}\">\n" +
    "                        <a class=\"show\" ng-click=\"filterTransaction('this_week')\" data-target=\"#\" data-toggle=\"tab\">{{'This Week' | translate }}</a>\n" +
    "                    </li>\n" +
    "                    <li ng-class=\"{active : activeMenu === 'this_month'}\">\n" +
    "                        <a class=\"show\" ng-click=\"filterTransaction('this_month')\" data-target=\"#\" data-toggle=\"tab\">{{'This Month' | translate }}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"table-responsive\">\n" +
    "                <table class=\"table table-hover\">\n" +
    "                    <thead>\n" +
    "                        <tr>\n" +
    "                            <th>{{'Date'|translate}}</th>\n" +
    "                            <th>{{'Description'|translate}}</th>\n" +
    "                            <th>{{'Credit' |translate}}</th>\n" +
    "                            <th>{{'Debit' |translate}}</th>\n" +
    "                        </tr>\n" +
    "                    </thead>\n" +
    "                    <tbody>\n" +
    "                        <tr ng-repeat=\"transaction in TransactionLists\">\n" +
    "                            <td>{{transaction.created_at}}</td>\n" +
    "                            <td><div ng-bind-html=\"transaction.description | html\"></div></td>\n" +
    "                            <td>{{getFormatCurrency(transaction.credit_amount)}}</td>\n" +
    "                            <td>{{getFormatCurrency(transaction.debit_amount)}}</td>\n" +
    "                        </tr>\n" +
    "                        <tr ng-show=\"transaction_metadata.total == 0\">\n" +
    "                            <td colspan=\"4\">\n" +
    "                                <p class=\"alert alert-danger\">{{'No Record Found' |translate}}</p>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </tbody>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"paging clearfix text-center\" ng-show=\"transaction_metadata.total > 0\">\n" +
    "            <uib-pagination previous-text=\"&#xf0d9\" next-text=\"&#xf0da\" total-items=\"transaction_metadata.total\" num-pages=\"transaction_metadata.total_pages\" ng-model=\"transaction_currentPage\" max-size=\"maxSize\" class=\"pagination-sm\" boundary-link-numbers=\"true\" rotate=\"false\" items-per-page=\"transaction_metadata.per_page\" ng-change=\"transaction_paginate()\"></uib-pagination>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
