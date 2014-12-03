/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.tool");
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
                                  productData) {
                $scope.productData= f.copy(productData);
            },
            data: {
                displayName: 'Product'
            }
        });
});