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
        .controller('RoomDetailsCtrl', RoomDetailsCtrl);



    RoomDetailsCtrl.$inject = ['$scope', '$state', '$stateParams', 'RoomSvc', 'LightSvc'];
    function RoomDetailsCtrl($scope, $state, $stateParams, roomSvc, lightSvc) {
        var lightsCtrl = this;
        lightsCtrl.roomName = "";
        lightsCtrl.lights = {};
        lightsCtrl.removeLight = RemoveLight;
        lightsCtrl.lightChanged = SendLightChange;
        var roomId = $stateParams.roomId;

        $scope.$on('$destroy', Unsubscribe);
        InitCtrl();

        return lightsCtrl;


        function InitCtrl() {
            lightSvc.on('created', OnLightCreated);
            lightSvc.on('updated', OnLightUpdated);
            lightSvc.on('removed', OnLightRemoved);
            FindLightsByRoomId();
            roomSvc.get(roomId).then(RoomRetrieved, OnError);
        }


        function Unsubscribe() {
            lightSvc.removeListener('created', OnLightCreated);
            lightSvc.removeListener('updated', OnLightUpdated);
            lightSvc.removeListener('removed', OnLightRemoved);
        }


        function FindLightsByRoomId() {
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


        function RoomRetrieved(room) {
            lightsCtrl.roomName = room.name;
        }


        function OnLightsUpdate(data) {
            lightsCtrl.lights = {};

            data.data.forEach(function(light) {
                lightsCtrl.lights[light._id] = light;
            });

            $scope.$apply();
        }


        function OnLightCreated(light) {
            if(light.roomId == roomId) {
                lightsCtrl.lights[light._id] = light;
                $scope.$apply();
            }
        }


        function OnLightUpdated(light) {
            if(lightsCtrl.lights.hasOwnProperty(light._id)) {
                lightsCtrl.lights[light._id].status = light.status;
                lightsCtrl.lights[light._id].level = light.level;
                $scope.$apply();
            }
        }


        function OnLightRemoved(light) {
            if(lightsCtrl.lights.hasOwnProperty(light._id)) {
                delete(lightsCtrl.lights[light._id]);
                $scope.$apply();
            }

        }


        function RemoveLight(id) {
            lightSvc.remove(id).then(null, OnError);
        }


        function SendLightChange(id) {
            var light = {};
            angular.copy(lightsCtrl.lights[id], light);
            delete(light._id);
            lightSvc.update(id, light).then(null, OnError);
        }


        function OnError(err) {
            console.log(err);
            $state.go('login');
        }
    }

})();
