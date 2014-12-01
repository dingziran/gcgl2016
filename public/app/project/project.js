/**
 * Created by Administrator on 14-5-1.
 */
var app=angular.module("gcgl2016.project",['gcgl2016.process','gcgl2016.product','gcgl2016.activity']);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('project', {
            url: "/project",
            templateUrl: "app/project/project.html",
            resolve:{
                projectListRef:function(ProjectService){
                    return ProjectService.getRefArray();
                }
            },
            controller:function($scope,$state,f,$stateParams,ProjectService,projectListRef){
                $scope.projectList= f.copy(projectListRef);
                $scope.sizeOfKeys=function(item){
                    return _.keys(item).length;
                };
                $scope.selectProcess=function(project){
                    $state.go('project.selectProcess',{projectId:project.$id});
                };
                $scope.remove=function(item){
                    f.remove(projectListRef,item).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.start=function(project){
                    $state.go("project.start",{projectId:project.$id});
                };

            },
            data: {
                displayName: 'Product'
            }
        })
        .state('project.start', {
            url: "/start/:projectId",
            templateUrl: "app/project/startProject.html",
            resolve:{
                project:function($stateParams,projectListRef){
                    return projectListRef.$getRecord($stateParams.projectId);
                },
                activityListRef:function(ActivityService){
                    return ActivityService.getRefArray();
                },
                exeActivityListRef:function($stateParams,ActivityService){
                    return ActivityService.getRefArrayExe($stateParams.projectId);
                },
                productListRef:function(ProductService){
                    return ProductService.getRefArray();
                },
                exeProductListRef:function($stateParams,ProductService){
                    return ProductService.getRefArrayExe($stateParams.projectId);
                },
                tagListRef:function(TagService){
                    return TagService.getRefArray();
                },
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                },
                activityTemplateListRef:function(TemplateService){
                    return TemplateService.getRefArray('activity');
                },
                productTemplateListRef:function(TemplateService){
                    return TemplateService.getRefArray('product');
                }
            },
            controller:function($scope,$state,f,ActivityService,ProductService,project,activityListRef,productListRef,featureListRef,
                                activityTemplateListRef,productTemplateListRef,projectListRef,exeActivityListRef,exeProductListRef){
                $scope.project=project;
                //products
                $scope.exeActivityListRef=exeActivityListRef;
                $scope.exeActivities={};
                $scope.exeProductListRef=exeProductListRef;
                $scope.exeProducts={};

                //activitiy extend
                $scope.exeActivities= f.extend(project.activities,activityListRef);
                //activity.templates get
                _.each($scope.exeActivities,function(activity){
                    activity.id=activity.$id;
                    activity.inputs= f.extend(activity.inputs,productListRef);
                    _.each(activity.inputs,function(item){
                        item.id=item.$id;
                        item.exeTemplate= f.extendSingle(item.template,productTemplateListRef);
                        if(!f.isNullOrUndefined(item.exeTemplate)){
                            item.exeTemplate.id=item.template;
                        }
                    });
                    activity.outputs= f.extend(activity.outputs,productListRef);
                    _.each(activity.outputs,function(item){
                        item.id=item.$id;
                        item.exeTemplate= f.extendSingle(item.template,productTemplateListRef);
                        if(!f.isNullOrUndefined(item.exeTemplate)){
                            item.exeTemplate.id=item.template;
                        }
                    });
                    activity.exeTemplates= f.extend(_.pluck(activity.fts,'template'),activityTemplateListRef);
                    _.each(activity.exeTemplates,function(item){
                        item.id=item.$id;
                    });
                });
//                //products extend
//                $scope.exeProducts= f.extend($scope.exeProducts,productListRef);
//                //product.templates get
//                _.each($scope.exeProducts,function(product){
//                    product.exeTemplate= f.extendSingle(product.template,productTemplateListRef);
//                });
                var result= f.compareArray($scope.exeActivityListRef,$scope.exeActivities,'id');
                $scope.newActivities=result.news;
                $scope.stayActivities=result.changes;
                _.each($scope.stayActivities,function(changes){
                    changes.inputChanges=getCompare(changes.oldItem,changes.newItem,"inputs")
                    changes.outputChanges=getCompare(changes.oldItem,changes.newItem,"outputs")
                    changes.templatesChanges=getCompare(changes.oldItem,changes.newItem,"exeTemplates")
                });
                $scope.delActivities=result.dels;
                $scope.relate=function(activity,property){
                    var old=$scope.exeActivityListRef.$getRecord(activity.$id);
                    if(old && old[property]===activity[property]){
                        return old[property];
                    }
                    else{
                        return null;
                    }
                };
                $scope.relateProduct=function(product,property){
                    var old=$scope.exeProductListRef.$getRecord(product.$id);
                    if(old && old[property]===product[property]){
                        return old[property];
                    }
                    else{
                        return null;
                    }
                };
                $scope.relateTemplate=function(product,property){
                    var old=$scope.exeProductListRef.$getRecord(product.$id);
                    if(old && old.exeTemplate.id===product.exeTemplate.id){
                        return old.exeTemplate.id;
                    }
                    else{
                        return null;
                    }
                };
                function getCompare(oldActivity,newActivity,property){
                    var oldProperty=oldActivity[property];
                    var newProperty=newActivity[property];
                    var result= f.compareArray(oldProperty,newProperty,'id');
                    return result;
                };

//                //products get
                var products= _.flatten(_.pluck($scope.exeActivities,"inputs").concat(_.pluck($scope.exeActivities,"outputs")));
                $scope.exeProducts= _.uniq(products,false,function(item){
                    return item.id;
                });

                var result2=f.compareArray($scope.exeProductListRef,$scope.exeProducts,'id');
                $scope.newProducts=result2.news;
                $scope.stayProducts=result2.changes;
                $scope.delProducts=result2.dels;


                $scope.start=function(){
                    //add
                    _.each($scope.newProducts,function(product){
                        f.add(exeProductListRef,product);
                    });
                    _.each($scope.newActivities,function(activity){
                        f.add(exeActivityListRef,activity);
                    });
                    //alter
                    _.each($scope.stayProducts,function(changes){
                        ProductService.save(exeProductListRef,changes.oldItem,changes.newItem);
                    });
                    _.each($scope.stayActivities,function(changes){
                        ActivityService.save(exeActivityListRef,changes.oldItem,changes.newItem);
                    });
                    //delete
                    _.each($scope.delProducts,function(product){
                        f.remove(exeProductListRef,product);
                    });
                    _.each($scope.delActivities,function(activity){
                        f.remove(exeActivityListRef,activity);
                    });

                    $state.go("main");
                };

            }
        })
        .state('project.create', {
            url: "/create",
            templateUrl: "app/project/createProject.html",
            controller:function($scope,$state,f,projectListRef){
                $scope.project={};
                $scope.create=function(project){
                    project.creationTimeStamp=new Date().toDateString();
                    f.add(projectListRef,project).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            }
        })
        .state('project.selectProcess',{
            url:"/selectProcess/:projectId",
            templateUrl:"app/project/selectProcess.html",
            resolve:{
                project:function($stateParams,projectListRef){
                    return projectListRef.$getRecord($stateParams.projectId);
                },
                activityListRef:function(ActivityService){
                    return ActivityService.getRefArray();
                },
                activityDataListRef:function(ActivityService,project){
                    return ActivityService.getActivityDataRef(project.$id);
                },
                productListRef:function(ProductService){
                    return ProductService.getRefArray();
                },
                productDataListRef:function(ProductService,project){
                    return ProductService.getProductDataRef(project.$id);
                },
                tagListRef:function(TagService){
                    return TagService.getRefArray();
                },
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                }
            },
            controller:function($scope,$state,$stateParams,project){
                $scope.project=project;
            },
            data: {
                displayName: 'Project Selecting and Tailoring'
            }
        })
        .state('project.selectProcess.chooseActivity', {
            url: "/chooseActivity",
            templateUrl: "app/project/chooseActivity.html",
            resolve: {
            },
            controller:function($scope,$state,$stateParams,$q,f,ActivityService,
                                project,activityListRef,activityDataListRef,productListRef,productDataListRef,tagListRef,featureListRef,projectListRef){
                $scope.activityList= f.copy(activityListRef);
                $scope.activityDataList= [];
                //prepare activities
                var selectedIds= _.pluck(activityDataListRef,"activityId");
                var productIds=[];
                _.each($scope.activityList,function(activity){
                    activity.tags= f.arrayToString(f.extend(activity.tags,tagListRef),'name');
                    if(_.contains(selectedIds,activity.$id)){
                        productIds=productIds.concat(activity.inputs,activity.outputs);
                        activity.select=true;
                        $scope.activityDataList.push(activity);
                    }
                });
                $scope.selectActivity=function(item){
                    $scope.activityDataList.push(item);
                    item.select=true;
                };
                $scope.unselectActivity=function(item){
                    $scope.activityDataList= _.without($scope.activityDataList,item);
                    item.select=false;
                };
                $scope.saveActivity=function(){
                    var activityDataActivityIds=_.pluck(activityDataListRef,"activityId");
                    var activityIds= _.pluck($scope.activityDataList,"$id");
                    var newIds= _.difference(activityIds,activityDataActivityIds);
                    var delIds=_.difference(activityDataActivityIds,activityIds);
                    var promises=[];
                    _.each(activityDataListRef,function(data){
                        if(_.contains(delIds,data.activityId)){
                            promises.push(f.remove(activityDataListRef,data));
                        }
                    });
                    _.each(newIds,function(id){
                        var act=activityListRef.$getRecord(id);
                        var item=ActivityService.createActivityData(act);
                        promises.push(f.add(activityDataListRef,item));
                    });
                    //
                    $q.all(promises).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Select Activity'
            }
        })
        .state('project.selectProcess.selectedActivity', {
            url: "/selectedActivity",
            templateUrl: "app/project/selectedActivity.html",
            resolve: {
            },
            controller:function($scope,$state,$stateParams,f,project,activityListRef,activityDataListRef,productListRef,productDataListRef,tagListRef,featureListRef,projectListRef){
                $scope.activityDataList= f.copy(activityDataListRef);
            },
            data: {
                displayName: 'Selected Activities'
            }
        })
        .state('project.selectProcess.selectedActivity.selectProduct', {
            url: "/selectProduct/:activityDataId",
            templateUrl: "app/project/selectProduct.html",
            resolve: {
                activityData:function($stateParams,activityDataListRef){
                    return activityDataListRef.$getRecord($stateParams.activityDataId);
                }
            },
            controller:function($scope,$state,$stateParams,f,ProductService,project,activityListRef,activityDataListRef,activityData,productListRef,productDataListRef){
                $scope.activityData= f.copy(activityData);
                $scope.activityDataList= f.copy(activityDataListRef);
                //算法：输入时activityData，让用户选择activityData是否采用其对应的activity的inputs和outputs，如果是，则将activityData.inputs指向其对应的activity的inputs对应的productData，如果此productData不存在，则新建productData

                //步骤1：获得activityData所对应的activity的inputs和outputs的product对象
                var activityId=activityData.activityId;
                var activity = activityListRef.$getRecord(activityId);
                var inputIds=activity.inputs;
                var outputIds=activity.outputs;
                var inputs = f.extend(inputIds,productListRef);
                var outputs = f.extend(outputIds,productListRef);

                //步骤2：确定这些product是否已选？确定方法：如果已选，则activityData.input的id是某个productData的id，且此productData指向的product，是次activity.inputs指向的product
                //如果是已选，则product.select=true
                _.each(inputs,function(input){
                    activityData.inputs&&activityData.inputs.forEach(function(dataInputId){
                        var dataInput=productDataListRef.$getRecord(dataInputId);
                        if(dataInput&&dataInput.productId==input.$id){
                            input.select=true;
                            input.productDataId=dataInput.$id;
                        }
                    });
                });
                _.each(outputs,function(output){
                    activityData.outputs && activityData.outputs.forEach(function(dataOutputId){
                        var dataOutput=productDataListRef.$getRecord(dataOutputId);
                        if(dataOutput&&dataOutput.productId==output.$id){
                            output.select=true;
                            output.productDataId=dataOutput.$id;
                        }
                    });
                });
                $scope.inputs=inputs;
                $scope.outputs=outputs;
                $scope.selectInput=function(item){
                    //步骤3：当选择某个product，首先检查数据库是否存在对应productData
                    var theProductData;
                    _.each(productDataListRef,function(productData){
                        if(productData.productId==item.$id){
                            theProductData=productData;
                        }
                    });
                    //步骤4：如果不存在，则先创建相应的productData，得到新创建的id
                    if(_.isEmpty(theProductData)){
                        f.add(productDataListRef,ProductService.createProductData(item)).then(function(ref){
                            var id=ref.name();
                            if(_.isEmpty(activityData.inputs)){
                                activityData.inputs=[];
                            }
                            activityData.inputs.push(id);
                            activityDataListRef.$save(activityData).then(function(){
                                $state.transitionTo($state.current, $stateParams, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                            });
                        });
                    }
                    else{
                        if(_.isEmpty(activityData.inputs)){
                            activityData.inputs=[];
                        }
                        activityData.inputs.push(theProductData.$id);
                        activityDataListRef.$save(activityData).then(function(){
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        });
                    }
                };
                $scope.selectOutput=function(item){
                    //步骤3：当选择某个product，首先检查数据库是否存在对应productData
                    var theProductData;
                    _.each(productDataListRef,function(productData){
                        if(productData.productId==item.$id){
                            theProductData=productData;
                        }
                    });
                    //步骤4：如果不存在，则先创建相应的productData，得到新创建的id
                    if(_.isEmpty(theProductData)){
                        f.add(productDataListRef,ProductService.createProductData(item)).then(function(ref){
                            var id=ref.name();
                            if(_.isEmpty(activityData.outputs)){
                                activityData.outputs=[];
                            }
                            activityData.outputs.push(id);
                            activityDataListRef.$save(activityData).then(function(){
                                $state.transitionTo($state.current, $stateParams, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                            });
                        });
                    }
                    else{
                        if(_.isEmpty(activityData.outputs)){
                            activityData.outputs=[];
                        }
                        activityData.outputs.push(theProductData.$id);
                        activityDataListRef.$save(activityData).then(function(){
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        });
                    }
                };
                $scope.unselectInput=function(item){
                    var refId=item.productDataId;
                    activityData.inputs= _.without(activityData.inputs,refId);
                    activityDataListRef.$save(activityData).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.unselectOutput=function(item){
                    var refId=item.productDataId;
                    activityData.outputs= _.without(activityData.outputs,refId);
                    activityDataListRef.$save(activityData).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
            },
            data: {
                displayName: 'Select Inputs and Outputs'
            }
        })
        .state('project.selectProcess.selectedActivity.selectFeature', {
            url: "/selectFeature/:activityDataId",
            templateUrl: "app/project/selectFeature.html",
            resolve: {
                activityData:function($stateParams,activityDataListRef){
                    return activityDataListRef.$getRecord($stateParams.activityDataId);
                }
            },
            controller:function($scope,$state,$stateParams,f,ProductService,project,activityListRef,activityDataListRef,activityData,featureListRef,productListRef,productDataListRef){
                $scope.activityData= activityData;
                //1.activity of activityData
                var activity= f.copy(activityListRef.$getRecord(activityData.activityId));
                //2.find all features of activity
                var features= f.extend(activity.features,featureListRef);
                //3.modify features
                features=_.filter(features,function(feature){
                    return !_.contains(_.pluck(activityData.features,"featureId"),feature.$id);
                });
                $scope.unSelectFeatures=features;
                $scope.select=function(feature){
                    var tmp={};
                    tmp.featureId=feature.$id;
                    tmp.name=feature.name;
                    tmp.description=feature.description;
                    $scope.unSelectFeatures= _.without($scope.unSelectFeatures,feature);
                    if(!$scope.activityData.features){
                        $scope.activityData.features=[];
                    }
                    $scope.activityData.features.push(tmp);
                    activityDataListRef.$save($scope.activityData).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.unselect=function(feature){
                    $scope.activityData.features=_.without($scope.activityData.features,feature);
                    activityDataListRef.$save($scope.activityData).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                }
            },
            data: {
                displayName: 'Select Feature'
            }
        })
        .state('project.selectProcess.selectedActivity.selectFeature.selectTool', {
            url: "/selectTool",
            templateUrl: "app/project/selectTool.html",
            resolve: {
            },
            controller:function($scope,$state,$stateParams,$modal,f,ProductService,project,activityListRef,activityDataListRef,activityData,featureListRef,productListRef,productDataListRef){
                $scope.activityData= activityData;
                if($scope.activityData&&$scope.activityData.features){
                    _.each($scope.activityData.features,function(feature){
                        if(feature.tool) {
                            _.each(feature.tool.inputs, function (input) {
                                input.product = productDataListRef.$getRecord(input.product);
                            });
                            _.each(feature.tool.outputs, function (output) {
                                output.product = productDataListRef.$getRecord(output.product);
                            });
                        }
                    })
                }

                $scope.state="selectTool";
                $scope.selectTool = function (feature) {

                    var modalInstance = $modal.open({
                        templateUrl: 'app/project/selectTool.tpls.html',
                        resolve: {
                            featureToolListRef:function(ToolService){
                                return ToolService.getRefArray("feature");
                            }
                        },
                        controller:function ($scope, $modalInstance,featureToolListRef) {
                            $scope.search="";
                            $scope.items = featureToolListRef;
                            $scope.selected={};

                            $scope.ok = function () {
                                $modalInstance.close($scope.selected);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.selected=item;
                            };
                        },
                        size:'lg'
                    });

                    modalInstance.result.then(function (selectedItem) {
                        feature.tool=selectedItem;
                        activityDataListRef.$save($scope.activityData).then(function(){
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        });
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
                $scope.selectInputProduct=function(feature,item){
                    //1.找到所有已有输入
                    var inputs= f.extend(activityData.inputs,productDataListRef);
                    //2.通过类型进行过滤
                    inputs=_.filter(inputs,function(input){
                        if(input.type==item.type){
                            return true;
                        }
                    });
                    var modalInstance = $modal.open({
                        templateUrl: 'app/project/selectProduct.tpls.html',
                        resolve: {
                        },
                        controller:function ($scope, $modalInstance) {
                            $scope.search="";
                            $scope.items = inputs;
                            $scope.selected={};

                            $scope.ok = function () {
                                $modalInstance.close($scope.selected);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.selected=item;
                            };
                        },
                        size:'lg'
                    });

                    modalInstance.result.then(function (selectedItem) {
                        item.product=selectedItem;
                        _.each(feature.tool.inputs, function (input) {
                            if(input.product){
                                input.product = input.product.$id;
                            }
                        });
                        _.each(feature.tool.outputs, function (output) {
                            if(output.product){
                                output.product = output.product.$id;
                            }
                        });
                        activityDataListRef.$save($scope.activityData).then(function(){
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        });
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
                $scope.selectOutputProduct=function(feature,item){
                    //1.找到所有已有输入
                    var outputs= f.extend(activityData.outputs,productDataListRef);
                    //2.通过类型进行过滤
                    outputs=_.filter(outputs,function(output){
                        if(output.type==item.type){
                            return true;
                        }
                    });
                    var modalInstance = $modal.open({
                        templateUrl: 'app/project/selectProduct.tpls.html',
                        resolve: {
                        },
                        controller:function ($scope, $modalInstance) {
                            $scope.search="";
                            $scope.items = outputs;
                            $scope.selected={};

                            $scope.ok = function () {
                                $modalInstance.close($scope.selected);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.selected=item;
                            };
                        },
                        size:'lg'
                    });

                    modalInstance.result.then(function (selectedItem) {
                        item.product=selectedItem;
                        _.each(feature.tool.inputs, function (input) {
                            if(input.product){
                                input.product = input.product.$id;
                            }
                        });
                        _.each(feature.tool.outputs, function (output) {
                            if(output.product){
                                output.product = output.product.$id;
                            }
                        });
                        activityDataListRef.$save($scope.activityData).then(function(){
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        });
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
            },
            data: {
                displayName: 'Select Feature Tool'
            }
        })
        .state('project.selectProcess.selectedProduct', {
            url: "/selectedProduct",
            templateUrl: "app/project/selectedProduct.html",
            resolve: {
            },
            controller:function($scope,$state,$stateParams,f,ProductService,
                project,activityListRef,activityDataListRef,productListRef,productDataListRef,tagListRef,featureListRef,projectListRef){
                $scope.productDataList= f.copy(productDataListRef);
                $scope.refresh=function(product){
                    console.log(product);
                    var theProduct=productDataListRef.$getRecord(product.$id);
                    console.log(theProduct);
//                    console.log(ProductService.createProductData(productListRef.$getRecord(theProduct.productId)));
                    _.extend(theProduct,ProductService.createProductData(productListRef.$getRecord(theProduct.productId)));
//                    console.log(theProduct);
                    theProduct.$id=product.$id;
                    productDataListRef.$save(theProduct).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                }
            },
            data: {
                displayName: 'Selected Product'
            }
        })
        .state('project.selectProcess.selectedProduct.selectTool', {
            url: "/select",
            templateUrl: "app/project/selectProductTool.html",
            resolve: {
            },
            controller:function($scope,$state,$stateParams,$modal,f,
                project,activityListRef,activityDataListRef,productListRef,productDataListRef,tagListRef,featureListRef,projectListRef){
                $scope.productDataList= productDataListRef;
                $scope.selectTool=function(product){
                    var modalInstance = $modal.open({
                        templateUrl: 'app/project/selectProduct.tpls.html',
                        resolve: {
                            productToolListRef:function(ToolService){
                                return ToolService.getRefArray("product");
                            }
                        },
                        controller:function ($scope, $modalInstance,productToolListRef) {
                            $scope.search="";
                            $scope.items = productToolListRef;
                            $scope.selected={};

                            $scope.ok = function () {
                                $modalInstance.close($scope.selected);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                            $scope.select=function(item){
                                $scope.selected=item;
                            };
                        },
                        size:'lg'
                    });

                    modalInstance.result.then(function (selectedItem) {
                        product.tool=selectedItem;
                        productDataListRef.$save(product).then(function(){
                            $state.transitionTo($state.current, $stateParams, {
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        });
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                };
            },
            data: {
                displayName: 'Select Product Tool'
            }
        })
        .state('project.edit', {
            url: "/edit/:id",
            views:{
                'main@':{
                    templateUrl: "project/editProject.html",
                    resolve:{
                        project:function(ProjectService,$stateParams){
                            return ProjectService.find($stateParams.id);
                        },
                        processes:function(ProcessService){
                            return ProcessService.list();
                        },
                        toSelectIds:function(ProjectService,ProcessService,project,processes){
//                            console.log("project");
//                            console.log(project);
                            var processIds=Object.keys(processes);
                            var has=function(id){
                                if(_.contains(project.selected,id)){
                                    return false;
                                }
                                return true;
                            };
                            var listAfterHas= _.filter(processIds,has);
                            //var selectId=_.filter(listAfterHas,isFollow);
                            console.log(listAfterHas);
                            return listAfterHas;
                        },
                        selectIds:function(project){
//                            console.log("project.selected");
//                            console.log(project.selected);
//                            console.log(project);
                            return angular.copy(project.selected);
                        }
                    },
                    controller:function($scope,$state,$stateParams,ProjectService,project,selectIds,toSelectIds,processes,f){
                        $scope.project=project;
//                        console.log("0:new projectCopy");
//                        console.log($scope.projectCopy);
                        $scope.myData2 =f.embedIdsArray(f.extend(toSelectIds,processes));
                        $scope.myData = f.embedIdsArray(f.extend(selectIds,processes));

//                        console.log($scope.myData2);
//                        console.log($scope.myData);

                        $scope.leftItems=[];
                        $scope.rightItems=[];
                        $scope.gridOptions = {
                            data: 'myData',
                            selectedItems:$scope.leftItems,
                            columnDefs: [{ field: 'name', displayName: 'Process Name'}]
                        };
                        $scope.gridOptions2 = {
                            data: 'myData2',
                            selectedItems:$scope.rightItems,
                            columnDefs: [{ field: 'name', displayName: 'Process Name'}]
                        };
                        $scope.select=function(){
                            console.log($scope.rightItems);
                            $scope.myData2= _.difference($scope.myData2,$scope.rightItems);
                            $scope.myData=$scope.myData.concat($scope.rightItems);
                            $scope.gridOptions2.selectAll(false);
                        };
                        $scope.unselect=function(){
                            $scope.myData= _.difference($scope.myData,$scope.leftItems);
                            $scope.myData2=$scope.myData2.concat($scope.leftItems);
                            $scope.gridOptions.selectAll(false);
                        };
                        $scope.save=function(){
                            $scope.project.selected=f.toIds($scope.myData);
                            ProjectService.update($stateParams.id,$scope.project);
                            $state.go("^",{},{reload:true});
                        };
                    }
                }
            }
        });
});
app.factory('ProjectService', function(f,ActivityService,ProductService) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref('/project').$asArray().$loaded();
        }
    };
    return service;
});



