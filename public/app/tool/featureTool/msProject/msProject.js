/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.tool");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.msProject', {
            url: "/msProject/:featureId",
            templateUrl: "app/tool/featureTool/msProject/msProject.html",
            resolve:{
                feature:function($stateParams,activityData){
                    return _.filter(activityData.features,function(feature){
                        return feature.featureId==$stateParams.featureId;
                    })[0];
                }
            },
            controller: function ($scope,$stateParams,f,
                                  activityData,feature) {
                $scope.activityData= f.copy(activityData);
                $scope.feature= f.copy(feature);
                $scope.download= function(){
                    function createTask(task,id){
                        var ret="";
                        ret+='<Task>';
                        ret+='<UID>'+id+'</UID>';
                        ret+='<ID>'+id+'</ID>';
                        ret+='<Name>'+task.name+'</Name>';
                        ret+='<Active>1</Active>'+
                        '<Manual>1</Manual>'+
                        '<Type>0</Type>'+
                        '<IsNull>0</IsNull>'+
                        '<WBS>1</WBS>'+
                        '<OutlineNumber>1</OutlineNumber>'+
                        '<OutlineLevel>1</OutlineLevel>'+
                        '<Priority>500</Priority>';
                        ret+='</Task>';
                        return ret;
                    }
                    var msproject=
                        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
                    '<Project xmlns="http://schemas.microsoft.com/project">'+
                            '<StartDate>2014-12-'+new Date().getDate()+'T08:00:00</StartDate>'+
                            '<FinishDate>2014-12-'+new Date().getDate()+'T17:00:00</FinishDate>'+
                    '<Tasks>'+
                    '    <Task>'+
                            '<UID>0</UID>'+
                            '<ID>0</ID>'+
                            '<Active>1</Active>'+
                            '<Manual>0</Manual>'+
                            '<Type>1</Type>'+
                    '    </Task>';
                    var task={name:'任务一'};
                    msproject+=createTask(task,1);
                    task.name='任务二';
                    msproject+=createTask(task,2);
                    task.name='任务三';
                    msproject+=createTask(task,3);
                    msproject+=
                    '</Tasks>'+
                    '</Project>';
                    var aFileParts = [];
                    aFileParts.push(msproject);
                    var blob = new Blob(aFileParts, { type: "application/octet-binary" }); // the blob
                    var url = URL.createObjectURL(blob);
                    window.location.href = url;
                };


            },
            data: {
                displayName: 'Feature'
            }
        });
});