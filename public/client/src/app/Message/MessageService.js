(function (module) {
    /**
     * @ngdoc service
     * @name Message.MessageController
     * @description
     * InboxFactory is a factory service which is used to get the auth user messages
     * @param {string} InboxFactory The name of the factory
     * @param {function()} function It uses get method, and get the auth user messages
     */
    module.factory('InboxFactory', ['$resource', 'GENERAL_CONFIG', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/messages', {}, {
            list: {
                method: 'GET'
            }
        });
    }]);

    /**
     * @ngdoc service
     * @name Message.MessageController
     * @description
     * SentMailFactory is a factory service which is used to get the auth user sent messages
     * @param {string} SentMailFactory The name of the factory
     * @param {function()} function It uses get method, and get the auth user sent messages
     */
    module.factory('SentMailFactory', ['$resource', 'GENERAL_CONFIG', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/sentMessages', {}, {
            list: {
                method: 'GET'
            }
        });
    }]);

    /**
     * @ngdoc service
     * @name Message.MessageController
     * @description
     * StarMailFactory is a factory service which is used to get the auth user star messages
     * @param {string} StarMailFactory The name of the factory
     * @param {function()} function It uses get method, and get the auth user star messages
     */
    module.factory('StarMailFactory', ['$resource', 'GENERAL_CONFIG', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/starMessages', {}, {
            list: {
                method: 'GET'
            }
        });
    }]);

    /**
     * @ngdoc service
     * @name Message.MessageController
     * @description
     * GetMessageFactory is a factory service which is used to get the auth user message
     * @param {string} GetMessageFactory The name of the factory
     * @param {function()} function It uses get method, and get the auth user message
     */
    module.factory('GetMessageFactory', ['$resource', 'GENERAL_CONFIG', function ($resource, GENERAL_CONFIG) {
        return $resource(GENERAL_CONFIG.api_url + '/messages/:id', {
            id:'@id',
        }, {
            get: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            }
        });
    }]);

})(angular.module("BookorRent.Messages"));
