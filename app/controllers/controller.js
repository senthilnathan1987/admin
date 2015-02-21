app.run(function ($rootScope, $location, authService,$modal) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
    $rootScope.authenticated = false;
        
      authService.getSession().success(function(response){
       
                if (response.uid) {
                   
                    $rootScope.authenticated = true;
                    $rootScope.uid = response.uid;
                    $rootScope.name = response.name;
                    $rootScope.userID = response.userID;
                  
                } else {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {
                        
                         var modalInstance = $modal.open({
                            templateUrl: 'views/modelPopup/loginModal.html',
                            controller: 'loginModelInstanceCtrl',
                            backdrop: 'static',
                            size:"login",
                            windowClass:"loginModelClass"

                          });
  
                    } else {
                        $location.path("/login");
                    }
                }
        
          
      });
    });
});


/***********************************************************************************************************************************************/

//FACTORY [REMINDER]
app.factory('reminderService',['$http',function($http){
    var urlBase = 'http://localhost/admin/restserver/index.php/api/services';
    var reminderService={};
    /** Add account **/
    reminderService.addReminders=function(data){
         return $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: urlBase+'/addReminders/',
                        method: "POST",
                        data: $.param(data)
                  });
    }
    /** get all transcation of user **/
    reminderService.getReminders=function(id){
        return $http.get(urlBase+'/getReminders/id/'+id);
    }
    
    return reminderService;
}]);



app.controller('myremindersController',['$scope','$compile','uiCalendarConfig','reminderService', function($scope,$compile,uiCalendarConfig,reminderService){
    
     var id=sessionStorage.uid;
    
     var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
    };

     $scope.events = [];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        
       
        
         
     reminderService.getReminders(id).success(function(response){

         for(var i=0;i<response.length;i++){

                     var str=response[i].event_dueDate;
                    var date = new Date(str);
                    var mnth = ("0" + (date.getMonth()+1));
                    var day  = ("0" + date.getDate()).slice(-2)
                    var year =date.getFullYear();
   
             
             if(response[i].event_recurrence=="monthly"){


                 $scope.events.push({
                        title: response[i].event_title,
                        start: date,
                        className: ['openSesame'],
                        color: response[i].event_color,
                        id:response[i].id,
                        allDay : true 

                  })
                 
                 
                 
             }
             
          
             
         }
         
        
     });
    };

 
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        alert (date.id + ' was clicked ');
    };
    /* alert on Drop */
     $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
       $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
       $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    
  
    /* select event color */
    $scope.eventColor=function(colorCode){
            $scope.colorStyle=colorCode;
    }
    
    
        $scope.today = function() {
            $scope.dt = new Date();
          };
          $scope.today();

          $scope.clear = function () {
            $scope.dt = null;
          };
    
    
       $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };
    
        $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

    
    
    
    /* add custom event*/
    $scope.addEvent = function(event) {
        
     
        reminderService.addReminders(event).success(function(response){
             $scope.alerts = [
                { type: 'success', msg: 'Well done! You successfully added a reminder to your account' }
              ];
             $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
              };

        });
        
              $scope.events.push({
                title: event.event_title,
                start: event.event_date,
                className: ['openSesame'],
                color: event.colorCode
              });
    };
    
    
    
    
    
    
    
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };

   /* config object */
    $scope.uiConfig = {
      calendar:{
        height: "100%",
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'today prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
       
      }
    };
    
    
     $scope.changeLang = function() {
      if($scope.changeTo === 'Hungarian'){
        $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
        $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
        $scope.changeTo= 'English';
      } else {
        $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $scope.changeTo = 'Hungarian';
      }
    };
    
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];

}]);







app.controller('loginController',['$scope', '$modal','authService', function($scope,$modal,authService){

}]);



app.controller('logoutController',['$scope', '$modal','authService', function($scope,$modal,authService){
                         var modalInstance = $modal.open({
                            templateUrl: 'views/modelPopup/loginModal.html',
                            controller: 'loginModelInstanceCtrl',
                            backdrop: 'static',
                            size:"login",
                            windowClass:"loginModelClass"

                          }); 
}]);

//INSTANCE OF LOGIN MODEL POPUP
app.controller('loginModelInstanceCtrl', ['$scope','$rootScope','$modal','$modalInstance','$http','authService','$route','$location', function($scope,$rootScope,$modal,$modalInstance,$http,authService,$route,$location) {
                     $scope.signIn=function(user,isValid){
                            authService.login(user).error(function(error){
                                if(error.statusText=="fail"){
                                    var errorMsg= error.message;
                                    $scope.alerts = [{ type: 'danger',msg:errorMsg }];
                                    
                                }
                            }).then(function (results) {
                                if(results.statusText=="OK"){
                                     $location.path('dashboard');
                                     sessionStorage.uid=results.data[0].uid;
                                     $modalInstance.close();
                                }
                            });
                        }
                     
                         
                      $scope.register=function(){
                         var modalInstance = $modal.open({
                            templateUrl: 'views/modelPopup/registerModel.html',
                            controller: 'registerModelInstanceCtrl',
                            backdrop: 'static',
                            size:"login",
                            windowClass:"loginModelClass"

                          });
                          
                    $scope.alreadyMember=function(){
                        alert('asd');
                    }
     }
                     
                     
                   
}]);

app.controller('registerModelInstanceCtrl', ['$scope','$rootScope','$modal','$modalInstance','$http','authService','$route','$location', function($scope,$rootScope,$modal,$modalInstance,$http,authService,$route,$location) {
             $scope.alreadyMember=function(){
                          var modalInstance = $modal.open({
                            templateUrl: 'views/modelPopup/loginModal.html',
                            controller: 'loginModelInstanceCtrl',
                            backdrop: 'static',
                            size:"login",
                            windowClass:"loginModelClass"

                          }); 
                    }
             $scope.processSignup=function(data){
                authService.signup(data).success(function(response){
                    if(response.statusText=="success"){
                         var modalInstance = $modal.open({
                            templateUrl: 'views/modelPopup/loginModal.html',
                            controller: 'loginModelInstanceCtrl',
                            backdrop: 'static',
                            size:"login",
                            windowClass:"loginModelClass"

                          }); 
                    }
                    
                   
                    
                });
             }
}]);





