/**
 * Created by Administrator on 2014/8/14.
 */
var app=angular.module("gcgl2016.tag",[]);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('tag',{
            url:"/tag",
            templateUrl:"app/tag/tag.html",
            resolve:{
                tagListRef:function(TagService){
                    return TagService.getRefArray();
                }
            },
            controller:function($scope,$state,$stateParams,f,tagListRef){
                $scope.tagList=tagListRef;
                $scope.remove=function(item){
                    f.remove(tagListRef,item).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };

            },
            data: {
                displayName: '管理标签'
            }
        })
        .state('tag.create', {
            url: "/create",
            templateUrl: "app/tag/createTag.html",
            resolve: {
            },
            controller: function ($scope,$state,f,TagService,tagListRef) {
                $scope.tag = {};
                $scope.create=function(){
                    f.add(tagListRef,$scope.tag).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: '新建标签'
            }
        })
        .state('tag.edit', {
            url: "/edit/:id",
            templateUrl: "app/tag/editTag.html",
            resolve: {
                tag:function(tagListRef,$stateParams){
                    return tagListRef.$getRecord($stateParams.id);
                }
            },
            controller: function ($scope,$state,f,tag,TagService,tagListRef) {
                $scope.tag = f.copy(tag);
                $scope.save=function(item){
                    TagService.save(tagListRef,tag,item).then(function(){
                        $state.go("^",{},{reload:true});
                    });
                };
            },
            data: {
                displayName: '修改标签'
            }
        })
        .state('tag.filter', {
            url: "/filter/:id",
            templateUrl: "app/tag/filterTag.html",
            resolve: {
                activityListRef:function(ActivityService){
                    return ActivityService.getRefArray();
                }
            },
            controller: function ($scope,$stateParams,activityListRef,f) {
//                $scope.tag = f.copy(tag);
                $scope.activityListRef = f.copy(activityListRef);
                $scope.activityFilter = _.filter($scope.activityListRef,function(item) {
                    return _.contains(item.tags, $stateParams.id);
                });
//                $scope.activityListFilter = activityListWithFull;
            },
            data: {
                displayName: 'Filter Tag'
            }
        });
});

app.factory('TagService', function(f,$q) {
    //Public Method
    var service = {
        getRefArray:function(){
            return f.ref("/tag").$asArray().$loaded();
        },
        save:function(refs,oldItem,newItem){
            if(_.isUndefined(refs)||!refs.hasOwnProperty('$save')){
                return;
            }
            var keys=[
                'name',
                'description'
            ];
            _.each(keys,function(key){
                if(_.isUndefined(newItem[key])){
                    oldItem[key]=null;
                }
                else{
                    oldItem[key]=newItem[key];
                }
            });
            return refs.$save(oldItem);
        }
    };
    return service;
});