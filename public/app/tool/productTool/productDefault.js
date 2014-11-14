/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.productDefault', {
            url: "/productDefault/:productDataId",
            templateUrl: "app/tool/productTool/productDefault.html",
            resolve:{
                productData:function($stateParams,productDataListRef){
                    return productDataListRef.$getRecord($stateParams.productDataId);
                }
            },
            controller: function ($scope,$stateParams,f,
                                  activityData,productData) {
                $scope.activityData= f.copy(activityData);
                console.log(productData);
                $scope.productData= f.copy(productData);
            }
        });
});