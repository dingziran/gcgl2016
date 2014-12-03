/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.tool");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.conference', {
            url: "/conference/:featureId",
            templateUrl: "app/tool/featureTool/conference.html",
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
                $scope.conference={};
                if(activityData.conference){
                    $scope.conference=activityData.conference;
                }
                $scope.save=function(){
                    if(!activityData.conference){
                        activityData.conference={};
                    }
                    _.extend(activityData.conference,$scope.conference);
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
                        product.document+="<h1>"+$scope.conference.name+"</h1>";
                        product.document+="<h4>主持人</h4>"+"<p>"+$scope.conference.presider+"</p>";
                        product.document+="<h4>召开时间</h4>"+"<p>"+$scope.conference.date+"</p>";
                        product.document+="<h4>参与人员</h4>"+"<p>"+$scope.conference.people+"</p>";
                        product.document+="<h4>会议议题</h4>"+"<p>"+$scope.conference.topic+"</p>";
                        product.document+="<h2>会议内容</h2>"+$scope.conference.content;
                        product.document+="<h2>解决问题</h2>"+$scope.conference.question;
                        product.document+="<h2>最终结论</h2>"+$scope.conference.conclusion;
                        productDataListRef.$save(product).then(function(){
                            $state.go("^",{},{reload:true});
                        });

                    }
                }
            },
            data: {
                displayName: 'Conference'
            }
        });
});