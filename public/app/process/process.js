var app=angular.module("myApp");
app.config(function($stateProvider, $urlRouterProvider){

    $stateProvider
        .state('process',{
            url:"/process",
            views:{
                'main@':{
                    templateUrl:"app/process/process.html",
                    controller:"ProcessController",
                    resolve:{
                        processList:function(ProcessService){
                            return ProcessService.list();
                        }
                    }
                }
            },
            data: {
                displayName: 'Process List'
            }
        })
        .state('process.create',{
            url:"/process/create",
            views:{
                'main@':{
                    templateUrl:"app/process/createProcess.html",
                    controller:"CreateProcessController"
                }
            },
            data: {
                displayName: 'Create Process'
            }
        })
        .state('process.relation',{
            url:"/process/relation",
            views:{
                'main@':{
                    templateUrl:"app/process/relation.html",
                    controller:"RelationProcessController",
                    resolve:{
                        relationList:function(ProcessService){
                            return ProcessService.listRelation();
                        },
                        processList:function(ProcessService){
                            return ProcessService.list();
                        }
                    }
                }
            },
            data: {
                displayName: 'Management Relationship'
            }
        })
});
app.factory('ProcessService', function(firebaseService,$q) {

    var processRef = firebaseService.ref("/process");
    var processRefLoad = $q.defer();
    processRef.$on("loaded",function(){
        processRefLoad.resolve(processRef);
    });

    var processRelationRef = firebaseService.ref("/processRelation");
    var processRelationRefLoad = $q.defer();
    processRelationRef.$on("loaded",function(){
        processRelationRefLoad.resolve(processRelationRef);
    });

    var constructRelation=function(){
        _.each(processRelationRef.$getIndex(),function(index){
            processRelationRef[index].pre=processRef.$child(processRelationRef[index].preId);
            processRelationRef[index].post=processRef.$child(processRelationRef[index].postId);
        });
    };
    //Public Method
    var processService = {
        create: function(process) {
            return processRef.$add(process);
        },
        list: function(){
            return processRefLoad.promise;
        },
        remove: function(key){
            return processRef.$remove(key);
        },
        addRelation: function(preId,postId){
            return processRelationRef.$add({preId:preId,postId:postId});
        },
        listRelation:function(){
            var promise=$q.all([processRefLoad.promise,processRelationRefLoad.promise]).then(function(){
                constructRelation();
                return processRelationRef;
            });
            return promise;
        },
        removeRelation:function(key){
            return processRelationRef.$remove(key);
        }
    };
    return processService;
});
app.controller("ProcessController",function($scope,ProcessService,processList){
    $scope.processList=processList;
    $scope.remove=function(key){
        ProcessService.remove(key).then(function(){
            console.log("ProcessController:Remove Successful");
        },function(){
            console.log("ProcessController:Remove failed");
        })
    }
});
app.controller("CreateProcessController",function($scope,$state,ProcessService){
    $scope.process={};
    $scope.create=function(){
        ProcessService.create($scope.process).then(function(){
            console.log("CreateProcessController:Create Success");
            $state.go("^");
        },function(){
            console.log("CreateProcessController:Create Failed");
        })
    }
});
app.controller("RelationProcessController",function($scope,$state,ProcessService,relationList,processList){
    $scope.processList=processList;
    $scope.preId={};
    $scope.postId={};
    $scope.relationList=relationList;
    $scope.relationList.$on("change",function(){
        ProcessService.listRelation().then(function(data){
            $scope.relationList=data;
        });
    })
    $scope.add=function(){
        if($scope.preId==$scope.postId){
            console.log("fail: pre equals post");
            return;
        }
        if(_.isEmpty($scope.preId)|| _.isEmpty($scope.postId)){
            console.log("fail: cannot input null");
            return;
        }
        ProcessService.addRelation($scope.preId,$scope.postId).then(function(){
            console.log("RelationProcessController:Add Success");
        },function(){
            console.log("RelationProcessController:Add Failed");
        });
        $scope.preId={};
        $scope.postId={};
        console.log("add");
    };
    $scope.remove=function(key){
        ProcessService.removeRelation(key).then(function(data){
            console.log("remove success");
        },function(){
            console.log("remove failed");
        });
    };
});