//FACTORY [ACCOUNT]
app.factory('myAccountService',['$http',function($http){
    var urlBase = 'http://localhost/admin/restserver/index.php/api/services';
    var accountService={};
    /** Add account **/
    accountService.addAccount=function(data){
         return $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: urlBase+'/user_account/',
                        method: "POST",
                        data: $.param(data)
                  });
    }
    /** Delete account **/
     accountService.deleteAccount=function(id){
         return $http.delete(urlBase+'/account/id/'+id);
    }
    /** Get list of all account **/
    accountService.getAllAccounts=function(id){
         return $http.get(urlBase+'/user_accounts/id/'+id);
    }
    /** get a single account **/
    accountService.getAccount=function(id){
         return $http.get(urlBase+'/account_detail/id/'+id);
    }
    /** Update account **/
    accountService.updateAccount=function(id,data){
        return $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: urlBase+'/update_account/',
                        method: "PUT",
                        data: $.param(data)
                  });
    }
    
    return accountService;
}]);


//LIST ALL USER ACCOUNTS CONTROLLER
app.controller('myBankAccountController',['$scope','$location','$http','myAccountService','$rootScope',function($scope,$location,$http,myAccountService,$rootScope){
    $scope.pageTitle="My bank accounts";
    
 var id=sessionStorage.uid;
    myAccountService.getAllAccounts(id).success(function (data) {
               $scope.accountInfo = data;
              $scope.getTotal = function(){
                    var balanceTotal = 0;
                    for(var i = 0; i < $scope.accountInfo.length; i++){
                        var product = $scope.accountInfo[i].account_balance;

                        balanceTotal +=parseInt(product);
                    }
                    return (balanceTotal).toFixed();
                }
    });
}]);

//LIST ACCOUNTS CONTROLLER
app.controller('addAccountListingSection', ['$scope', '$modal', '$log','myAccountService','$route', function($scope, $modal, $log,myAccountService,$route) {
    
    /** Open add account modal popup **/
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/modelPopup/addAccountModel.html',
        controller: 'addAccountModelInstanceCtrl',
        size: size,
        
      });
    };
    
    /** Remove account **/
    $scope.removeAccount=function(id){
         myAccountService.deleteAccount(id).success(function (data) {
            $route.reload();
         });
    }
    
    /** Edit account model popup **/
     $scope.editAccount = function (id) {
      var modalInstance = $modal.open({
        templateUrl: 'views/modelPopup/updateAccountModel.html',
        controller: 'editAccountModelInstanceCtrl',
        size: "lg",
        resolve: {$targetId: function () {
            return id;
          }
          }
      });
    };  
}]);

//INSTANCE OF EDIT ACCOUNT MODEL POPUP
app.controller('editAccountModelInstanceCtrl', ['$scope', '$modalInstance','$http','myAccountService','$route','$targetId', function($scope, $modalInstance,$http,myAccountService,$route,$targetId) {
     myAccountService.getAccount($targetId).success(function (data) {
         $scope.account={};
         $scope.account = data[0];
    });
    
      $scope.modelHeader="Edit account";
      $scope.updateAccountBtn=function(id,data){
          myAccountService.updateAccount(id,data).success(function (data) {
                $route.reload();
                $modalInstance.close();
            });
      }
      $scope.cancel = function () {
             $modalInstance.dismiss('cancel');
        };
  }]);
//INSTANCE OF ADD ACCOUNT MODEL POPUP
app.controller('addAccountModelInstanceCtrl', ['$scope', '$modalInstance','$http','myAccountService','$route', function($scope, $modalInstance,$http,myAccountService,$route) {
      $scope.modelHeader="Add transcations";
        $scope.saveAccountBtn = function (account) {
          myAccountService.addAccount(angular.copy(account)).success(function(data){
             $route.reload();
              $modalInstance.close(); 
          });
        };
        $scope.cancel = function () {
             $modalInstance.dismiss('cancel');
        };
  }]);

/***********************************************************************************************************************************************/

//FACTORY [DASHBOARD]
app.factory('dashboardService',['$http',function($http){
    var urlBase = 'http://localhost/admin/restserver/index.php/api/services';
    var dashboardService={};
    /** Add account **/
    dashboardService.addTranscation=function(data){
         return $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: urlBase+'/addTranscation/',
                        method: "POST",
                        data: $.param(data)
                  });
    }
    /** get all transcation of user **/
    dashboardService.getTranscations=function(id){
        return $http.get(urlBase+'/account_transcations/id/'+id);
    }
    
    return dashboardService;
}]);


