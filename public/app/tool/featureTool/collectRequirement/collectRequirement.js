/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.collectRequirement', {
            url: "/collectRequirement/:featureId",
            templateUrl: "app/tool/featureTool/collectRequirement/collectRequirement.html",
            resolve:{
                feature:function($stateParams,activityData){
                    return _.filter(activityData.features,function(feature){
                        return feature.featureId==$stateParams.featureId;
                    })[0];
                }
            },
            controller: function ($scope,$stateParams,$state,f,
                                  activityData,feature,activityDataListRef,productDataListRef) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                $scope.requirements=[];
                if(!_.isEmpty(activityData.requirements)){
                    $scope.requirements= f.copy(activityData.requirements);
                }
                $scope.delete=function(item){
                    activityData.requirements=_.reject(activityData.requirements,function(req){
                        return req.name==item.name&&req.src==item.src&&req.description==item.description;
                    });
                    activityDataListRef.$save(activityData).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
                $scope.output=function(){
                    var tool=feature.tool;
                    var outputs=tool.outputs;
                    //find the document output property
                    var document=null;
                    _.each(outputs,function(output){
                        if(output.property=="document"){
                            document=output;
                        }
                    });
                    if(!document){
                        return;
                    }
                    //output to document.product
                    var product=productDataListRef.$getRecord(document.product);
                    if(!_.isEmpty(product)){
                        product.document="";
                        product.document+="<ul>";
                        _.each($scope.requirements,function(req){
                            product.document+='<li>';
                            product.document+='<h2>'+req.name+'<h2>';
                            product.document+='<h3>需求来源： '+req.src+'<h3>';
                            product.document+='<p>'+req.description+'<p>';
                            product.document+='</li>';
                        });
                        product.document+="</ul>";
                        productDataListRef.$save(product).then(function(){
                            $state.go("^",{},{reload:true});
                        });

                    }
                }
            },
            data: {
                displayName: 'Feature'
            }
        })
        .state('main.project.activity.collectRequirement.create', {
            url: "/create",
            templateUrl: "app/tool/featureTool/collectRequirement/createCollectRequirement.html",
            resolve:{
            },
            controller: function ($scope,$stateParams,$state,f,
                                  activityData,feature,activityDataListRef) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                $scope.requirement={};
                $scope.create=function(){
                    if(!activityData.requirements){
                        activityData.requirements=[];
                    }
                    activityData.requirements.push($scope.requirement);
                    activityDataListRef.$save(activityData).then(function(){
                        $state.go("^",{},{reload:true});
                    })
                }
            },
            data: {
                displayName: 'Create'
            }
        })
        .state('main.project.activity.collectRequirement.edit', {
            url: "/edit/:index",
            templateUrl: "app/tool/featureTool/collectRequirement/editCollectRequirement.html",
            resolve:{
            },
            controller: function ($scope,$stateParams,$state,f,
                                  activityData,feature,activityDataListRef) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                $scope.requirement=activityData.requirements[$stateParams.index];
                $scope.save=function(){
                    activityDataListRef.$save(activityData).then(function(){
                        $state.go("^",{},{reload:true});
                    })
                }
            },
            data: {
                displayName: 'Edit'
            }
        });
});