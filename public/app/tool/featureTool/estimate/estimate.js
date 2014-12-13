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
                                  activityData,feature,activityDataListRef,productDataListRef,project) {
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
                };
                $scope.projectId={};
                $scope.open=function(){
                    window.open(activityData.address);
                };
                $scope.send=function(){

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
                    function ajax(){
                        $.ajax({
                            type: "POST",
                            url: $scope.activityData.address+$scope.activityData.sendAddress,
                            data:json,
                            dataType: "json",
                            error: function(error){
                                alert(error.status);
                                alert("数据连接错误！");

                            },
                            success: function(json){
                                $scope.projectId=json.Projectid;
                                alert("已发送，生成项目id:"+$scope.projectId);
                            }

                        });
                    }
                    ajax();

                };
                $scope.receive=function(){

                    function modify(data){
                        var keys= _.keys(data);
                        var pair={
                            "Projectname":"项目名称",
                            "devTime":"工期（月）",
                            "Sloc":"源代码行数",
                            "ProjDescription":"项目描述",
                            "effort":"工作量（人月）",
                            "people":"所需员工人数（人）",
                            "cost":"成本（元）",
                            "Manpermonth":"员工平均工资（元/月）",
                            "ProjectType":"估算模型",
                            "Status":"项目完成状态",
                            "Functionpoint":"功能点数",
                            "EndDate":"结束日期",
                            "StartDate":"开始日期",
                            "LanguageName":"编程语言",
                            "Projectid":"项目id",
                            "ProjectClientname":"客户名称"
                        };
                        var ret={};
                        _.each(pair,function(value,key){
                            if(data.hasOwnProperty(key)){
                                ret[value]=data[key];
                            }
                        });
                        return ret;
                    }
                    if(_.isEmpty($scope.projectId)){
                        $http.get($scope.activityData.address+$scope.activityData.receiveAddress).success(function(data){
                            $scope.data=data;
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
                                product.document+="<table>";
                                _.each(modify($scope.data),function(value,key){
                                    product.document+='<tr>';
                                    product.document+='<td>'+key+'</td>';
                                    product.document+='<td>'+value+'</td>';
                                    product.document+='</tr>';
                                });
                                product.document+="</table>";
                                productDataListRef.$save(product).then(function(){
                                    $state.go("^",{},{reload:true});
                                });

                            }
                        });
                    }
                    else{
                        $http.get($scope.activityData.address+$scope.activityData.receiveAddress+'\\'+$scope.projectId).success(function(data){
                            $scope.data=data;
                            modify(data);
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
                                product.document+="<table>";
                                console.log($scope.data);
                                _.each(modify($scope.data),function(value,key){
                                    product.document+='<tr>';
                                    product.document+='<td>'+key+'</td>';
                                    product.document+='<td>'+value+'</td>';
                                    product.document+='</tr>';
                                });
                                product.document+="</table>";
                                productDataListRef.$save(product).then(function(){
                                    $state.go("^",{},{reload:true});
                                });

                            }
                        });
                    }

                }
            },
            data: {
                displayName: 'Feature'
            }
        });
});