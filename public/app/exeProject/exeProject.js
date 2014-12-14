var app=angular.module("gcgl2016.exeProject",['ui.router','gcgl2016.firebase','gcgl2016.project','ui.bootstrap']);
app.config(function($stateProvider){
    $stateProvider
        .state('main', {
            url: "/main",
            templateUrl: "app/exeProject/selectProject.html",
            resolve: {
                projectListRef: function (ProjectService) {
                    return ProjectService.getRefArray();
                }
            },
            controller: function ($scope,projectListRef,f) {
                $scope.projectList= f.copy(projectListRef);
            },
            data: {
                displayName: '首页'
            }
        })
        .state('main.project',{
            url:"/:projectId",
            templateUrl:"app/exeProject/activityList.html",
            resolve:{
                project:function($stateParams,projectListRef){
                    return projectListRef.$getRecord($stateParams.projectId);
                },
                activityDataListRef:function($stateParams,ActivityService){
                    return ActivityService.getActivityDataRef($stateParams.projectId);
                },

                productDataListRef:function($stateParams,ProductService){
                    return ProductService.getProductDataRef($stateParams.projectId);
                }
            },
            controller:function($scope,$state,$stateParams,f,activityDataListRef){
                $scope.activityDataList= f.copy(activityDataListRef);
                $scope.calStyle=function(number){
                    if(!number||number<0){
                        return {width:'0%'};
                    }
                    else if(number>100){
                        return {width:'100%'};
                    }
                    else{
                        return {width:number+'%'};
                    }
                };
                $scope.calNumber=function(number){
                    if(!number||number<0){
                        return '0%';
                    }
                    else if(number>100){
                        return '100%';
                    }
                    else{
                        return ''+number+"%";
                    }
                }
            },
            data: {
                displayName: '项目主界面'
            }
        })
        .state('main.project.activity',{
            url:"/:activityId",
            templateUrl:"app/exeProject/activityTemplate.html",
            resolve:{
                activityData:function($stateParams,activityDataListRef,f){
                    return activityDataListRef.$getRecord($stateParams.activityId);
                }
            },
            controller:function($scope,f,
                                productDataListRef,activityData){
                $scope.activityData= f.copy(activityData);
                $scope.activityData.inputs= f.extend($scope.activityData.inputs,productDataListRef);
                $scope.activityData.outputs= f.extend($scope.activityData.outputs,productDataListRef);
            },
            data: {
                displayName: '活动主界面'
            }
        });
});
app.factory('ExeProjectService', function() {


    //Public Method
    var exeProjectService = {
    };
    return exeProjectService;
});