/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.conference', {
            url: "/conference/:featureId",
            templateUrl: "app/tool/featureTool/conference.html",
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
            },
            data: {
                displayName: 'Conference'
            }
        });
});