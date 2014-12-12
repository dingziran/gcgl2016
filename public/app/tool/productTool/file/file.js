/**
 * Created by dingziran on 2014/11/14.
 */
var app=angular.module("gcgl2016.tool");
app.config(function($stateProvider) {
    $stateProvider
        .state('main.project.activity.file', {
            url: "/file/:productDataId",
            templateUrl: "app/tool/productTool/file/file.html",
            resolve:{
                productData:function($stateParams,productDataListRef){
                    return productDataListRef.$getRecord($stateParams.productDataId);
                }
            },
            controller: function ($scope,$stateParams,$state,f,FileUploader,
                                  productData,productDataListRef) {
                $scope.productData= f.copy(productData);
                $scope.uploader=new FileUploader({
                    url: 'upload'
                });
                $scope.upload=function(){
                    var item=$scope.uploader.queue[0];
                    item.upload();
                };
                $scope.remove=function(item){
                    $scope.productData.file=_.filter($scope.productData.file,function(f){
                        return item!=f;
                    });
                    productDataListRef.$save(_.extend(productData,$scope.productData)).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };

                $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
    //                console.info('onCompleteItem', fileItem, response, status, headers);
                    if(response&&response[0]){
                        fileItem.originalFilename=response[0].originalFilename;
                        fileItem.path=response[0].path.replace("public\\","");
                        fileItem.path=fileItem.path.replace("public/","");
                    }
                    if(!$scope.productData.file){
                        $scope.productData.file=[];
                    }

                    $scope.productData.file.push({path:fileItem.path,name:fileItem.originalFilename,date:new Date().toDateString()});
                    productDataListRef.$save(_.extend(productData,$scope.productData)).then(function(){
                        $state.transitionTo($state.current, $stateParams, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    });
                };
            },
            data: {
                displayName: 'Product'
            }
        });
});