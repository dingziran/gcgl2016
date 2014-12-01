/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.productEditor', {
            url: "/productEditor/:productDataId",
            templateUrl: "app/tool/productTool/productEditor.html",
            resolve:{
                productData:function($stateParams,productDataListRef){
                    return productDataListRef.$getRecord($stateParams.productDataId);
                }
            },
            controller: function ($scope,$stateParams,f,ProductService,
                                  activityData,productData,productDataListRef) {
                $scope.activityData= f.copy(activityData);
                $scope.productData= f.copy(productData);
                console.log($scope.productData);
                $scope.save=function(){
                    ProductService.save(productDataListRef,productData,$scope.productData);
                };
                $scope.reset=function(){
                    $scope.productData=f.copy(productData);
                }
            },
            data: {
                displayName: 'Document'
            }
        });
});