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
            controller: function ($scope,$stateParams,$state,f,
                                  activityData,feature,productDataListRef,activityDataListRef) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                if($scope.feature.tool){
                    if($scope.feature.tool.inputs){
                        _.each($scope.feature.tool.inputs,function(input){
                            input.product=productDataListRef.$getRecord(input.product);
                        });
                    }
                    if($scope.feature.tool.outputs){
                        _.each($scope.feature.tool.outputs,function(output){
                            output.product=productDataListRef.$getRecord(output.product);
                        });
                    }
                }
                $scope.data=[];
                if($scope.activityData.simpleDivide){
                    $scope.data=$scope.activityData.simpleDivide;
                }

                $scope.remove = function(node) {
                    node.disable=true;
                };
                $scope.edit = function(node) {
                    node.editing=true;
                };
                $scope.save = function(node) {
                    node.editing = false;
                };
                $scope.newSubItem = function(node) {
                    node.nodes.push({
                        title: 'New Item',
                        nodes: []
                    });
                };
                $scope.addNode = function(){
                    $scope.data.push({
                        title:'New Item',
                        nodes:[]
                    });
                };

                var getRootNodesScope = function() {
                    return angular.element(document.getElementById("tree-root")).scope();
                };

                $scope.fromInput=function(){
                };
                $scope.toOutput=function(){
                };
                $scope.saveTool=function(){
                    $scope.activityData.simpleDivide=$scope.data;
                    var theActivityData=activityDataListRef.$getRecord($scope.activityData.$id);
                    theActivityData.simpleDivide=$scope.data;
                    activityDataListRef.$save(theActivityData).then(function() {
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });

                };
            }
        });
});