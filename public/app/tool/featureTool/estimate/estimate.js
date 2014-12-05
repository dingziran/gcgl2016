/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.tool");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.estimate', {
            url: "/estimate/:featureId",
            templateUrl: "app/tool/featureTool/estimate/estimate.html",
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
                $scope.url="";
                $scope.open=function(){
                    $scope.url="";
                }
            },
            data: {
                displayName: 'Feature'
            }
        });
});