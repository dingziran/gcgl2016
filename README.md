gcgl2016
========

##工具下载
使用git工具中的clone命令，或者直接点击github上的Download ZIP。

##工具部署
工具部署于nodejs之上，[从这里下载](http://nodejs.org/)

##工具运行
在工程目录下，第一次使用npm install安装相应库
以后每次使用npm start命令运行，之后在浏览器中打开localhost:3000

##工具使用技术
工具主要使用框架包括,从重要到次要
* [AngularJS](http://angularjs.org/)
* [Firebase](https://www.firebase.com/)
* [Bootstrap](http://getbootstrap.com/)
* [UnderscoreJS](http://underscorejs.org/)
* [UI-Router](https://github.com/angular-ui/ui-router/)
* [Kendo-ui](http://www.telerik.com/kendo-ui)

##开发入门
工具主体采用Angularjs框架，数据库使用Firebase，前端界面主要使用bootstrap。

学习AngularJS的最好的教材是ng-book，学习Firebase查看官方API文档即可，学习Bootstrap查看官方API文档。

本工具还使用了一些框架，包括UI-router是AngularJS的一个模块，查看官方文档学习使用方法。

underscorejs是一个javascript的函数库，方便进行一些函数运算。

kendoui, ng-bootstrap，nvd3等库是为了界面美观

##工具使用说明
工具的开发目的，所解决问题，以及使用方法，见论文

##下一步工作
###架构问题
* 使用Meteor代替nodejs和firebase
###部署问题
* 使用grunt进行自动化部署
* 使用Karma进行测试
###功能问题
* 集成更多项目管理子工具
* 增加用户管理
