/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.productDefault', {
            url: "/default/:productId",
            templateUrl: "app/tool/featureTool/featureDefault.html",
            resolve:{
                productData:function($stateParams,productDataListRef){
                    return productDataListRef.$getRecord($stateParams.productId);
                }
            },
            controller: function ($scope,$stateParams,f,
                                  activityData,productData) {
                $scope.activityData= f.copy(activityData);
                $scope.productData= f.copy(productData);
            }
        });
});