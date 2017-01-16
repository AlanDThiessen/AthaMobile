/******************************************************************************
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Hill City Software
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
        .controller('RoomDetailsCtrl', RoomDetailsCtrl);



    RoomDetailsCtrl.$inject = ['$scope', '$stateParams', 'LightSvc'];
    function RoomDetailsCtrl($scope, $stateParams, lightSvc) {
        var lightsCtrl = this;
        lightsCtrl.lights = [];
        lightsCtrl.removeLight = RemoveLight;
        var rooms = {};
        var roomId = $stateParams.roomId;

        UpdateLights();

        return lightsCtrl;


        function UpdateLights() {
            lightSvc.find({
                query: {
                    $limit: 100,
                    roomId: roomId,
                    $sort: {
                        'name': 1
                    }
                }
            }).then(OnLightsUpdate, OnError);
        }


        function OnLightsUpdate(data) {
            lightsCtrl.lights = [];

            data.data.forEach(function(light) {
                light.roomName = rooms[light.roomId];
                lightsCtrl.lights.push(light);
            });

            $scope.$apply();
        }


        function RemoveLight(id) {
            lightSvc.remove(id).then(UpdateLights, OnError);
        }


        function OnError(err) {
            console.log(err);
        }
    }

})();
