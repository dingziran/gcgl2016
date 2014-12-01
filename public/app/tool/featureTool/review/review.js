/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.template");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.review', {
            url: "/review/:featureId",
            templateUrl: "app/tool/featureTool/review/review.html",
            resolve:{
                feature:function($stateParams,activityData){
                    return _.filter(activityData.features,function(feature){
                        return feature.featureId==$stateParams.featureId;
                    })[0];
                }
            },
            controller: function ($scope,$stateParams,f,
                                  activityData,activityDataListRef,productDataListRef,feature) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                $scope.questions=[];
                if(!_.isEmpty(activityData.questions)){
                    $scope.questions= f.copy(activityData.questions);
                }
                $scope.delete=function(item){
                    activityData.questions=_.reject(activityData.questions,function(req){
                        return req.name==item.name;
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
                        _.each($scope.questions,function(item){
                            product.document+='<li>';
                            product.document+='<h2>'+item.name+'<h2>';
                            product.document+='<h3>需求来源： '+item.src+'<h3>';
                            product.document+='<p>'+item.description+'<p>';
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
        });
});