//DASHBOARD CONTROLLER
app.controller('dashboardController',['$scope','dashboardService','myAccountService','$rootScope',function($scope,dashboardService,myAccountService,$rootScope){

    var id=sessionStorage.uid;
    $scope.parseInt = parseInt;
    
    
    
    //TRANSCATION SERVICE
    dashboardService.getTranscations(id).success(function(response){
        
       $scope.transcationInfo=response;
        
               $scope.xAxisTickFormatFunction = function(){
                    return function(d){
                        return d3.time.format('%m/%d/%Y')(new Date(d));
                    }
                }
               $scope.xFunction = function(){
                    return function(d) {
                        return d.key;
                    };
                }
               $scope.yFunction = function(){
                    return function(d){
                        return d.y;
                    };
                }
                
               
                var expenseArray = [];
                var incomeArray = [];
                var expenseArray2 = [];
                var incomeArray2 = [];
                for(i=0;i<response.length;i++){
                     var tranType=response[i].transcation_tag;
                    var balance=parseInt(response[i].transcation_amount);
                    var date=response[i].transcation_date;
                    var sub_category=response[i].sub_category;
                    if(tranType=="expense"){
                        expenseArray.push( {"key": sub_category, "y": balance} );

                        expenseArray2.push([date,balance]);
                        
                    }
                     if(tranType=="income"){
                        incomeArray.push( {"key": sub_category, "y": balance} );
                        incomeArray2.push([date,balance]);
                    }
                    
                }   
              
              /*$scope.expenseChart = [{"key": "Series 1","values": expenseArray}];
              $scope.incomeChart = [{"key": "Series 2","values": incomeArray}];*/
        
        
             $scope.expenseChart =expenseArray ;
             $scope.incomeChart =incomeArray ;
        
        
        
          
             $scope.expenceIncome=[
          {
              "key": "Series 1",
              "values": [expenseArray2]
          }
   

     ];
        
      
        
        
        

       /** calculate expense total and print in dashboard **/
       var expenseTotal=0;  
       for(var i=0;i<response.length;i++){
           var tranType=response[i].transcation_tag;
          if(tranType=="expense"){
              var exTotal=response[i].transcation_amount;
              expenseTotal +=parseInt(exTotal);
          }  
       }
      $scope.expenseTotal= (expenseTotal).toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    
    /** calculate income total and print in dashboard **/
       var incomeTotal=0;
       for(var i=0;i<response.length;i++){
           var tranType=response[i].transcation_tag;
          if(tranType=="income"){
              var inTotal=response[i].transcation_amount;
              incomeTotal +=parseInt(inTotal);
          }  
       }
      $scope.incomeTotal= (incomeTotal).toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
      
        
    }).error(function(error){
      
        if(error){
             $scope.expenseTotal=0;
            $scope.incomeTotal=0;
        }
        
    });
    
    //ACCOUNT SERVICE
     myAccountService.getAllAccounts(id).success(function (data) {
                $scope.accountInfo = data;
               var getTotal = function(){
                var balanceTotal = 0;
                for(var i = 0; i < $scope.accountInfo.length; i++){
                        var product = $scope.accountInfo[i].account_balance;

                        balanceTotal +=parseInt(product);
                    }
                    return (balanceTotal).toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
               
               $scope.networth=getTotal().toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
           
         
     }).error(function(error){
      
        if(error){
           $scope.networth=0;
            if(!$scope.incomeTotal){
                 $scope.incomeTotal=0;
            }
             if(!$scope.expenseTotal){
                 $scope.expenseTotal=0;
             }
        }
        
    });;
    

}]);



//ADD TRANSCATION MODEL POPUP
app.controller('addTransactionModel', ['$scope', '$modal', '$log','dashboardService', function($scope, $modal, $log,dashboardService) {

    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/modelPopup/addTranscationModel.html',
        controller: 'addTransactionModelInstanceCtrl',
        size: size,
      });
    };  
}]);
//INSTANCE OF TRANSCATION MODEL POPUP
app.controller('addTransactionModelInstanceCtrl', ['$scope', '$modalInstance','dashboardService','$route','categoryService', function($scope, $modalInstance,dashboardService,$route,categoryService) {
    
        var id=sessionStorage.uid;
       $scope.modelHeader="Add transcations";
    
    
        categoryService.getCategory().success(function(response){
            $scope.categoryList=response;
        });
    
         $scope.today = function() {
            $scope.dt = new Date();
          };
          $scope.today();

          $scope.clear = function () {
            $scope.dt = null;
          };
    
    
       $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };
    
        $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

    /** Add transcation **/
    $scope.addTranscation=function(data){
        dashboardService.addTranscation(data).success(function(response){
             $route.reload();
              $modalInstance.close(); 
        });
    }
    
    $scope.selectCategoryAction=function(){
        var parentCategory=$scope.transcation.category;
        $scope.subCategoryBlock=true;
         categoryService.getSubCategory(parentCategory).success(function(response){
           $scope.subCategoryList=response;
        });
    }
    
    
    
    
 
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);




/***********************************************************************************************************************************************/

//FACTORY [CATEGORY]
app.factory('categoryService',['$http',function($http){
    var urlBase = 'http://localhost/admin/restserver/index.php/api/services';
    var categoryService={};
    /** Add category **/
/*    categoryService.addCategory=function(data){
      
        
         return $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: urlBase+'/addCategory/',
                        method: "POST",
                        data: $.param(data)
                  });
    }*/
    
    /** get all categorys of user **/
    categoryService.getCategory=function(){
        return $http.get(urlBase+'/getCategory/');
    }
    categoryService.getSubCategory=function(parentCategory){
        return $http.get(urlBase+'/getSubCategory/cat/'+parentCategory);
        
    }
   
    
    return categoryService;
}]);

/*

//CATEGORY MANAGMENT CONTROLLER
app.controller('categoryController',['$scope','categoryService','$rootScope',function($scope,categoryService,$rootScope){
   var id=sessionStorage.uid;
  
    
    categoryService.getCategory(id).success(function(response){
        $scope.category=response;   
    });
    
    $scope.categorySelect=function(){
      
        if($scope.catg.category=="addNewCategory"){
            $('#addCategory').show();
        }else{
             $('#addCategory').hide();
        }
    }
    
    
   
   
    $scope.addCategory=function(data){
    
        console.log(data);
        categoryService.addCategory(data).success(function(response){
              categoryService.getCategory(id).success(function(response){
                   
                    $scope.catg={};
                   $('#addCategory').hide();
                   $scope.category=response;
                });
        });
        
    }
}]);
*/





/***********************************************************************************************************************************************/

//FACTORY [CREDIT CARD]
app.factory('creditCardService',['$http',function($http){
    var urlBase = 'http://localhost/admin/restserver/index.php/api/services';
    var creditCardService={};
    /** Add account **/
    creditCardService.addCreditCards=function(data){
         return $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: urlBase+'/addCreditCards/',
                        method: "POST",
                        data: $.param(data)
                  });
    }
    /** get all transcation of user **/
    creditCardService.getCreditCards=function(id){
        return $http.get(urlBase+'/getCreditCards/id/'+id);
    }
    
    return creditCardService;
}]);






