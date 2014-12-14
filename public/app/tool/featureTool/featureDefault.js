/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.tool");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.featureDefault', {
            url: "/featureDefault/:featureId",
            templateUrl: "app/tool/featureTool/featureDefault.html",
            resolve:{
                feature:function($stateParams,activityData){
                    return _.filter(activityData.features,function(feature){
                        return feature.featureId==$stateParams.featureId;
                    })[0];
                }
            },
            controller: function ($scope,$stateParams,f,
                                  activityData,productDataListRef,feature) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                $scope.getProductName=function(id){
                    var product= productDataListRef.$getRecord(id);
                    if(_.isEmpty(product)){
                        return "";
                    }
                    else{
                        return product.name
                    }
                };
            },
            data: {
                displayName: '默认特征工具'
            }
        });
});