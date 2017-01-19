/******************************************************************************
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Alan Thiessen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 ******************************************************************************/


(function() {
    'use strict';

    angular.module('AthaMobile')
        .controller('StarterCtrl', StarterController);


    StarterController.$inject = ['$state', 'Settings', 'FeathersJS'];
    function StarterController($state, settings, feathers) {
        var startCtrl = this;
        startCtrl.showLogin = false;
        startCtrl.url = '';
        startCtrl.email = '';
        startCtrl.password = '';
        startCtrl.login = DoLogin;

        var client;

        Start();

        return startCtrl;

        /////////////////////////////////////////////////////////
        function Start() {
            startCtrl.url = settings.getValue('server');

            if(typeof(startCtrl.url) != 'undefined') {
                client = feathers.connect(startCtrl.url);
                ServerConnect();
            }
            else {
                ConnectionFailed();
            }
        }


        function ServerConnect(email, password) {
            if(typeof(email) == 'undefined') {
                client.authenticate().then(ConnectionSuccess, ConnectionFailed);
            }
            else {
                client.authenticate({
                    'type': 'local',
                    'email': email,
                    'password': password
                }).then(ConnectionSuccess, ConnectionFailed);
            }
        }


        function ConnectionSuccess() {
            settings.setValue('server', startCtrl.url);
            settings.setValue('authToken', client.get('token'));
            $state.go('tab.rooms');
        }


        function ConnectionFailed() {
            startCtrl.showLogin = true;
        }


        function DoLogin() {
            client = feathers.connect(startCtrl.url);
            ServerConnect(startCtrl.email, startCtrl.password);
        }
    }

})();
