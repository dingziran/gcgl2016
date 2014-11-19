/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.areaChart', {
            url: "/areaChart/:productDataId",
            templateUrl: "app/tool/productTool/areaChart.html",
            resolve:{
                productData:function($stateParams,productDataListRef){
                    return productDataListRef.$getRecord($stateParams.productDataId);
                }
            },
            controller: function ($scope,$stateParams,$state,f,
                                  activityData,productDataListRef,productData) {
                $scope.activityData= f.copy(activityData);
                $scope.productData= f.copy(productData);
                $scope.electricity = new kendo.data.DataSource({
                    data: [
                        { name: "Jane Doe", age: 30, value:101 },
                        { name: "Jane Doe", age: 31, value:102  },
                        { name: "Jane Doe", age: 32, value:103  },
                        { name: "Jane Doe", age: 33, value:104  },
                        { name: "Jane Doe", age: 34, value:105  },
                        { name: "Jane Doe", age: 35, value:106  },
                        { name: "Jane Doe", age: 36, value:107  },
                        { name: "Jane Doe", age: 37, value:108  },
                        { name: "Jane Doe", age: 38, value:109  },
                        { name: "John Doe", age: 39, value:120  }
                    ],
                    sort: { field: "age", dir: "asc" }
                });
                $scope.theSeries=$scope.activityData.theSeries||[];
                $scope.newSeries={};
                $scope.addSeries=function(){
                    $scope.theSeries.push($scope.newSeries);
                    $scope.newSeries={};
                    productData.theSeries=$scope.theSeries;
                    productDataListRef.$save(productData).then(function() {
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