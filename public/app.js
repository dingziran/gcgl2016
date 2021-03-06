var app=angular.module("gcgl2016",[
    'ui.router',
    'ui.bootstrap',
    'ui.tree',
    'firebase',
    'gcgl2016.directives',
    "gcgl2016.filters",
    'gcgl2016.directives.uiBreadcrumbs',
    'gcgl2016.firebase',
    'gcgl2016.util',
    'gcgl2016.exeProject',
    'gcgl2016.product',
    'gcgl2016.project',
    'gcgl2016.tool',
    'gcgl2016.activity',
    'gcgl2016.tag',
    'gcgl2016.feature',
    "gcgl2016.enum",
    'angularFileUpload',
    'kendo.directives',
    'ngSanitize'
]);
app.config(function($stateProvider, $urlRouterProvider,$httpProvider){
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/main");
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
app.controller('HomeController',function($scope,$location,$rootScope){

});