app.controller('myCreditCardsController',['$scope','$location','creditCardService',function($scope,$location,creditCardService){
    $scope.isCollapsed = true;
    $scope.pageTitle="My Credit Cards";
     var id=sessionStorage.uid;
    
    
    creditCardService.getCreditCards(id).success(function(response){
       var jsonObj=[];
        
        for(var i=0;i<response.length;i++){
               
            
                jsonObj.push({"account_name":response[i].account_name,
                              "account_type":response[i].account_type,
                              "account_number":response[i].account_number,
                              "outstanding_balance":response[i].outstanding_balance,
                              "interest":response[i].interest,
                              "credit_limit":response[i].credit_limit
                              
                             });
        }
        
        $scope.cardInfo=(jsonObj);

        $scope.saveCreditCard=function(data){
                     $scope.isCollapsed = true;

                     jsonObj.push({
                        "account_name":data.cardaccountname,
                        "account_type":data.cardaccounttype,
                        "account_number":data.cardaccountnumber,
                        "outstanding_balance":data.cardaccountbalance,
                        "interest":data.cardaccountintrest,
                        "credit_limit":data.cardcreditlimit
                       });
            
             creditCardService.addCreditCards(data).success(function(response){
                 console.log(response);
             });
             
        }
    });
    

      $scope.removeCard=function(id){
        var index = -1;		
		var comArr = eval( $scope.cardInfo );
        for( var i = 0; i < comArr.length; i++ ) {
			if( comArr[i].id === id ) {
				index = i;
				break;
			}
		}
        $scope.cardInfo.splice( index, 1 );

    }
       
}]);


/***********************************************************************************************************************************************/

//FACTORY [LOANS]
app.factory('loansService',['$http',function($http){
    var urlBase = 'http://localhost/admin/restserver/index.php/api/services';
    var loansService={};
    /** Add account **/
    loansService.addLoans=function(data){
         return $http({
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: urlBase+'/addLoans/',
                        method: "POST",
                        data: $.param(data)
                  });
    }
    /** get all transcation of user **/
    loansService.getloans=function(id){
        return $http.get(urlBase+'/getLoans/id/'+id);
    }
    
    return loansService;
}]);


app.controller('myloansController',['$scope','$location','loansService',function($scope,$location,loansService){
    $scope.isCollapsed = true;
    $scope.pageTitle="My Loans";
     var id=sessionStorage.uid;
    
      $scope.today = function() {
            $scope.dt = new Date();
          };
          $scope.today();

          $scope.clear = function () {
            $scope.dt = null;
          };
    
    
       $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };
    
        $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
    
    $LoanjsonObj=[];
    loansService.getloans(id).success(function(response){
      
         for(var i=0;i<response.length;i++){
               
            
                $LoanjsonObj.push({
                                "id":response[i].id,
                               "bank_name":response[i].bank_name,
                                "loan_number":response[i].loan_number,
                                "loan_type":response[i].loan_type,
                                "opening_balance":response[i].opening_balance,
                                "interest":response[i].interest,
                                "loan_start_date":response[i].loan_start_date,
                                "loan_tenure":response[i].loan_tenure,
                                "payment_due_day":response[i].payment_due_day
                              
                             });
        }

       $scope.loansInfo=($LoanjsonObj);
    
    });
    
    
        $scope.saveLoan=function(data){
                     $scope.isCollapsed = true;
                    
                     $LoanjsonObj.push({
                        "bank_name":data.bankName,
                        "loan_number":data.loanaccountnumber,
                        "loan_type":data.loantype,
                        "opening_balance":data.openingbalance,
                        "interest":data.loanintrest,
                        "loan_start_date":data.loansatrtdate,
                        "loan_tenure":data.loanstenure,
                        "payment_due_day":data.loanduedate
                        
                       });
              $scope.loansInfo=($LoanjsonObj);
                    loansService.addLoans(data).success(function(response){
                        
                     });
            
        }
             

}]);



/***********************************************************************************************************************************************/
app.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});



//FACTORY [LOANS DETAILS]
app.factory('loanDetailService',['$http',function($http){
    var urlBase = 'http://localhost/admin/restserver/index.php/api/services';
    var loanDetailService={};

    /** get all transcation of user **/
    loanDetailService.getloan=function(id){
        return $http.get(urlBase+'/getLoan/id/'+id);
    }
    
    return loanDetailService;
}]);


app.controller('myloansDetailsController',['$scope','$http','$routeParams','$location','loanDetailService',function($scope,$http, $routeParams,$location,loanDetailService){
    var loanId = $routeParams.loanId;
    
    loanDetailService.getloan(loanId).success(function(response){
        
        $scope.loanInfo=response;
        
        console.log($scope.loanInfo);
        var loanAmount = response[0].opening_balance;
        var numberOfYears =response[0].loan_tenure;
        var numberOfMonths =numberOfYears*12;
        var rateOfInterest = response[0].interest;
        var monthlyInterestRatio = (rateOfInterest/12)/100;
        var loanStartDate= response[0].loan_start_date;
        
                var top = Math.pow((1+monthlyInterestRatio),numberOfMonths);
				var bottom = top-1;
				var sp = top / bottom;
				var emi = (loanAmount * monthlyInterestRatio) * sp;
    
				var full = numberOfMonths * emi;
				var interest = full - loanAmount;
				var int_pge =  (interest / full) * 100;
                var emi_str = emi.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                var loanAmount_str = loanAmount.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var full_str = full.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				var int_str = interest.toFixed(2).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                var int_prec = int_pge.toFixed(2)+"%";

       
                 $scope.emi=emi_str;
                 $scope.totalIntrest=int_str;
                 $scope.payableAmt=full_str;
                 $scope.intrestPrecent=int_prec;
                 $scope.tenure=numberOfMonths;
                 $scope.roi=rateOfInterest;
        
               
        
                $scope.itemsPerPage = 10;
                $scope.currentPage = 0;
                $loanCal=[];
                var bb=parseInt(loanAmount);
        
             
        
                var date = new Date(loanStartDate);
                var mnth = (date.getMonth())-1;
                var year =date.getFullYear();
                var monthNames = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];
                 var Currentdate = new Date();
                var currentyear=Currentdate.getFullYear();
                var currentmonth=Currentdate.getMonth()+1;
                 var status="paid"
       
                for(var i=1;i<=numberOfMonths;i++){
                    int_dd = bb * ((rateOfInterest/100)/12);
                    pre_dd = emi.toFixed(2) - int_dd.toFixed(2);
                    end_dd = bb - pre_dd.toFixed(2);
                    
                    mnth=mnth+1;
                     console.log(currentmonth+"--"+ mnth + "and"+currentyear+"---"+year);
                    
                    if(currentmonth==mnth && currentyear==year){
                        var status="pending"
                    }
                    
                    if(mnth>11){
                        
                        
                        mnth=0;
                        year=year+1;
                        
                    }
                    

                    
                    $loanCal.push({
                                    "paymentNo":i,
                                    "openingBalance":bb.toFixed(2),
                                    "emi":emi.toFixed(2),
                                    "principle":pre_dd.toFixed(2),
                                    "intrest":int_dd.toFixed(2),
                                    "endingBal":end_dd.toFixed(2),
                                    "paymentMonth":monthNames[mnth]+" "+year,
                                    "loanstatus":status
                                    
                                    
                    
                    });
                    bb = bb - pre_dd.toFixed(2);
                }
        
        
       console.log($loanCal);
        
        
         $scope.range = function() {
            var rangeSize = 5;
            var ret = [];
            var start;

            start = $scope.currentPage;
            if ( start > $scope.pageCount()-rangeSize ) {
              start = $scope.pageCount()-rangeSize+1;
            }

            for (var i=start; i<start+rangeSize; i++) {
              ret.push(i);
            }
            return ret;
          };
        
        $scope.prevPage = function() {
            if ($scope.currentPage > 0) {
              $scope.currentPage--;
            }
          };
        
         $scope.prevPageDisabled = function() {
             
            
            return $scope.currentPage === 0 ? "disabled" : "";
          };

          $scope.pageCount = function() {
            return Math.ceil($scope.loanDetails.length/$scope.itemsPerPage)-1;
          };

          $scope.nextPage = function() {
            if ($scope.currentPage < $scope.pageCount()) {
              $scope.currentPage++;
            }
          };

          $scope.nextPageDisabled = function() {
            return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
          };
        
         $scope.setPage = function(n) {
            $scope.currentPage = n;
          };

        
        $scope.loanDetails=$loanCal;
        
        
        
        
        
            $scope.loanChart = [
                                { key: "Loan", y: eval(loanAmount) },
                                 { key: "Intrest", y: eval(interest.toFixed(2)) },
                                
                             ];

                            $scope.xFunction = function(){
                            return function(d) {
                                return d.key;
                            };
                        }

                            $scope.yFunction = function(){
                            return function(d){
                                return d.y;
                            };
                        }
        
        
    })
    
    
}]);




















