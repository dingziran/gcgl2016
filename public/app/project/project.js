/**
 * Created by Administrator on 14-5-1.
 */
var app=angular.module("myApp");
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('project', {
            url: "/project",
            views:{
                'main@':{
                    templateUrl: "app/project/project.html",
                    controller:"ProjectController",
                    resolve:{
                        projectList:function(ProjectService){
                            return ProjectService.list();
                        }
                    }
                }
            }
        })
        .state('project.create', {
            url: "/project/create",
            views:{
                'main@':{
                    templateUrl: "app/project/createProject.html",
                    controller:"CreateProjectController"
                }
            }
        });
});
app.factory('ProjectService', function(firebaseService,$q) {
    var projectRef = firebaseService.ref("/project");
    var projectRefLoad=$q.defer();
    projectRef.$on("loaded",function(){
        projectRefLoad.resolve(projectRef);
    });


    //Public Method
    var projectService = {
        create: function(project) {
            return projectRef.$add(project);
        },
        list: function(){
            return projectRefLoad.promise;
        },
        remove: function(key){
            return projectRef.$remove(key);
        }
    };
    return projectService;
});

app.controller("ProjectController",function($scope,ProjectService,projectList){
    $scope.projectList=projectList;
    $scope.remove=function(key){
        ProjectService.remove(key).then(function(){
            console.log("ProjectController:Remove Successful");
        },function(){
            console.log("ProjectController:Remove failed");
        })
    }

});
app.controller("CreateProjectController",function($scope,$state,ProjectService){
    $scope.project={};
    $scope.create=function(){
        ProjectService.create($scope.project).then(function(){
            console.log("CreateProjectController:Create Success");
            $state.go("^");
        },function(){
            console.log("CreateProjectController:Create Failed");
        })
    }
});