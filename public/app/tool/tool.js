/**
 * Created by dingziran on 2014/11/3.
 */
var app=angular.module("gcgl2016.tool",[]);
app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('tool', {
            url: "/tool",
            templateUrl: "app/tool/tool.html",
            resolve:{
            },
            controller:function($scope){
            },
            data: {
                displayName: 'Tool'
            }
        })
        .state('tool.feature', {
            url: "/feature",
            templateUrl: "app/tool/featureTool.html",
            resolve:{
                featureListRef:function(FeatureService){
                    return FeatureService.getRefArray();
                },
                featureToolListRef:function(ToolService){
                    return ToolService.getRefArray("feature");
                }
            },
            controller:function($scope,$state,$stateParams,f,featureListRef,featureToolListRef){
                $scope.featureList= f.copy(featureListRef);
                _.each($scope.featureList,function(feature){
                    feature.tool=featureToolListRef.$getRecord(feature.tool);
                });
                $scope.featureToolList=f.copy(featureToolListRef);
                _.each($scope.featureToolList,function(tool){
                    tool.feature=featureListRef.$getRecord(tool.feature);
                });
                $scope.remove=function(item){
                    f.remove(featureToolListRef,item).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                }
            },
            data: {
                displayName: 'Feature Tool'
            }
        })
        .state('tool.feature.create', {
            url: "/create",
            templateUrl: "app/tool/createFeatureTool.html",
            resolve:{
                types:function(EnumService){
                    return EnumService.getProductTypes();
                }
            },
            controller:function($scope,$state,f,featureToolListRef,featureListRef,types){
                $scope.types=types;
                $scope.tool={};
                $scope.featureList= f.copy(featureListRef);
                $scope.addInput=function(item){
                    if(_.isUndefined(item.inputs)){
                        item.inputs=[];
                    }
                    item.inputs.push({});
                };
                $scope.removeInput=function(item){
                    $scope.tool.inputs= _.filter($scope.tool.inputs,function(input){
                        return !input===item;
                    });
                };
                $scope.addOutput=function(item){
                    if(_.isUndefined(item.outputs)){
                        item.outputs=[];
                    }
                    item.outputs.push({});
                };
                $scope.removeOutput=function(item){
                    $scope.tool.outputs= _.filter($scope.tool.outputs,function(output){
                        return !output===item;
                    });
                };
                $scope.add=function(item){
                    f.add(featureToolListRef,item).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Create Tool'
            }
        })
        .state('tool.feature.edit', {
            url: "/edit/:id",
            templateUrl: "app/tool/editFeatureTool.html",
            resolve:{
                types:function(EnumService){
                    return EnumService.getProductTypes();
                },
                tool:function($stateParams,featureToolListRef){
                    return featureToolListRef.$getRecord($stateParams.id);
                }
            },
            controller:function($scope,$state,f,ToolService,
                                featureToolListRef,featureListRef,types,tool){
                $scope.types=types;
                $scope.tool= f.copy(tool);
                $scope.featureList= f.copy(featureListRef);
                $scope.addInput=function(item){
                    if(_.isUndefined(item.inputs)){
                        item.inputs=[];
                    }
                    item.inputs.push({});
                };
                $scope.removeInput=function(item){
                    $scope.tool.inputs= _.filter($scope.tool.inputs,function(input){
                        return !input===item;
                    });
                };
                $scope.addOutput=function(item){
                    if(_.isUndefined(item.outputs)){
                        item.outputs=[];
                    }
                    item.outputs.push({});
                };
                $scope.removeOutput=function(item){
                    $scope.tool.outputs= _.filter($scope.tool.outputs,function(output){
                        return !output===item;
                    });
                };
                $scope.save=function(item){
                    ToolService.save(featureToolListRef,tool,item).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Edit Tool'
            }
        })
        .state('tool.product', {
            url: "/product",
            templateUrl: "app/tool/productTool.html",
            resolve:{
                productListRef:function(ProductService){
                    return ProductService.getRefArray();
                },
                productToolListRef:function(ToolService){
                    return ToolService.getRefArray("product");
                }
            },
            controller:function($scope,$state,$stateParams,f,productListRef,productToolListRef){
                $scope.productList= f.copy(productListRef);
                _.each($scope.productList,function(product){
                    product.tool=productToolListRef.$getRecord(product.tool);
                });
                $scope.productToolList= f.copy(productToolListRef);
                $scope.remove=function(template){
                    f.remove(productToolListRef,template).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
            },
            data: {
                displayName: 'Product Tool'
            }
        })
        .state('tool.product.create', {
            url: "/create",
            templateUrl: "app/tool/createProductTool.html",
            resolve:{
                types:function(EnumService){
                    return EnumService.getProductTypes();
                }
            },
            controller:function($scope,$state,f,types,productToolListRef){
                $scope.tool={};
                $scope.types= types;
                $scope.add=function(item){
                    f.add(productToolListRef,item).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Create Tool'
            }
        })
        .state('tool.product.edit', {
            url: "/edit/:id",
            templateUrl: "app/tool/editProductTool.html",
            resolve:{
                types:function(EnumService){
                    return EnumService.getProductTypes();
                },
                tool:function($stateParams,productToolListRef){
                    return productToolListRef.$getRecord($stateParams.id);
                }
            },
            controller:function($scope,$state,f,ToolService,
                                tool,types,productToolListRef){
                $scope.tool= f.copy(tool);
                $scope.types= types;
                $scope.save=function(item){
                    ToolService.save(productToolListRef,tool,item).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: 'Edit Tool'
            }
        });
});
app.factory('ToolService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(type){
            if(type==="feature"){
                return f.ref("/tool/feature").$asArray().$loaded();
            }
            if(type==="product"){
                return f.ref("/tool/product").$asArray().$loaded();
            }
        },
        save:function(refs,oldItem,newItem){
            if(_.isUndefined(refs)||!refs.hasOwnProperty('$save')){
                return;
            }
            _.extend(oldItem,newItem);
            oldItem.updateTimeStamp=new Date().toString();
            return refs.$save(oldItem);
        }
    };
    return service;
});
