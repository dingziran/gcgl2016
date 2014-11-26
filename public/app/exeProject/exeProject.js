var app=angular.module("gcgl2016.exeProject",['ui.router','gcgl2016.firebase','gcgl2016.project','ui.bootstrap','gcgl2016.template']);
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
                displayName: 'Home'
            }
        })
        .state('main.project',{
            url:"/:projectId",
            templateUrl:"app/exeProject/activityList.html",
            resolve:{
                activityDataListRef:function($stateParams,ActivityService){
                    return ActivityService.getActivityDataRef($stateParams.projectId);
                },

                productDataListRef:function($stateParams,ProductService){
                    return ProductService.getProductDataRef($stateParams.projectId);
                }
            },
            controller:function($scope,$state,$stateParams,f,activityDataListRef){
                $scope.activityDataList= f.copy(activityDataListRef);
            },
            data: {
                displayName: 'Project'
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
                displayName: 'Activity'
            }
        })
        .state('main.process',{
            url:"/process/:pId/:id",
            views:{
                'main@':{
                    templateUrl:"app/exeProject/processExe.html",
                    resolve:{
                        project:function(ExeProjectService,ProductDataService,ProcessDataService,$stateParams){
                            ProductDataService.setProject($stateParams.pId);
                            ProcessDataService.setProject($stateParams.pId);
                            return ExeProjectService.find($stateParams.pId);
                        },
                        process:function(ExeProjectService,$stateParams){
                            return ExeProjectService.getProcessData($stateParams.pId,$stateParams.id);
                        },
                        input:function(process,project,f){
                            return f.embedId(f.extendSingle(process.input,project.productData));
                        },
                        output:function(process,project,f){
//                            console.log('output:function(process,project){');
//                            console.log(process.output);
//                            console.log(project.productData);
                            return f.embedId(f.extendSingle(process.output,project.productData));
                        }
                    },
                    controller:function($stateParams,$state,$modal,$scope,process,input,output,ProductDataService,ProcessDataService){
                        console.log("input");
                        console.log(input);
                        console.log("output");
                        console.log(output);
                        $scope.process=process;
//                        $scope.process.path="template/processTemplate/description/description.html";
                        $scope.input=input;
                        $scope.output=output;
                        $scope.saveOutput=function(){
                            ProductDataService.find($scope.output.id).then(function(productDataContent){
                                productDataContent.fields=$scope.output.fields;
                                ProductDataService.update($scope.output.id,productDataContent).then(function(){

                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                });
                            });
                        };
                        $scope.saveInput=function(){
                            ProductDataService.find($scope.input.id).then(function(productDataContent){
                                productDataContent.fields=$scope.input.fields;
                                ProductDataService.update($scope.input.id,productDataContent).then(function(){

                                    $state.transitionTo($state.current, $stateParams, {
                                        reload: true,
                                        inherit: false,
                                        notify: true
                                    });
                                });
                            });
                        };
                        $scope.finish=function(){
                            ProcessDataService.finish($stateParams.id);
                            $state.go('^',{},{reload:"true"});
                        };
                        $scope.showInput=function(){
                            //$scope.input.path='template/productTemplate/document.html';
                            var modalInstance = $modal.open({
                                templateUrl:  $scope.input.path,
                                controller: 'ModalInputCtrl',
                                size: 'lg',
                                resolve: {
                                    input: function () {
                                        return $scope.input;
                                    }
                                }
                            });

                            modalInstance.result.then(function (output) {
                                $scope.output=input;
                                $scope.saveOutput();
                            }, function () {
                                console.log('Modal dismissed at: ' + new Date());
                            });
                        };
                        $scope.showOutput=function(){
                            var modalInstance = $modal.open({
                                templateUrl: $scope.output.path,
                                controller: 'ModalOutputCtrl',
                                size: 'lg',
                                resolve: {
                                    output: function () {
                                        return $scope.output;
                                    }
                                }
                            });

                            modalInstance.result.then(function (output) {
                                $scope.output=output;
                                $scope.saveOutput();
                            }, function () {
                                console.log('Modal dismissed at: ' + new Date());
                            });
                        };
                    }

                }
            }
        });
});
app.controller('ModalInputCtrl',function ($scope, $modalInstance, input) {
//    console.log("ModalInputCtrl input");
//    console.log(input);
    $scope.input = input;
    $scope.readonly=true;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.controller('ModalOutputCtrl',function ($scope, $modalInstance, output) {
//    console.log("ModalOutputCtrl output");
//    console.log(output);
    $scope.input = output;
    $scope.readonly=undefined;

    $scope.ok = function () {
        $modalInstance.close($scope.input);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
app.factory('ExeProjectService', function(f) {
    var baseUrl = "/project";
    var projectRef = f.ref(baseUrl);
    var list=projectRef.$asArray();
    var currentProjectId={};


    //Public Method
    var exeProjectService = {
        saveProductData:function(refs,oldRef,newData){
            oldRef.data=newData;
            return refs.$save(oldRef);
        },
        getBaseUrl:function(){
            return baseUrl;
        },
        create: function(project) {
            //This is an usual situation
            return exeProjectRef.$update(project);
        },
        remove: function(key){
            return exeProjectRef.$remove(key);
        },
        update: function(key,value){
            var obj={};
            obj[key]=value;
            return exeProjectRef.$update(obj);
        },
        find:function(key){
            var promise=exeProjectRefLoad.promise.then(function(){
//                console.log("exeProjectRef[key]");
//                console.log(f.copy(exeProjectRef[key]));
                return f.copy(exeProjectRef[key]);
            });
            return promise;
        },
        list: function(){
            return list.$loaded().then(function(){
                return list;
            });
        },
        getCurrentProjectId:function(){
            return currentProjectId;
        },
        setCurrentProjectId:function(id){
            console.log("id");
            console.log(id);
            currentProjectId=id;
        },
        getProcessData:function(pId,id){
            return exeProjectService.find(pId).then(function(project){
                var processData=project.processData;
                return processData[id];
            });
        },
        createProcessProjectData:function(pId){
            exeProjectService.find(pId).then(function(exeProjectContent){
//                console.log('############');
//                console.log(pId);
//                console.log(exeProjectContent);
                var processDataRef=exeProjectRef.$child(pId).$child("processData");
                var productDataRef=exeProjectRef.$child(pId).$child("productData");
                ProcessService.list().then(function(processes){
                    var selectProcesses=f.extend(exeProjectContent.selected,processes);
                    _.each(selectProcesses,function(process){
                        process[Object.keys(process)[0]].path='template/processTemplate/description/description.html';
                        processDataRef.$update(process);
                        var processContent=process[Object.keys(process)[0]];
                        ProductService.list().then(function(products){
                            ProcessService.withProduct(processContent,products,processes);
                            if(Object.keys(processContent.input).length==1){
                                if(processContent.inputType=="product"){
                                    processContent.input[Object.keys(processContent.input)[0]].path='template/productTemplate/document.html';
                                    productDataRef.$update(processContent.input);
                                }
                                if(processContent.inputType=="process"){
                                    processDataRef.$update(processContent.input);
                                }
                            }

                            if(Object.keys(processContent.output).length==1){
                                if(processContent.outputType=="product"){
                                    processContent.output[Object.keys(processContent.output)[0]].path='template/productTemplate/document.html';
                                    productDataRef.$update(processContent.output);
                                }
                                if(processContent.outputType=="process"){
                                    processDataRef.$update(processContent.output);
                                }
                            }
                        });
                    });
                });
            });

//            var promise=exeProjectRefLoad.promise.then(function(){
//                var processDataRef=exeProjectRef.$child(pId).$child("processData");
//                var productDataRef=exeProjectRef.$child(pId).$child("productData");
//                _.each(processIds,function(processId){
//                    ProcessService.find(processId).then(function(processContent){
//                        var process={};
//                        process[processId]=processContent;
//                        processDataRef.$update(process);
//                        if(!_.isUndefined(processContent.input)&&!(processContent.input=="")){
//                            if(processContent.inputType=="document"){}
//                        }
//                    })
//                })
//            });
//            return promise;
        },
        /**
         *
         * @param process
         * @param processList
         * @param productList
         */
        withInputOutputAndEmbed:function(processContent,productList,processList){
            if(_.isUndefined(processList)|| _.isUndefined(productList)){
                console.log("processes and products is undefine");
                return processContent;
            }
//            console.log(productList);
//            console.log(processList);
//            console.log('processContent ');
            processContent=angular.copy(processContent);
            if(processContent.inputType=="product"){
                processContent.input=f.embedId(f.extendSingle(processContent.input,productList));
            }
            else{
                processContent.input= f.embedId(f.extendSingle(processContent.input,processList));
            }
//            console.log('after input');
            if(processContent.outputType=="product"){
                processContent.output= f.embedId(f.extendSingle(processContent.output,productList));
            }
            else{
                processContent.output= f.embedId(f.extendSingle(processContent.output,processList));
            }
            return processContent;
        },
        test:function(){
            return "hello world";
        }
    };
    return exeProjectService;
});