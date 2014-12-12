/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.tool");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.estimate', {
            url: "/estimate/:featureId",
            templateUrl: "app/tool/featureTool/estimate/estimate.html",
            resolve:{
                feature:function($stateParams,activityData){
                    return _.filter(activityData.features,function(feature){
                        return feature.featureId==$stateParams.featureId;
                    })[0];
                }
            },
            controller: function ($scope,$stateParams,f,$state,$http,
                                  activityData,feature,activityDataListRef,project) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                $scope.save=function(){
                    activityDataListRef.$save(_.extend(activityData,$scope.activityData)).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                }
                $scope.open=function(){
                    window.open(activityData.address);
                }
                $scope.send=function(){
                    console.log(project);
                    var json={
                        projectname:project.name,
                        projectType:"early-design",
                        projDescription:project.description,
                        startDate:"2014-12-09",
                        endDate:"2014-12-30",
                        status:"项目开始",
                        languageName:"JAVA",
                        fptosloc:"100",
                        manpermonth:"4000",
                        computefunctionpoint:"1,2,3,1,2,3,1,2,3,1,2,3,1,2,3",
                        clientname:"客户Test",
                        email:"Test@sina.com"
                    };
                    $http({
                        method: 'POST',
                        url: $scope.activityData.address+$scope.activityData.sendAddress,
                        data:  json,
                        headers:{
                            'Content-Type': 'application/json'
                        }
                    }).success(function(data){
                        $scope.projectId=data;
                    });
                        
                };
                $scope.receive=function(){
                    $http.get($scope.activityData.address+$scope.activityData.receiveAddress+'\\'+$scope.projectId).success(function(data){
                        $scope.data=data;
                    });
                }
            },
            data: {
                displayName: 'Feature'
            }
        });
});