app.controller('TabsDemoCtrl', function ($scope, $window) {
  $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      $window.alert('You\'ve selected the alert tab!');
    });
  };
});














app.controller('FlotChartDemoCtrl', ['$scope', function($scope) {
    
    $scope.bulletData =  {
         "title": "Revenue",
         "subtitle": "US$, in thousands",
         "ranges": [150, 225, 300],
         "measures": [220],
        "markers": [250]
    };
    
    
    
    $scope.pieData = [
     	{ key: "One", y: 5 },
         { key: "Two", y: 2 },
         { key: "Three", y: 9 },
         { key: "Four", y: 7 },
         { key: "Five", y: 4 },
         { key: "Six", y: 3 },
         { key: "Seven", y: 9 }
     ];
    
    $scope.xFunction = function(){
    return function(d) {
        return d.key;
    };
}
    
    $scope.yFunction = function(){
	return function(d){
		return d.y;
	};
}
    
    
   $scope.exampleData = [
         {
             "key": "Series 1",
              "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] , [ 1059624000000 , 11.341210982529] , [ 1062302400000 , 14.734820409020] , [ 1064894400000 , 12.387148007542] , [ 1067576400000 , 18.436471461827] , [ 1070168400000 , 19.830742266977] , [ 1072846800000 , 22.643205829887] , [ 1075525200000 , 26.743156781239] , [ 1078030800000 , 29.597478802228] , [ 1080709200000 , 30.831697585341] , [ 1083297600000 , 28.054068024708] , [ 1085976000000 , 29.294079423832] , [ 1088568000000 , 30.269264061274] , [ 1091246400000 , 24.934526898906] , [ 1093924800000 , 24.265982759406] , [ 1096516800000 , 27.217794897473] , [ 1099195200000 , 30.802601992077] , [ 1101790800000 , 36.331003758254] , [ 1104469200000 , 43.142498700060] , [ 1107147600000 , 40.558263931958] , [ 1109566800000 , 42.543622385800] , [ 1112245200000 , 41.683584710331] , [ 1114833600000 , 36.375367302328] , [ 1117512000000 , 40.719688980730] , [ 1120104000000 , 43.897963036919] , [ 1122782400000 , 49.797033975368] , [ 1125460800000 , 47.085993935989] , [ 1128052800000 , 46.601972859745] , [ 1130734800000 , 41.567784572762] , [ 1133326800000 , 47.296923737245] , [ 1136005200000 , 47.642969612080] , [ 1138683600000 , 50.781515820954] , [ 1141102800000 , 52.600229204305] , [ 1143781200000 , 55.599684490628] , [ 1146369600000 , 57.920388436633] , [ 1149048000000 , 53.503593218971] , [ 1151640000000 , 53.522973979964] , [ 1154318400000 , 49.846822298548] , [ 1156996800000 , 54.721341614650] , [ 1159588800000 , 58.186236223191] , [ 1162270800000 , 63.908065540997] , [ 1164862800000 , 69.767285129367] , [ 1167541200000 , 72.534013373592] , [ 1170219600000 , 77.991819436573] , [ 1172638800000 , 78.143584404990] , [ 1175313600000 , 83.702398665233] , [ 1177905600000 , 91.140859312418] , [ 1180584000000 , 98.590960607028] , [ 1183176000000 , 96.245634754228] , [ 1185854400000 , 92.326364432615] , [ 1188532800000 , 97.068765332230] , [ 1191124800000 , 105.81025556260] , [ 1193803200000 , 114.38348777791] , [ 1196398800000 , 103.59604949810] , [ 1199077200000 , 101.72488429307] , [ 1201755600000 , 89.840147735028] , [ 1204261200000 , 86.963597532664] , [ 1206936000000 , 84.075505208491] , [ 1209528000000 , 93.170105645831] , [ 1212206400000 , 103.62838083121] , [ 1214798400000 , 87.458241365091] , [ 1217476800000 , 85.808374141319] , [ 1220155200000 , 93.158054469193] , [ 1222747200000 , 65.973252382360] , [ 1225425600000 , 44.580686638224] , [ 1228021200000 , 36.418977140128] , [ 1230699600000 , 38.727678144761] , [ 1233378000000 , 36.692674173387] , [ 1235797200000 , 30.033022809480] , [ 1238472000000 , 36.707532162718] , [ 1241064000000 , 52.191457688389] , [ 1243742400000 , 56.357883979735] , [ 1246334400000 , 57.629002180305] , [ 1249012800000 , 66.650985790166] , [ 1251691200000 , 70.839243432186] , [ 1254283200000 , 78.731998491499] , [ 1256961600000 , 72.375528540349] , [ 1259557200000 , 81.738387881630] , [ 1262235600000 , 87.539792394232] , [ 1264914000000 , 84.320762662273] , [ 1267333200000 , 90.621278391889] , [ 1270008000000 , 102.47144881651] , [ 1272600000000 , 102.79320353429] , [ 1275278400000 , 90.529736050479] , [ 1277870400000 , 76.580859994531] , [ 1280548800000 , 86.548979376972] , [ 1283227200000 , 81.879653334089] , [ 1285819200000 , 101.72550015956] , [ 1288497600000 , 107.97964852260] , [ 1291093200000 , 106.16240630785] , [ 1293771600000 , 114.84268599533] , [ 1296450000000 , 121.60793322282] , [ 1298869200000 , 133.41437346605] , [ 1301544000000 , 125.46646042904] , [ 1304136000000 , 129.76784954301] , [ 1306814400000 , 128.15798861044] , [ 1309406400000 , 121.92388706072] , [ 1312084800000 , 116.70036100870] , [ 1314763200000 , 88.367701837033] , [ 1317355200000 , 59.159665765725] , [ 1320033600000 , 79.793568139753] , [ 1322629200000 , 75.903834028417] , [ 1325307600000 , 72.704218209157] , [ 1327986000000 , 84.936990804097] , [ 1330491600000 , 93.388148670744]]
          },
          {
              "key": "Series 2",
              "values": [ [ 1025409600000 , 0] , [ 1028088000000 , 0] , [ 1030766400000 , 0] , [ 1033358400000 , 0] , [ 1036040400000 , 0] , [ 1038632400000 , 0] , [ 1041310800000 , 0] , [ 1043989200000 , 0] , [ 1046408400000 , 0] , [ 1049086800000 , 0] , [ 1051675200000 , 0] , [ 1054353600000 , 0] , [ 1056945600000 , 0] , [ 1059624000000 , 0] , [ 1062302400000 , 0] , [ 1064894400000 , 0] , [ 1067576400000 , 0] , [ 1070168400000 , 0] , [ 1072846800000 , 0] , [ 1075525200000 , -0.049184266875945] , [ 1078030800000 , -0.10757569491991] , [ 1080709200000 , -0.075601531307242] , [ 1083297600000 , -0.061245277988149] , [ 1085976000000 , -0.068227316401169] , [ 1088568000000 , -0.11242758058502] , [ 1091246400000 , -0.074848439408270] , [ 1093924800000 , -0.11465623676497] , [ 1096516800000 , -0.24370633342416] , [ 1099195200000 , -0.21523268478893] , [ 1101790800000 , -0.37859370911822] , [ 1104469200000 , -0.41932884345151] , [ 1107147600000 , -0.45393735984802] , [ 1109566800000 , -0.50868179522598] , [ 1112245200000 , -0.48164396881207] , [ 1114833600000 , -0.41605962887194] , [ 1117512000000 , -0.48490348490240] , [ 1120104000000 , -0.55071036101311] , [ 1122782400000 , -0.67489170505394] , [ 1125460800000 , -0.74978070939342] , [ 1128052800000 , -0.86395050745343] , [ 1130734800000 , -0.78524898506764] , [ 1133326800000 , -0.99800440950854] , [ 1136005200000 , -1.1177951153878] , [ 1138683600000 , -1.4119975432964] , [ 1141102800000 , -1.2409959736465] , [ 1143781200000 , -1.3088936375431] , [ 1146369600000 , -1.5495785469683] , [ 1149048000000 , -1.1563414981293] , [ 1151640000000 , -0.87192471725994] , [ 1154318400000 , -0.84073995183442] , [ 1156996800000 , -0.88761892867370] , [ 1159588800000 , -0.81748513917485] , [ 1162270800000 , -1.2874081041274] , [ 1164862800000 , -1.9234702981339] , [ 1167541200000 , -1.8377768147648] , [ 1170219600000 , -2.7107654031830] , [ 1172638800000 , -2.6493268125418] , [ 1175313600000 , -3.0814553134551] , [ 1177905600000 , -3.8509837783574] , [ 1180584000000 , -5.2919167850718] , [ 1183176000000 , -5.2297750650773] , [ 1185854400000 , -3.9335668501451] , [ 1188532800000 , -2.3695525190114] , [ 1191124800000 , -2.3084243151854] , [ 1193803200000 , -3.0753680726738] , [ 1196398800000 , -2.2346609938962] , [ 1199077200000 , -3.0598810361615] , [ 1201755600000 , -1.8410154270386] , [ 1204261200000 , -1.6479442038620] , [ 1206936000000 , -1.9293858622780] , [ 1209528000000 , -3.0769590460943] , [ 1212206400000 , -4.2423933501421] , [ 1214798400000 , -2.6951491617768] , [ 1217476800000 , -2.8981825939957] , [ 1220155200000 , -2.9662727940324] , [ 1222747200000 , 0.21556750497498] , [ 1225425600000 , 2.6784995167088] , [ 1228021200000 , 4.1296711248958] , [ 1230699600000 , 3.7311068218734] , [ 1233378000000 , 4.7695330866954] , [ 1235797200000 , 5.1919133040990] , [ 1238472000000 , 4.1025856045660] , [ 1241064000000 , 2.8498939666225] , [ 1243742400000 , 2.8106017222851] , [ 1246334400000 , 2.8456526669963] , [ 1249012800000 , 0.65563070754298] , [ 1251691200000 , -0.30022343874633] , [ 1254283200000 , -1.1600358228964] , [ 1256961600000 , -0.26674408835052] , [ 1259557200000 , -1.4693389757812] , [ 1262235600000 , -2.7855421590594] , [ 1264914000000 , -1.2668244065703] , [ 1267333200000 , -2.5537804115548] , [ 1270008000000 , -4.9144552474502] , [ 1272600000000 , -6.0484408234831] , [ 1275278400000 , -3.3834349033750] , [ 1277870400000 , -0.46752826932523] , [ 1280548800000 , -1.8030186027963] , [ 1283227200000 , -0.99623230097881] , [ 1285819200000 , -3.3475370235594] , [ 1288497600000 , -3.8187026520342] , [ 1291093200000 , -4.2354146250353] , [ 1293771600000 , -5.6795404292885] , [ 1296450000000 , -6.2928665328172] , [ 1298869200000 , -6.8549277434419] , [ 1301544000000 , -6.9925308360918] , [ 1304136000000 , -8.3216548655839] , [ 1306814400000 , -7.7682867271435] , [ 1309406400000 , -6.9244213301058] , [ 1312084800000 , -5.7407624451404] , [ 1314763200000 , -2.1813149077927] , [ 1317355200000 , 2.9407596325999] , [ 1320033600000 , -1.1130607112134] , [ 1322629200000 , -2.0274822307752] , [ 1325307600000 , -1.8372559072154] , [ 1327986000000 , -4.0732815531148] , [ 1330491600000 , -6.4417038470291]]
        },
         {
            "key": "Series 3",
             "values": [ [ 1025409600000 , 0] , [ 1028088000000 , -6.3382185140371] , [ 1030766400000 , -5.9507873460847] , [ 1033358400000 , -11.569146943813] , [ 1036040400000 , -5.4767332317425] , [ 1038632400000 , 0.50794682203014] , [ 1041310800000 , -5.5310285460542] , [ 1043989200000 , -5.7838296963382] , [ 1046408400000 , -7.3249341615649] , [ 1049086800000 , -6.7078630712489] , [ 1051675200000 , 0.44227126150934] , [ 1054353600000 , 7.2481659343222] , [ 1056945600000 , 9.2512381306992] , [ 1059624000000 , 11.341210982529] , [ 1062302400000 , 14.734820409020] , [ 1064894400000 , 12.387148007542] , [ 1067576400000 , 18.436471461827] , [ 1070168400000 , 19.830742266977] , [ 1072846800000 , 22.643205829887] , [ 1075525200000 , 26.693972514363] , [ 1078030800000 , 29.489903107308] , [ 1080709200000 , 30.756096054034] , [ 1083297600000 , 27.992822746720] , [ 1085976000000 , 29.225852107431] , [ 1088568000000 , 30.156836480689] , [ 1091246400000 , 24.859678459498] , [ 1093924800000 , 24.151326522641] , [ 1096516800000 , 26.974088564049] , [ 1099195200000 , 30.587369307288] , [ 1101790800000 , 35.952410049136] , [ 1104469200000 , 42.723169856608] , [ 1107147600000 , 40.104326572110] , [ 1109566800000 , 42.034940590574] , [ 1112245200000 , 41.201940741519] , [ 1114833600000 , 35.959307673456] , [ 1117512000000 , 40.234785495828] , [ 1120104000000 , 43.347252675906] , [ 1122782400000 , 49.122142270314] , [ 1125460800000 , 46.336213226596] , [ 1128052800000 , 45.738022352292] , [ 1130734800000 , 40.782535587694] , [ 1133326800000 , 46.298919327736] , [ 1136005200000 , 46.525174496692] , [ 1138683600000 , 49.369518277658] , [ 1141102800000 , 51.359233230659] , [ 1143781200000 , 54.290790853085] , [ 1146369600000 , 56.370809889665] , [ 1149048000000 , 52.347251720842] , [ 1151640000000 , 52.651049262704] , [ 1154318400000 , 49.006082346714] , [ 1156996800000 , 53.833722685976] , [ 1159588800000 , 57.368751084016] , [ 1162270800000 , 62.620657436870] , [ 1164862800000 , 67.843814831233] , [ 1167541200000 , 70.696236558827] , [ 1170219600000 , 75.281054033390] , [ 1172638800000 , 75.494257592448] , [ 1175313600000 , 80.620943351778] , [ 1177905600000 , 87.289875534061] , [ 1180584000000 , 93.299043821956] , [ 1183176000000 , 91.015859689151] , [ 1185854400000 , 88.392797582470] , [ 1188532800000 , 94.699212813219] , [ 1191124800000 , 103.50183124741] , [ 1193803200000 , 111.30811970524] , [ 1196398800000 , 101.36138850420] , [ 1199077200000 , 98.665003256909] , [ 1201755600000 , 87.999132307989] , [ 1204261200000 , 85.315653328802] , [ 1206936000000 , 82.146119346213] , [ 1209528000000 , 90.093146599737] , [ 1212206400000 , 99.385987481068] , [ 1214798400000 , 84.763092203314] , [ 1217476800000 , 82.910191547323] , [ 1220155200000 , 90.191781675161] , [ 1222747200000 , 66.188819887335] , [ 1225425600000 , 47.259186154933] , [ 1228021200000 , 40.548648265024] , [ 1230699600000 , 42.458784966634] , [ 1233378000000 , 41.462207260082] , [ 1235797200000 , 35.224936113579] , [ 1238472000000 , 40.810117767284] , [ 1241064000000 , 55.041351655012] , [ 1243742400000 , 59.168485702020] , [ 1246334400000 , 60.474654847301] , [ 1249012800000 , 67.306616497709] , [ 1251691200000 , 70.539019993440] , [ 1254283200000 , 77.571962668603] , [ 1256961600000 , 72.108784451998] , [ 1259557200000 , 80.269048905849] , [ 1262235600000 , 84.754250235173] , [ 1264914000000 , 83.053938255703] , [ 1267333200000 , 88.067497980334] , [ 1270008000000 , 97.556993569060] , [ 1272600000000 , 96.744762710807] , [ 1275278400000 , 87.146301147104] , [ 1277870400000 , 76.113331725206] , [ 1280548800000 , 84.745960774176] , [ 1283227200000 , 80.883421033110] , [ 1285819200000 , 98.377963136001] , [ 1288497600000 , 104.16094587057] , [ 1291093200000 , 101.92699168281] , [ 1293771600000 , 109.16314556604] , [ 1296450000000 , 115.31506669000] , [ 1298869200000 , 126.55944572261] , [ 1301544000000 , 118.47392959295] , [ 1304136000000 , 121.44619467743] , [ 1306814400000 , 120.38970188330] , [ 1309406400000 , 114.99946573061] , [ 1312084800000 , 110.95959856356] , [ 1314763200000 , 86.186386929240] , [ 1317355200000 , 62.100425398325] , [ 1320033600000 , 78.680507428540] , [ 1322629200000 , 73.876351797642] , [ 1325307600000 , 70.866962301942] , [ 1327986000000 , 80.863709250982] , [ 1330491600000 , 86.946444823715]]
         },
         {
             "key": "Series 4",
             "values": [ [ 1025409600000 , -7.0674410638835] , [ 1028088000000 , -14.663359292964] , [ 1030766400000 , -14.104393060540] , [ 1033358400000 , -23.114477037218] , [ 1036040400000 , -16.774256687841] , [ 1038632400000 , -11.902028464000] , [ 1041310800000 , -16.883038668422] , [ 1043989200000 , -19.104223676831] , [ 1046408400000 , -20.420523282736] , [ 1049086800000 , -19.660555051587] , [ 1051675200000 , -13.106911231646] , [ 1054353600000 , -8.2448460302143] , [ 1056945600000 , -7.0313058730976] , [ 1059624000000 , -5.1485118700389] , [ 1062302400000 , -3.0011028761469] , [ 1064894400000 , -4.1367265281467] , [ 1067576400000 , 1.5425209565025] , [ 1070168400000 , 2.7673533607299] , [ 1072846800000 , 7.7077114755360] , [ 1075525200000 , 9.7565015112434] , [ 1078030800000 , 11.396888609473] , [ 1080709200000 , 10.013964745578] , [ 1083297600000 , 8.0558890950562] , [ 1085976000000 , 9.6081966657458] , [ 1088568000000 , 11.918590426432] , [ 1091246400000 , 7.9945345523982] , [ 1093924800000 , 8.3201276776796] , [ 1096516800000 , 9.8283954846342] , [ 1099195200000 , 11.527125859650] , [ 1101790800000 , 16.413657596527] , [ 1104469200000 , 20.393798297928] , [ 1107147600000 , 17.456308413907] , [ 1109566800000 , 20.087778400999] , [ 1112245200000 , 17.988336990817] , [ 1114833600000 , 15.378490151331] , [ 1117512000000 , 19.474322935730] , [ 1120104000000 , 20.013851070354] , [ 1122782400000 , 24.749943726975] , [ 1125460800000 , 23.558710274826] , [ 1128052800000 , 24.558915040889] , [ 1130734800000 , 22.355860488034] , [ 1133326800000 , 27.138026265756] , [ 1136005200000 , 27.202220808591] , [ 1138683600000 , 31.219437344964] , [ 1141102800000 , 31.392355525125] , [ 1143781200000 , 33.373099232542] , [ 1146369600000 , 35.095277582309] , [ 1149048000000 , 30.923356507615] , [ 1151640000000 , 31.083717332561] , [ 1154318400000 , 31.290690671561] , [ 1156996800000 , 34.247769216679] , [ 1159588800000 , 37.411073177620] , [ 1162270800000 , 42.079177096411] , [ 1164862800000 , 44.978191659648] , [ 1167541200000 , 46.713271025310] , [ 1170219600000 , 49.203892437699] , [ 1172638800000 , 46.684723471826] , [ 1175313600000 , 48.385458973500] , [ 1177905600000 , 54.660197840305] , [ 1180584000000 , 60.311838415602] , [ 1183176000000 , 57.583282204682] , [ 1185854400000 , 52.425398898751] , [ 1188532800000 , 54.663538086985] , [ 1191124800000 , 60.181844325224] , [ 1193803200000 , 62.877219773621] , [ 1196398800000 , 55.760611512951] , [ 1199077200000 , 54.735280367784] , [ 1201755600000 , 45.495912959474] , [ 1204261200000 , 40.934919015876] , [ 1206936000000 , 40.303777633187] , [ 1209528000000 , 47.403740368773] , [ 1212206400000 , 49.951960898839] , [ 1214798400000 , 37.534590035098] , [ 1217476800000 , 36.405758293321] , [ 1220155200000 , 38.545373001858] , [ 1222747200000 , 26.106358664455] , [ 1225425600000 , 4.2658006768744] , [ 1228021200000 , -3.5517839867557] , [ 1230699600000 , -2.0878920761513] , [ 1233378000000 , -10.408879093829] , [ 1235797200000 , -19.924242196038] , [ 1238472000000 , -12.906491912782] , [ 1241064000000 , -3.9774866468346] , [ 1243742400000 , 1.0319171601402] , [ 1246334400000 , 1.3109350357718] , [ 1249012800000 , 9.1668309061935] , [ 1251691200000 , 13.121178985954] , [ 1254283200000 , 17.578680237511] , [ 1256961600000 , 14.971294355085] , [ 1259557200000 , 21.551327027338] , [ 1262235600000 , 24.592328423819] , [ 1264914000000 , 20.158087829555] , [ 1267333200000 , 24.135661929185] , [ 1270008000000 , 31.815205405903] , [ 1272600000000 , 34.389524768466] , [ 1275278400000 , 23.785555857522] , [ 1277870400000 , 17.082756649072] , [ 1280548800000 , 25.248007727100] , [ 1283227200000 , 19.415179069165] , [ 1285819200000 , 30.413636349327] , [ 1288497600000 , 35.357952964550] , [ 1291093200000 , 35.886413535859] , [ 1293771600000 , 45.003601951959] , [ 1296450000000 , 48.274893564020] , [ 1298869200000 , 53.562864914648] , [ 1301544000000 , 54.108274337412] , [ 1304136000000 , 58.618190111927] , [ 1306814400000 , 56.806793965598] , [ 1309406400000 , 54.135477252994] , [ 1312084800000 , 50.735258942442] , [ 1314763200000 , 42.208170945813] , [ 1317355200000 , 31.617916826724] , [ 1320033600000 , 46.492005006737] , [ 1322629200000 , 46.203116922145] , [ 1325307600000 , 47.541427643137] , [ 1327986000000 , 54.518998440993] , [ 1330491600000 , 61.099720234693]]
         }
     ];
    
    
  }]);