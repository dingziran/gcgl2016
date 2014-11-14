/**
 * Created by Administrator on 2014/9/20.
 */

var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.productDefault2', {
            url: "/productDefault/:productId",
            templateUrl: "app/template/productTemplate/productDefault.html",
            resolve:{
                productData:function($stateParams,productListRef){
                    return productListRef.$getRecord($stateParams.productId);
                }
            },
            controller: function ($scope,product) {
                $scope.product=product;
            }
        });
});