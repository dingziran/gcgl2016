/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.simpleDivide', {
            url: "/simpleDivide/:featureId",
            templateUrl: "app/tool/featureTool/simpleDivide.html",
            resolve:{
                feature:function($stateParams,activityData){
                    return _.filter(activityData.features,function(feature){
                        return feature.featureId==$stateParams.featureId;
                    })[0];
                }
            },
            controller: function ($scope,$stateParams,f,
                                  activityData,feature) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                $scope.data=[
                    {
                        "id": 1,
                        "title": "node1",
                        "nodes": [
                            {
                                "id": 11,
                                "title": "node1.1",
                                "nodes": [
                                    {
                                        "id": 111,
                                        "title": "node1.1.1",
                                        "nodes": []
                                    }
                                ]
                            },
                            {
                                "id": 12,
                                "title": "node1.2",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "title": "node2",
                        "nodes": [
                            {
                                "id": 21,
                                "title": "node2.1",
                                "nodes": []
                            },
                            {
                                "id": 22,
                                "title": "node2.2",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "title": "node3",
                        "nodes": [
                            {
                                "id": 31,
                                "title": "node3.1",
                                "nodes": []
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "title": "node4",
                        "nodes": [
                            {
                                "id": 41,
                                "title": "node4.1",
                                "nodes": []
                            }
                        ]
                    }
                ];

                $scope.remove = function(scope) {
                    scope.remove();
                };

                $scope.toggle = function(scope) {
                    scope.toggle();
                };
                $scope.editNode = function(node) {
                    node.editing = true;
                };
                $scope.saveNode = function(node) {
                    node.editing = false;
                };
                $scope.moveLastToTheBegginig = function () {
                    var a = $scope.data.pop();
                    $scope.data.splice(0,0, a);
                };

                $scope.newSubItem = function(scope) {
                    var nodeData = scope.$modelValue;
                    nodeData.nodes.push({
                        id: nodeData.id * 10 + nodeData.nodes.length,
                        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                        nodes: []
                    });
                };
                $scope.addNode = function(){
                    $scope.data.push({
                        id:$scope.data.length+1,
                        title:'node'+($scope.data.length+1),
                        nodes:[]
                    });
                };

                var getRootNodesScope = function() {
                    return angular.element(document.getElementById("tree-root")).scope();
                };

                $scope.collapseAll = function() {
                    var scope = getRootNodesScope();
                    scope.collapseAll();
                };

                $scope.expandAll = function() {
                    var scope = getRootNodesScope();
                    scope.expandAll();
                };
            }
        });
});