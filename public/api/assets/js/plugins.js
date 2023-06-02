/**
 * BookorRent - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name SocialLogins
 * @description
 *
 * This is the module for SocialLogins. It contains the social login functionalities.
 *
 * The social login module act as a state provider, this module get the url and load the template and call the controller instantly.
 *
 * @param {string} SocialLogin name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *         [
 *            'ui.router',
 *            'ngResource',
 *            'satellizer'
 *        ]
 * @param {string} stateProvider State provider is used to provide a corresponding model and template.
 * @param {string} analyticsProvider This service lets you integrate google analytics tracker in your AngularJS applications easily.
 * @returns {BookorRent.SocialLogins} new BookorRent.SocialLogins module.
 **/
(function (module) {
    /**
     * @ngdoc directive
     * @name Vehicles.directive:socialShare
     * @scope
     * @restrict EA
     * @description
     * socialShare directive used to load the social login share.
     * @param {string} socialShare Name of the directive
     **/
    module.directive('socialShare', function () {
        return {
            restrict: 'EA',
            templateUrl: "Plugins/SocialLogins/social_login_share.tpl.html"
        };
    });
    module.config(function ($stateProvider, $authProvider, GENERAL_CONFIG) {
        $authProvider.unlinkUrl = GENERAL_CONFIG.api_url + '/auth/unlink';
        var ResolveServiceData = {
            'ResolveServiceData': function (ResolveService, $q) {
                return $q.all({
                    AuthServiceData: ResolveService.promiseAuth,
                    SettingServiceData: ResolveService.promiseSettings
                });
            }
        };
        $stateProvider.state('social', {
            url: '/social',
            authenticate: true,
            views: {
                "main": {
                    controller: 'SocialConnectionController as model',
                    templateUrl: 'Plugins/SocialLogins/my_connection.tpl.html',
                    resolve: ResolveServiceData
                }
            }
        }).state('profileImage', {
            url: '/profile_image',
            authenticate: true,
            views: {
                "main": {
                    controller: 'SocialProfileController as model',
                    templateUrl: 'Plugins/SocialLogins/profile_image.tpl.html',
                    resolve: ResolveServiceData
                }
            }
        }).state('socialLoginEmail', {
            url: '/social-login/email',
            authenticate: false,
            views: {
                "main": {
                    controller: 'SocialLoginEmailController as model',
                    templateUrl: 'Plugins/SocialLogins/get_email_from_user.tpl.html',
                    resolve: ResolveServiceData
                }
            }
        });
    });
}(angular.module('BookorRent.SocialLogins', [
    'ui.router',
    'ngResource',
    'satellizer'
])));
(function (module) {
    /**
     * @ngdoc controller
     * @name SocialLogins.controller:SocialConnectionController
     * @description
     * This is SocialConnection Controller having the methods init(), setMetaData(), getProviderUsers(), connect() and disconnect().
     * It maintains the functinolities of the social profile.
     **/
    module.controller('SocialConnectionController', function ($state, ProvidersFactory, $auth, $scope, $rootScope, $location, AuthFactory, $filter, Flash, ProviderUsersFactory, ConstSocialLogin) {
        var model = this;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf SocialLogins.controller:SocialConnectionController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {
            var pageTitle = $filter("translate")("Social Connection");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        model.sociallogin = {};
        /**
         * @ngdoc method
         * @name getProviderUsers
         * @methodOf SocialLogins.controller:SocialConnectionController
         * @description
         * This method will get the list of service providers.
         **/
        model.getProviderUsers = function () {
            model.fb_connected = false;
            ProviderUsersFactory.get().$promise.then(function (response) {
                angular.forEach(response.data, function (value, key) {
                    if (value.provider_id == ConstSocialLogin.Facebook && value.is_connected) {
                        model.fb_connected = true;
                        model.fb_img = value.profile_picture_url;
                    } else if (value.provider_id == ConstSocialLogin.Twitter && value.is_connected) {
                        model.twitter_connected = true;
                        model.twt_img = value.profile_picture_url;
                    } else if (value.provider_id == ConstSocialLogin.Google && value.is_connected) {
                        model.google_connected = true;
                        model.goo_img = value.profile_picture_url;
                    } else if (value.provider_id == ConstSocialLogin.Github && value.is_connected) {
                        model.github_connected = true;
                        model.git_img = value.profile_picture_url;
                    }
                });
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf SocialLogins.controller:SocialConnectionController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        model.init = function () {
            model.setMetaData();
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Social Connection");
            //Get Active social logins
            ProvidersFactory.get({'filter': 'active', 'sortby': 'asc', 'sort': 'display_order'}).$promise
                .then(function (response) {
                    model.sociallogin = response;
                });
            //check if user connect with social
            model.getProviderUsers();
        };
        model.init();
        //Connect with providers
        /**
         * @ngdoc method
         * @name connect
         * @methodOf SocialLogins.controller:SocialConnectionController
         * @description
         * This method will be used in connecting the user to the social websites.
         * @param {integer} provider Provider details.
         * @returns {Array} Success or failure message.
         **/
        model.connect = function (provider) {
            $auth.link(provider).then(function (response) {
                if (response.data.provider_id == ConstSocialLogin.Facebook && response.data.is_connected) {
                    model.fb_connected = true;
                } else if (response.data.provider_id == ConstSocialLogin.Twitter && response.data.is_connected) {
                    model.twitter_connected = true;
                } else if (response.data.provider_id == ConstSocialLogin.Google && response.data.is_connected) {
                    model.google_connected = true;
                } else if (response.data.provider_id == ConstSocialLogin.Github && response.data.is_connected) {
                    model.github_connected = true;
                }
                Flash.set($filter("translate")("Connected Successfully"), 'success', true);
            }).catch(function (error) {
                Flash.set($filter("translate")(error.data.message), 'error', false);
            });
        };
        //Disconnect with providers
        /**
         * @ngdoc method
         * @name connect
         * @methodOf SocialLogins.controller:SocialConnectionController
         * @description
         * This method will be used in disconnecting the user to the social websites.
         * @param {integer} provider Provider details.
         * @returns {Array} Success or failure message.
         **/
        model.disconnect = function (provider) {
            $auth.unlink(provider).then(function (response) {
                AuthFactory.fetch().$promise.then(function (user) {
                    $rootScope.auth = user;
                });
                if (response.data.provider_id == ConstSocialLogin.Facebook && !response.data.is_connected) {
                    model.fb_connected = false;
                } else if (response.data.provider_id == ConstSocialLogin.Twitter && !response.data.is_connected) {
                    model.twitter_connected = false;
                } else if (response.data.provider_id == ConstSocialLogin.Google && !response.data.is_connected) {
                    model.google_connected = false;
                } else if (response.data.provider_id == ConstSocialLogin.Github && !response.data.is_connected) {
                    model.github_connected = false;
                }
                Flash.set($filter("translate")("Disconnected successfully"), 'success', true);
            });
        };
    });
}(angular.module('BookorRent.SocialLogins')));
(function (module) {
    module.config(function ($authProvider, GENERAL_CONFIG) {
        var ResolveServiceData = {
            'ResolveServiceData': function (ResolveService, $q) {
                return $q.all({
                    AuthServiceData: ResolveService.promiseAuth,
                    SettingServiceData: ResolveService.promiseSettings
                });
            }
        };
        var url = GENERAL_CONFIG.api_url + '/providers';
        var params = {};
        $.get(url, params, function (response) {
            var credentials = {};
            var url = GENERAL_CONFIG.api_url + '/auth/';
            if (location.hostname == 'localhost') {
                url = window.location.protocol + '//' + window.location.host + url;
            }
            angular.forEach(response.data, function (res, i) {
                credentials = {
                    clientId: res.api_key,
                    redirectUri: url + angular.lowercase(res.name),
                    url: GENERAL_CONFIG.api_url + '/auth/' + angular.lowercase(res.name)
                };
                if (res.name === 'Facebook') {
                    $authProvider.facebook(credentials);
                }
                if (res.name === 'Google') {
                    $authProvider.google(credentials);
                }
                if (res.name === 'Twitter') {
                    $authProvider.twitter(credentials);
                }
                if (res.name === 'Github') {
                    credentials = {
                        redirectUri: url + 'github',
                        url: url + 'github',
                        clientId: res.api_key
                    };
                    $authProvider.github(credentials);
                }
            });
        });
    });
    /**
     * @ngdoc directive
     * @name SocialLogins.directive:socialLogin
     * @module SocialLogins
     * @scope
     * This directive used to load the social login page url link.
     * @restrict E
     * @description
     * This directive used to load the social login page template.
     */
    module.directive('socialLogin', function () {
        var linker = function (scope, element, attrs) {
            // do DOM Manipulation here
        };
        return {
            restrict: 'E',
            templateUrl: 'Plugins/SocialLogins/social_login.tpl.html',
            link: linker,
            controller: 'SocialLoginController as model',
            bindToController: true,
            scope: {
                pageType: '@pageType'
            }
        };
    });
    /**
     * @ngdoc controller
     * @name SocialLogins.controller:SocialLoginEmailController
     * @description
     * This is SocialLoginEmailController having the methods init(), setMetaData(), loginnow(). It controls the email related functions.
     **/
    module.controller('SocialLoginEmailController', function ($state, ProvidersFactory, $auth, $scope, Flash, SocialLoginFactory, $rootScope, $filter, $location, AuthFactory) {
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf SocialLogins.controller:SocialLoginEmailController
         * @description
         * This method will set the meta data's dynamically by using the angular.element
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Get Social API Email");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf SocialLogins.controller:SocialLoginEmailController
         * @description
         * This method will initialize the page. It returns the page title.
         **/
        $scope.init = function () {
            if (!$rootScope.thrid_party_profile) {
                Flash.set($filter("translate")("Unable to get provider info, please try again."), 'error', false);
                $state.go('login');
            }
            // $scope.setMetaData();
            // $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Get Social API Email");
        };
        $scope.init();
        /**
         * @ngdoc method
         * @name loginnow
         * @methodOf SocialLogins.controller:SocialLoginEmailController
         * @description
         * This method will be used in authenticating and logging in the user.
         * @param {integer} user User details.
         * @returns {Array} Success or failure message.
         **/
        $scope.loginnow = function (user) {
            $scope.user = user;
            $scope.user.thrid_party_profile = $rootScope.thrid_party_profile;
            SocialLoginFactory.login($scope.user, function (response) {
                if (response.userToken) {
                    $auth.setToken(response.userToken);
                    localStorage.userRole = response.role;
                    AuthFactory.fetch().$promise.then(function (user) {
                        $rootScope.auth = user;
                        $state.go('dashboard');
                    });
                } else {
                    var errorMessage;
                    if (response.error.code === 1) {
                        errorMessage = $filter("translate")("Already registered email");
                    } else {
                        errorMessage = response.error.message;
                    }
                    Flash.set(errorMessage, 'error', false);
                }
            });
        };
    });
    /**
     * @ngdoc controller
     * @name SocialLogins.controller:SocialLoginController
     * @description
     * This is SocialLoginController having the methods init(), setMetaData() and it controls the login functionalities using social websites.
     **/
    module.controller('SocialLoginController', function ($state, ProvidersFactory, $auth, $scope, $rootScope, $location, AuthFactory, $filter, Flash) {
        var model = this;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf SocialLogins.controller:SocialLoginController
         * @description
         * This method will set the meta data's dynamically by using the angular.element
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {            
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + $rootScope.pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf SocialLogins.controller:SocialLoginController
         * @description
         * This method will initialize the page. It returns the page title.
         **/
        model.init = function () {
            model.setMetaData();
            ProvidersFactory.get({'filter': 'active', 'sortby': 'asc', 'sort': 'display_order'}).$promise
                .then(function (response) {
                    model.sociallogin = response;
                });
        };
        model.init();
        $scope.contentInIframe = false;
        if (self !== top) {
            $scope.contentInIframe = true;
        }
        model.sociallogin = {};
        /**
         * @ngdoc method
         * @name authenticate
         * @methodOf SocialLogins.controller:SocialLoginController
         * @description
         * This method will be used in authenticating the user.
         * @returns {Array} Success or failure message.
         **/
        model.authenticate = function (provider) {
            $auth.authenticate(provider).then(function (response) {
                if (response.data.userToken) {
                    localStorage.userRole = response.data.role;
                    AuthFactory.fetch().$promise.then(function (user) {
                        $rootScope.auth = user;
                        $state.go('dashboard', {});
                    });
                } else if (response.data.thrid_party_profile) {
                    $rootScope.thrid_party_profile = response.data.thrid_party_profile;
                    $state.go('socialLoginEmail');
                }
            }).catch(function (error) {
            });
        };
    });
})(angular.module('BookorRent.SocialLogins'));
(function (module) {
    /**
     * @ngdoc service
     * @name SocialLogins.ProvidersFactory
     * @description
     * ProvidersFactory is used to listing the providers.
     * @param {string} ProvidersFactory The name of the factory service
     * @param {function()} function returns the providers list.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     */
    module.factory('ProvidersFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/providers', {}, {});
    });
    /**
     * @ngdoc service
     * @name SocialLogins.ProviderUsersFactory
     * @description
     * ProviderUsersFactory is used to listing provider users
     * @param {string} ProviderUsersFactory The name of the factory service
     * @param {function()} function It uses get method for get and returns the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('ProviderUsersFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/provider_users', {}, {
            get: {
                method: 'GET'
            }
        });
    });
    /**
     * @ngdoc service
     * @name SocialLogins.UpdateProfileFactory
     * @description
     * UpdateProfileFactory is used to update user profile
     * @param {string} UpdateProfileFactory The name of the factory service
     * @param {function()} function It uses get method for get and returns the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'update':    {method:'POST'}
	 *		};
     */
    module.factory('UpdateProfileFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/update_profile/', {}, {
            update: {
                method: 'POST'
            },
        });
    });
    /**
     * @ngdoc service
     * @name SocialLogins.SocialLoginFactory
     * @description
     * SocialLoginFactory is used to login social user
     * @param {string} SocialLoginFactory The name of the factory service
     * @param {function()} function It uses get method for get and returns the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'login':    {method:'POST'}
	 *		};
     */
    module.factory('SocialLoginFactory', function ($resource) {
        return $resource('api/social_login', {}, {
            login: {
                method: 'POST'
            }
        });
    });
})(angular.module('BookorRent.SocialLogins'));
(function (module) {
    /**
     * @ngdoc controller
     * @name SocialLogins.controller:SocialProfileController
     * @description
     * This is SocialProfile controller having the methods init(), setMetaData(), and getProviderUsers().
     * It maintains the functinolities of the social profile.
     **/
    module.controller('SocialProfileController', function ($state, $auth, $scope, $rootScope, ProvidersFactory, $location, $filter, Flash, ProviderUsersFactory, UpdateProfileFactory, UserAttachmentFactory, AuthFactory, ConstSocialLogin) {
        var model = this;
        model.updateProfileDetails = [];
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf SocialLogins.controller:SocialProfileController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {
            var pageTitle = $filter("translate")("Social Profile Image");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        model.sociallogin = {};
        /**
         * @ngdoc method
         * @name getProviderUsers
         * @methodOf SocialLogins.controller:SocialProfileController
         * @description
         * This method will get the list of service provider usres list.
         **/
        model.getProviderUsers = function () {
            model.fb_connected = false;
            ProviderUsersFactory.get().$promise.then(function (response) {
                angular.forEach(response.data, function (value, key) {
                    model.updateProfileDetails.source_id = value.user.user_avatar_source_id;
                    if (value.provider_id == ConstSocialLogin.Facebook && value.is_connected) {
                        model.fb_connected = true;
                        model.fb_img = value.profile_picture_url;
                    } else if (value.provider_id == ConstSocialLogin.Twitter && value.is_connected) {
                        model.twitter_connected = true;
                        model.twt_img = value.profile_picture_url;
                    } else if (value.provider_id == ConstSocialLogin.Google && value.is_connected) {
                        model.google_connected = true;
                        model.goo_img = value.profile_picture_url;
                    } else if (value.provider_id == ConstSocialLogin.Github && value.is_connected) {
                        model.github_connected = true;
                        model.git_img = value.profile_picture_url;
                    }
                });
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf SocialLogins.controller:SocialProfileController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        model.init = function () {
            model.setMetaData();
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Profile Images");
            model.user_avatar_source = ConstSocialLogin;
            UserAttachmentFactory.get({
                id: $rootScope.auth.id
            }).$promise
                .then(function (response) {
                    $scope.media = response;
                });
            //Get Active social logins
            ProvidersFactory.get({'filter': 'active', 'sortby': 'asc', 'sort': 'display_order'}).$promise
                .then(function (response) {
                    model.sociallogin = response;
                });
            //check if user connect with social
            model.getProviderUsers();
        };
        model.init();
        //Connect with providers
        /**
         * @ngdoc method
         * @name connect
         * @methodOf SocialLogins.controller:SocialProfileController
         * @description
         * This method will be used in connecting the user to the social websites.
         * @param {integer} provider Provider details.
         * @returns {Array} Success or failure message.
         **/
        model.connect = function (provider) {
            $auth.link(provider).then(function (response) {
                if (response.data.provider_id == ConstSocialLogin.Facebook && response.data.is_connected) {
                    model.fb_connected = true;
                    model.fb_img = response.data.profile_picture_url;
                } else if (response.data.provider_id == ConstSocialLogin.Twitter && response.data.is_connected) {
                    model.twitter_connected = true;
                    model.twt_img = response.data.profile_picture_url;
                } else if (response.data.provider_id == ConstSocialLogin.Google && response.data.is_connected) {
                    model.google_connected = true;
                    model.goo_img = response.data.profile_picture_url;
                } else if (response.data.provider_id == ConstSocialLogin.Github && response.data.is_connected) {
                    model.github_connected = true;
                    model.git_img = response.data.profile_picture_url;
                }
                Flash.set($filter("translate")("Connected Successfully"), 'success', true);
            }).catch(function (error) {
                Flash.set($filter("translate")(error.data.message), 'error', false);
            });
        };
        //Update profile image
        /**
         * @ngdoc method
         * @name updateProfile
         * @methodOf SocialLogins.controller:SocialProfileController
         * @description
         * This method is used to update the user profile image.
         * @param {integer} updateProfileDetails User profile details.
         * @returns {Array} Success or failure message.
         **/
        model.updateProfile = function (updateProfileDetails) {
            UpdateProfileFactory.update({'source_id': updateProfileDetails.source_id}).$promise.then(function (response) {
                AuthFactory.fetch().$promise.then(function (user) {
                    $rootScope.auth = user;
                });
                Flash.set($filter("translate")("Profile image updated successfully"), 'success', true);
            });
        };
    });
}(angular.module('BookorRent.SocialLogins')));
angular.module('BookorRent').requires.push('BookorRent.SocialLogins');/**
 * bookorrent - v0.0.1 - 2016-04-22
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name Translations
 * @description
 *
 * This is the module for translations. It contains the translations functionalities.
 *
 * @param {string} Translations name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *         [
 *            'ngResource',
 *            'pascalprecht.translate',
 *            'tmh.dynamicLocale',
 *            'ngSanitize',
 *            'ngCookies',
 *        ]
 * @returns {BookorRent.Translations} new BookorRent.Translations module.
 **/
(function (module) {
}(angular.module('BookorRent.Translations', [
    'ngResource',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'ngSanitize',
    'ngCookies'
])));
(function (module) {
    module.config(function (tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('assets/js/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.localeLocationPattern('assets/js/moment/locale/{{locale}}.js');
    });
    /**
     * @ngdoc service
     * @name Translations.LanguageList
     * @function
     * @description
     * LanguageList is used to list the languages.
     * @param {string} LanguageList The name of the factory service
     * @param {function()} function It used to list the languages.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service return language list.
     */
    module.service('LanguageList', function ($sce, $rootScope, $q, GENERAL_CONFIG) {
        promise = $.get(GENERAL_CONFIG.api_url + '/languages?filter=active&sort=name&sortby=asc', function (response) {
        });
        return {
            promise: promise
        };
    });
    /**
     * @ngdoc service
     * @name Translations.LocaleService
     * @function
     * @description
     * LocaleService is used to maintains the locale service of the languages.
     * @param {string} LocaleService The name of the factory service
     * @param {function()} function It used to maintains the locale service of the languages.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     */
    module.service('LocaleService', function ($translate, $rootScope, tmhDynamicLocale, GENERAL_CONFIG, LanguageList, ResolveService, $translateLocalStorage, amMoment) {
        'use strict';
        var localesObj;
        var loadedlocalesObj = {};
        var _LOCALES_DISPLAY_NAMES = [];
        var _LOCALES;
        var promiseLanguages = LanguageList.promise;
        promiseLanguages.then(function (response) {
            $.each(response.data, function (i, data) {
                loadedlocalesObj[data.iso2] = data.name;
            });
            localesObj = loadedlocalesObj;
            // locales and locales display names
            _LOCALES = Object.keys(localesObj);
            if (!_LOCALES || _LOCALES.length === 0) {
                console.error('There are no _LOCALES provided');
            }
            _LOCALES.forEach(function (locale) {
                _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
            });
        });
        // STORING CURRENT LOCALE
        var currentLocale = $translate.preferredLanguage();
        if ($translate.use() !== undefined) {
            currentLocale = $translate.use();
        } else if ($translateLocalStorage.get('NG_TRANSLATE_LANG_KEY') !== undefined && $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY') !== null) {
            currentLocale = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
        }
        // METHODS
        var checkLocaleIsValid = function (locale) {
            return _LOCALES.indexOf(locale) !== -1;
        };
        var setLocale = function (locale) {
            if (!checkLocaleIsValid(locale)) {
                console.error('Locale name "' + locale + '" is invalid');
                return;
            }
            // updating current locale
            currentLocale = locale;
            // asking angular-translate to load and apply proper translations
            $translate.use(locale);
        };
        // EVENTS
        // on successful applying translations by angular-translate
        $rootScope.$on('$translateChangeSuccess', function (event, data) {
            amMoment.changeLocale(data.language);
            document.documentElement.setAttribute('lang', data.language); // sets "lang" attribute to html
            // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
			var dyn_locale = data.language.toLowerCase().replace(/_/g, '-');
			if(dyn_locale == 'en'){
				dyn_locale = 'en-au';
			}
            tmhDynamicLocale.set(dyn_locale);
        });
        return {
            getLocaleName: function(locale) {
                var lang_code = '';
                angular.forEach(localesObj, function(value, key){
                      if(value == locale) {
                          lang_code = key;
                      }
                  });
                return lang_code;
            },
            getLocaleDisplayName: function () {
                return localesObj[currentLocale];
            },
            setLocaleByDisplayName: function (localeDisplayName) {
                setLocale(
                    _LOCALES[
                        _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName) // get locale index
                        ]
                );
            },
            getLocalesDisplayNames: function () {
                return _LOCALES_DISPLAY_NAMES;
            }
        };
    });
    /**
     * @ngdoc directive
     * @name Translations.directive:ngTranslateLanguageSelect
     * @module Translations
     * @scope
     * This directive used to load translated languages.
     * @restrict A
     * @description
     * This directive used to load translated languages.
     */
    module.directive('ngTranslateLanguageSelect', function (LocaleService, LanguageList) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'Plugins/Translations/language_translate.tpl.html',
            controller: function ($scope, $rootScope, $timeout, LanguageList, amMoment) {
                var promiseSettings = LanguageList.promise;
                promiseSettings.then(function (response) {
                    $scope.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
                    $scope.localesDisplayNames = LocaleService.getLocalesDisplayNames();
                    $scope.visible = $scope.localesDisplayNames && $scope.localesDisplayNames.length > 1;
                });
                $scope.changeLanguage = function (locale) {
                    var code = LocaleService.getLocaleName(locale);
                    amMoment.changeLocale(code);
                    LocaleService.setLocaleByDisplayName(locale);
                };
            }
        };
    });
}(angular.module("BookorRent.Translations")));
angular.module('BookorRent').requires.push('BookorRent.Translations');/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name Vehicles
 * @description
 *
 * This is the module for Vehicles
 *
 * The Vehicle module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *            'ui.bootstrap.datetimepicker',
 *            'rzModule',
 *            'ngFileUpload',
 *            'google.places'
 *        ]
 * @param {string} stateProvider State provider is used to provide a corresponding model and template.
 * @param {string} analyticsProvider This service lets you integrate google analytics tracker in your AngularJS applications easily.
 * @returns {BookorRent.Vehicles} new BookorRent.Vehicles module.
 **/
(function (module) {
    /**
     * @ngdoc directive
     * @name Vehicles.directive:vehicleSearch
     * @scope
     * @restrict EA
     * @description
     * vehicleSearch directive used to load the search template.
     * @param {string} vehicleSearch Name of the directive
     **/
    module.directive('vehicleSearch', function () {
        return {
            restrict: 'EA',
            templateUrl: "Plugins/Vehicles/vehicle_search.tpl.html",
            controller: function ($scope, $element, $attrs, $state, CounterLocationFactory, $filter) {
                $scope.counter_location = function () {
                    CounterLocationFactory.get({type: 'list'}).$promise.then(function (response) {
                        $scope.locations = response.data;
                    });
                };
                $scope.init = function () {
                    $scope.currentDate = new Date();
                    $scope.counter_location();
                };
                $scope.init();
                /**
                 * Open Picup and drop off calendar
                 * @param e
                 * @param date
                 */
                $scope.openPickupCalendar = function (e, date) {
                    $scope.open_pickup[date] = true;
                };
                $scope.openDropCalendar = function (e, date) {
                    $scope.open_drop[date] = true;
                };
				$scope.openSearchPickupCalendar = function (e, date) {
					$scope.open_pickup[date] = true;
				};
				$scope.openSearchDropCalendar = function (e, date) {
					$scope.open_drop[date] = true;
				};	
                $scope.open_pickup = {
                    date: false
                };
                $scope.open_drop = {
                    date: false
                };
                $scope.buttonBar = {
                    show: true,
                    now: {
                        show: true,
                        text: $filter('translate')('Now')
                    },
                    today: {
                        show: true,
                        text: $filter('translate')('Today')
                    },
                    clear: {
                        show: true,
                        text: $filter('translate')('Clear')
                    },
                    date: {
                        show: true,
                        text: $filter('translate')('Date')
                    },
                    time: {
                        show: true,
                        text: $filter('translate')('Time')
                    },
                    close: {
                        show: true,
                        text: $filter('translate')('Close')
                    }
                };
                /**
                 * @ngdoc method
                 * @name SearchSubmit
                 * @methodOf Vehicles.controller:VehiclesController
                 * @description
                 * This method is used to store search details.
                 * @param {Array} vehicel Search details.
                 * @returns {html} Vehicle list page.
                 */
                $scope.SearchSubmit = function ($valid) {
                    if ($valid && ($scope.vehicle.start_date > $scope.currentDate) && ($scope.vehicle.end_date > $scope.vehicle.start_date)) {
                        if (!$scope.vehicle.drop_location) {
                            $scope.vehicle.drop_location = $scope.vehicle.pickup_location;
                        }
                        $scope.setLocalStorage = {
                            start_date: $scope.vehicle.start_date,
                            end_date: $scope.vehicle.end_date,
                            pickup_location_id: $scope.vehicle.pickup_location.id,
                            drop_location_id: $scope.vehicle.drop_location.id,
                            pickup_location: $scope.vehicle.pickup_location,
                            drop_location: $scope.vehicle.drop_location
                        };
                        localStorage.setItem('searchValue', JSON.stringify($scope.setLocalStorage));
                        $state.go('vehicle_list');
                    }
                };
            }

        };
    });
    module.directive('vehicle', function () {
        return {
            restrict: 'EA',
            templateUrl: "Plugins/Vehicles/vehicle.tpl.html"
        };
    });
    module.directive('tripDetail', function () {
        return {
            restrict: 'EA',
            templateUrl: "Plugins/Vehicles/trip_detail.tpl.html"
        };
    });
    module.directive('vehicleList', function() {
       return {
           restrict: 'EA',
           templateUrl:"Plugins/Vehicles/vehicle_list_home.tpl.html",
           controller: function ($scope, $element, $attrs, $state, VehicleTypeFactory, VehicleSearchFactory, $rootScope) {
               //Get vehicles based on vehicle type
			   $scope.active = 0;
               $scope.getVehicles = function(vehicle_type_id) {
					$scope.active = 0;
                   $scope.vehicles = [];
                   VehicleSearchFactory.post({'vehicle_type_id':vehicle_type_id}, function(response) {
                       $scope.vehicleTypes.status_id = vehicle_type_id;
                       var vehicles = response.data;
                       var item = 3;
                       //Split array for show 3 vehicle per slide
                       for(var i=0;i<vehicles.length;i+=item) {
                           $scope.vehicles.push(vehicles.slice(i,i+item));
                       }
                   });
               };
               //Get all vehicle types and store to rootscope
                $scope.getVehicleTypes = function() {
                    if ($rootScope.vehicleTypes == undefined) {
                        VehicleTypeFactory.getAll({'type':'vehicle_count'}).$promise.then(function(response) {
							if(response.data.length > 0 ){
								$scope.vehicleTypes = response.data;
								$scope.getVehicles(response.data[0].id);
								$rootScope.vehicleTypes = response.data;
							}
                            
                        });
                    } else {
                        $scope.vehicleTypes = $rootScope.vehicleTypes;
                        $scope.getVehicles($scope.vehicleTypes[0].id);
                    }
                };
               $scope.init = function() {
                   $scope.noWrapSlides = false;
                   $scope.interval = 5000;
                   $scope.getVehicleTypes();
               };
               $scope.init();

           }
       }
    });
    module.config(function ($stateProvider, $analyticsProvider) {
        var ResolveServiceData = {
            'ResolveServiceData': function (ResolveService, $q) {
                return $q.all({
                    AuthServiceData: ResolveService.promiseAuth,
                    SettingServiceData: ResolveService.promiseSettings
                });
            }
        };
        $stateProvider
            .state('vehicleAdd', {
                url: '/vehicle/add',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'VehicleAddController as model',
                        templateUrl: 'Plugins/Vehicles/vehicle_add.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Add Vehicle'}
            })
            .state('vehicleEdit', {
                url: '/vehicle/edit/:id',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'VehicleEditController as model',
                        templateUrl: 'Plugins/Vehicles/vehicle_edit.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Edit Vehicle'}
            })
            .state('myVehicles', {
                url: '/myvehicles',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'MyVehiclesController as model',
                        templateUrl: 'Plugins/Vehicles/my_vehicles.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'My Vehicles'}
            })
            .state('vehicleCompany', {
                url: '/vehicle/company',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'vehicleCompanyController as model',
                        templateUrl: 'Plugins/Vehicles/vehicleCompany.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Company'}
            })
            .state('vehiclePaynow', {
                url: '/vehicle/{vehicle_id}/paynow',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'VehiclesController as model',
                        templateUrl: 'Plugins/Vehicles/vehicle_payment.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('vehicle_search', {
                url: '/vehicle/search',
                authenticate: false,
                views: {
                    "main": {
                        controller: 'VehicleSearchController as model',
                        templateUrl: 'Plugins/Vehicles/vehicle_search.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('vehicle_list', {
                url: '/vehicles',
                authenticate: false,
                views: {
                    "main": {
                        controller: 'VehicleListController as model',
                        templateUrl: 'Plugins/Vehicles/vehicle_list.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('vehicle_detail', {
                url: '/vehicle_rental/order/{vehicle_rental_id}/update',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'VehicleDetailsController as model',
                        templateUrl: 'Plugins/Vehicles/vehicle_details.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('maintenanceVehicles', {
                url: '/vehicle/{vehicle_id}/maintenance',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'MaintenanceVehiclesController as model',
                        templateUrl: 'Plugins/Vehicles/maintenance_vehicles.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('maintenanceVehicleAdd', {
                url: '/maintenance_vehicle/{vehicle_id}/add',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'MaintenanceVehiclesController as model',
                        templateUrl: 'Plugins/Vehicles/maintenance_vehicle_add.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('maintenanceVehicleEdit', {
                url: '/maintenance_vehicle/{id}/edit',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'MaintenanceVehiclesController as model',
                        templateUrl: 'Plugins/Vehicles/maintenance_vehicle_edit.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('vehicleView', {
                url: '/vehicle/{id}/{slug}',
                authenticate: false,
                views: {
                    "main": {
                        controller: 'VehicleViewController as model',
                        templateUrl: 'Plugins/Vehicles/vehicle_view.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('vehicleStatus', {
                url: '/vehicle/{status}',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'VehicleAddController as model',
                        templateUrl: 'Plugins/Vehicles/vehicle_view.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'Vehicles'}
            })
            .state('all_vehicles', {
            url: '/vehicles/all',
            authenticate: false,
            views: {
                "main": {
                    controller: 'VehicleAllLsitController as model',
                    templateUrl: 'Plugins/Vehicles/all_vehicles.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'Vehicles'}
        })
    });
}(angular.module("BookorRent.Vehicles", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'rzModule',
    'ngFileUpload',
    'google.places',
    '720kb.socialshare'
])));(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:MaintenanceVehiclesController
     * @description
     * This is MaintenanceVehiclesController having the methods init(), setMetaData(). It controls the functionality of vehicle maintenance.
     **/
    module.controller('MaintenanceVehiclesController', function ($window, $scope, $rootScope, $filter, Flash, $state, $location, MaintenanceVehicles, EditMaintenanceVehicles) {
        var model = this;
        model.maxSize = 5;
        model._metadata = [];
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:MaintenanceVehiclesController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {
            var pageTitle = $filter("translate")("Maintenance Vehicles");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:MaintenanceVehiclesController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        model.init = function () {
            model.setMetaData();
            model.currentPage = (model.currentPage !== undefined) ? parseInt(model.currentPage) : 1;
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Maintenance Vehicles");
            //For Listing
            if ($state.params.vehicle_id != undefined) {
                MaintenanceVehicles.get({'vehicle_id': $state.params.vehicle_id}).$promise.then(function (response) {
                    model.maintenanceVehicles = response.data;
                    model._metadata = response.meta.pagination;
                });
            }
            //For edit
            if ($state.params.id != undefined) {
                EditMaintenanceVehicles.get({id: $state.params.id}).$promise.then(function (response) {
                    model.start_date = new Date(response.start_date);
                    model.end_date = new Date(response.end_date);
                });
            }
        };
        model.init();
        /**
         * @ngdoc method
         * @name paginate
         * @methodOf Vehicles.controller:MaintenanceVehiclesController
         * @description
         * This method will be load pagination the pages.
         **/
        model.paginate = function (pageno) {
            model.currentPage = parseInt(model.currentPage);
            $scope.init();
        };
        /**
         * Open Picup and drop off calendar
         * @param e
         * @param date
         */
        model.openStartCalendar = function (e, date) {
            $scope.open_start[date] = true;
        };
        model.openEndCalendar = function (e, date) {
            $scope.open_end[date] = true;
        };

        $scope.open_start = {
            date: false
        };
        $scope.open_end = {
            date: false
        };
        $scope.buttonBar = {
            show: true,
            now: {
                show: true,
                text: $filter('translate')('Now')
            },
            today: {
                show: true,
                text: $filter('translate')('Today')
            },
            clear: {
                show: true,
                text: $filter('translate')('Clear')
            },
            date: {
                show: true,
                text: $filter('translate')('Date')
            },
            time: {
                show: true,
                text: $filter('translate')('Time')
            },
            close: {
                show: true,
                text: $filter('translate')('Close')
            }
        }
        $scope.addMaintenanceDate = function () {
            $state.go('maintenanceVehicleAdd', {'vehicle_id': $state.params.vehicle_id})
        };
        /**
         * @ngdoc method
         * @name manitenanceVehicle
         * @methodOf Vehicles.controller:MaintenanceVehiclesController
         * @description
         * This method is used to store vehicle maintenance.
         * @param {Array} vehicle_id Vehicle identifier.
         * @returns {Array} Success or failure message.
         */
        model.manitenanceVehicle = function ($valid) {
            if ($valid) {
                var vehicle = {
                    vehicle_id: $state.params.vehicle_id,
                    start_date: model.start_date,
                    end_date: model.end_date
                };
                MaintenanceVehicles.save(vehicle, function (response) {
                    Flash.set($filter("translate")("Maintenance date added"), 'success', true);
                    $state.go('maintenanceVehicles', {vehicle_id: $state.params.vehicle_id});
                }, function (error) {
                    Flash.set($filter("translate")(error.data.message), 'error', false);
                });
            }
        };
        /**
         * @ngdoc method
         * @name editManitenanceDates
         * @methodOf Vehicles.controller:MaintenanceVehiclesController
         * @description
         * This method is used to edit vehicle maintenance.
         * @param {Array} maintenance_id Vehicle maintenance identifier.
         * @returns {Array} Success or failure message.
         */
        model.editManitenanceDates = function ($valid) {
            if ($valid) {
                var vehicle = {
                    id:$state.params.id,
                    start_date: model.start_date,
                    end_date: model.end_date
                };
                MaintenanceVehicles.update(vehicle, function (response) {
                    Flash.set($filter("translate")("Maintenance date updated"), 'success', true);
                    $state.go('maintenanceVehicles', {vehicle_id: response.vehicle_id});
                }, function (error) {
                    Flash.set($filter("translate")(error.data.message), 'error', false);
                })
            }
        }
        /**
         * @ngdoc method
         * @name removeVehicle
         * @methodOf Vehicles.controller:MaintenanceVehiclesController
         * @description
         * This method is used to remove vehicle maintenance.
         * @param {Array} maintenance_id Vehicle maintenance identifier.
         * @returns {Array} Success or failure message.
         */
        model.removeVehicle = function (id) {
            var deleteItem = $window.confirm('Are you sure want to delete?');
            if (deleteItem) {
                MaintenanceVehicles.delete({'id': id}, function (response) {
                    Flash.set($filter("translate")("Maintenanace Date Deleted successfully"), 'success', true);
                    $state.reload();
                }, function (error) {
                    Flash.set($filter("translate")("Maintenanace Date Could not be deleted"), 'error', false);
                });
            }
        };
    });
}(angular.module("BookorRent.Vehicles")));
(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:MyVehiclesController
     * @description
     * This is MyVehiclesController having the methods init(), setMetaData(). It controls the functionality of my vehicle.
     **/
    module.controller('MyVehiclesController', function ($scope, $rootScope, $filter, Flash, $state, $location, MyVehiclesFactory, $uibModal) {
        model = this;
        model.maxSize = 5;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:MyVehiclesController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {
            var pageTitle = $filter("translate")("My Vehicles");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:MyVehiclesController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        model.init = function () {
            model.setMetaData();
            model.currentPage = (model.currentPage !== undefined) ? parseInt(model.currentPage) : 1;
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("My Vehicles");
            model.getMyVehicleList();
            //Vehicle rating
            $scope.maxRatings = [];
            $scope.maxRating = 5;
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
        };
        /**
         * @ngdoc method
         * @name getMyVehicleList
         * @methodOf Vehicles.controller:MyVehiclesController
         * @description
         * This method is used to get my vehicle list details.
         * @param {Array} user_id Logged user identifier.
         * @returns {Array} Success or failure message.
         */
        model.getMyVehicleList = function () {
            MyVehiclesFactory.get({'user_id': $rootScope.auth.id, 'page': model.currentPage}).$promise.then(function (response) {
                model.vehicles = response.data;
                angular.forEach(model.vehicles, function (value, key) {
                    value.roundedRating = value.feedback_rating | 0;
                });
                model._metadata = response.meta.pagination;
            });
        };
        model.init();
        /**
         * @ngdoc method
         * @name paginate
         * @methodOf Vehicles.controller:MyVehiclesController
         * @description
         * This method will be load pagination the pages.
         **/
        model.paginate = function (pageno) {
            model.currentPage = parseInt(model.currentPage);
            model.getMyVehicleList();
        };
        model.maintenance = function (vehicle_id) {
            $state.go("maintenanceVehicles", {'vehicle_id': vehicle_id});
        };
        model.payNow = function (vehicle_id) {
            $state.go("vehiclePaynow", {'vehicle_id': vehicle_id});
        }
        /**
         * @ngdoc method
         * @name modalOpen
         * @methodOf Vehicles.controller:MyVehiclesController
         * @description
         * This method will initialze the page. It pen the modal with vehicle feedbacks.
         **/
        $scope.modalOpen = function (size, vehicle_id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Plugins/Vehicles/vehicle_feedback_modal.tpl.html',
                controller: 'VehicleModalController',
                size: size,
                resolve: {
                    vehicle_id: function () {
                        return vehicle_id;
                    }
                }
            });
        };
    });
}(angular.module("BookorRent.Vehicles")));
(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleBookitController
     * @description
     * This is modal controller. It contains all the details about the vehicle rental.
     **/
    module.controller('VehicleBookitController', function ($state, $scope, $http, Flash, AuthFactory, GENERAL_CONFIG, $filter, $rootScope, $uibModalInstance, vehicleDetails, VehicleBookingFactory, searchValue) {
        var model = this;
        model.init = function () {
            $scope.currentDate = new Date();
            $scope.vehicle = vehicleDetails;
            $scope.pickup_locations = vehicleDetails.pickup_locations;
            $scope.drop_locations = vehicleDetails.drop_locations;
            if(searchValue != null) {
                $scope.vehicle = JSON.parse(searchValue);
				$scope.vehicle.id = vehicleDetails.id;
				$scope.vehicle.slug = vehicleDetails.slug;
				$scope.vehicle.pickup_location_id = $scope.vehicle.pickup_location_id;
				$scope.vehicle.drop_location_id = $scope.vehicle.drop_location_id;
                $scope.vehicle.start_date = new Date($scope.vehicle.start_date);
                $scope.vehicle.end_date = new Date($scope.vehicle.end_date);
            }
        };
        model.init();
        $scope.modalClose = function () {
            $uibModalInstance.dismiss('close');
        };
        /**
         * Open Picup and drop off calendar
         * @param e
         * @param date
         */
        $scope.openPickupCalendar = function (e, date) {
            $scope.open_pickup[date] = true;
        };
        $scope.openDropCalendar = function (e, date) {
            $scope.open_drop[date] = true;
        };

        $scope.open_pickup = {
            date: false
        };
        $scope.open_drop = {
            date: false
        };
	$scope.buttonBar = {
	    show: true,
	    now: {
		show: true,
		text: $filter('translate')('Now')
	    },
	    today: {
		show: true,
		text: $filter('translate')('Today')
	    },
	    clear: {
		show: true,
		text: $filter('translate')('Clear')
	    },
	    date: {
		show: true,
		text: $filter('translate')('Date')
	    },
	    time: {
		show: true,
		text: $filter('translate')('Time')
	    },
	    close: {
		show: true,
		text: $filter('translate')('Close')
	    }
	};

        /**
         * @ngdoc method
         * @name Bookit
         * @methodOf Vehicles.controller:VehicleBookitController
         * @description
         * This method is used to store vehicle rental.
         * @param {Object} vehicle Vehicle details.
         * @returns {Array} Success or failure message.
         */
        $scope.Bookit = function ($valid) {
            if ($valid && ($scope.vehicle.start_date > $scope.currentDate) && ($scope.vehicle.end_date > $scope.vehicle.start_date)) {
                if ($rootScope.auth == undefined) {
                    $scope.modalClose();
                    localStorage.vehicle_search_value = JSON.stringify($scope.vehicle);
                    Flash.set($filter("translate")("Sign in for an account"), 'error', false);
                    $state.go('login');
                } else {
                    $scope.bookingObj = {
                        vehicle_id: $scope.vehicle.id,
                        item_booking_start_date: $scope.vehicle.start_date,
                        item_booking_end_date: $scope.vehicle.end_date,
                        pickup_counter_location_id: $scope.vehicle.pickup_location_id,
                        drop_counter_location_id: $scope.vehicle.pickup_location_id
                    };
                    if ($scope.vehicle.drop_location_id) {
                        $scope.bookingObj.drop_counter_location_id = $scope.vehicle.drop_location_id;
                    }
                    VehicleBookingFactory.save($scope.bookingObj, function (response) {
                        $uibModalInstance.dismiss('close');
                        $state.go('vehicle_detail', {'vehicle_rental_id': response.id})
                    }, function (error) {
                        Flash.set($filter("translate")(error.data.message), 'error', false);
                    });
                }
            }
        };
    });
}(angular.module("BookorRent.Vehicles")));
(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleDetailsController
     * @description
     * This is VehicleDetailsController having the methods init(), setMetaData(), and it defines the vehicle related funtions.
     **/
    module.controller('VehicleDetailsController', function ($state, $scope, $http, Flash, $filter, AuthFactory, $rootScope, $location, VehicleDetailFactory, UpdateVehicleRentalFactory, $uibModal, ConstDiscountTypes, ConstDurationTypes) {
        $scope.vehicle_rental = {};
        $scope.booker_detail = {};
        $scope.vehicle_rental.vehicle_type_extra_accessories = [];
        $scope.vehicle_rental.vehicle_type_fuel_options = [];
        $scope.vehicle_rental.vehicle_type_insurances = [];
        $scope.isPayment = true;
        $scope.ConstDiscountTypes = ConstDiscountTypes;
        $scope.ConstDurationTypes = ConstDurationTypes;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:VehicleDetailsController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Vehicle Details");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name additionalCharges
         * @methodOf Vehicles.controller:VehicleDetailsController
         * @description
         * This method is used to store vehicle rental.
         * @param {Object} additional_charge Additional charge details.
         * @returns {Array} New additional charge details.
         */
        $scope.additionalCharges = function (additional_charge) {
            angular.forEach(additional_charge, function (value, key) {
                if (value.item_user_additional_chargable_type == 'MorphInsurance') {
                    $scope.vehicle_rental.vehicle_type_insurances.push(parseInt(value.item_user_additional_chargable_id));
                }
                if (value.item_user_additional_chargable_type == 'MorphFuelOption') {
                    $scope.vehicle_rental.vehicle_type_fuel_options.push(parseInt(value.item_user_additional_chargable_id));
                }
                if (value.item_user_additional_chargable_type == 'MorphExtraAccessory') {
                    $scope.vehicle_rental.vehicle_type_extra_accessories.push(parseInt(value.item_user_additional_chargable_id));
                }
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehicleDetailsController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        $scope.init = function () {
            $scope.setMetaData();
            VehicleDetailFactory.get({id: $state.params.vehicle_rental_id, 'type':'rental'}).$promise.then(function (response) {
                $scope.VehicleRentalDetails = response;
                var start_date = $scope.VehicleRentalDetails.item_booking_start_date.replace(/(.+) (.+)/, "$1T$2Z");
                var end_date = $scope.VehicleRentalDetails.item_booking_end_date.replace(/(.+) (.+)/, "$1T$2Z");
                $scope.VehicleRentalDetails.item_booking_start_date = $filter('date')(new Date(start_date), 'MMM d, y h:mm a', '+0');
                $scope.VehicleRentalDetails.item_booking_end_date = $filter('date')(new Date(end_date), 'MMM d, y h:mm a', '+0');
                $scope.vehicleDetails = response.item_userable;
                $scope.vehicleDetails.roundedRating = response.item_userable.feedback_rating | 0;
                if ($scope.vehicleDetails.vehicle_type.vehicle_type_extra_accessory) {
                    $scope.vehicle_extra_sccessories = $scope.vehicleDetails.vehicle_type.vehicle_type_extra_accessory.data;
                    $scope.vehicle_extra_sccessories.status = false;
                }
                if ($scope.vehicleDetails.vehicle_type.vehicle_type_fuel_option) {
                    $scope.vehicle_type_fuel_option = $scope.vehicleDetails.vehicle_type.vehicle_type_fuel_option.data;
                    $scope.vehicle_type_fuel_option.status = false;
                }
                if ($scope.vehicleDetails.vehicle_type.vehicle_type_insurance) {
                    $scope.vehicle_type_insurance = $scope.vehicleDetails.vehicle_type.vehicle_type_insurance.data;
                    $scope.vehicle_type_insurance.status = false;
                }
                $scope.vehicle_additional_charges = response.vehicle_rental_additional_chargable.data;
                $scope.additionalCharges($scope.vehicle_additional_charges);
                //For drop location differ charge fee
                $scope.unit_price = $scope.vehicleDetails.vehicle_type.drop_location_differ_unit_price;
                $scope.differ_location_distance = $scope.VehicleRentalDetails.total_distance+' ('+$scope.VehicleRentalDetails.distance_unit+') ';

                if (response.booker_detail) {
                    $scope.booker_detail = response.booker_detail;
                } else {
                    AuthFactory.fetch().$promise.then(function (user) {
                        if (user.user_profile) {
                            $scope.booker_detail.first_name = user.user_profile.first_name;
                            $scope.booker_detail.last_name = user.user_profile.last_name;
                        }
                        $scope.booker_detail.email = user.email;
                    });
                }
            }, function (error) {
                Flash.set($filter("translate")(error.data.message), 'error', false);
                $state.go('vehicle_rental_list_status', {'statusID':0, 'slug':'all'});
            });
            //Vehicle rating
            $scope.maxRatings = [];
            $scope.maxRating = 5;
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
        };
        $scope.init();

        $scope.getExtraAccessory = function (id) {
            id = parseInt(id);
            var selected_id = $scope.vehicle_rental.vehicle_type_extra_accessories.indexOf(id);
            if (selected_id > -1) {
                $scope.vehicle_rental.vehicle_type_extra_accessories.splice(selected_id, 1);
            } else {
                $scope.vehicle_rental.vehicle_type_extra_accessories.push(id);
            }
        };
        $scope.getfuelOption = function (id) {
            id = parseInt(id);
            var selected_id = $scope.vehicle_rental.vehicle_type_fuel_options.indexOf(id);
            if (selected_id > -1) {
                $scope.vehicle_rental.vehicle_type_fuel_options.splice(selected_id, 1);
            } else {
                $scope.vehicle_rental.vehicle_type_fuel_options.push(id);
            }
        };
        $scope.getVehicleInsurance = function (id) {
            id = parseInt(id);
            var selected_id = $scope.vehicle_rental.vehicle_type_insurances.indexOf(id);
            if (selected_id > -1) {
                $scope.vehicle_rental.vehicle_type_insurances.splice(selected_id, 1);
            } else {
                $scope.vehicle_rental.vehicle_type_insurances.push(id);
            }
        };
        /**
         * @ngdoc method
         * @name updateVehicleRental
         * @methodOf Vehicles.controller:VehicleDetailsController
         * @description
         * This method is used to update vehicle rental details.
         * @param {Object} vehicle_rental Vehicle rental details.
         * @returns {Array} Success or failure message.
         */
        $scope.updateVehicleRental = function ($valid) {
            if ($valid) {
                $scope.updateBookingForm.$setPristine();
                $scope.updateBookingForm.$setUntouched();
                $scope.vehicle_rental.first_name = $scope.booker_detail.first_name;
                $scope.vehicle_rental.last_name = $scope.booker_detail.last_name;
                $scope.vehicle_rental.email = $scope.booker_detail.email;
                $scope.vehicle_rental.mobile = $scope.booker_detail.mobile;
                $scope.vehicle_rental.address = ($scope.booker_detail.address.formatted_address == undefined) ? $scope.booker_detail.address : $scope.booker_detail.address.formatted_address;
                $scope.vehicle_rental.id = $state.params.vehicle_rental_id;
                UpdateVehicleRentalFactory.update({id: $scope.vehicle_rental.id}, $scope.vehicle_rental, function (response) {
                    Flash.set($filter("translate")("Details Updated Successfully"), 'success', true);
                    $state.reload();
                }, function (error) {
                    Flash.set($filter("translate")("Details Could not be updated"), 'error', false);
                });
            }
        };
        $scope.continuePayment = function () {
            $state.go('order', {'vehicle_rental_id': $state.params.vehicle_rental_id});
        };
        /**
         * @ngdoc method
         * @name modalOpen
         * @methodOf Vehicles.controller:VehicleDetailsController
         * @description
         * This method will initialze the page. It pen the modal with vehicle feedbacks.
         **/
        $scope.modalOpen = function (size, vehicle_id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Plugins/Vehicles/vehicle_feedback_modal.tpl.html',
                controller: 'VehicleModalController',
                size: size,
                resolve: {
                    vehicle_id: function () {
                        return vehicle_id;
                    }
                }
            });
        };

    });

}(angular.module("BookorRent.Vehicles")));

(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleListController
     * @description
     * This is VehicleListController having the methods init(), setMetaData(), and it defines the vehicle list related funtions.
     **/
    module.controller('VehicleListController', function ($state, $scope, $http, Flash, $filter, AuthFactory, $rootScope, $location, VehicleSearchFactory, CounterLocationFactory, VehicleFilterFactory, VehicleBookingFactory, $uibModal) {
        $scope.maxSize = 5;
        var params = {};
        $scope.issearchTpl = false;
        $scope.searchTpl = "Plugins/Vehicles/vehicle_search.tpl.html";
        $scope.seatRange = {};
        $scope.priceRange = {};
        $scope.check_drop_location = false;
        $scope.maxRating = 5;
        $scope.returnLocation = function (status) {
            if (!status) {
                $scope.vehicle.drop_location = '';
                $scope.check_drop_location = false;
            }
        };
        $scope.sort_name = $filter("translate")("Lowest Price");
        $scope.closeSearch = function () {
            $scope.issearchTpl = false;
        };
        $scope.status = {
            type: true,
            preference: true,
            fuel: true,
            seat: true,
            price: true
        };
        $scope.currentDate = new Date();
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Vehicle Lists");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name search
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method will search the vehicles based on the request.
         * @param {Object} vehicle Vehicle details.
         * @returns {Object} Vehicle list details.
         **/
        $scope.search = function (vehicle) {
            VehicleSearchFactory.post(vehicle, function (response) {
                $scope.searchData = response.data;
                $scope.searchData.status = false;
                $scope._metadata = response.meta.pagination;
                angular.forEach($scope.searchData, function(value, key) {
                    //filter changes - show rating
                    value.roundedRating = value.feedback_rating | 0;
					value.open_pickup = false;
					value.open_drop = false;
                });
                $scope.vehicleListErr = false;
            }, function(error) {
				$scope.vehicleListErr = true;
                Flash.set($filter("translate")(error.data.message), 'error', false);
            });
        };
        /**
         * @ngdoc method
         * @name counter_location
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method will get location list by type.
         * @param {integer} type Vehicle type.
         * @returns {Object} location list.
         **/
        $scope.counter_location = function () {
            CounterLocationFactory.get({type: 'list'}).$promise.then(function (response) {
                $scope.locations = response.data;
            });
        };
        /**
         * @ngdoc method
         * @name getFilterValues
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method will get vehicle list by type.
         * @param {integer} type Vehicle type.
         * @returns {Object} Vehicle details.
         **/
        $scope.getFilterValues = function () {
            VehicleFilterFactory.get().$promise.then(function (response) {
                $scope.vehicle_company_lists = response.vehicle_company_list;
                $scope.vehicle_type_lists = response.vehicle_type_list;
                $scope.seats = response.settings.seats;
                $scope.fuel_lists = response.fuel_type_list;
                $scope.vehicle_price = response.vehicle_type_price;
                //Set seat slider value
                $scope.seatRange = {
                    min: 1,
                    max: parseInt($scope.seats),
                    options: {
                        floor: 1,
                        ceil: parseInt($scope.seats),
                        onEnd: function () {
                            $scope.vehicle.seat_min = $scope.seatRange.min;
                            $scope.vehicle.seat_max = $scope.seatRange.max;
                            $scope.search($scope.vehicle);
                        }
                    }
                };
                //Set day price slider value
                var minPrice, maxPrice;
                $scope.$watch('booking_details', function (booking_details) {
                    if (angular.isDefined(booking_details)) {
                        minPrice = (booking_details.is_day_price == 1) ? $scope.vehicle_price.min_day_price : $scope.vehicle_price.min_hour_price;
                        maxPrice = (booking_details.is_day_price == 1) ? $scope.vehicle_price.max_day_price : $scope.vehicle_price.max_hour_price;
                        $scope.priceRange = {
                            min: parseFloat(minPrice),
                            max: parseFloat(maxPrice),
                            options: {
                                floor: parseFloat(minPrice),
                                ceil: parseFloat(maxPrice),
                                onEnd: function () {
                                    $scope.vehicle.price_min = $scope.priceRange.min;
                                    $scope.vehicle.price_max = $scope.priceRange.max;
                                    $scope.search($scope.vehicle);
                                }
                            }
                        }
                    }
                });

            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        $scope.init = function () {
            $scope.is_drop_location = false;
            $scope.setMetaData();

            $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
            //Get search value item from localstorage
            var searchValue = localStorage.getItem('searchValue');
            localStorage.setItem('vehicle_search_value', searchValue);
            if (searchValue != null) {
                $scope.counter_location();
                $scope.getFilterValues();
                $scope.vehicle = JSON.parse(searchValue);
                $scope.vehicle.vehicle_type = [];
                $scope.vehicle.fuel_type = [];
                $scope.vehicle.sort = 'price';
                $scope.vehicle.sortby = 'asc';
                $scope.vehicle.page = $scope.currentPage;
                //search results from localstorage
                VehicleSearchFactory.post($scope.vehicle, function (response) {
                    $scope.searchData = response.data;
                    $scope.searchData.status = false;
                    $scope._metadata = response.meta.pagination;
                    $scope.booking_details = response.meta.booking_details;
                    // if booking details empty calculate the hours differnce
                    if($scope.booking_details.length == 0) {
                        $scope.booking_details.is_day_price = 1;
                        var diff = new Date($scope.vehicle.end_date).getTime() - new Date($scope.vehicle.start_date).getTime();
                        var hours = Math.abs(diff) / 36e5;
                        if(hours < 1) {
                            $scope.booking_details.is_day_price = 0;
                        }
                    }
                    angular.forEach($scope.searchData, function(value, key) {
                        //if number is decimal return only integer
                        value.roundedRating = value.feedback_rating | 0;
                    });
                    $scope.vehicleListErr = false;
                }, function(error) {
                    $scope.vehicleListErr = true;
                    Flash.set($filter("translate")(error.data.message), 'error', false);
                });
                $scope.vehicle.start_date = new Date($scope.vehicle.start_date);
                $scope.vehicle.end_date = new Date($scope.vehicle.end_date);
                if ($scope.vehicle.drop_location && $scope.vehicle.drop_location.id != $scope.vehicle.pickup_location.id) {
                    $scope.check_drop_location = true;
                    $scope.is_drop_location = true;
                }
            } else {
                $state.go('home');
            }
            //Vehicle rating
            $scope.maxRatings = [];
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
            //Set vehicle start and end date to new scope
            $scope.vehicle.pickup_date = $scope.vehicle.start_date;
            $scope.vehicle.drop_date = $scope.vehicle.end_date;
        };
        $scope.init();
        $scope.paginate = function (pageno) {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.init();
        };
        /**
         * Open Picup and drop off calendar
         * @param e
         * @param date
         */
        $scope.openPickupCalendar = function (e, date, index) {
			$scope.searchData[index].open_pickup = true;
        };
        $scope.openDropCalendar = function (e, date, index) {
			$scope.searchData[index].open_drop = true;
        };
		
		$scope.openSearchPickupCalendar = function (e, date) {
            $scope.open_pickup[date] = true;
        };
        $scope.openSearchDropCalendar = function (e, date) {
            $scope.open_drop[date] = true;
        };

        $scope.open_pickup = {
            date: false
        };
        $scope.open_drop = {
            date: false
        };
	$scope.buttonBar = {
	    show: true,
	    now: {
		show: true,
		text: $filter('translate')('Now')
	    },
	    today: {
		show: true,
		text: $filter('translate')('Today')
	    },
	    clear: {
		show: true,
		text: $filter('translate')('Clear')
	    },
	    date: {
		show: true,
		text: $filter('translate')('Date')
	    },
	    time: {
		show: true,
		text: $filter('translate')('Time')
	    },
	    close: {
		show: true,
		text: $filter('translate')('Close')
	    }
	}
        /**
         * @ngdoc method
         * @name SearchSubmit
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method store search details.
         * @param {Object} vehicle Vehicle serach details.
         * @returns {Object} Vehicle list.
         **/
        $scope.SearchSubmit = function ($valid) {
            if ($valid && ($scope.vehicle.start_date > $scope.currentDate) && ($scope.vehicle.end_date > $scope.vehicle.start_date)) {
                if (!$scope.vehicle.drop_location) {
                    $scope.vehicle.drop_location = $scope.vehicle.pickup_location;
                }
                $scope.setLocalStorage = {
                    start_date: $scope.vehicle.start_date,
                    end_date: $scope.vehicle.end_date,
                    pickup_location_id: $scope.vehicle.pickup_location.id,
                    drop_location_id: $scope.vehicle.drop_location.id,
                    pickup_location: $scope.vehicle.pickup_location,
                    drop_location: $scope.vehicle.drop_location
                };
                localStorage.setItem('searchValue', JSON.stringify($scope.setLocalStorage));
                $scope.init();
                $scope.fuel_lists = [];
                $scope.vehicle_type_lists = [];
                if ($scope.vehicle.drop_location && $scope.vehicle.drop_location.id != $scope.vehicle.pickup_location.id) {
                    $scope.check_drop_location = true;
                }
                $scope.issearchTpl = false;
            }
        };
        /**
         * @ngdoc method
         * @name filterBasedSearch
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method search vehicles.
         * @param {Object} vehicle Vehicle search details.
         * @returns {Object} Vehicle list.
         **/
        $scope.filterBasedSearch = function (filter, id) {
            if (filter == 'type') {
                $scope.selected = $scope.vehicle.vehicle_type.indexOf(id);
                if ($scope.selected > -1) {
                    $scope.vehicle.vehicle_type.splice($scope.selected, 1);
                } else {
                    $scope.vehicle.vehicle_type.push(id);
                }
            }
            if (filter == 'fuel') {
                $scope.selected = $scope.vehicle.fuel_type.indexOf(id);
                if ($scope.selected > -1) {
                    $scope.vehicle.fuel_type.splice($scope.selected, 1);
                } else {
                    $scope.vehicle.fuel_type.push(id);
                }
            }
            $scope.search($scope.vehicle);
        };
        /**
         * @ngdoc method
         * @name sortVehicles
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method used to sort the vehicles.
         * @param {Object} type Vehicle type.
         * @returns {Object} Vehicle list.
         **/
        $scope.sortVehicles = function (type, sortby) {
            if (type == 'price') {
                $scope.sort_name = (sortby == 'desc') ? $filter("translate")("Highest Price") : $filter("translate")("Lowest Price");
            }
            if (type == 'rating') {
                $scope.sort_name = (sortby == 'desc') ? $filter("translate")("Higher Rating") : $filter("translate")("Lower Rating");
            }
            $scope.vehicle.sort = type;
            $scope.vehicle.sortby = sortby;
            $scope.search($scope.vehicle);
        };
        /**
         * @ngdoc method
         * @name vehicleBooking
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method used to store vehicle rentals.
         * @param {Object} vehicle Vehicle rental details.
         * @returns {Object} Vehicle list.
         **/
        $scope.vehicleBooking = function (vehicle_id, slug, $valid) {
            if ($valid && ($scope.vehicle.pickup_date > $scope.currentDate) && ($scope.vehicle.drop_date > $scope.vehicle.pickup_date)) {
                if ($rootScope.auth == undefined) {
                    $scope.vehicle = {
                        id: vehicle_id,
                        slug: slug,
                        start_date: $scope.vehicle.pickup_date,
                        end_date: $scope.vehicle.drop_date,
                        pickup_location_id: $scope.vehicle.pickup_location.id,
                        drop_location_id: $scope.vehicle.drop_location.id
                    };
                    localStorage.vehicle_search_value = JSON.stringify($scope.vehicle);
                    Flash.set($filter("translate")("Sign in for an account"), 'error', false);
                    $state.go('login');
                } else {
                    $scope.bookingObj = {
                        vehicle_id: vehicle_id,
                        item_booking_start_date: $scope.vehicle.pickup_date,
                        item_booking_end_date: $scope.vehicle.drop_date,
                        pickup_counter_location_id: $scope.vehicle.pickup_location.id,
                        drop_counter_location_id: $scope.vehicle.pickup_location.id
                    };
                    if ($scope.vehicle.drop_location) {
                        $scope.bookingObj.drop_counter_location_id = $scope.vehicle.drop_location.id;
                    }
                    VehicleBookingFactory.save($scope.bookingObj, function (response) {
                        $state.go('vehicle_detail', {'vehicle_rental_id': response.id});
                    }, function (error) {
                        Flash.set($filter("translate")(error.data.message), 'error', false);
                    });
                }
            }
        };

        /**
         * @ngdoc method
         * @name modalOpen
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method will initialze the page. It pen the modal with vehicle feedbacks.
         **/
        $scope.modalOpen = function (size, vehicle_id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Plugins/Vehicles/vehicle_feedback_modal.tpl.html',
                controller: 'VehicleModalController',
                size: size,
                resolve: {
                    vehicle_id: function () {
                        return vehicle_id;
                    }
                }
            });
        };
    });
}(angular.module("BookorRent.Vehicles")));

(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleModalController
     * @description
     * This is modal controller. It contains all the details about the user. It fetches the data of the feedbacks
     **/
    module.controller('VehicleModalController', function ($state, $scope, $http, Flash, AuthFactory, GENERAL_CONFIG, $filter, $rootScope, $uibModalInstance, vehicle_id, GetVehicleFeedbackFactory, moment) {
        var model = this;
        $scope.maxSize = 5;
        /**
         * @ngdoc method
         * @name getVehicleFeedbacks
         * @methodOf Vehicles.controller:VehicleModalController
         * @description
         * This method is used to get vehicle feedbacks.
         * @param {integer} vehicle_id Vehicle identifier.
         * @returns {Object} Vehicle feedbacks.
         */
        $scope.getVehicleFeedbacks = function () {
            GetVehicleFeedbackFactory.get({vehicle_id: vehicle_id, page: $scope.currentPage}).$promise.then(function (response) {
                $scope.vehicleFeedbacks = response.data;
                $scope.vehicle_metadata = response.meta.pagination;
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehicleModalController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        model.init = function () {
            $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
            $scope.maxRatings = [];
            $scope.maxRating = 5;
            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
            $scope.getVehicleFeedbacks();
        };
        model.init();
        $scope.modalClose = function () {
            $uibModalInstance.dismiss('close');
        };
        //Go to user page
        $scope.userDashboard = function (name) {
            $uibModalInstance.dismiss('close');
            $state.go('userView', {'username': name});
        };
        /**
         * @ngdoc method
         * @name paginate
         * @methodOf Vehicles.controller:VehicleModalController
         * @description
         * This method will be load pagination the pages.
         **/
        $scope.paginate = function () {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.getVehicleFeedbacks();
        };
    });
}(angular.module("BookorRent.Vehicles")));
(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleSearchController
     * @description
     * This is VehicleSearchController having the methods init(), setMetaData(), and it defines the vehicle search related funtions.
     **/
    module.controller('VehicleSearchController', function ($state, $scope, $http, Flash, $filter, AuthFactory, $rootScope, $location, VehicleSearchFactory, CounterLocationFactory) {
        $scope.vehicle = {};
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:VehicleSearchController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Vehicle Search");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name counter_location
         * @methodOf Vehicles.controller:VehicleSearchController
         * @description
         * This method will get location list by type.
         * @param {integer} type Vehicle type.
         * @returns {Object} Location list.
         **/
        $scope.counter_location = function () {
            CounterLocationFactory.get().$promise.then(function (response) {
                $scope.locations = response.data;
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehicleSearchController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $scope.counter_location();
        };
        $scope.init();
        /**
         * Open Picup and drop off calendar
         * @param e
         * @param date
         */
        $scope.openPickupCalendar = function (e, date) {
            $scope.open_pickup[date] = true;
        };
        $scope.openDropCalendar = function (e, date) {
            $scope.open_drop[date] = true;
        };

        $scope.open_pickup = {
            date: false
        };
        $scope.open_drop = {
            date: false
        };
        $scope.SearchSubmit = function ($valid) {
            if ($valid) {
                localStorage.setItem('searchValue', JSON.stringify($scope.vehicle));
                $state.go('vehicle_list');
            }
        };
    });
}(angular.module("BookorRent.Vehicles")));

(function (module) {
    /**
     * @ngdoc service
     * @name Vehicles.VehicleRelatedFactory
     * @description
     * VehicleRelatedFactory is a factory service which is used to brings all vehicle related informations.
     * @param {string} VehicleRelatedFactory The name of the factory
     * @param {function()} function It uses post method to fetch the data
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'},
	 *		};
     */
    module.factory('VehicleRelatedFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/vehicle/add', {}, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehicleModelFactory
     * @description
     * VehicleModelFactory used to get vehicle types.
     * @param {function()} function It uses get method for vehicle types.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @param {integer=} vehicle_make_id Vehicle model identifier to get the particular vehicle type.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'},
	 *		};
     */
    module.factory('VehicleModelFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_models', {}, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehicleTypeFactory
     * @description
     * VehicleTypeFactory used to get type price.
     * @param {function()} function It uses get method for type price.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @param {integer=} vehicle_make_id Vehicle model identifier to get the particular vehicle type price.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'},
	 *		};
     */
    module.factory('VehicleTypeFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_types/:id', {}, {
                'get': {
                    method: 'GET'
                },
                'getAll':{
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehicleFactory
     * @description
     * VehicleFactory is a factory service which is used to store and update vehicle details.
     * @param {string} VehicleFactory The name of the factory
     * @param {function()} function It used to store and update vehicle details.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':    {method:'POST'},
	 *			'update':    {method:'POST'}
	 *		};
     */
    module.factory('VehicleFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/vehicles/:id', {}, {
                'save': {
                    method: 'POST'
                },
                'update': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.MyVehiclesFactory
     * @description
     * MyVehiclesFactory is a factory service which is used to fetch user's vechicle details.
     * @param {string} MyVehiclesFactory The name of the factory
     * @param {function()} function It used to fetch user's vechicle details.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('MyVehiclesFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/vehicles/me', {}, {
                'get': {
                    method: 'GET'
                },
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehicleCompanyFactory
     * @description
     * VehicleCompanyFactory is a factory service which is used to fetch user's vechicle details.
     * @param {string} VehicleCompanyFactory The name of the factory
     * @param {function()} function It used to fetch user's vechicle details.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':    {method:'POST'},
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('VehicleCompanyFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/vehicle_companies', {}, {
                'save': {
                    method: 'POST'
                },
                'get': {
                    method: 'GET'
                }
            }
        );
    });

    /**
     * @ngdoc service
     * @name Vehicles.VehicleCompanyShowFactory
     * @description
     * VehicleCompanyShowFactory is a factory service which is used to show logged user the company details.
     * @param {string} VehicleCompanyShowFactory The name of the factory
     * @param {function()} function It used to show logged user the company details.
     */
    module.factory('VehicleCompanyShowFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/vehicle_companies/show', {}, {}
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.CounterLocationFactory
     * @description
     * CounterLocationFactory used in list and list the counter locations.
     * @param {string} CounterLocationFactory The name of the factory
     * @param {function()} function It uses get method for listing, defines the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('CounterLocationFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/counter_locations', {}, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehicleSearchFactory
     * @description
     * VehicleSearchFactory used in list and list the vehicles.
     * @param {string} VehicleSearchFactory The name of the factory
     * @param {function()} function It uses post method for listing, defines the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':    {method:'POST'}
	 *		};
     */
    module.factory('VehicleSearchFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicles/search', {}, {
                'post': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehicleFilterFactory
     * @description
     * VehicleFilterFactory used in list and list the vehicle filters.
     * @param {string} VehicleFilterFactory The name of the factory
     * @param {function()} function It uses post method for listing, defines the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('VehicleFilterFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicles/filters', {}, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehicleBookingFactory
     * @description
     * VehicleBookingFactory used in list and list the vehicle filters.
     * @param {string} VehicleBookingFactory The name of the factory
     * @param {function()} function It uses post method for booking the vehicle
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':    {method:'POST'}
	 *		};
     */
    module.factory('VehicleBookingFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals', {}, {
                'save': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehicleDetailFactory
     * @description
     * VehicleDetailFactory used in list and list the vehicle filters.
     * @param {string} VehicleDetailFactory The name of the factory
     * @param {function()} function It uses get method for get the booking vehicle details
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('VehicleDetailFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals/:id', {
                id: '@id'
            }, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.UpdateBookingDetailFactory
     * @description
     * UpdateBookingDetailFactory used in list and list the vehicle filters.
     * @param {string} UpdateBookingDetailFactory The name of the factory
     * @param {function()} function It uses get method for put method for update the booking details
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'update':    {method:'PUT'}
	 *		};
     */
    module.factory('UpdateVehicleRentalFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals/:id', {
                id: '@id'
            }, {
                'update': {
                    method: 'PUT'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.GetVehicleFactory
     * @description
     * GetVehicleFactory used in list and list the vehicle filters.
     * @param {string} GetVehicleFactory The name of the factory
     * @param {function()} function It uses get method for get method for get the vehicle
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('GetVehicleFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicles/:id', {
                íd: '@id'
            }, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.VehiclePaymentFactory
     * @description
     * VehiclePaymentFactory used in vehicle payment method.
     * @param {string} VehiclePaymentFactory The name of the factory
     * @param {function()} function It uses Post method for vehicle payment
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':    {method:'POST'}
	 *		};
     */
    module.factory('VehiclePaymentFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicles/paynow', {}
            , {
                'save': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.MaintenanceVehicles
     * @description
     * MaintenanceVehicles used to get maintenance vehicles
     * @param {string} MaintenanceVehicles The name of the factory
     * @param {function()} function It uses get method for get maintenance vehicles
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'},
	 *			'save':    {method:'POST'},
	 *			'update':    {method:'PUT'},
	 *			'delete':    {method:'DELETE'}
	 *		};
     */
    module.factory('MaintenanceVehicles', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/unavailable_vehicles/:id', {
                id: '@id'
            }
            , {
                'get': {
                    method: 'GET'
                },
                'save': {
                    method: 'POST'
                },
                'update': {
                    method: 'PUT'
                },
                'delete': {
                    method: 'DELETE'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.EditMaintenanceVehicles
     * @description
     * EditMaintenanceVehicles used to get maintenance vehicles
     * @param {string} EditMaintenanceVehicles The name of the factory
     * @param {function()} function It uses get method for get maintenance vehicles
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('EditMaintenanceVehicles', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/unavailable_vehicles/:id/edit', {
                id: '@id'
            }
            , {
                'get': {
                    method: 'GET'
                },
            }
        );
    });
    /**
     * @ngdoc service
     * @name Vehicles.GetVehicleFeedbackFactory
     * @description
     * GetVehicleFeedbackFactory used to get vehicle feedbacks
     * @param {string} GetVehicleFeedbackFactory The name of the factory
     * @param {function()} function It uses get method for get vehicle feedbacks
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':    {method:'GET'}
	 *		};
     */
    module.factory('GetVehicleFeedbackFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_feedbacks', {}
            , {
                'get': {
                    method: 'GET'
                },
            }
        );
    });

})(angular.module('BookorRent.Vehicles'));
(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleViewController
     * @description
     * This is modal controller. It contains all the details about the vehicle view.
     **/
    module.controller('VehicleViewController', function ($state, $scope, $http, Flash, $location, AuthFactory, GENERAL_CONFIG, $filter, $rootScope, GetVehicleFactory, GetVehicleFeedbackFactory, $uibModal, ConstDurationTypes, ConstDiscountTypes, moment) {
        var model = this;
        $scope.maxSize = 5;
        $scope.ConstDiscountTypes = ConstDiscountTypes;
        $scope.ConstDurationTypes = ConstDurationTypes;
        $scope.socialShareDetails = {};
        /**
         * @ngdoc method
         * @name getVehicle
         * @methodOf Vehicles.controller:VehicleViewController
         * @description
         * This method is used to get vehicle details.
         * @param {integer} vehicle_id Vehicle identifier.
         * @returns {Object} Vehicle details.
         */
        $scope.getVehicle = function () {
            GetVehicleFactory.get({id: $state.params.id}).$promise.then(function (response) {
                $scope.vehicle = response;
                $scope.vehicle.roundedRating = response.feedback_rating | 0;
                $scope.pickup_locations = response.pickup_locations;
                $scope.drop_locations = response.drop_locations;
                if (response.vehicle_type && response.vehicle_type.vehicle_type_extra_accessory) {
                    $scope.vehicle_extra_accessories = response.vehicle_type.vehicle_type_extra_accessory.data;
                }
                if (response.vehicle_type && response.vehicle_type.vehicle_type_insurance) {
                    $scope.vehicle_insurance = response.vehicle_type.vehicle_type_insurance.data;
                }
                if (response.vehicle_type && response.vehicle_type.vehicle_type_fuel_option) {
                    $scope.vehicle_fuel_option = response.vehicle_type.vehicle_type_fuel_option.data;
                }
                if (response.vehicle_type && response.vehicle_type.vehicle_type_tax) {
                    $scope.vehicle_taxes = response.vehicle_type.vehicle_type_tax.data;
                }
                if (response.vehicle_type && response.vehicle_type.vehicle_type_surcharge) {
                    $scope.vehicle_surcharges = response.vehicle_type.vehicle_type_surcharge.data;
                }
                $scope.socialShareDetails = {
                    name : $scope.vehicle.name,
                    image: $scope.vehicle.attachments.thumb.large,
                    rating: $scope.vehicle.feedback_rating,
                    url: $scope.currentUrl
                };
            });
        };
        /**
         * @ngdoc method
         * @name getVehicleFeedbacks
         * @methodOf Vehicles.controller:VehicleViewController
         * @description
         * This method is used to get vehicle feedback details.
         * @param {integer} vehicle_id Vehicle identifier.
         * @returns {Object} Vehicle feedback details.
         */
        $scope.getVehicleFeedbacks = function () {
            GetVehicleFeedbackFactory.get({vehicle_id: $state.params.id, page: model.currentPage}).$promise.then(function (response) {
                $scope.vehicleFeedbacks = response.data;
                $scope.vehicle_feedback_metadata = response.meta.pagination;
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehicleViewController
         * @description
         * This method will initialize the functionalities
         **/
        $scope.init = function () {
            $scope.vehicle_search_value = localStorage.getItem('vehicle_search_value');
            localStorage.removeItem('vehicle_search_value');
            $scope.currentUrl = $location.absUrl();
            model.currentPage = (model.currentPage !== undefined) ? parseInt(model.currentPage) : 1;
            $scope.maxRatings = [];
            $scope.maxRating = 5;
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
            $scope.getVehicle();
            $scope.getVehicleFeedbacks();
        };
        $scope.init();
        $scope.paginate = function (pageno) {
            model.currentPage = parseInt(model.currentPage);
            $scope.getVehicleFeedbacks();
        };
        /**
         * @ngdoc method
         * @name openBookitModal
         * @methodOf Vehicles.controller:VehicleViewController
         * @description
         * This method will initialze the page. It pen the modal with vehicle.
         **/
        $scope.openBookitModal = function (size) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Plugins/Vehicles/vehicle_bookit.tpl.html',
                controller: 'VehicleBookitController',
                size: size,
                resolve: {
                    vehicleDetails: function () {
                        return $scope.vehicle;
                    },
                    searchValue: function () {
                        return $scope.vehicle_search_value;
                    }
                }
            });
        };
    });
}(angular.module("BookorRent.Vehicles")));
(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehiclesController
     * @description
     * This is VehiclesController having the methods init(), setMetaData(), and it defines the vehicle related funtions.
     **/
    module.controller('VehiclesController', function ($state, $scope, $http, Flash, $filter, AuthFactory, $rootScope, $location, $window, ConstPaymentGateways, GetCountries, GetGatewaysFactory, GetVehicleFactory, VehiclePaymentFactory) {
        $scope.buyer = {};
        $scope.ConstPaymentGateways = ConstPaymentGateways;
        $scope.apply_is_disabled = $scope.paynow_is_disabled = false;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:VehiclesController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Vehicle Details");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name getGatewaysList
         * @methodOf Vehicles.controller:VehiclesController
         * @description
         * This method used to get payment gateway list.
         * @param {Object} Gateway_list Payment gateway list.
         * @returns {Object} Payment gateway list.
         */
        $scope.getGatewaysList = function () {
            GetGatewaysFactory.get().$promise.then(function (response) {
                if (response.paypal) {
                    $scope.paypal_enabled = (response.paypal.paypal_enabled) ? true : false;
                }
                if (response.wallet) {
                    $scope.wallet_enabled = (response.wallet.wallet_enabled) ? true : false;
                }
                if (response.sudopay) {
                    $scope.gateway_groups = response.sudopay.gateway_groups;
                    $scope.payment_gateways = response.sudopay.payment_gateways;
                    $scope.form_fields_tpls = response.sudopay.form_fields_tpls;
                    $scope.sel_payment_gateway = response.sudopay.selected_payment_gateway_id;
                    $scope.show_form = [];
                    $scope.form_fields = [];
                    $scope.group_gateway_id = response.sudopay.selected_gateway_id;
                    angular.forEach($scope.form_fields_tpls, function (key, value) {
                        if (value == 'buyer') {
                            $scope.form_fields[value] = 'Plugins/Sudopays/buyer.tpl.html';
                        }
                        if (value == 'credit_card') {
                            $scope.form_fields[value] = 'Plugins/Sudopays/credit_card.tpl.html';
                        }
                        if (value == 'manual') {
                            $scope.form_fields[value] = 'Plugins/Sudopays/manual.tpl.html';
                        }
                        $scope.show_form[value] = true;
                    });
                }
                if ($scope.paypal_enabled) {
                    $scope.gateway_id = ConstPaymentGateways.PayPal;
                } else if ($scope.wallet_enabled) {
                    $scope.gateway_id = ConstPaymentGateways.Wallet;
                } else {
                    $scope.gateway_id = ConstPaymentGateways.SudoPay;
                }
            });
        };
        $scope.paneChanged = function (pane) {
            var keepGoing = true;
            $scope.buyer = {};
            $scope.PaymentForm.$setPristine();
            $scope.PaymentForm.$setUntouched();
            angular.forEach($scope.form_fields_tpls, function (key, value) {
                $scope.show_form[value] = false;
            });
            if (pane == 'paypal') {
                $scope.gateway_id = ConstPaymentGateways.PayPal;
            }
            else if (pane == 'wallet') {
                $scope.gateway_id = ConstPaymentGateways.Wallet;
            }
            else {
                $scope.gateway_id = ConstPaymentGateways.SudoPay;
                angular.forEach($scope.gateway_groups, function (res) {
                    if (res.display_name == pane) {
                        var selPayment = '';
                        angular.forEach($scope.payment_gateways, function (response) {
                            if (keepGoing) {
                                if (response.group_id == res.id) {
                                    selPayment = response;
                                    keepGoing = false;
                                    $scope.rdoclick(selPayment.id, selPayment.form_fields);
                                }
                            }
                        });
                        $scope.sel_payment_gateway = "sp_" + selPayment.id;
                        $scope.group_gateway_id = selPayment.group_id;
                    }
                });
            }
        };

        $scope.rdoclick = function (res, res1) {
            $scope.paynow_is_disabled = false;
            $scope.sel_payment_gateway = "sp_" + res;
            $scope.array = res1.split(',');
            angular.forEach($scope.array, function (value) {
                $scope.show_form[value] = true;
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehiclesController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $scope.getGatewaysList();
            $scope.gatewayTpl = 'Common/gateway.tpl.html';
            GetVehicleFactory.get({id: $state.params.vehicle_id}).$promise.then(function (response) {
                $scope.vehicleDetails = response;
                $scope.vehicleDetails.roundedRating = response.feedback_rating | 0;
            });
            //Get countries list
            GetCountries.get({'sort': 'name', 'sortby': 'asc'}).$promise.then(function (response) {
                $scope.countries = response.data;
            });
            //Vehicle rating
            $scope.maxRatings = [];
            $scope.maxRating = 5;
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
            //Get user available balance
            AuthFactory.fetch({}).$promise
                .then(function (response) {
                    $scope.user_available_balance = response.available_wallet_amount;
                });
        };
        $scope.init();
        /**
         * @ngdoc method
         * @name PaymentSubmit
         * @methodOf Vehicles.controller:VehiclesController
         * @description
         * This method will pay amount to booking item.
         * @param {object} form Payment details.
         * @returns {Array} Success or failure message.
         */
        $scope.PaymentSubmit = function (form) {
            payment_id = '';
            if ($scope.sel_payment_gateway && $scope.gateway_id == ConstPaymentGateways.SudoPay) {
                payment_id = $scope.sel_payment_gateway.split('_')[1];
            }

            $scope.buyer.payment_id = payment_id;
            $scope.buyer.gateway_id = $scope.gateway_id; // Paypal or sudopay
            $scope.buyer.vehicle_id = $state.params.vehicle_id; // vehicle id
            if ($scope.buyer.credit_card_expire_month || $scope.buyer.credit_card_expire_year) {
                $scope.buyer.credit_card_expire_month = $scope.buyer.credit_card_expire_month > 9 ? $scope.buyer.credit_card_expire_month: "0" + $scope.buyer.credit_card_expire_month;
                $scope.buyer.credit_card_expire = $scope.buyer.credit_card_expire_month + "/" + $scope.buyer.credit_card_expire_year;
            }
            if ($scope.gateway_id == ConstPaymentGateways.PayPal) { //if Paypal checkonly amount field
                form.$valid = true;
            }
            if (form.$valid) {
                $scope.paynow_is_disabled = true;
                VehiclePaymentFactory.save($scope.buyer, function (response) {
                    if (response.data == 'wallet') {
                        if($rootScope.settings['vehicle.auto_approve'] == 0) {
                            Flash.set($filter("translate")("Admin need to approve the vehicle."), 'success', true);
                        } else {
                            Flash.set($filter("translate")("Vehicle Add successfully completed."), 'success', true);
                        }
                        $state.go('myVehicles');
                    }
                    if (response.url != undefined) {
                        $window.location.href = response.url;
                    } else if (response.Success != undefined) {
                        if($rootScope.settings['vehicle.auto_approve'] == 0) {
                            Flash.set($filter("translate")("Admin need to approve the vehicle."), 'success', true);
                        } else {
                            Flash.set($filter("translate")(response.Success), 'success', true);
                        }
                        $state.go('myVehicles');
                    }
                    $scope.paynow_is_disabled = false;
                }, function (error) {
                    Flash.set($filter("translate")(error.data.message), 'error', false);
                    $scope.paynow_is_disabled = false;
                });
            }
        };
    });

}(angular.module("BookorRent.Vehicles")));

/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name Vehicles
 * @description
 *
 * This is the module for Vehicles.
 *
 * The vehicle module have initialize, directive and controllers. The vehicle module is used to vehicle the item with date and quantity.
 *
 * @param {Array.<string>=} dependencies The dependencies are included in main BookorRent.Banner module.
 *
 *        [
 *            'ui.router',
 *            'ngResource'
 *        ]
 * @param {controller=} Controller controller function for the module.
 * @returns {BookorRent.Vehicles} new BookorRent.Vehicles module.
 **/
(function (module) {


    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleAllLsitController
     * @description
     *
     * This is VehicleAllLsitController having the methods init(), setMetaData(), and it defines the vehicle search related funtions.
     **/
    module.controller('VehicleAllLsitController', function ($state, $scope, $http, Flash, $filter, AuthFactory, $rootScope, $location, $timeout, VehicleSearchFactory, CounterLocationFactory, VehicleFilterFactory, VehicleBookingFactory, $uibModal, GetVehicleFactory) {
        $scope.maxSize = 5;
        $scope.indextab = 1;
        var params = {};
        $scope.vehicle = {};
        $scope.seatRange = {};
        $scope.dayPriceRange = {};
        $scope.hourPriceRange = {};
        $scope.maxRating = 5;
        $scope.sort_name = $filter("translate")("Sort by");
        $scope.status = {
            type:true,
            preference:true,
            fuel:true,
            seat:true,
            price:true
        };
        $scope.currentDate = new Date();
        $scope.vehicle.vehicle_type = [];
        $scope.vehicle.fuel_type = [];
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:VehicleAllLsitController
         * @description
         *
         * This method will set the meta data dynamically by using the angular.element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Vehicle Lists");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name search
         * @methodOf Vehicles.controller:VehicleAllLsitController
         * @description
         *
         * This method will search the vehicles based on the request.
         **/
        $scope.search = function(vehicle){
            vehicle.page = $scope.currentPage;
            VehicleSearchFactory.post(vehicle, function(response) {
                $scope.searchData = response.data;
                $scope.searchData.status = false;
                $scope._metadata = response.meta.pagination;
                angular.forEach($scope.searchData, function(value, key) {
                    //if number is decimal return only integer
                    value.roundedRating = value.feedback_rating | 0;
					value.open_pickup = false;
					value.open_drop = false;
                });
            });
        };
        /**
         * @ngdoc method
         * @name getFilterValues
         * @methodOf Vehicles.controller:VehicleSearchController
         * @description
         *
         * This method will get the list of filters.
         **/
        $scope.getFilterValues = function() {
            VehicleFilterFactory.get().$promise.then(function(response) {
                $scope.vehicle_company_lists = response.vehicle_company_list;
                $scope.vehicle_type_lists = response.vehicle_type_list;
                $scope.seats = response.settings.seats;
                $scope.fuel_lists = response.fuel_type_list;
                $scope.vehicle_price = response.vehicle_type_price;
                //Set seat slider value
                $scope.seatRange = {
                    min:1,
                    max:parseInt($scope.seats),
                    options: {
                        floor: 1,
                        ceil: parseInt($scope.seats),
                        onEnd: function () {
                            $scope.vehicle.seat_min = $scope.seatRange.min;
                            $scope.vehicle.seat_max = $scope.seatRange.max;
                            $scope.search($scope.vehicle);
                        }
                    }
                };
                //if length > 0,display price range
                $scope.vehicle_price_length = Object.keys($scope.vehicle_price).length;
                //Set day and hour price slider value
                var minDayPrice, maxDayPrice, minHourPrice, maxHourPrice;
                minDayPrice = $scope.vehicle_price.min_day_price;
                maxDayPrice = $scope.vehicle_price.max_day_price;
                minHourPrice = $scope.vehicle_price.min_hour_price;
                maxHourPrice = $scope.vehicle_price.max_hour_price;
                //Day price filter
                $scope.dayPriceRange = {
                    min:parseFloat(minDayPrice),
                    max:parseFloat(maxDayPrice),
                    options: {
                        floor: parseFloat(minDayPrice),
                        ceil: parseFloat(maxDayPrice),
                        onEnd: function () {
                            $scope.vehicle.price_type = 'day';
                            $scope.vehicle.price_min = $scope.dayPriceRange.min;
                            $scope.vehicle.price_max = $scope.dayPriceRange.max;
                            $scope.search($scope.vehicle);
                            //reset if day price set
                            $scope.hourPriceRange.min = minHourPrice;
                            $scope.hourPriceRange.max = maxHourPrice;
                        }
                    }
                }
                //hour price filter
                $scope.hourPriceRange = {
                    min:parseFloat(minHourPrice),
                    max:parseFloat(maxHourPrice),
                    options: {
                        floor: parseFloat(minHourPrice),
                        ceil: parseFloat(maxHourPrice),
                        onEnd: function () {
                            $scope.vehicle.price_type = 'hour';
                            $scope.vehicle.price_min = $scope.hourPriceRange.min;
                            $scope.vehicle.price_max = $scope.hourPriceRange.max;
                            $scope.search($scope.vehicle);
                            //reset if day price set
                            $scope.dayPriceRange.min = minDayPrice;
                            $scope.dayPriceRange.max = maxDayPrice;
                        }
                    }
                }
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehicleAllLsitController
         * @description
         *
         * This method will initialize the meta data and functionalities.
         **/
        $scope.init = function () {
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("All Vehicles");
            $scope.vehicle.price_type = 'day';
            $scope.setMetaData();
            $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
            $scope.getFilterValues();
            $scope.vehicle.page = 1;
            $scope.search($scope.vehicle);

            //Vehicle rating
            $scope.maxRatings = [];
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
        };
        $scope.init();
        $scope.paginate = function(pageno) {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.search($scope.vehicle);
        };
        /**
         * Open Picup and drop off calendar
         * @param e
         * @param date
         */
        $scope.openPickupCalendar = function (e, date, index) {
			$scope.searchData[index].open_pickup = true;
        };
        $scope.openDropCalendar = function (e, date, index) {
			$scope.searchData[index].open_drop = true;
        };

        $scope.open_pickup = {
            date: false
        };
        $scope.open_drop = {
            date: false
        };
	
	$scope.buttonBar = {
	    show: true,
	    now: {
		show: true,
		text: $filter('translate')('Now')
	    },
	    today: {
		show: true,
		text: $filter('translate')('Today')
	    },
	    clear: {
		show: true,
		text: $filter('translate')('Clear')
	    },
	    date: {
		show: true,
		text: $filter('translate')('Date')
	    },
	    time: {
		show: true,
		text: $filter('translate')('Time')
	    },
	    close: {
		show: true,
		text: $filter('translate')('Close')
	    }
	};
        /**
         * @ngdoc method
         * @name filterBasedSearch
         * @methodOf Vehicles.controller:VehicleAllLsitController
         * @description
         *
         * This method will list the vehicles based on filters.
         **/

        $scope.filterBasedSearch = function(filter,id) {
            if(filter == 'type') {
                $scope.selected = $scope.vehicle.vehicle_type.indexOf(id);
                if($scope.selected > -1) {
                    $scope.vehicle.vehicle_type.splice($scope.selected, 1);
                } else {
                    $scope.vehicle.vehicle_type.push(id);
                }
            }
            if(filter == 'fuel') {
                $scope.selected = $scope.vehicle.fuel_type.indexOf(id);
                if($scope.selected > -1) {
                    $scope.vehicle.fuel_type.splice($scope.selected, 1);
                } else {
                    $scope.vehicle.fuel_type.push(id);
                }
            }
            $scope.search($scope.vehicle);
        };

        /**
         * @ngdoc method
         * @name sortVehicles
         * @methodOf Vehicles.controller:VehicleAllLsitController
         * @description
         *
         * This method will sort the vehicles.
         **/
        $scope.sortVehicles = function(price_type, type, sortby) {
            if(type == 'price') {
                $scope.sort_name = (sortby == 'desc') ? $filter("translate")("Highest Price") : $filter("translate")("Lowest Price");
                $scope.vehicle.sort_by_price = price_type;
            }
            if(type == 'rating') {
                $scope.sort_name = (sortby == 'desc') ? $filter("translate")("Higher Rating") : $filter("translate")("Lower Rating");
            }
            $scope.vehicle.sort = type;
            $scope.vehicle.sortby = sortby;
            $scope.search($scope.vehicle);
        };

        /**
         * @ngdoc method
         * @name modalOpen
         * @methodOf Vehicles.controller:VehicleAllLsitController
         * @description
         * This method will initialze the page. It pen the modal with vehicle feedbacks.
         *
         **/
        $scope.modalOpen = function (size, vehicle_id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Plugins/Vehicles/vehicle_feedback_modal.tpl.html',
                controller: 'VehicleModalController',
                size: size,
                resolve: {
                    vehicle_id: function () {
                        return vehicle_id;
                    }
                }
            });
        };
        /**
         * @ngdoc method
         * @name openBookitModal
         * @methodOf Vehicles.controller:VehicleAllLsitController
         * @description
         * This method will initialze the page. It pen the modal with vehicle feedbacks.
         *
         **/
        $scope.openBookitModal = function (size, vehicle_id) {
            GetVehicleFactory.get({'id':vehicle_id}).$promise.then(function(response) {
                $scope.vehicleDetails = response;
                var modalInstance = $uibModal.open({
                    templateUrl: 'Plugins/Vehicles/vehicle_bookit.tpl.html',
                    controller: 'VehicleBookitController',
                    size: size,
                    resolve: {
                        vehicleDetails: function () {
                            return  $scope.vehicleDetails;
                        }
                    }
                });
            });

        };

        $scope.refreshSlider = function () {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        };

        /**
         * @ngdoc method
         * @name vehicleBooking
         * @methodOf Vehicles.controller:VehicleListController
         * @description
         * This method used to store vehicle rentals.
         * @param {Object} vehicle Vehicle rental details.
         * @returns {Object} Vehicle list.
         **/
        $scope.VehicleBooking = function (vehicle_id, slug, $valid) {
            if ($valid && ($scope.vehicle.pickup_date > $scope.currentDate) && ($scope.vehicle.drop_date > $scope.vehicle.pickup_date)) {
                if ($rootScope.auth == undefined) {
                    $scope.vehicle = {
                        id: vehicle_id,
                        slug: slug,
                        start_date: $scope.vehicle.pickup_date,
                        end_date: $scope.vehicle.drop_date,
                        pickup_location_id: $scope.vehicle.pickup_location.id,
                        drop_location_id: $scope.vehicle.pickup_location.id
                    };
					if ($scope.vehicle.drop_location) {
                        $scope.vehicle.drop_location_id = $scope.vehicle.drop_location.id;
                    }
                    localStorage.vehicle_search_value = JSON.stringify($scope.vehicle);
                    Flash.set($filter("translate")("Sign in for an account"), 'error', false);
                    $state.go('login');
                } else {
                    $scope.bookingObj = {
                        vehicle_id: vehicle_id,
                        item_booking_start_date: $scope.vehicle.pickup_date,
                        item_booking_end_date: $scope.vehicle.drop_date,
                        pickup_counter_location_id: $scope.vehicle.pickup_location.id,
                        drop_counter_location_id: $scope.vehicle.pickup_location.id
                    };
                    if ($scope.vehicle.drop_location) {
                        $scope.bookingObj.drop_counter_location_id = $scope.vehicle.drop_location.id;
                    }
                    VehicleBookingFactory.save($scope.bookingObj, function (response) {
                        $state.go('vehicle_detail', {'vehicle_rental_id': response.id})
                    }, function (error) {
                        Flash.set($filter("translate")(error.data.message), 'error', false);
                    });
                }
            }
        };
    });
}(angular.module("BookorRent.Vehicles")));

(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleAddController
     * @description
     * This is VehicleAddController having the methods init(), setMetaData(). It controls the functionality of add vehicle.
     **/
    module.controller('VehicleAddController', function ($scope, $rootScope, $filter, Flash, $state, $location, Upload, GENERAL_CONFIG, VehicleRelatedFactory, VehicleModelFactory, VehicleTypeFactory, VehicleCompanyFactory) {
        model = this;
        $scope.vehicle = {};
        $scope.vehicle.pickup_counter_locations = [];
        $scope.vehicle.drop_counter_locations = [];
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {
            var pageTitle = $filter("translate")("Add Vehicle");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        model.init = function () {
            model.setMetaData();
            $scope.driver_min_age = $rootScope.settings['vehicle.driver_min_age'];
            $scope.driver_max_age = $rootScope.settings['vehicle.driver_max_age'];
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Add Vehicle");
            VehicleRelatedFactory.get().$promise.then(function (response) {
                $scope.vehicleCompanies = response.vehicle_company_list;
                $scope.vehicleTypes = response.vehicle_type_list;
                $scope.vehicleMakes = response.vehicle_make_list;
                $scope.counter_locations = response.counter_location_list;
                $scope.fuelTypes = response.fuel_type_list;
                $scope.seats = parseInt(response.settings.seats);
                $scope.doors = parseInt(response.settings.doors);
                $scope.small_bags = parseInt(response.settings.small_bags);
                $scope.large_bags = parseInt(response.settings.large_bags);
                $scope.gears = parseInt(response.settings.gears);
                $scope.air_bags = parseInt(response.settings.airbags);

                //covert counter location object to array
                $scope.vehicle_counter_locations = [];
                angular.forEach ($scope.counter_locations, function(value, key){
                    var obj = {};
                    obj.id = value;
                    obj.name = key;
                    $scope.vehicle_counter_locations.push(obj);
                });
            });

            $scope.status = ($state.params.status !== undefined) ? $state.params.status : 0;
            if ($scope.status == 'fail') {
                Flash.set($filter("translate")("Vehicle Add could not be completed, please try again."), 'error', false);
                $state.go("myVehicles");

            } else if ($scope.status == 'success') {
                if($rootScope.settings['vehicle.auto_approve'] == 0) {
                    Flash.set($filter("translate")("Admin need to approve the vehicle."), 'success', true);
                } else {
                    Flash.set($filter("translate")("Vehicle Add successfully completed."), 'success', true);
                }
                $state.go("myVehicles");
            }
        };
        model.init();
        /**
         * @ngdoc method
         * @name getVehicleModel
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method will get vehicle models.
         * @param {integer} vehicle_make_id Vehicle make identifier.
         * @returns {Object} Vehicle models list.
         **/
        $scope.getVehicleModel = function (vehicle_make_id) {
            VehicleModelFactory.get({'vehicle_make_id': vehicle_make_id}).$promise.then(function (response) {
                $scope.vehicleModels = response.data;
            });
        };
        /**
         * @ngdoc method
         * @name getVehicleTypePrice
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method will get vehicle types.
         * @param {integer} vehicle_type_id Vehicle type identifier.
         * @returns {Object} Vehicle type list.
         **/
        $scope.getVehicleTypePrice = function (vehicle_type_id) {
            VehicleTypeFactory.get({'id': vehicle_type_id}).$promise.then(function (response) {
                $scope.vehicleType = response;
            });
        };
        /**
         * @ngdoc method
         * @name getNumber
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method user to create new array.
         */
        $scope.getNumber = function (num) {
            return new Array(num);
        };
        /**
         * @ngdoc method
         * @name Range
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method used create numbers between two number.
         */
        $scope.Range = function (min, max) {
            var result = [];
            for (var i = parseFloat(min); i <= parseFloat(max); i++) {
                result.push(i);
            }
            return result;
        };
        /**
         * @ngdoc method
         * @name pickupSelection
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method used to collect all pickup location from counter location.
         */
        $scope.pickupSelection = function pickupSelection(location_id) {
            var selected_id = $scope.vehicle.pickup_counter_locations.indexOf(location_id);
            if (selected_id > -1) {
                $scope.vehicle.pickup_counter_locations.splice(selected_id, 1);
                $scope.all_pickup_location = false;
            } else {
                $scope.vehicle.pickup_counter_locations.push(location_id);
                if($scope.vehicle.pickup_counter_locations.length == $scope.vehicle_counter_locations.length) {
                    $scope.all_pickup_location = true;
                }
            }
        };
        /**
         * @ngdoc method
         * @name dropSelection
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method used to collect all drop location from counter location.
         */
        $scope.dropSelection = function dropSelection(location_id) {
            var selected_id = $scope.vehicle.drop_counter_locations.indexOf(location_id);
            if (selected_id > -1) {
                $scope.vehicle.drop_counter_locations.splice(selected_id, 1);
                $scope.all_drop_location = false;
            } else {
                $scope.vehicle.drop_counter_locations.push(location_id);
                if($scope.vehicle.drop_counter_locations.length == $scope.vehicle_counter_locations.length) {
                    $scope.all_drop_location = true;
                }
            }
        };
        /**
         * @ngdoc method
         * @name select all pickuplocation
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method used to collect all pickup location from counter location.
         */
        $scope.selectAllPickupLocation = function() {
            $scope.vehicle.pickup_counter_locations = [];
            if ($scope.all_pickup_location) {
                $scope.all_pickup_location = true;
            } else {
                $scope.all_pickup_location = false;
            }
            angular.forEach($scope.vehicle_counter_locations, function (value, key) {
                value.selected = $scope.all_pickup_location;
                if($scope.all_pickup_location) {
                    $scope.vehicle.pickup_counter_locations.push(value.id);
                }
            });
        };
        /**
         * @ngdoc method
         * @name select all droplocation
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method used to collect all drop location from counter location.
         */
        $scope.selectAllDropLocation = function() {
            $scope.vehicle.drop_counter_locations = [];
            if ($scope.all_drop_location) {
                $scope.all_drop_location = true;
            } else {
                $scope.all_drop_location = false;
            }
            angular.forEach($scope.vehicle_counter_locations, function (value, key) {
                value.checked = $scope.all_drop_location;
                if($scope.all_drop_location) {
                    $scope.vehicle.drop_counter_locations.push(value.id);
                }
            });
        };
        /**
         * @ngdoc method
         * @name vehicleSubmit
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method will store vehicle.
         * @param {Object} vehicle Vehicle detaila.
         * @returns {Array} Success or failure message.
         **/
        $scope.vehicleSubmit = function ($valid, file) {
            if ($valid) {
                $scope.vehicle.file = file;
                Upload.upload({
                    url: GENERAL_CONFIG.api_url + '/vehicles',
                    data: $scope.vehicle
                }).then(function (response) {
                    if (response.data.Success !== undefined) {
                        Flash.set($filter("translate")("Vehicle Added successfully"), 'success', true);
                        if ($rootScope.settings['vehicle.listing_fee'] > 0) {
                            $state.go('vehiclePaynow', {'vehicle_id': response.data.id});
                        } else {
                            $state.go('myVehicles');
                        }
                    } else {
                        Flash.set($filter("translate")("Vehicle could not be added"), 'error', false);
                    }
                });
            }
        }
    });
}(angular.module("BookorRent.Vehicles")));
(function (module) {
    module.directive('vehicleCompany', function() {
       return {
           restrict : 'EA',
           templateUrl : 'Plugins/Vehicles/vehicleCompany.tpl.html',
           controller : "vehicleCompanyController"
       } ;
    });
    /**
     * @ngdoc controller
     * @name Vehicles.controller:vehicleCompanyController
     * @description
     * This is vehicleCompanyController having the methods init(), setMetaData(). It controls the functionality of vehicle company.
     **/
    module.controller('vehicleCompanyController', function ($scope, $rootScope, $filter, Flash, $state, $location, VehicleCompanyFactory, VehicleCompanyShowFactory, AuthFactory) {
        model = this;
        $scope.message = "";
        $scope.loader_is_disabled = true;
        $scope.form_is_active = false;
        $scope.is_reject_active = 0;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:vehicleCompanyController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {
            var pageTitle = $filter("translate")("Company");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:vehicleCompanyController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        model.init = function () {
            model.setMetaData();
            $scope.emailErr = '';
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Company");
            VehicleCompanyShowFactory.get().$promise.then(function (response) {
                $scope.loader_is_disabled = false;
                if (response) {
                    if (response.is_active == 0) {
                        $scope.message = $filter("translate")("Admin will approve your company details soon.");
                    } else if (response.is_active == 2) {
                        $scope.is_reject_active = response.is_active;
                        $scope.message = "Admin rejected your company details. Please contact ";
                    } else if (response.is_active == 1) {
                        $scope.form_is_active = true;
                        $scope.vehicleCompanies = response;
                        $scope.vehicleCompanies.full_address = response.address;
                        $scope.vehicleCompanies.address = response.address;
                    }
                } else {
                    $scope.form_is_active = true;
                }
            }, function (message) {
                $scope.form_is_active = true;
                $scope.loader_is_disabled = false;
            });
        };
        $scope.$on('g-places-autocomplete:select', function (event) {
            if (event.targetScope.model.formatted_address.indexOf(event.targetScope.model.name)) {
                $scope.vehicleCompanies.address = event.targetScope.model.name + ', ' + event.targetScope.model.formatted_address;
            } else {
                $scope.vehicleCompanies.address = event.targetScope.model.formatted_address;
            }
            $scope.vehicleCompanies.latitude = event.targetScope.model.geometry.location.lat();
            $scope.vehicleCompanies.longitude = event.targetScope.model.geometry.location.lng();
        });
        model.init();
        /**
         * @ngdoc method
         * @name VehicleCompaniesAdd
         * @methodOf Vehicles.controller:vehicleCompanyController
         * @description
         * This method is used to store vehicle company.
         * @param {Object} company Company details.
         * @returns {Array} Success or failure message.
         */
        $scope.VehicleCompaniesAdd = function ($valid) {
            if ($valid) {
                $scope.vehicleCompanies.user_id = $rootScope.auth.id;
                VehicleCompanyFactory.save($scope.vehicleCompanies, function (response) {
                    Flash.set($filter("translate")("Company details updated successfully"), 'success', true);
                    AuthFactory.fetch({}).$promise
                        .then(function (response) {
                            $rootScope.vehicle_company = response.vehicle_company;
                        });
                    $state.reload('vehicleCompany');
                }, function (error) {
                    var errorResponse = error.data.errors;
                    if (errorResponse.email) {
                        $scope.emailErr = $filter("translate")(errorResponse.email[0]);
                    }
                    if (errorResponse.address) {
                        $scope.addressErr = $filter("translate")(errorResponse.address[0]);
                    }
                    Flash.set($filter("translate")("Company details could not be updated"), 'error', false);
                });
            }
        }
    });
}(angular.module("BookorRent.Vehicles")));
(function (module) {
    /**
     * @ngdoc controller
     * @name Vehicles.controller:VehicleEditController
     * @description
     * This is VehicleEditController having the methods init(), setMetaData(). It controls the functionality of edit vehicle.
     **/
    module.controller('VehicleEditController', function ($scope, $rootScope, $filter, Flash, $state, $location, Upload, GENERAL_CONFIG, VehicleRelatedFactory, VehicleModelFactory, VehicleTypeFactory, VehicleFactory) {
        model = this;
        $scope.vehicle = {};
        $scope.vehicle.pickup_counter_locations = [];
        $scope.vehicle.drop_counter_locations = [];
        var vehicle_id = $state.params.id;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {
            var pageTitle = $filter("translate")("Edit Vehicle");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        model.init = function () {
            $scope.driver_min_age = $rootScope.settings['vehicle.driver_min_age'];
            $scope.driver_max_age = $rootScope.settings['vehicle.driver_max_age'];
            model.setMetaData();
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Add Vehicle");
            VehicleRelatedFactory.get().$promise.then(function (response) {
                $scope.vehicleCompanies = response.vehicle_company_list;
                $scope.vehicleTypes = response.vehicle_type_list;
                $scope.vehicleMakes = response.vehicle_make_list;
                $scope.counter_locations = response.counter_location_list;
                $scope.fuelTypes = response.fuel_type_list;
                $scope.seats = parseInt(response.settings.seats);
                $scope.doors = parseInt(response.settings.doors);
                $scope.small_bags = parseInt(response.settings.small_bags);
                $scope.large_bags = parseInt(response.settings.large_bags);
                $scope.gears = parseInt(response.settings.gears);
                $scope.air_bags = parseInt(response.settings.airbags);

                //covert counter location object to array
                $scope.vehicle_counter_locations = [];
                angular.forEach ($scope.counter_locations, function(value, key){
                    var obj = {};
                    obj.id = value;
                    obj.name = key;
                    $scope.vehicle_counter_locations.push(obj);
                });
            });
            VehicleFactory.get({'id': $state.params.id}).$promise.then(function (response) {
                $scope.vehicle = response;
                pickup_counter_locations = [];
                drop_counter_locations = [];
                angular.forEach(response.pickup_locations, function (value, key) {
                    pickup_counter_locations.push(value.id);
                });
                angular.forEach(response.drop_locations, function (value, key) {
                    drop_counter_locations.push(value.id);
                });
                $scope.vehicle.minimum_age_of_driver = parseInt(response.minimum_age_of_driver);
                $scope.vehicle.pickup_counter_locations = pickup_counter_locations;
                $scope.vehicle.drop_counter_locations = drop_counter_locations;
                $scope.getVehicleModel(response.vehicle_make_id);
                $scope.getVehicleTypePrice(response.vehicle_type_id);
            }, function (error) {
            });
        };
        model.init();
        /**
         * @ngdoc method
         * @name getVehicleModel
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method will get vehicle models.
         * @param {integer} vehicle_make_id Vehicle make identifier.
         * @returns {Object} Vehicle models list.
         **/
        $scope.getVehicleModel = function (vehicle_make_id) {
            VehicleModelFactory.get({'vehicle_make_id': vehicle_make_id}).$promise.then(function (response) {
                $scope.vehicleModels = response.data;
            });
        };
        /**
         * @ngdoc method
         * @name getVehicleTypePrice
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method will get vehicle types.
         * @param {integer} vehicle_type_id Vehicle type identifier.
         * @returns {Object} Vehicle type list.
         **/
        $scope.getVehicleTypePrice = function (vehicle_type_id) {
            VehicleTypeFactory.get({'id': vehicle_type_id}).$promise.then(function (response) {
                $scope.vehicleType = response;
            });
        };
        /**
         * @ngdoc method
         * @name getNumber
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method user to create new array.
         */
        $scope.getNumber = function (num) {
            return new Array(num);
        };
        /**
         * @ngdoc method
         * @name Range
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method used create numbers between two number.
         */
        $scope.Range = function (min, max) {
            var result = [];
            for (var i = parseFloat(min); i <= parseFloat(max); i++) {
                result.push(i);
            }
            return result;
        };
        /**
         * @ngdoc method
         * @name pickupSelection
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method used to collect all pickup location from counter location.
         */
        $scope.pickupSelection = function pickupSelection(location_id) {
            location_id = parseInt(location_id);
            var selected_id = $scope.vehicle.pickup_counter_locations.indexOf(location_id);
            if (selected_id > -1) {
                $scope.vehicle.pickup_counter_locations.splice(selected_id, 1);
                $scope.all_pickup_location = false;
            } else {
                $scope.vehicle.pickup_counter_locations.push(location_id);
                if($scope.vehicle.pickup_counter_locations.length == $scope.vehicle_counter_locations.length) {
                    $scope.all_pickup_location = true;
                }
            }
        };
        /**
         * @ngdoc method
         * @name dropSelection
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method used to collect all drop location from counter location.
         */
        $scope.dropSelection = function dropSelection(location_id) {
            location_id = parseInt(location_id);
            var selected_id = $scope.vehicle.drop_counter_locations.indexOf(location_id);
            if (selected_id > -1) {
                $scope.vehicle.drop_counter_locations.splice(selected_id, 1);
                $scope.all_drop_location = false;
            } else {
                $scope.vehicle.drop_counter_locations.push(location_id);
                if($scope.vehicle.drop_counter_locations.length == $scope.vehicle_counter_locations.length) {
                    $scope.all_drop_location = true;
                }
            }
        };
        /**
         * @ngdoc method
         * @name select all pickuplocation
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method used to collect all pickup location from counter location.
         */
        $scope.selectAllPickupLocation = function() {
            $scope.vehicle.pickup_counter_locations = [];
            if ($scope.all_pickup_location) {
                $scope.all_pickup_location = true;
            } else {
                $scope.all_pickup_location = false;
            }
            angular.forEach($scope.vehicle_counter_locations, function (value, key) {
                value.selected = $scope.all_pickup_location;
                if($scope.all_pickup_location) {
                    $scope.vehicle.pickup_counter_locations.push(value.id);
                }
            });
        };
        /**
         * @ngdoc method
         * @name select all droplocation
         * @methodOf Vehicles.controller:VehicleAddController
         * @description
         * This method used to collect all drop location from counter location.
         */
        $scope.selectAllDropLocation = function() {
            $scope.vehicle.drop_counter_locations = [];
            if ($scope.all_drop_location) {
                $scope.all_drop_location = true;
            } else {
                $scope.all_drop_location = false;
            }
            angular.forEach($scope.vehicle_counter_locations, function (value, key) {
                value.checked = $scope.all_drop_location;
                if($scope.all_drop_location) {
                    $scope.vehicle.drop_counter_locations.push(value.id);
                }
            });
        };
        /**
         * @ngdoc method
         * @name checkStatus
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method used to show the selected drop and pickup locations.
         */
        $scope.checkStatus = function (id, selected_list) {
            if ($.inArray(parseInt(id), selected_list) > -1) {
                return true;
            } else {
                return false;
            }
        };
        /**
         * @ngdoc method
         * @name vehicleSubmit
         * @methodOf Vehicles.controller:VehicleEditController
         * @description
         * This method will store vehicle.
         * @param {Object} vehicle Vehicle detaila.
         * @returns {Array} Success or failure message.
         **/
        $scope.vehicleSubmit = function ($valid, file) {
            if ($valid) {
                if (file !== undefined) {
                    Upload.upload({
                        url: GENERAL_CONFIG.api_url + '/vehicles/' + vehicle_id,
                        data: {
                            file: file,
                            'id': vehicle_id,
                            'vehicle_make_id': $scope.vehicle.vehicle_make_id,
                            'vehicle_model_id': $scope.vehicle.vehicle_model_id,
                            'vehicle_type_id': $scope.vehicle.vehicle_type_id,
                            'pickup_counter_locations': $scope.vehicle.pickup_counter_locations,
                            'drop_counter_locations': $scope.vehicle.drop_counter_locations,
                            'driven_kilometer': $scope.vehicle.driven_kilometer,
                            'vehicle_no': $scope.vehicle.vehicle_no,
                            'no_of_seats': $scope.vehicle.no_of_seats,
                            'no_of_doors': $scope.vehicle.no_of_doors,
                            'no_of_gears': $scope.vehicle.no_of_gears,
                            'is_manual_transmission': $scope.vehicle.is_manual_transmission,
                            'no_small_bags': $scope.vehicle.no_small_bags,
                            'no_large_bags': $scope.vehicle.no_large_bags,
                            'is_ac': $scope.vehicle.is_ac,
                            'minimum_age_of_driver': $scope.vehicle.minimum_age_of_driver,
                            'mileage': $scope.vehicle.mileage,
                            'is_airbag': $scope.vehicle.mileage,
                            'no_of_airbags': $scope.vehicle.no_of_airbags,
                            'is_abs': $scope.vehicle.is_abs,
                            'per_hour_amount': $scope.vehicle.per_hour_amount,
                            'per_day_amount': $scope.vehicle.per_day_amount,
                            'fuel_type_id': $scope.vehicle.fuel_type_id
                        }
                    }).then(function (response) {
                        if (response.data.Success !== undefined) {
                            Flash.set($filter("translate")("Vehicle Updated successfully"), 'success', true);
                            $state.go('myVehicles');
                        } else {
                            Flash.set($filter("translate")("Vehicle could not be updated"), 'error', false);
                        }
                    });
                } else {
                    VehicleFactory.update({id: vehicle_id}, $scope.vehicle, function (response) {
                        Flash.set($filter("translate")("Vehicle Updated successfully"), 'success', true);
                        $state.go('myVehicles');
                    }, function (error) {
                        Flash.set($filter("translate")("Vehicle could not be updated"), 'error', false);
                    });
                }
            }
        }
    });
}(angular.module("BookorRent.Vehicles")));
angular.module('BookorRent').requires.push('BookorRent.Vehicles');/**
 * BookorRent - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleRentals
 * @description
 *
 * This is the module for VehicleRentals. It contains the contact us functionalities.
 *
 * The VehicleRentals module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} VehicleRentals name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap',
 *            'ui.bootstrap.datetimepicker',
 *            'credit-cards'
 *        ]
 * @param {string} stateProvider State provider is used to provide a corresponding model and template.
 * @param {string} analyticsProvider This service lets you integrate google analytics tracker in your AngularJS applications easily.
 * @returns {BookorRent.VehicleRentals} new BookorRent.VehicleRentals module.
 **/
(function (module) {
    module.config(function ($stateProvider, $analyticsProvider) {
        var ResolveServiceData = {
            'ResolveServiceData': function (ResolveService, $q) {
                return $q.all({
                    AuthServiceData: ResolveService.promiseAuth,
                    SettingServiceData: ResolveService.promiseSettings
                });
            }
        };
        $stateProvider.state('vehicle_rental_list_status', {
                url: '/booking/:statusID/:slug',
                authenticate: true,
                views: {
                    "main": {
                        controller: 'VehicleRentalController as model',
                        templateUrl: 'Plugins/VehicleRentals/vehicle_rental_list.tpl.html',
                        resolve: ResolveServiceData
                    }
                },
                data: {pageTitle: 'VehicleRental'}
            })
            
        .state('orders', {
            url: '/orders/:statusID/:slug',
            authenticate: true,
            views: {
                'main': {
                    controller: 'OrderListsController as model',
                    templateUrl: 'Plugins/VehicleRentals/order_lists.tpl.html',
                    resolve: ResolveServiceData
                }
            }
        })
        .state('order', {
            url: '/vehicle_rental/order/{vehicle_rental_id}',
            authenticate: true,
            views: {
                "main": {
                    controller: 'VehicleRentalOrderController as model',
                    templateUrl: 'Plugins/VehicleRentals/vehicle_rental_order.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'VehicleRental'}
        })
        .state('activity', {
            url: '/activity/{vehicle_rental_id}/{action}',
            authenticate: true,
            views: {
                "main": {
                    controller: 'VehicleRentalActivityController as model',
                    templateUrl: 'Plugins/VehicleRentals/vehicle_rental_activity.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'VehicleRental'}
        })
        .state('bookingAdd', {
            url: '/items/bookit/{item_id}/add',
            authenticate: true,
            views: {
                "main": {
                    controller: 'VehicleRentalController as model',
                    templateUrl: 'Plugins/VehicleRentals/vehicle_rental_add.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'VehicleRental'}
        })
        .state('checkout', {
            url: '/vehicle_rental/{order_id}/checkout',
            authenticate: true,
            views: {
                "main": {
                    controller: 'VehicleCheckoutController as model',
                    templateUrl: 'Plugins/VehicleRentals/vehicle_checkout.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'VehicleRental'}
        })
        .state('vehicleRentalStatus', {
            url: '/vehicle_rental/{statusID}/{slug}',
            authenticate: true,
            views: {
                "main": {
                    controller: 'VehicleRentalController as model',
                }
            },
            data: {pageTitle: 'Vehicles'}
        })
        .state('hostCalendar', {
            url: '/vehicle_rentals/orders/calendar',
            authenticate: true,
            views: {
                "main": {
                    controller: 'OrderCalendarController as model',
                    templateUrl: 'Plugins/VehicleRentals/vehicle_rental_calendar.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'VehicleRental'}
        })
        .state('bookingCalendar', {
            url: '/vehicle_rentals/bookings/calendar',
            authenticate: true,
            views: {
                "main": {
                    controller: 'BookingCalendarController as model',
                    templateUrl: 'Plugins/VehicleRentals/vehicle_rental_calendar.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'VehicleRental'}
        })
        .state('vehicleRentalAction', {
            url: '/vehicle_rentals/{vehicle_rental_id}/{action}',
            authenticate: true,
            views: {
                "main": {
                    controller: 'VehicleRentalController as model',
                    templateUrl: 'Plugins/VehicleRentals/vehicle_rental_list.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'VehicleRental'}
        })
        .state('vehicleOrderAction', {
            url: '/vehicle_orders/{vehicle_order_id}/{action}',
            authenticate: true,
            views: {
                "main": {
                    controller: 'OrderListsController as model',
                    templateUrl: 'Plugins/VehicleRentals/order_lists.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'VehicleRental'}
        });
    });
}(angular.module("BookorRent.VehicleRentals", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel',
    'mwl.calendar',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'credit-cards'
])));
(function (module) {
    /**
     * @ngdoc controller
     * @name orderlists.controller:BookingCalendarController
     * @description
     *
     * This is items controller having the methods init(), setMetaData().
     *
     * It controls the functionality of items.
     **/
    module.controller('BookingCalendarController', function ($scope, $rootScope, $filter, Flash, $state, $location, VehicleRentalFactory, calendarConfig) {
        model = this;

        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf orderlists.controller:BookingCalendarController
         * @description
         *
         * This method will set the meta data dynamically by using the angular.element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Booking Calendar");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        $scope.getEvents = function(month, year) {
            VehicleRentalFactory.get({'limit':'all'}).$promise.then(function(response) {
                $scope.vehicles = response.data;
                model.events = $scope.setEvents($scope.vehicles);
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf orderlists.controller:OrderCalendarController
         * @description
         * This method will initialze the page. It returns the page title.
         *
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Bookings Calendar");
            model.calendarView = 'month';
            model.viewDate = new Date();
            model.isCellOpen = true;
            model.title = $filter("translate")("Booking Calendar");
            $scope.getEvents();
            //Translate week in  calendar
            calendarConfig.i18nStrings.weekNumber = $filter("translate")("Week") +' {week}';
        };
        $scope.setEvents = function(vehicles) {
            var eventsLists = [];
            var types = ['info', 'warning', 'primary', 'important', 'success'];
            angular.forEach(vehicles, function(value, key) {
                var start_date =  value.item_booking_start_date.replace(/(.+) (.+)/, "$1T$2Z");
                var end_date =  value.item_booking_end_date.replace(/(.+) (.+)/, "$1T$2Z");
                start_date = $filter("date")(new Date(start_date), "MMM d, y h:mm a", '+0');
                end_date = $filter('date')(new Date(end_date), 'MMM d, y h:mm a', '+0');
                var name = (value.item_userable) ? value.item_userable.name: '';
                eventsList = {
                    title: name+' '+start_date+' - '+end_date,
                    type: types[key % 5],
                    startsAt: value.item_booking_start_date,
                    endsAt: value.item_booking_end_date,
                    draggable: false,
                    resizable: false,
                    editable: false,
                    deletable: false,
                    event: value
                };
                eventsLists.push(eventsList);
            });
            return eventsLists;
        };
        model.eventClicked = function(cal_event) {
            $state.go('activity', {'vehicle_rental_id':cal_event.event.id, 'action':'note'});
        };
        $scope.init();
    });

}(angular.module("BookorRent.VehicleRentals")));
(function (module) {
    /**
     * @ngdoc controller
     * @name orderlists.controller:OrderCalendarController
     * @description
     *
     * This is items controller having the methods init(), setMetaData().
     *
     * It controls the functionality of items.
     **/
    module.controller('OrderCalendarController', function ($scope, $rootScope, $filter, Flash, $state, $location, moment, ItemsOrderFactory, calendarConfig) {
        var model = this;

        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf orderlists.controller:OrderCalendarController
         * @description
         *
         * This method will set the meta data dynamically by using the angular.element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Orders Calendar");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };

        $scope.getEvents = function() {
            ItemsOrderFactory.get({'limit':'all'}).$promise.then(function(response) {
                $scope.vehicles = response.data;
                model.events = $scope.setEvents($scope.vehicles);
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf orderlists.controller:OrderCalendarController
         * @description
         * This method will initialze the page. It returns the page title.
         *
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Orders Calendar");
            model.calendarView = 'month';
            model.viewDate = new Date();
            model.isCellOpen = true;
            model.title = $filter("translate")("Order Calendar");
            $scope.getEvents();
            //Translate week in  calendar
            calendarConfig.i18nStrings.weekNumber = $filter("translate")("Week") +' {week}';
        };
        /**
         * @ngdoc method
         * @name setEvents
         * @methodOf orderlists.controller:OrderCalendarController
         * @description
         * This method will set the events to calendar.
         *
         **/
        $scope.setEvents = function(vehicles) {
            var eventsLists = [];
            var types = ['info', 'warning', 'primary', 'important', 'success'];
            angular.forEach(vehicles, function(value, key) {
                var start_date =  value.item_booking_start_date.replace(/(.+) (.+)/, "$1T$2Z");
                var end_date =  value.item_booking_end_date.replace(/(.+) (.+)/, "$1T$2Z");
                start_date = $filter("date")(new Date(start_date), "MMM d, y h:mm a",'+0');
                end_date = $filter('date')(new Date(end_date), 'MMM d, y h:mm a','+0');
                var name = (value.item_userable) ? value.item_userable.name: '';
                eventsList = {
                    title: name+' '+start_date+' - '+end_date,
                    type: types[key % 5],
                    startsAt: value.item_booking_start_date,
                    endsAt: value.item_booking_end_date,
                    draggable: false,
                    resizable: false,
                    editable: false,
                    deletable: false,
                    event: value
                };
                eventsLists.push(eventsList);
            });
            return eventsLists;
        };
        model.eventClicked = function(cal_event) {
            $state.go('activity', {'vehicle_rental_id':cal_event.event.id, 'action':'note'});
        };
        $scope.init();
    });
       
}(angular.module("BookorRent.VehicleRentals")));
(function (module) {
    /**
     * @ngdoc controller
     * @name VehicleRentals.controller:OrderListsController
     * @description
     * This is items controller having the methods init(), setMetaData().
     * It controls the functionality of items.
     **/
    module.controller('OrderListsController', function ($scope, $rootScope, $filter, Flash, $state, $location, ItemsOrderFactory, VehicleRentalStatusFactory, ConstItemUserStatus, ConfirmVehicleRental, RejectVehicleRental, $stateParams, checkInFactory) {
        model = this;
        $scope.maxSize = 5;
        $scope.ConstItemUserStatus = ConstItemUserStatus;
        var params = {};
        $scope.statusID = 0;
        $scope.status_slug = 'all';

        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf VehicleRentals.controller:OrderListsController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Item orders");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name getItemOrders
         * @methodOf VehicleRentals.controller:OrderListsController
         * @description
         * This method will initialze the page. It returns the item orders.
         * @param {integer} params Page no.
         * @returns {Array} Order Order details.
         */
        $scope.getItemOrders = function () {
            params = {'page': $scope.currentPage};
            if ($scope.statusID !== undefined && $scope.statusID !== 0) {
                params = {'item_user_status_id': $scope.statusID, 'page': $scope.currentPage};
            }
            ItemsOrderFactory.get(params).$promise.then(function (response) {
                $scope.itemOrders = response.data;
                $scope._metadata = response.meta.pagination;
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf VehicleRentals.controller:OrderListsController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $scope.currentPage = (model.currentPage !== undefined) ? parseInt(model.currentPage) : 1;
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Item Orders");
            $scope.statusID = ($stateParams.statusID !== undefined) ? parseInt($stateParams.statusID) : 0;
            $scope.status_slug = ($stateParams.slug !== undefined) ? $stateParams.slug : 'all';
            // get orders listing
            $scope.getItemOrders();
            //Get booking status
            $scope.getRentalStatus();

            //from email, click accept or reject
            if($stateParams.vehicle_order_id !== undefined) {
                var order_id = $stateParams.vehicle_order_id;
                if( $stateParams.action == 'confirm') {
                    $scope.VehicleRentalConfirm(order_id);
                }
                if($stateParams.action == 'reject') {
                    $scope.VehicleRentalReject(order_id);
                }
            }
        };
        /**
         * @ngdoc method
         * @name getRentalStatus
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method will be load rental status.
         * @param {string} user_type User type.
         * @returns {Array} Status Order status.
         **/
        $scope.getRentalStatus = function () {
            if ($rootScope.OrderItemUserStatus == undefined) {
                VehicleRentalStatusFactory.get({'filter': 'host'}).$promise.then(function (response) {
                    $scope.itemUserStatus = response.item_user_statuses;
                    $rootScope.OrderItemUserStatus = response.item_user_statuses;
                });
            } else {
                $scope.itemUserStatus = $rootScope.OrderItemUserStatus;
            }
        };
        /**
         * @ngdoc method
         * @name paginate
         * @methodOf VehicleRentals.controller:OrderListsController
         * @description
         * This method will be load pagination the pages.
         **/
        $scope.paginate = function (pageno) {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.getItemOrders();
        };

        /**
         * @ngdoc method
         * @name filterOrder
         * @methodOf VehicleRentals.controller:OrderListsController
         * @description
         * This method will initialze the page. It returns item orders with filters
         *
         **/
        $scope.filterOrder = function (id, slug) {
            $state.go('orders', {statusID: id, slug: slug});
        };
        /**
         * @ngdoc method
         * @name VehicleRentalConfirm
         * @methodOf VehicleRentals.controller:OrderListsController
         * @description
         * This method is used to confirm the booked item.
         * @param {integer} vehicle_rental_id Rental identifier.
         * @returns {Array} Success or failure message.
         */
        $scope.VehicleRentalConfirm = function (vehicle_rental_id) {
            ConfirmVehicleRental.confirm({id: vehicle_rental_id}).$promise.then(function (response) {
                Flash.set($filter("translate")("VehicleRental Confirmed Successfully!"), 'success', true);
                $state.go('orders', {statusID: $scope.ConstItemUserStatus.Confirmed, slug: 'confirmed'});
            }, function (error) {
                Flash.set($filter("translate")("VehicleRental Could not be updated!"), 'error', false);
            });
        };

        /**
         * @ngdoc method
         * @name VehicleRentalReject
         * @methodOf VehicleRentals.controller:OrderListsController
         * @description
         * This method is used to reject the booked item.
         * @param {integer} vehicle_rental_id Rental identifier.
         * @returns {Array} Success or failure message.
         */
        $scope.VehicleRentalReject = function (id) {
            RejectVehicleRental.reject({
                id: id
            }).$promise.then(function (data) {
                Flash.set($filter("translate")("VehicleRental Rejected Successfully!"), 'success', true);
                $state.go('orders', {statusID: $scope.ConstItemUserStatus.Rejected, slug: 'rejected'});
            }, function (error) {
                errmsg = (error.data.message != undefined) ? error.data.message : "VehicleRental could not be rejected";
                Flash.set($filter("translate")(errmsg), 'error', false);
            });
        };

        $scope.init();
        /**
         * @ngdoc method
         * @name orderCheckin
         * @methodOf VehicleRentals.controller:OrderListsController
         * @description
         * This method is used to check in.
         * @param {integer} order_id Order identifier.
         * @returns {Array} Success or failure message.
         */
        $scope.orderCheckin = function (order_id) {
            checkInFactory.checkin({'id': order_id}, function (response) {
                Flash.set($filter("translate")("VehicleRental has been checked-in successfully!"), 'success', true);
                $state.go('orders', {statusID: $scope.ConstItemUserStatus.Attended, slug: 'attended'});
            }, function (error) {
                Flash.set($filter("translate")("VehicleRental could not be updated. Please, try again"), 'error', false);
            });
        };
    });
}(angular.module("BookorRent.VehicleRentals")));
(function (module) {
    /**
     * @ngdoc controller
     * @name VehicleRentals.controller:VehicleCheckoutController
     * @description
     * This is items controller having the methods init(), setMetaData().
     * It controls the functionality of items.
     **/
    module.controller('VehicleCheckoutController', function ($scope, $rootScope, $filter, Flash, $state, $location, $window, VehicleRentalFactory, checkOutFactory, GetVehicleFeedbackFactory, $uibModal) {
        model = this;

        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf VehicleRentals.controller:VehicleCheckoutController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Vehicle Checkout");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };

        /**
         * @ngdoc method
         * @name init
         * @methodOf VehicleRentals.controller:VehicleCheckoutController
         * @description
         * This method will initialze the page. It returns the page title.
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $scope.currentPage = (model.currentPage !== undefined) ? parseInt(model.currentPage) : 1;
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("item Orders");
            //Get vehicles and vehicle booking details
            VehicleRentalFactory.get({'id': $state.params.order_id}).$promise.then(function (response) {
                $scope.vehicleDetails = response.item_userable;
                $scope.VehicleRentalDetails = response;
                var start_date = $scope.VehicleRentalDetails.item_booking_start_date.replace(/(.+) (.+)/, "$1T$2Z");
                var end_date = $scope.VehicleRentalDetails.item_booking_end_date.replace(/(.+) (.+)/, "$1T$2Z");
                $scope.VehicleRentalDetails.item_booking_start_date = $filter('date')(new Date(start_date), 'MMM d, y h:mm a', '+0');
                $scope.VehicleRentalDetails.item_booking_end_date = $filter('date')(new Date(end_date), 'MMM d, y h:mm a', '+0');
                //To display distance and unit
                $scope.unit_price = $scope.vehicleDetails.vehicle_type.drop_location_differ_unit_price;
                $scope.differ_location_distance = $scope.VehicleRentalDetails.total_distance+' ('+$scope.VehicleRentalDetails.distance_unit+') ';
            });

            //Vehicle rating
            $scope.maxRatings = [];
            $scope.maxRating = 5;
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
            //Feedback Modal
            $scope.feedbackModal = 'Plugins/Vehicles/vehicle_feedback_modal.tpl.html';
        };

        $scope.init();
        /**
         * @ngdoc method
         * @name calculateAmount
         * @methodOf VehicleRentals.controller:VehicleCheckoutController
         * @description
         * This method will initialze the page. It returns the checkout manual payment amount.
         * @param {float} Amount Amount for calculation.
         * @returns {float} Amount New calculated amount.
         **/
        $scope.calculateAmount = function (amount) {
            if ($scope.VehicleRentalDetails.late_checkout_total_fee) {
                amount = amount + $scope.VehicleRentalDetails.late_checkout_total_fee;
            }
            if (($scope.VehicleRentalDetails.deposit_amount > 0)) {
                if ($scope.VehicleRentalDetails.deposit_amount > amount) {
                    $scope.manualPay = 0;
                    $scope.claimToDeposit = amount;
                } else {
                    $scope.manualPay = amount - $scope.VehicleRentalDetails.deposit_amount;
                    $scope.claimToDeposit = $scope.VehicleRentalDetails.deposit_amount;
                }
            } else {
                $scope.manualPay = amount;
            }
        };
        /**
         * @ngdoc method
         * @name checkout
         * @methodOf VehicleRentals.controller:VehicleCheckoutController
         * @description
         * This method is used to check in.
         * @param {float} claim_mount new claim amount.
         * @returns {Array} Success or failure message.
         */
        $scope.checkout = function ($valid) {
            var checkout = $window.confirm('Are you sure want to checkout?');
            if (checkout) {
                $scope.claim_request_amount = ($scope.claim_amount) ? $scope.claim_amount : 0;
                checkOutFactory.checkout({'id': $state.params.order_id}, {'claim_request_amount': $scope.claim_request_amount}, function (response) {
                    Flash.set($filter("translate")("VehicleRental has been checked-out successfully!"), 'success', true);
                    $state.go('orders', {'statusID': 0, 'slug': 'all'})
                }, function (error) {
                    Flash.set($filter("translate")("VehicleRental could not be updated. Please, try again"), 'error', false);
                });
            }
        };
        /**
         * @ngdoc method
         * @name getFeedback
         * @methodOf VehicleRentals.controller:VehicleCheckoutController
         * @description
         * This method is used to check in.
         * @param {integer} vehicle_id Vehicle identifier.
         * @returns {Array} Feedback new response.
         */
            //Vehicle Feedbacks
        $scope.getFeedback = function (vehicle_id) {
            // $scope.vehicle_metadata = {};
            GetVehicleFeedbackFactory.get({vehicle_id: vehicle_id}).$promise.then(function (response) {
                $scope.vehicleFeedbacks = response.data;
                //  $scope.vehicle_metadata = response.meta;
                // console.log("response", $scope.vehicleFeedbacks.vehicle_metadata);
            });
        };

        //Go to user page
        $scope.userDashboard = function (name) {
            $('.modal-backdrop').hide();
            $state.go('userView', {'username': name});
        };
        /**
         * @ngdoc method
         * @name modalOpen
         * @methodOf Vehicles.controller:VehicleCheckoutController
         * @description
         * This method will initialze the page. It pen the modal with vehicle feedbacks.
         **/
        $scope.modalOpen = function (size, vehicle_id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Plugins/Vehicles/vehicle_feedback_modal.tpl.html',
                controller: 'VehicleModalController',
                size: size,
                resolve: {
                    vehicle_id: function () {
                        return vehicle_id;
                    }
                }
            });
        };
    });
}(angular.module("BookorRent.VehicleRentals")));
(function (module) {
    /**
     * @ngdoc controller
     * @name VehicleRentals.controller:VehicleRentalActivityController
     * @description
     * This is VehicleRentalActivityController having the methods init(), setMetaData(), and it defines the item list related funtions.
     **/
    module.controller('VehicleRentalActivityController', function ($state, $scope, $http, Flash, $filter, $rootScope, $location, VehicleRentalFactory, VehicleRentalMessageFactory, SavePrivateNoteFactory, ConstItemUserStatus, AuthFactory, $uibModal, moment) {
        var model = this;
        $scope.vehicle_dispute = {};
        $scope.vehicle_rental_id = $state.params.vehicle_rental_id ? $state.params.vehicle_rental_id : '';
        $scope.ConstItemUserStatus = ConstItemUserStatus;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf VehicleRentals.controller:VehicleRentalActivityController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("VehicleRental Activity");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name getVehicleRentalMessages
         * @methodOf VehicleRentals.controller:VehicleRentalActivityController
         * @description
         * This method will get the messages of booked item.
         * @param {integer} vehicle_rental_id Rental identifier.
         * @returns {Array} Success or failure message.
         */
        $scope.getVehicleRentalMessages = function () {
            VehicleRentalMessageFactory.get({'id': $scope.vehicle_rental_id}).$promise.then(function (response) {
                if (response.messages != undefined) {
                    $scope.messageDetails = response.messages.messages;
                }
            }, function (error) {
                Flash.set($filter("translate")("Invalid Request"), 'error', false);
                $state.go('home');
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf VehicleRentals.controller:VehicleRentalActivityController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $scope.action = ($state.params.action !== undefined) ? $state.params.action : 'note';
            VehicleRentalFactory.get({'id': $scope.vehicle_rental_id}).$promise.then(function (response) {
                $scope.VehicleRentalDetails = response;
                $scope.vehicleDetails = response.item_userable;
                $scope.vehicleDetails.roundedRating = response.item_userable.feedback_rating;
                $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")($scope.vehicleDetails.name+" : Activities");
            });
            AuthFactory.fetch().$promise.then(function (user) {
                $rootScope.auth = user;
            });
            $scope.getVehicleRentalMessages();
            //Vehicle rating
            $scope.maxRatings = [];
            $scope.maxRating = 5;
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
        };
        $scope.init();
        /**
         * @ngdoc method
         * @name PrivateNoteSubmit
         * @methodOf VehicleRentals.controller:VehicleRentalActivityController
         * @description
         * This method user to add private note.
         * @param {integer} vehicle_rental_id Rental identifier.
         * @returns {Array} Success or failure message.
         */
        $scope.PrivateNoteSubmit = function ($valid) {
            if ($valid) {
                SavePrivateNoteFactory.save({id: $scope.vehicle_rental_id, message: $scope.note}, function (response) {
                    Flash.set($filter("translate")("Private Note Added Successfully!"), 'success', true);
                    $state.reload();
                }, function (error) {
                    Flash.set($filter("translate")("Private Note Could not be added!"), 'error', false);
                });
            }
        };
        $scope.filterTab = function (id, action) {
            $state.go('activity', {vehicle_rental_id: id, action: action});
        };
        /**
         * @ngdoc method
         * @name modalOpen
         * @methodOf VehicleRentals.controller:VehicleRentalActivityController
         * @description
         * This method will initialze the page. It pen the modal with vehicle feedbacks.
         * @param {integer} vehicle_id Vehicle identifier.
         * @returns {html} Load new template.
         **/
        $scope.modalOpen = function (size, vehicle_id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Plugins/Vehicles/vehicle_feedback_modal.tpl.html',
                controller: 'VehicleModalController',
                size: size,
                resolve: {
                    vehicle_id: function () {
                        return vehicle_id;
                    }
                }
            });
        };

    });
}(angular.module("BookorRent.VehicleRentals")));
(function (module) {
    /**
     * @ngdoc controller
     * @name VehicleRentals.controller:VehicleRentalOrderController
     * @description
     * This is VehicleRentalOrderController having the methods init(), setMetaData(), and it defines the item order related funtions.
     **/
    module.controller('VehicleRentalOrderController', function ($state, $scope, $http, Flash, $filter, $rootScope, $location, VehicleRentalFactory, ApplyCouponFactory, PaymentFactory, GetGatewaysFactory, ConstPaymentGateways, GetCountries, $window, AuthFactory, $uibModal) {
        var model = this;
        $scope.buyer = {};
        $scope.ConstPaymentGateways = ConstPaymentGateways;
        $scope.apply_is_disabled = $scope.paynow_is_disabled = false;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf  VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Book It");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name getGatewaysList
         * @methodOf  VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method used to get payment gateway list.
         * @param {Object} Gateway_list Payment gateway list.
         * @returns {html} Load the corresponding template.
         */
        $scope.getGatewaysList = function () {
            GetGatewaysFactory.get().$promise.then(function (response) {
                if (response.paypal) {
                    $scope.paypal_enabled = (response.paypal.paypal_enabled) ? true : false;
                }
                if (response.wallet) {
                    $scope.wallet_enabled = (response.wallet.wallet_enabled) ? true : false;
                }
                if (response.sudopay) {
                    $scope.gateway_groups = response.sudopay.gateway_groups;
                    $scope.payment_gateways = response.sudopay.payment_gateways;
                    $scope.form_fields_tpls = response.sudopay.form_fields_tpls;
                    $scope.sel_payment_gateway = response.sudopay.selected_payment_gateway_id;
                    $scope.show_form = [];
                    $scope.form_fields = [];
                    $scope.group_gateway_id = response.sudopay.selected_gateway_id;
                    angular.forEach($scope.form_fields_tpls, function (key, value) {
                        if (value == 'buyer') {
                            $scope.form_fields[value] = 'Plugins/Sudopays/buyer.tpl.html';
                        }
                        if (value == 'credit_card') {
                            $scope.form_fields[value] = 'Plugins/Sudopays/credit_card.tpl.html';
                        }
                        if (value == 'manual') {
                            $scope.form_fields[value] = 'Plugins/Sudopays/manual.tpl.html';
                        }
                        $scope.show_form[value] = true;
                    });
                }
                if ($scope.paypal_enabled) {
                    $scope.gateway_id = ConstPaymentGateways.PayPal;
                } else if ($scope.wallet_enabled) {
                    $scope.gateway_id = ConstPaymentGateways.Wallet;
                } else {
                    $scope.gateway_id = ConstPaymentGateways.SudoPay;
                }
            });
        };
        /**
         * @ngdoc method
         * @name paneChanged
         * @methodOf  VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method used to change the tab.
         * @param {Object} Gateway_list Payment gateway list.
         * @returns {Object} Payment gateway list.
         */
        $scope.paneChanged = function (pane) {
            var keepGoing = true;
            $scope.buyer = {};
            $scope.PaymentForm.$setPristine();
            $scope.PaymentForm.$setUntouched();
            angular.forEach($scope.form_fields_tpls, function (key, value) {
                $scope.show_form[value] = false;
            });
            if (pane == 'paypal') {
                $scope.gateway_id = ConstPaymentGateways.PayPal;
            }
            else if (pane == 'wallet') {
                $scope.gateway_id = ConstPaymentGateways.Wallet;
            }
            else {
                $scope.gateway_id = ConstPaymentGateways.SudoPay;
                angular.forEach($scope.gateway_groups, function (res) {
                    if (res.display_name == pane) {
                        var selPayment = '';
                        angular.forEach($scope.payment_gateways, function (response) {
                            if (keepGoing) {
                                if (response.group_id == res.id) {
                                    selPayment = response;
                                    keepGoing = false;
                                    $scope.rdoclick(selPayment.id, selPayment.form_fields);
                                }
                            }
                        });
                        $scope.sel_payment_gateway = "sp_" + selPayment.id;
                        $scope.group_gateway_id = selPayment.group_id;
                    }
                });
            }
        };
        /**
         * @ngdoc method
         * @name rdoclick
         * @methodOf VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method used to split the arrays.
         * @param {Object} res Payment gateway list.
         * @returns {Object} New Splited payment gateway list.
         */
        $scope.rdoclick = function (res, res1) {
            $scope.paynow_is_disabled = false;
            $scope.sel_payment_gateway = "sp_" + res;
            $scope.array = res1.split(',');
            angular.forEach($scope.array, function (value) {
                $scope.show_form[value] = true;
            });
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        $scope.init = function () {
            $scope.currentYear = new Date().getFullYear();
            $scope.setMetaData();
            $scope.item_id = $state.params.id ? $state.params.id : '';
            $scope.vehicle_rental_id = $state.params.vehicle_rental_id ? $state.params.vehicle_rental_id : '';
            VehicleRentalFactory.get({'id': $scope.vehicle_rental_id,'type':'rental'}).$promise.then(function (response) {
                $scope.VehicleRentalDetails = response;
                var start_date = $scope.VehicleRentalDetails.item_booking_start_date.replace(/(.+) (.+)/, "$1T$2Z");
                var end_date = $scope.VehicleRentalDetails.item_booking_end_date.replace(/(.+) (.+)/, "$1T$2Z");
                $scope.VehicleRentalDetails.item_booking_start_date = $filter('date')(new Date(start_date), 'MMM d, y h:mm a', '+0');
                $scope.VehicleRentalDetails.item_booking_end_date = $filter('date')(new Date(end_date), 'MMM d, y h:mm a', '+0');
                $scope.vehicleDetails = response.item_userable;
                $scope.vehicleDetails.roundedRating = response.item_userable.feedback_rating | 0;
                if ($scope.VehicleRentalDetails.item_user_status.id != 1) {
                    Flash.set($filter("translate")("You can't pay for this order"), 'error', false);
                    $state.go('vehicle_rental_list_status', {statusID: 0, slug: 'all'});
                }
				//To display distance and unit
                $scope.unit_price = $scope.vehicleDetails.vehicle_type.drop_location_differ_unit_price;
                $scope.differ_location_distance = $scope.VehicleRentalDetails.total_distance+' ('+$scope.VehicleRentalDetails.distance_unit+') ';
            });
            AuthFactory.fetch({}).$promise
                .then(function (response) {
                    $scope.user_available_balance = response.available_wallet_amount;
                });
            $scope.getGatewaysList();
            $scope.gatewayTpl = 'Common/gateway.tpl.html';
            //Get countries list
            GetCountries.get({'sort': 'name', 'sortby': 'asc'}).$promise.then(function (response) {
                $scope.countries = response.data;
            });
            //Vehicle rating
            $scope.maxRatings = [];
            $scope.maxRating = 5;
            for (var i = 0; i < $scope.maxRating; i++) {
                $scope.maxRatings.push(i);
            }
        };
        $scope.init();
        /**
         * @ngdoc method
         * @name bookingCouponSubmit
         * @methodOf VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method will apply coupon code to booking item.
         * @param {integer} vehicle_rental_id Rental identifier.
         * @returns {Array} Success or failure message.
         */
        $scope.vehicleCouponSubmit = function ($valid) {
            if ($valid) {
                $scope.apply_is_disabled = true;
                var bookingCoupon = {
                    name: $scope.coupon_code
                };
                ApplyCouponFactory.update({id: $state.params.vehicle_rental_id}, bookingCoupon, function (response) {
                    Flash.set($filter("translate")("Coupon code applied Successfully"), 'success', true);
                    $scope.apply_is_disabled = false;
                    $state.reload();
                }, function (error) {
                    Flash.set($filter("translate")(error.data.message), 'error', false);
                    $scope.apply_is_disabled = false;
                });
            }
        };
        /**
         * @ngdoc method
         * @name payNow
         * @methodOf VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method will pay amount to booking item.
         * @param {integer} vehicle_rental_id Rental identifier.
         * @returns {Array} Success or failure message.
         */
        $scope.payNow = function () {
            PaymentFactory.update({id: $state.params.vehicle_rental_id}, function (response) {
                Flash.set($filter("translate")("VehicleRental fee paid Successfully"), 'success', true);
                $state.go('items');
            }, function (error) {
                Flash.set($filter("translate")("VehicleRental Could not be updated"), 'error', false);
            });
        };

        /**
         * @ngdoc method
         * @name PaymentSubmit
         * @methodOf VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method will pay amount to booking item.
         * @param {object} form Payment details.
         * @returns {Array} Success or failure message.
         */
        $scope.PaymentSubmit = function (form) {
            payment_id = '';
            if ($scope.sel_payment_gateway && $scope.gateway_id == ConstPaymentGateways.SudoPay) {
                payment_id = $scope.sel_payment_gateway.split('_')[1];
            }

            $scope.buyer.payment_id = payment_id;
            $scope.buyer.gateway_id = $scope.gateway_id; // Paypal or sudopay
            $scope.buyer.vehicle_rental_id = $state.params.vehicle_rental_id; // booking id
            if ($scope.buyer.credit_card_expire_month || $scope.buyer.credit_card_expire_year) {
                $scope.buyer.credit_card_expire_month = $scope.buyer.credit_card_expire_month > 9 ? $scope.buyer.credit_card_expire_month: "0" + $scope.buyer.credit_card_expire_month;
                $scope.buyer.credit_card_expire = $scope.buyer.credit_card_expire_month + "/" + $scope.buyer.credit_card_expire_year;
            }
            $scope.buyer.amount = $scope.VehicleRentalDetails.total_amount;
            if ($scope.gateway_id == ConstPaymentGateways.PayPal && form.amount.$valid) { //if Paypal checkonly amount field
                form.$valid = true;
            }
            if (form.$valid) {
                $scope.paynow_is_disabled = true;
                PaymentFactory.save({id: $state.params.vehicle_rental_id}, $scope.buyer, function (response) {
                    if (response.data == 'wallet') {
                        Flash.set($filter("translate")("Vehicle booked successfully"), 'success', true);
                        $state.go('vehicle_rental_list_status', {statusID: 0, slug: 'all'});
                    }
                    if (response.url != undefined) {
                        $window.location.href = response.url;
                    } else if (response.Success != undefined) {
                        Flash.set($filter("translate")(response.Success), 'success', true);
                        $state.go('vehicle_rental_list_status', {statusID: 0, slug: 'all'});
                    }
                    $scope.paynow_is_disabled = false;
                }, function (error) {
                    Flash.set($filter("translate")(error.data.message), 'error', false);
                    $scope.paynow_is_disabled = false;
                });
            }
        };
        /**
         * @ngdoc method
         * @name modalOpen
         * @methodOf VehicleRentals.controller:VehicleRentalOrderController
         * @description
         * This method will initialze the page. It pen the modal with vehicle feedbacks.
         * @param {integer} vehicle_id Vehicle identifier.
         * @returns {html} Load new template.
         **/
        $scope.modalOpen = function (size, vehicle_id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'Plugins/Vehicles/vehicle_feedback_modal.tpl.html',
                controller: 'VehicleModalController',
                size: size,
                resolve: {
                    vehicle_id: function () {
                        return vehicle_id;
                    }
                }
            });
        };
    });
}(angular.module("BookorRent.VehicleRentals")));
(function (module) {
    /**
     * @ngdoc service
     * @name VehicleRentals.VehicleRentalFactory
     * @description
     * VehicleRentalFactory used to list, store, filter the rental details.
     * @param {string} VehicleRentalFactory The name of the factory.
     * @param {function()} function It used to access the rental details.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':   {method:'POST'},
	 *			'get':   {method:'GET'},
	 *			'list':   {method:'GET'},
	 *			'filter':   {method:'GET'}
	 *		};
     */
    module.factory('VehicleRentalFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals/:id', {}, {
                'save': {
                    method: 'POST'
                },
                'get': {
                    method: 'GET'
                },
                'list': {
                    method: 'GET'
                },
                'filter': {
                    method: 'GET'
                }

            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.VehicleRentalCancelFactory
     * @description
     * VehicleRentalCancelFactory used to cancel the rental.
     * @param {string} VehicleRentalCancelFactory The name of the factory.
     * @param {function()} function It used to cancel the rental.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'cancel':   {method:'GET'}
	 *		};
     */
    module.factory('VehicleRentalCancelFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals/:id/cancel', {}, {
                'cancel': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.ApplyCouponFactory
     * @description
     * ApplyCouponFactory used to apply the coupon code.
     * @param {string} ApplyCouponFactory The name of the factory.
     * @param {function()} function It used to apply the coupon code.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'update':   {method:'POST'}
	 *		};
     */
    module.factory('ApplyCouponFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/vehicle_coupons/:id', {
                id: '@id',
            }, {
                'update': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.PaymentFactory
     * @description
     * PaymentFactory used to apply the payment.
     * @param {string} PaymentFactory The name of the factory
     * @param {function()} function It used to apply the payment.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':   {method:'POST'}
	 *		};
     */
    module.factory('PaymentFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/vehicle_rentals/:id/paynow', {
                id: '@id',
            }, {
                'save': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.VehicleRentalStatusFactory
     * @description
     * VehicleRentalStatusFactory used to get the booking status.
     * @param {string} VehicleRentalStatusFactory The name of the factory
     * @param {function()} function It used to get the booking status.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     */
    module.factory('VehicleRentalStatusFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/vehicle_rental_status', {}, {}
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.ItemsOrderFactory
     * @description
     * ItemsOrderFactory used to get the item orders.
     * @param {string} ItemsOrderFactory The name of the factory
     * @param {function()} function It used to get the item orders.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':   {method:'GET'},
	 *			'filter':   {method:'GET'}
	 *		};
     */
    module.factory('ItemsOrderFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/item_orders', {}, {
                'get': {
                    method: 'GET'
                },
                'filter': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.VehicleRentalMessageFactory
     * @description
     * VehicleRentalMessageFactory used to get the booked item messages.
     * @param {string} VehicleRentalMessageFactory The name of the factory
     * @param {function()} function It used to get the booked item messages.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':   {method:'GET'}
	 *		};
     */
    module.factory('VehicleRentalMessageFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/item_user_messages/:id', {
                id: '@id'
            }, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.SavePrivateNoteFactory
     * @description
     * SavePrivateNoteFactory used to save private note for booked item.
     * @param {string} SavePrivateNoteFactory The name of the factory
     * @param {function()} function It used to save private note for booked item.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':   {method:'POST'}
	 *		};
     */
    module.factory('SavePrivateNoteFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/private_notes', {}, {
                'save': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.GetGatewaysFactory
     * @description
     * GetGatewaysFactory used to get all payment gateways.
     * @param {string} GetGatewaysFactory The name of the factory
     * @param {function()} function It used to get all payment gateways.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':   {method:'GET'}
	 *		};
     */
    module.factory('GetGatewaysFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/get_gateways', {}, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.GetCountries
     * @description
     * GetCountries used to list the countries.
     * @param {string} GetCountries The name of the factory
     * @param {function()} function It used to list the countries.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':   {method:'GET'}
	 *		};
     */
    module.factory('GetCountries', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/countries', {}, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.ConfirmVehicleRental
     * @description
     * ConfirmVehicleRental used to list and change booking status id.
     * @param {string} ConfirmVehicleRental The name of the factory
     * @param {function()} function It used to list and change booking status id.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'confirm':   {method:'GET'}
	 *		};
     */
    module.factory('ConfirmVehicleRental', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals/:id/confirm', {
                id: '@id',
            }, {
                'confirm': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.RejectVehicleRental
     * @description
     * RejectVehicleRental used to reject the rental.
     * @param {string} RejectVehicleRental The name of the factory
     * @param {function()} function It used to reject the rental.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'reject':   {method:'GET'}
	 *		};
     */
    module.factory('RejectVehicleRental', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals/:id/reject', {
                id: '@id',
            }, {
                'reject': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.VehicleDisputesFactory
     * @description
     * VehicleDisputesFactory used to list dispute types and closed types.
     * @param {string} VehicleDisputesFactory The name of the factory
     * @param {function()} function It used to list dispute types and closed types.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':   {method:'GET'}
	 *		};
     */
    module.factory('VehicleDisputesFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_disputes/:id', {
                id: '@id',
            }, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.VehicleDisputeFactory
     * @description
     * VehicleDisputeFactory used to create disputes.
     * @param {string} VehicleDisputeFactory The name of the factory
     * @param {function()} function It used to create disputes.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':   {method:'GET'}
	 *		};
     */
    module.factory('VehicleDisputeFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_disputes/add', {}, {
                'save': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.VehicleDisputeResolveFactory
     * @description
     * VehicleDisputeResolveFactory used to resolve disputes.
     * @param {string} VehicleDisputeResolveFactory The name of the factory
     * @param {function()} function It used to resolve disputes.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':   {method:'POST'}
	 *		};
     */
    module.factory('VehicleDisputeResolveFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/admin/vehicle_disputes/resolve', {}, {
                'save': {
                    method: 'POST'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.checkInFactory
     * @description
     * checkInFactory used to checkin vehicel rentals.
     * @param {string} checkInFactory The name of the factory
     * @param {function()} function It used to checkin vehicel rentals.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'checkin':   {method:'GET'}
	 *		};
     */
    module.factory('checkInFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals/:id/checkin', {
                id: '@id'
            }, {
                'checkin': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name VehicleRentals.checkOutFactory
     * @description
     * checkOutFactory used to checkout vehicel rentals.
     * @param {string} checkOutFactory The name of the factory
     * @param {function()} function It used to checkout vehicel rentals.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'checkout':   {method:'GET'}
	 *		};
     */
    module.factory('checkOutFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_rentals/:id/checkout', {
                id: '@id'
            }, {
                'checkout': {
                    method: 'POST'
                }
            }
        );
    });
})(angular.module('BookorRent.VehicleRentals'));
/**
 * BookorRent - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleRentals
 * @description
 *
 * This is the module for VehicleRentals.
 *
 * The VehicleRentals module have initialize, directive and controllers. The booking module is used to booking the item with date and quantity.
 *
 * @param {Array.<string>=} dependencies The dependencies are included in main BookorRent.Banner module.
 *
 *        [
 *            'ui.router',
 *            'ngResource'
 *        ]
 * @returns {BookorRent.VehicleRentals} new BookorRent.VehicleRentals module.
 **/
(function (module) {
    /**
     * @ngdoc directive
     * @name VehicleRentals.directive:coupon
     * @scope
     * @restrict EA
     * @description
     * coupon directive used to load the coupon template.
     * @param {string} coupon Name of the directive
     **/
    module.directive('coupon', function () {
        var linker = function (scope, element, attrs) {
            // do DOM Manipulation here
        };
        return {
            restrict: 'A',
            templateUrl: 'Plugins/VehicleRentals/coupon.tpl.html',
            link: linker,
            controller: 'CouponController as model',
            bindToController: true,
            scope: {
                filter: '@filter'
            }
        };
    });
    /**
     * @ngdoc controller
     * @name VehicleRentals.controller:VehicleRentalController
     * @description
     * This is VehicleRentalController having the methods init(), setMetaData(), and it defines the vehicle rental related funtions.
     **/
    module.controller('VehicleRentalController', function ($state, $scope, $http, Flash, $filter, VehicleRentalFactory, VehicleRentalCancelFactory, AuthFactory, $rootScope, $location, ConstItemUserStatus, VehicleRentalStatusFactory, $stateParams) {
        var model = this;
        $scope.maxSize = 5;
        $scope.ConstItemUserStatus = ConstItemUserStatus;
        var params = {};
        $scope.statusID = 0;
        $scope.status_slug = 'all';
        $scope.booking = {};
        $scope.isPayment = false;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method will set the meta data dynamically by using the angular.element.
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Book It");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name getVehicleRentalList
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method will get vehicle rental list.
         * @param {integer} rental_status_id Rental status identifier.
         * @returns {Object} Vehicle rental list.
         **/
        $scope.getVehicleRentalList = function () {
            param = {'page': $scope.currentPage};
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("VehicleRental");
            if ($scope.statusID !== undefined && $scope.statusID !== 0) {
                param = {'item_user_status_id': $scope.statusID, 'page': $scope.currentPage};
            }
            VehicleRentalFactory.filter(param).$promise.then(function (response) {
                $.each(response.data, function (i, record) {
                    if(response.data[i].item_user_status_id == ConstItemUserStatus.BookerReviewed){
                        response.data[i].item_user_status.name = 'completed';
                    }
                });
                $scope.VehicleRentalLists = response.data;
                $scope._metadata = response.meta.pagination;
            });
        };
        /**
         * @ngdoc method
         * @name VehicleRentalCancel
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method is used to cancel the booked item.
         * @param {integer} rental_id Rental identifier.
         * @returns {Array} Success or failure message.
         */
        $scope.VehicleRentalCancel = function (id) {
            VehicleRentalCancelFactory.cancel({
                id: id
            }).$promise.then(function (data) {
                Flash.set($filter("translate")("VehicleRental Cancelled Successfully!"), 'success', true);
                $state.go('vehicle_rental_list_status', {statusID: $scope.ConstItemUserStatus.Cancelled, slug: 'cancelled'});
            }, function (error) {
                errmsg = (error.data.message != undefined) ? error.data.message : "VehicleRental could not be cancelled";
                Flash.set($filter("translate")(errmsg), 'error', false);
            });
        };

        /**
         * @ngdoc method
         * @name init
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
            $scope.statusID = ($stateParams.statusID !== undefined) ? $stateParams.statusID : 0;
            $scope.status_slug = ($stateParams.slug !== undefined) ? $stateParams.slug : 'all';
            if ($scope.statusID == 'status') {
                if ($scope.status_slug == 'fail') {
                    Flash.set($filter("translate")("VehicleRental could not be completed, please try again."), 'error', false);
                } else if ($scope.status_slug == 'success') {
                    Flash.set($filter("translate")("Vehicle booked successfully"), 'success', true);
                }
                $state.go('vehicle_rental_list_status', {statusID: 0, slug: 'all'});
            } else {
                $scope.statusID = parseInt($scope.statusID);
            }
            //Get booking status
            $scope.getRentalStatus();
            $scope.getVehicleRentalList();
            //from email, click cancel
            if($stateParams.vehicle_rental_id !== undefined && $stateParams.action == 'cancel') {
                var rental_id = $stateParams.vehicle_rental_id;
                $scope.VehicleRentalCancel(rental_id);
            }

        };
        /**
         * @ngdoc method
         * @name getRentalStatus
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method will be load rental status.
         * @returns {Array} Rental Status.
         **/
        $scope.getRentalStatus = function () {
            if ($rootScope.BookingItemUserStatus == undefined) {
                VehicleRentalStatusFactory.get({'filter': 'booker'}).$promise.then(function (response) {
                    $scope.itemUserStatus = response.item_user_statuses;
                    $rootScope.BookingItemUserStatus = response.item_user_statuses;
                });
            } else {
                $scope.itemUserStatus = $rootScope.BookingItemUserStatus;
            }
        };
        /**
         * @ngdoc method
         * @name paginate
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method will be load pagination the pages.
         **/
        $scope.paginate = function (pageno) {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.getVehicleRentalList();
        };
        /**
         * @ngdoc method
         * @name filterVehicleRental
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method will be redirect to status based.
         **/
        $scope.filterVehicleRental = function (id, slug) {
            $state.go('vehicle_rental_list_status', {statusID: id, slug: slug});
        };
        $scope.init();

        /**
         * @ngdoc method
         * @name openCalendar
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method used to open a calendar.
         **/
        $scope.openCalendar = function (e, date) {
            $scope.open[date] = true;
        };

        $scope.open = {
            date: false
        };
        /**
         * @ngdoc method
         * @name BookFormSubmit
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method is used to store rental details.
         * @param {Array} rental Rental details.
         * @returns {Array} Success or failure message.
         */
        $scope.BookFormSubmit = function ($valid) {
            if ($valid) {
                $scope.booking.item_id = $state.params.item_id;
                VehicleRentalFactory.save($scope.booking, function (response) {
                    $scope.booking = {};
                    $scope.BookAddForm.$setPristine();
                    $scope.BookAddForm.$setUntouched();
                    Flash.set($filter("translate")("VehicleRental Added Successfully!"), 'success', true);
                    $state.go('order', {id: response.item_userable_id, vehicle_rental_id: response.id});
                }, function (error) {
                    $scope.dateErr = '';
                    $scope.quantityErr = '';
                    var errorResponse = error.data.errors;
                    if (errorResponse.item_booking_start_date) {
                        $scope.dateErr = $filter("translate")(errorResponse.item_booking_start_date[0]);
                    }
                    if (errorResponse.quantity) {
                        $scope.quantityErr = $filter("translate")(errorResponse.quantity[0]);
                    }
                    Flash.set($filter("translate")("VehicleRental Could not be added!"), 'error', false);
                });
            }
        };
        /**
         * @ngdoc method
         * @name vehicleRentalPaynow
         * @methodOf VehicleRentals.controller:VehicleRentalController
         * @description
         * This method is used to pay rental amount.
         * @param {integer} order_id Order details.
         * @returns {Array} Success or failure message.
         */
            //if booker details not updated move to vehicle rental update page
        $scope.vehicleRentalPaynow = function (order_id) {
            VehicleRentalFactory.get({id: order_id}).$promise.then(function (response) {
                if (response.booker_detail) {
                    $state.go('order', {'vehicle_rental_id': order_id});
                } else {
                    $state.go('vehicle_detail', {'vehicle_rental_id': order_id});
                }
            }, function (error) {
				Flash.set($filter("translate")(error.data.message), 'error', true);
			});
        };

    });
}(angular.module("BookorRent.VehicleRentals")));

angular.module('BookorRent').requires.push('BookorRent.VehicleRentals');/**
 * BookorRent - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name Contacts
 * @description
 *
 * This is the module for Contacts. It contains the contact us functionalities.
 *
 * The contact module act as a state provider, this module get the url and load the template and call the controller instantly.
 *
 * @param {string} Contacts name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'vcRecaptcha'
 *        ]
 * @param {string} stateProvider State provider is used to provide a corresponding model and template.
 * @param {string} analyticsProvider This service lets you integrate google analytics tracker in your AngularJS applications easily.
 * @returns {BookorRent.Contacts} new BookorRent.Contacts module.
 **/
(function (module) {

    module.config(function ($stateProvider, $analyticsProvider) {
        var ResolveServiceData = {
            'ResolveServiceData': function (ResolveService, $q) {
                return $q.all({
                    AuthServiceData: ResolveService.promiseAuth,
                    SettingServiceData: ResolveService.promiseSettings
                });
            }
        };
        $stateProvider
            .state('contact', {
                url: '/contactus',
                authenticate: false,
                views: {
                    'main': {
                        controller: 'ContactUsController as model',
                        templateUrl: 'Plugins/Contacts/contacts.tpl.html',
                        resolve: ResolveServiceData
                    }
                }
            });

    });

}(angular.module('BookorRent.Contacts', [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel',
    'vcRecaptcha'
])));
(function (module) {
    /**
     * @ngdoc directive
     * @name contacts.directive:contactLinks
     * @module Contacts
     * @scope
     * This directive used to load the contact page url link.
     * @restrict A
     * @description
     * This directive used to load the contact page template.
     */
    module.directive('contactLinks', function () {
        var linker = function (scope, element, attrs) {
            // do DOM Manipulation here
        };
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'Plugins/Contacts/contact_links.tpl.html',
            link: linker,
            controller: 'ContactUsController as model',
            bindToController: true
        };
    });
    /**
     * @ngdoc controller
     * @name Contacts.controller:ContactUsController
     * @description
     * This is contactUs controller having the methods init(), setMetaData(), and contactFormSubmit().
     * It controls the functionality of contact us.
     **/
    module.controller('ContactUsController', function ($scope, $rootScope, ContactsFactory, $filter, Flash, $state, $location, vcRecaptchaService) {
        var model = this;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Contacts.controller:ContactUsController
         * @description
         * This method will set the meta data's dynamically by using the angular.element
         * @returns {Element} New meta data element.
         **/
        model.setMetaData = function () {
            var pageTitle = $filter("translate")("Contact Us");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Contacts.controller:ContactUsController
         * @description
         * This method will initialize the page. It returns the page title.
         **/
        model.init = function () {
            model.setMetaData();
            model.captcha_site_key = $rootScope.settings['captcha.site_key'];
            if($location.path() == '/contactus') {
                $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Contact Us");
            }
        };
        $scope.setRecaptchaId = function (widgetId) {
            $scope.widgetId = widgetId;
        };

        model.init();
        /**
         * @ngdoc method
         * @name contactFormSubmit
         * @methodOf Contacts.controller:ContactUsController
         * @description
         * This method handles the form which is used for contact, and add contact details.
         * @param {integer} FormDetails Contact form details.
         * @returns {Array} Success or failure message.
         **/
        model.contactFormSubmit = function ($valid) {
            model.emailErr = '';
            model.captchaErr = '';
            var response = vcRecaptchaService.getResponse($scope.widgetId);
            if (response.length === 0) {
                model.captchaErr = $filter("translate")("Please resolve the captcha and submit");
            } else {
                model.captchaErr = '';
            }
                if ($valid) {
                    model.contactForm.recaptcha_response = response;
                    ContactsFactory.save(model.contactForm).$promise.then(function (response) {
                        Flash.set($filter("translate")("Thank you, we received your message and will get back to you as soon as possible."), 'success', true);
                        $state.reload('contact');
                    }, function (error) {
                        var errMsg = error.data.errors;
                        if (errMsg.email) {
                            model.emailErr = $filter("translate")(errMsg.email[0]);
                        }
                        Flash.set($filter("translate")("Contact message could not be sent. Please, try again."), 'error', false);
                    });
                }

        };
    });
}(angular.module("BookorRent.Contacts")));
(function (module) {
    /**
     * @ngdoc service
     * @name Contacts.ContactsFactory
     * @description
     * ContactsFactory used to store the contact details.
     * @param {function()} function It used to save the data.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':   {method:'POST'}
	 *		};
     */
    module.factory('ContactsFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(
            GENERAL_CONFIG.api_url + '/contacts', {}, {
                'save': {
                    method: 'POST'
                }
            }
        );
    });

})(angular.module("BookorRent.Contacts"));
angular.module('BookorRent').requires.push('BookorRent.Contacts');/**
 * LumenBase - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name Pages
 * @description
 *
 * This is the module for pages. It contains the pages functionalities.
 *
 * The contact module act as a state provider, this module get the url and load the template and call the controller instantly.
 *
 * @param {string} pages name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'vcRecaptcha'
 *        ]
 * @param {string} stateProvider State provider is used to provide a corresponding model and template.
 * @param {string} analyticsProvider This service lets you integrate google analytics tracker in your AngularJS applications easily.
 **/
(function (module) {

    module.config(function ($stateProvider, $analyticsProvider) {
        var ResolveServiceData = {
            'ResolveServiceData': function (ResolveService, $q) {
                return $q.all({
                    AuthServiceData: ResolveService.promiseAuth,
                    SettingServiceData: ResolveService.promiseSettings
                });
            }
        };
        $stateProvider.state('pages', {
            url: '/page/{slug}',
            authenticate: false,
            views: {
                "main": {
                    controller: 'PagesController as model',
                    templateUrl: 'Plugins/Pages/pages.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'Pages'}
        });
    });

}(angular.module("BookorRent.Pages", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
(function (module) {
    /**
     * @ngdoc directive
     * @name Pages.directive:footerLinks
     * @scope
     * @restrict AE
     *
     * @description
     * footerLinks directive creates a footerLinks tag. We can use this as an element.
     *
     * @param {string} googleAnalytics Name of the directive
     *
     **/
    module.directive('footerLinks', function () {
        var linker = function (scope, element, attrs) {
            // do DOM Manipulation here
        };
        return {
            restrict: 'A',
            templateUrl: 'Plugins/Pages/page_links.tpl.html',
            link: linker,
            controller: 'PagesController as model',
            bindToController: true
        };
    });
    /**
     * @ngdoc controller
     * @name Pages.controller:PagesController
     * @description
     *
     * This is pages controller having the methods init(), setMetaData(). It controls the static pages.
     **/
    module.controller('PagesController', function ($scope, $http, $filter, $state, $rootScope, $location, PageFactory, $translate, $translateLocalStorage) {
        var model = this;
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Pages.controller:PagesController
         * @description
         *
         * This method will set the meta data dynamically by using the angular.element
         **/
        model.setMetaData = function (title) {
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + title);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Pages.controller:PagesController
         * @description
         * This method will initialze the page. It returns the page title
         *
         **/
        model.init = function () {
            var currentLocale = $translate.preferredLanguage();
            if ($translate.use() !== undefined) {
                currentLocale = $translate.use();
            } else if ($translateLocalStorage.get('NG_TRANSLATE_LANG_KEY') !== undefined || $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY') !== null) {
                currentLocale = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
            }
            if ($state.params.slug !== undefined && $state.params.slug !== null) {
                PageFactory.get({slug: $state.params.slug, iso2: currentLocale}).$promise
                    .then(function (response) {
                        $scope.page = response;
                        model.setMetaData(response.title);
                        $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + response.title;
                    });
            }
        };
        model.init();
    });
}(angular.module("BookorRent.Pages")));
(function (module) {
    /**
     * @ngdoc service
     * @name Pages.PageFactory
     * @description
     * PageFactory used to fetch the page details.
     * @param {function()} function It used to fetch the data.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @param {string} slug Page slug.
     * @param {string} iso2 Content iso.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'get':   {method:'GET'}
	 *		};
     */
    module.factory('PageFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/page/:slug/:iso2', {
                slug: '@slug',
                iso2: '@iso2'
            }, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
})(angular.module("BookorRent.Pages"));
angular.module('BookorRent').requires.push('BookorRent.Pages');/**
 * LumenBase - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name Paypal
 * @description
 *
 * This is the module for Paypal. It contains the Paypal functionalities.
 *
 * The Paypal module act as a state provider, this module get the url and load the template and call the controller instantly.
 *
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource'
 *        ]
 * @returns {BookorRent.Paypal} new BookorRent.Paypal module.
 **/
(function (module) {

}(angular.module("BookorRent.Paypal", [
    'ui.router',
    'ngResource'
])));
/**
 * LumenBase - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name Paypal
 * @description
 *
 * This is the module for Paypal. It contains the Paypal functionalities.
 *
 * The Paypal module act as a state provider, this module get the url and load the template and call the controller instantly.
 *
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource'
 *        ]
 * @returns {BookorRent.Paypal} new BookorRent.Paypal module.
 **/
(function (module) {

}(angular.module("BookorRent.Paypal", [
    'ui.router',
    'ngResource'
])));
angular.module('BookorRent').requires.push('BookorRent.Paypal');/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleExtraAccessories
 * @description
 *
 * This is the module for VehicleExtraAccessories
 *
 * The VehicleExtraAccessories module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleExtraAccessories} new BookorRent.VehicleExtraAccessories module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleExtraAccessories", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleExtraAccessories
 * @description
 *
 * This is the module for VehicleExtraAccessories
 *
 * The VehicleExtraAccessories module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleExtraAccessories} new BookorRent.VehicleExtraAccessories module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleExtraAccessories", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
angular.module('BookorRent').requires.push('BookorRent.VehicleExtraAccessories');/**
 * BookorRent - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleFeedbacks
 * @description
 *
 * This is the module for VehicleFeedbacks. It contains the VehicleFeedbacks functionalities.
 *
 * The VehicleFeedbacks module act as a state provider, this module get the url and load the template and call the controller instantly.
 *
 * @param {string} VehicleFeedbacks name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel' *
 *        ]
 * @returns {BookorRent.VehicleFeedbacks} new BookorRent.VehicleFeedbacks module.
 **/
(function (module) {
    module.directive('allFeedback', function () {
        return {
            restrict: 'EA',
            templateUrl: "Plugins/VehicleFeedbacks/vehicle_feedbacks.tpl.html",
            controller: function ($scope, $element, $attrs, $state, FeedbacksFactory, $rootScope) {
                $scope.getFeedbacks = function() {
                    FeedbacksFactory.get({type:'vehicle'}).$promise.then(function(response) {
                        $scope.feedbacks = response.data;
                    });
                };
                $scope.init = function() {
                    $scope.noWrapSlides = false;
                    $scope.interval = 5000;
                    $scope.getFeedbacks();
                    //Vehicle rating
                    $scope.maxRatings = [];
                    $scope.maxRating = 5;
                    for (var i = 0; i < $scope.maxRating; i++) {
                        $scope.maxRatings.push(i);
                    }
                };
                $scope.init();
            }
        };
    });
    module.directive('userFeedback', function () {
        return {
            restrict: 'EA',
            templateUrl: "Plugins/VehicleFeedbacks/user_feedbacks.tpl.html",
            controller: function ($scope, $element, $attrs, $state, UserFeedbacksFactory, $rootScope, moment) {
                var model = this;
                $scope.maxSize = 5;
                $scope.getUserFeedbacks = function() {
                    $scope.$watch('userId', function(userId) {
                        if(userId != undefined) {
                            UserFeedbacksFactory.get({
                                to_user_id: userId,
                                'page': $scope.feedback_currentPage
                            }).$promise.then(function (response) {
                                $scope.user_feedbacks = response.data;
                                $scope.feedback_metadata = response.meta.pagination;
                            });
                        }
                    });
                };
                $scope.init = function() {
                    $scope.feedback_currentPage = ($scope.feedback_currentPage != undefined)?$scope.feedback_currentPage:1;
                    $scope.getUserFeedbacks();
                    //Vehicle rating
                    $scope.FeedbackMaxRatings = [];
                    $scope.FeedbackMaxRating = 5;
                    for (var i = 0; i < $scope.FeedbackMaxRating; i++) {
                        $scope.FeedbackMaxRatings.push(i);
                    }
                };
                $scope.feedback_paginate = function() {
                    $scope.feedback_currentPage = parseInt($scope.feedback_currentPage);
                    $scope.getUserFeedbacks();
                };
                $scope.init();
            },
            scope: {
                userId: '='
            }
        };
    });

}(angular.module('BookorRent.VehicleFeedbacks', [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel',
    'ui.bootstrap'
])));
(function (module) {
/**
 * @ngdoc service
 * @name VehicleFeedbacks.BookerFeedbackFactory
 * @description
 * BookerFeedbackFactory used in list and  booker send feedback to host
 * @param {string} BookerFeedbackFactory The name of the factory
 * @param {function()} function It uses get method for booker send feedback to host
 * @param {string} url Base url accessed in GENERAL_CONFIG.
 * @returns {object} The service contains these actions:
 *
 *      {
 *			'save':   {method:'POST'}
 *		};
 */
module.factory('BookerFeedbackFactory', function ($resource, GENERAL_CONFIG) {
    return $resource(GENERAL_CONFIG.api_url + '/booker/review', {}, {
            'save': {
                method: 'POST'
            }
        }
    );
});
/**
 * @ngdoc service
 * @name VehicleFeedbacks.HostFeedbackFactory
 * @description
 * HostFeedbackFactory used in list and host send feedback to booker.
 * @param {string} HostFeedbackFactory The name of the factory
 * @param {function()} function It uses get method for host send feedback to booker
 * @param {string} url Base url accessed in GENERAL_CONFIG.
 * @returns {object} The service contains these actions:
 *
 *      {
 *			'save':   {method:'POST'}
 *		};
 */
module.factory('HostFeedbackFactory', function ($resource, GENERAL_CONFIG) {
    return $resource(GENERAL_CONFIG.api_url + '/host/review', {}, {
            'save': {
                method: 'POST'
            }
        }
    );
});

/**
 * @ngdoc service
 * @name VehicleFeedbacks.GetFeedbackFactory
 * @description
 * GetFeedbackFactory used in list and admin get the feedback.
 * @param {string} GetFeedbackFactory The name of the factory
 * @param {function()} function It uses get method for admin get the feedback
 * @param {string} url Base url accessed in GENERAL_CONFIG.
 * @returns {object} The service contains these actions:
 *
 *      {
 *			'get':   {method:'GET'}
 *		};
 */
module.factory('GetFeedbackFactory', function ($resource, GENERAL_CONFIG) {
    return $resource(GENERAL_CONFIG.api_url + '/admin/vehicle_feedbacks/:id/edit', {
        id:'@id',
    }, {
            'get': {
                method: 'get'
            }
        }
    );
});

/**
 * @ngdoc service
 * @name VehicleFeedbacks.EditFeedbackFactory
 * @description
 * EditFeedbackFactory used in list and  admin edit the feedback.
 * @param {string} EditFeedbackFactory The name of the factory
 * @param {function()} function It uses get method for admin edit the feedback
 * @param {string} url Base url accessed in GENERAL_CONFIG.
 * @returns {object} The service contains these actions:
 *
 *      {
 *			'update':   {method:'PUT'}
 *		};
 */
module.factory('EditFeedbackFactory', function ($resource, GENERAL_CONFIG) {
    return $resource(GENERAL_CONFIG.api_url + '/admin/vehicle_feedbacks/:id', {
            id:'@id',
        }, {
            'update': {
                method: 'PUT'
            }
        }
    );
});
/**
 * @ngdoc service
 * @name VehicleFeedbacks.FeedbacksFactory
 * @description
 * FeedbacksFactory used in list  the feedback.
 * @param {string} FeedbacksFactory The name of the factory
 * @param {function()} function It uses get method for get all feedbacks
 * @param {string} url Base url accessed in GENERAL_CONFIG.
 * @returns {object} The service contains these actions:
 *
 *      {
 *			'get':   {method:'GET'}
 *		};
     */
    module.factory('FeedbacksFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_feedbacks/', {

            }, {
                'get': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name User.UserFeedbacksFactory
     * @description
     * UserFeedbacksFactory is a factory service which is used to get the feedbacks.
     * @param {string} UserFeedbacksFactory The name of the factory
     * @param {function()} function It uses get method, and get the feedbacks
     */

    module.factory('UserFeedbacksFactory', ['$resource', 'GENERAL_CONFIG', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/vehicle_feedbacks', {}, {
                'get': {
                    method: 'GET'
                }
            }
        );
    }]);

})(angular.module('BookorRent.VehicleFeedbacks'));
(function (module) {
    /**
     * @ngdoc directive
     * @name VehicleFeedbacks.directive:starRating
     * @scope
     * @restrict EA
     * @description
     * starRating directive used to load the rating template.
     * @param {string} starRating Name of the directive
     **/
    module.directive('starRating', function () {
        return {
            scope: {
                rating: '=',
                maxRating: '@',
                readOnly: '@',
                click: "&",
                mouseHover: "&",
                mouseLeave: "&"
            },
            restrict: 'EA',
            templateUrl: "Plugins/VehicleFeedbacks/rating.tpl.html",
            compile: function (element, attrs) {
                if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                    attrs.maxRating = '5';
                }
                ;
            },
            controller: function ($scope, $element, $attrs) {
                $scope.maxRatings = [];

                for (var i = 1; i <= $scope.maxRating; i++) {
                    $scope.maxRatings.push({});
                }
                ;

                $scope._rating = $scope.rating;

                $scope.isolatedClick = function (param) {
                    if ($scope.readOnly == 'true') return;

                    $scope.rating = $scope._rating = param;
                    $scope.hoverValue = 0;
                    $scope.click({
                        param: param
                    });
                };

                $scope.isolatedMouseHover = function (param) {
                    if ($scope.readOnly == 'true') return;

                    $scope._rating = 0;
                    $scope.hoverValue = param;
                    $scope.mouseHover({
                        param: param
                    });
                };

                $scope.isolatedMouseLeave = function (param) {
                    if ($scope.readOnly == 'true') return;
                    $scope._rating = $scope.rating;
                    $scope.hoverValue = 0;
                    $scope.mouseLeave({
                        param: param
                    });
                };
                $scope.emptyStar = 'assets/img/star-empty-lg.png';
                $scope.fillStar = 'assets/img/star-fill-lg.png';
            }
        };
    });
    /**
     * @ngdoc directive
     * @name VehicleFeedbacks.directive:feedback
     * @scope
     * @restrict EA
     * @description
     * feedback directive used to load the feedback template.
     * @param {string} feedback Name of the directive
     **/
    module.directive('feedback', function () {
        return {
            restrict: 'EA',
            templateUrl: "Plugins/VehicleFeedbacks/feedback.tpl.html",
            controller: function ($scope, $rootScope, $element, $attrs, $state, Flash, $filter, AuthFactory, VehicleRentalFactory, BookerFeedbackFactory, HostFeedbackFactory) {
                var model = this;
                $scope.vehicle_rental_id = $state.params.vehicle_rental_id ? $state.params.vehicle_rental_id : '';
                $scope.user = {};
                $scope.starRating = 0;
                $scope.hoverRating = 0;
                $scope.isRated = false;
                $scope.init = function () {
                    VehicleRentalFactory.get({'id': $scope.vehicle_rental_id}).$promise.then(function (response) {
                        $scope.VehicleRentalDetails = response;
                        $scope.itemDetail = response.item;
                    });
                    AuthFactory.fetch().$promise.then(function (user) {
                        $rootScope.auth = user;
                    });
                };
                /**
                 * @ngdoc method
                 * @name init
                 * @methodOf VehicleFeedbacks.controller:FeedbackController
                 * @description
                 * This method will initialize the page.
                 **/
                $scope.init();
                $scope.getRating = function (param) {
                    $scope.isRated = true;
                    $scope.starRating = param;
                };
                /**
                 * @ngdoc method
                 * @name feedbackSubmit
                 * @methodOf VehicleFeedbacks.controller:FeedbackController
                 * @description
                 * This method will add the feedback details.
                 * @param {integer} Feedback Feedback form details.
                 * @returns {Array} Success or failure message.
                 **/
                $scope.feedbackSubmit = function ($valid) {
                    if ($valid && $scope.isRated) {
                        if ($rootScope.auth.id == $scope.VehicleRentalDetails.user_id) {
                            BookerFeedbackFactory.save({item_user_id: $scope.vehicle_rental_id, feedback: $scope.user.feedback, rating: $scope.starRating}, function (response) {
                                Flash.set($filter("translate")("Feedback Added Successfully!"), 'success', true);
                                $state.go('activity', {vehicle_rental_id: $scope.vehicle_rental_id, action: 'all'});
                            }, function (error) {
                                Flash.set($filter("translate")("Feedback Could not be added!"), 'error', false);
                            });
                        }
                        if ($rootScope.auth.id == $scope.vehicleDetails.user_id) {
                            HostFeedbackFactory.save({item_user_id: $scope.vehicle_rental_id, feedback: $scope.user.feedback, rating: $scope.starRating}, function (response) {
                                Flash.set($filter("translate")("Feedback Added Successfully!"), 'success', true);
                                $state.go('activity', {vehicle_rental_id: $scope.vehicle_rental_id, action: 'all'});
                            }, function (error) {
                                Flash.set($filter("translate")("Feedback Could not be added!"), 'error', false);
                            });
                        }
                    }
                };
            }
        };
    });
    /**
     * @ngdoc directive
     * @name VehicleFeedbacks.directive:editFeedback
     * @scope
     * @restrict EA
     * @description
     * editFeedback directive used to load the feedback template.
     * @param {string} editFeedback Name of the directive
     **/
    module.directive('editFeedback', function () {
        return {
            restrict: 'EA',
            templateUrl: "Plugins/VehicleFeedbacks/edit_feedback.tpl.html",
            controller: function ($scope, $rootScope, $element, $attrs, $state, Flash, $filter, AuthFactory, GetFeedbackFactory, EditFeedbackFactory) {
                var model = this;
                $scope.init = function () {
                    AuthFactory.fetch().$promise.then(function (user) {
                        $rootScope.auth = user;
                    });
                    GetFeedbackFactory.get({id: $scope.feedbackId}).$promise.then(function (response) {
                        $scope.bookingFeedback = response;
                        $scope.rating = response.rating;
                    });
                };
                /**
                 * @ngdoc method
                 * @name init
                 * @methodOf VehicleFeedbacks.controller:FeedbackController
                 * @description
                 * This method will initialize the page.
                 **/
                $scope.init();
                $scope.getRating = function (param) {
                    $scope.rating = param;
                };
                /**
                 * @ngdoc method
                 * @name feedbackSubmit
                 * @methodOf VehicleFeedbacks.controller:FeedbackController
                 * @description
                 * This method will update the feedback details.
                 * @param {integer} Feedback Feedback form details.
                 * @returns {Array} Success or failure message.
                 **/
                $scope.EditfeedbackSubmit = function ($valid) {
                    if ($valid) {
                        $scope.feedbackEdit.$setPristine();
                        $scope.feedbackEdit.$setUntouched();
                        $scope.feedback = {
                            id: $scope.bookingFeedback.id,
                            rating: $scope.rating,
                            feedback: $scope.bookingFeedback.feedback,
                            item_user_id: $scope.itemUserId,
                            dispute_closed_type_id: $scope.disputeClosedTypeId
                        };
                        EditFeedbackFactory.update($scope.feedback, function (response) {
                            Flash.set($filter("translate")("Feedback Updated Successfully!"), 'success', true);
                            $state.reload();
                        }, function (error) {
                            Flash.set($filter("translate")("Feedback Could not be Updated!"), 'error', false);
                        });
                    }
                };
            },
            scope: {
                feedbackId: '=',
                itemUserId: '=',
                disputeClosedTypeId: '='
            }
        };
    });
    /**
     * @ngdoc controller
     * @name VehicleFeedbacks.controller:FeedbackController
     * @description
     * This is FeedbackController having the methods init(), setMetaData(), and it defines the item list related funtions.
     **/
    module.controller('FeedbackController', function ($state, $scope, $http, Flash, $filter, FeedbackFactory, FeedbackCancelFactory, AuthFactory, $rootScope, $location, ConstItemUserStatus, FeedbackStatusFactory) {


    });
}(angular.module("BookorRent.VehicleFeedbacks")));
angular.module('BookorRent').requires.push('BookorRent.VehicleFeedbacks');/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleFuelOptions
 * @description
 *
 * This is the module for VehicleFuelOptions
 *
 * The VehicleFuelOptions module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleFuelOptions} new BookorRent.VehicleFuelOptions module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleFuelOptions", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleFuelOptions
 * @description
 *
 * This is the module for VehicleFuelOptions
 *
 * The VehicleFuelOptions module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleFuelOptions} new BookorRent.VehicleFuelOptions module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleFuelOptions", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
angular.module('BookorRent').requires.push('BookorRent.VehicleFuelOptions');/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleInsurances
 * @description
 *
 * This is the module for VehicleInsurances
 *
 * The VehicleInsurances module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleInsurances} new BookorRent.VehicleInsurances module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleInsurances", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleInsurances
 * @description
 *
 * This is the module for VehicleInsurances
 *
 * The VehicleInsurances module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleInsurances} new BookorRent.VehicleInsurances module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleInsurances", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
angular.module('BookorRent').requires.push('BookorRent.VehicleInsurances');/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleSurcharges
 * @description
 *
 * This is the module for VehicleSurcharges
 *
 * The VehicleSurcharges module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} VehicleSurcharges name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleSurcharges} new BookorRent.VehicleSurcharges module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleSurcharges", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleSurcharges
 * @description
 *
 * This is the module for VehicleSurcharges
 *
 * The VehicleSurcharges module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} VehicleSurcharges name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleSurcharges} new BookorRent.VehicleSurcharges module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleSurcharges", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
angular.module('BookorRent').requires.push('BookorRent.VehicleSurcharges');/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleTaxes
 * @description
 *
 * This is the module for VehicleTaxes
 *
 * The VehicleTaxes module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleTaxes} new BookorRent.VehicleTaxes module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleTaxes", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
/**
 * BookorRent - v1.0a.01 - 2016-06-07
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name VehicleTaxes
 * @description
 *
 * This is the module for VehicleTaxes
 *
 * The VehicleTaxes module act as a state provider, this module get the url and load the template and call the controller temporarily.
 *
 * @param {string} vehicle name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel',
 *            'ui.bootstrap'
 *        ]
 * @returns {BookorRent.VehicleTaxes} new BookorRent.VehicleTaxes module.
 **/
(function (module) {

}(angular.module("BookorRent.VehicleTaxes", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
angular.module('BookorRent').requires.push('BookorRent.VehicleTaxes');/**
 * BookorRent - v1.0a.01 - 2016-03-28
 *
 * Copyright (c) 2016 Agriya
 */
/**
 * @ngdoc object
 * @name Withdrawals
 * @description
 *
 * This is the module for Withdrawals. It contains the withdrawal functionalities.
 *
 * The withdrawal module act as a state provider, this module get the url and load the template and call the controller instantly.
 *
 * @param {string} withdrawals name of the module
 * @param {!Array.<string>=} dependencies If specified then new module is being created. If unspecified then the module is being retrieved for further configuration.
 *
 *        [
 *            'ui.router',
 *            'ngResource',
 *            'angulartics',
 *            'angulartics.google.analytics',
 *            'angulartics.facebook.pixel'
 *        ]
 * @param {string} stateProvider State provider is used to provide a corresponding model and template.
 * @param {string} analyticsProvider This service lets you integrate google analytics tracker in your AngularJS applications easily.
 * @returns {BookorRent.Withdrawals} new BookorRent.Withdrawals module.
 **/
(function (module) {
    module.config(function ($stateProvider, $analyticsProvider) {
        var ResolveServiceData = {
            'ResolveServiceData': function (ResolveService, $q) {
                return $q.all({
                    AuthServiceData: ResolveService.promiseAuth,
                    SettingServiceData: ResolveService.promiseSettings
                });
            }
        };
        $stateProvider.state('user_cash_withdrawals', {
            url: '/user_cash_withdrawals',
            authenticate: true,
            views: {
                "main": {
                    controller: 'UserCashWithdrawalsController as model',
                    templateUrl: 'Plugins/Withdrawals/user_cashWithdrawals.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'User Cash Withdrawals'}
        });
        $stateProvider.state('money_transfer_account', {
            url: '/money_transfer_account',
            authenticate: true,
            views: {
                "main": {
                    controller: 'MoneyTransferAccountsController as model',
                    templateUrl: 'Plugins/Withdrawals/money_transfer_account.tpl.html',
                    resolve: ResolveServiceData
                }
            },
            data: {pageTitle: 'Money Transfer Accounts'}
        });
    });
}(angular.module("BookorRent.Withdrawals", [
    'ui.router',
    'ngResource',
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.facebook.pixel'
])));
(function (module) {
    /**
     * @ngdoc controller
     * @name Withdrawals.controller:MoneyTransferAccountsController
     * @description
     * Money Transfer accounts details and its listing functions developed here.
     */
    module.controller('MoneyTransferAccountsController', function ($state, $scope, $http, Flash, $filter, MoneyTransferAccountsFactory, MoneyTransferAccountFactory, MoneyTransferAccountPrimaryFactory, $rootScope, $location) {
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Withdrawals.controller:MoneyTransferAccountsController
         * @description
         * This method will set the meta data's dynamically by using the angular.element
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("Money Transfer Accounts");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name init
         * @methodOf Withdrawals.controller:MoneyTransferAccountsController
         * @description
         * This method will initialize the page. It returns the page title.
         **/
        $scope.init = function () {
            $scope.setMetaData();
            $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Money Transfer Accounts");
            MoneyTransferAccountsFactory.list()
                .$promise
                .then(function (response) {
                    $scope.moneyTransferAccLists = response.data;
                });
        };
        /**
         * @ngdoc method
         * @name MoneyTransferAccSubmit
         * @methodOf Withdrawals.controller:MoneyTransferAccountsController
         * @description
         * This method used to store money transfer account.
         * @param {Object} money_transfer_account Money transfer account details.
         * @returns {Array} Success or failure message.
         **/
        $scope.MoneyTransferAccSubmit = function ($valid) {
            if($valid) {
                MoneyTransferAccountsFactory.save($scope.money_transfer_account, function (response) {
                    Flash.set($filter("translate")("Account Added successfully"), 'success', true);
                    $state.reload();
                }, function (error) {
                    Flash.set($filter("translate")("Account could not be added"), 'error', false);
                });
            }
        };
        /**
         * @ngdoc method
         * @name MoneyTransferAccDelete
         * @methodOf Withdrawals.controller:MoneyTransferAccountsController
         * @description
         * This method used to delete money transfer account.
         * @param {integer} account_id Money transfer account identifier.
         * @returns {Array} Success or failure message.
         **/
        $scope.MoneyTransferAccDelete = function (id) {
            MoneyTransferAccountFactory.delete({
                id: id
            }).$promise.then(function (data) {
                Flash.set($filter("translate")("Account deleted successfully"), 'success', true);
                $state.reload();
            }, function (error) {
                errmsg = (error.data.message != undefined) ? error.data.message : "Account could not be deleted";
                Flash.set($filter("translate")(errmsg), 'error', false);
            });
        };
        $scope.init();
    });
}(angular.module("BookorRent.Withdrawals")));
(function (module) {
    /**
     * @ngdoc controller
     * @name Withdrawals.controller:UserCashWithdrawalsController
     * @description
     * This is userCashWithdrawalsController having the methods init(), setMetaData(), userCashWithdrawSubmit() and it defines the user cash withdraw relted funtions.
     **/
    module.controller('UserCashWithdrawalsController', function ($state, $scope, $http, Flash, $filter, UserCashWithdrawalsFactory, AuthFactory, $rootScope, $location, MoneyTransferAccountsFactory) {
        var model = this;
        $rootScope.pageTitle = $rootScope.settings['site.name'] + " | " + $filter("translate")("Withdrawals");
        model.moneyTransferList = [];
        $scope.withdrawals = [];
        $scope.withdrawals.minimum_withdraw_amount = $rootScope.settings['user.minimum_withdraw_amount'];
        $scope.withdrawals.maximum_withdraw_amount = $rootScope.settings['user.maximum_withdraw_amount'];
        $scope.infoMessage = '';
        $scope.user_available_balance = '';
        $scope.maxSize = 5;
        model.userCashWithdrawalsList = [];
        model.userCashWithdrawSubmit = userCashWithdrawSubmit;
        model.moneyTransfer = new UserCashWithdrawalsFactory();
        var user_id = $rootScope.auth ? parseInt($rootScope.auth.id) : '';
        /**
         * @ngdoc method
         * @name setMetaData
         * @methodOf Withdrawals.controller:UserCashWithdrawalsController
         * @description
         * This method will set the meta data's dynamically by using the angular.element
         * @returns {Element} New meta data element.
         **/
        $scope.setMetaData = function () {
            var pageTitle = $filter("translate")("User Cash Withdrawals");
            var fullUrl = $location.absUrl();
            var appUrl = $rootScope.settings['scheme_name'] + ":/" + $location.url();
            angular.element('html head meta[property="og:title"], html head meta[name="twitter:title"]').attr("content", $rootScope.settings['site.name'] + " | " + pageTitle);
            angular.element('meta[property="al:ios:url"], meta[property="al:ipad:url"], meta[property="al:android:url"], meta[property="al:windows_phone:url"], html head meta[name="twitter:app:url:iphone"], html head meta[name="twitter:app:url:ipad"], html head meta[name="twitter:app:url:googleplay"]').attr('content', appUrl);
            angular.element('meta[property="og:url"]').attr('content', fullUrl);
        };
        /**
         * @ngdoc method
         * @name getMoneyTransferList
         * @methodOf Withdrawals.controller:UserCashWithdrawalsController
         * @description
         * This method handles the form which is used for contact, and add contact details.
         * @param {integer} FormDetails Contact form details.
         * @returns {Array} Success or failure message.
         **/
        $scope.getMoneyTransferList = function () {
            MoneyTransferAccountsFactory.list()
                .$promise
                .then(function (response) {
                    model.moneyTransferList = response.data;
                });
        };

        var params = {};
        /**
         * @ngdoc method
         * @name getUserCashWithdrawals
         * @methodOf Withdrawals.controller:UserCashWithdrawalsController
         * @description
         * This method will be used in get withdraw request.
         **/
        $scope.getUserCashWithdrawals = function () {
            params.page = $scope.currentPage;
            UserCashWithdrawalsFactory.list(params)
                .$promise
                .then(function (response) {
                    //$scope.userCashWithdrawalsList = response.data;
                    model.userCashWithdrawalsList = response.data;
                    $scope._metadata = response.meta.pagination;
                });
        };

        /**
         * @ngdoc method
         * @name userCashWithdrawSubmit
         * @methodOf Withdrawals.controller:UserCashWithdrawalsController
         * @description
         * This method will be used in submitting a request for withdraw.
         **/
        function userCashWithdrawSubmit($valid) {
            if ($valid) {
                if($scope.user_available_balance >= model.moneyTransfer.amount) {
                    model.moneyTransfer.$save()
                        .then(function (response) {
                            Flash.set($filter("translate")("Your request submitted successfully."), "success", false);
                            $state.reload('user_cash_withdrawals');
                        })
                        .catch(function (error) {
                            Flash.set("Withdraw request could not be added", "error", false);
                            $scope.amountErr = '';
                            var errorResponse = error.data.errors;
                            if (errorResponse.amount) {
                                $scope.amountErr = $filter("translate")(errorResponse.amount[0]);
                            }
                        })
                        .finally();
                }else{
                    Flash.set("You Dont have sufficient amount in your wallet.", "error", false);
                }
            }
        }
        /**
         * @ngdoc method
         * @name init
         * @methodOf Withdrawals.controller:UserCashWithdrawalsController
         * @description
         * This method will initialize the meta data and functionalities.
         **/
        $scope.init = function() {
            $scope.setMetaData();
            $scope.currentPage = ($scope.currentPage !== undefined) ? parseInt($scope.currentPage) : 1;
            AuthFactory.fetch({}).$promise
                .then(function (response) {
                    $scope.user_available_balance = response.available_wallet_amount;
                });
            $scope.getUserCashWithdrawals();
            $scope.getMoneyTransferList();
        };
        $scope.init();
        $scope.paginate = function(pageno) {
            $scope.currentPage = parseInt($scope.currentPage);
            $scope.init();
        };

    });

}(angular.module("BookorRent.Withdrawals")));
(function (module) {
    /**
     * @ngdoc service
     * @name Withdrawals.UserCashWithdrawalsFactory
     * @description
     * UserCashWithdrawalsFactory used in listing the user cash withdrawal requests and submitting a withdraw request.
     * @param {string} UserCashWithdrawalsFactory The name of the factory
     * @param {function()} function It uses get method for listing, post method for save and defines the url.
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':   {method:'POST'},
	 *			'list':   {method:'GET'}
	 *		};
     */
    module.factory('UserCashWithdrawalsFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/user_cash_withdrawals', {}, {
                'save': {
                    method: 'POST'
                },
                'list': {
                    method: 'GET'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Withdrawals.MoneyTransferAccountsFactory
     * @description
     * MoneyTransferAccountsFactory is used in money transfer accounts
     * @param {string} MoneyTransferAccountsFactory The name of the factory
     * @param {function()} function It uses get method for listing, post method for save and defines the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'save':   {method:'POST'},
	 *			'list':   {method:'GET'}
	 *		};
     */
    module.factory('MoneyTransferAccountsFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/money_transfer_accounts', {}, {
            'list': {
                method: 'GET'
            },
            'save': {
                method: 'POST'
            }

        });
    });
    /**
     * @ngdoc service
     * @name Withdrawals.MoneyTransferAccountFactory
     * @description
     * MoneyTransferAccountFactory is used in delete the money transfer accounts
     * @param {string} MoneyTransferAccountFactory The name of the factory
     * @param {function()} function It uses delete method, and returns the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'delete':   {method:'DELETE'}
	 *		};
     */
    module.factory('MoneyTransferAccountFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/money_transfer_accounts/:id', {
                id: '@id'
            }, {
                'delete': {
                    method: 'DELETE'
                }
            }
        );
    });
    /**
     * @ngdoc service
     * @name Withdrawals.MoneyTransferAccountPrimaryFactory
     * @description
     * MoneyTransferAccountPrimaryFactory is used in money transfer account primary
     * @param {string} MoneyTransferAccountPrimaryFactory The name of the factory
     * @param {function()} function It uses get method for primary, and returns the url
     * @param {string} url Base url accessed in GENERAL_CONFIG.
     * @returns {object} The service contains these actions:
     *
     *      {
	 *			'primary':   {method:'GET'},
	 *		};
     */
    module.factory('MoneyTransferAccountPrimaryFactory', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/money_transfer_accounts/:id/primary', {
                id: '@id'
            }, {
                'primary': {
                    method: 'GET'
                }
            }
        );
    });


})(angular.module('BookorRent.Withdrawals'));
angular.module('BookorRent').requires.push('BookorRent.Withdrawals');