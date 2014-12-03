/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.tool");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.jsonViewer', {
            url: "/jsonViewer/:productDataId",
            templateUrl: "app/tool/productTool/jsonViewer.html",
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