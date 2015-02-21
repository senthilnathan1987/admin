'use strict';

app.factory("authService", ['$http','$rootScope',
    function ($http,$rootScope) { // This service connects to our REST API
 
        var serviceBase = 'http://localhost/admin/restserver/index.php/api/auth';
 
        var obj = {};
        
        obj.getSession=function(){
                 return $http.get(serviceBase+'/session/');
        }
         obj.logout=function(){
                 return $http.get(serviceBase+'/session_logout/');
        }
         
         
        
        obj.toast = function (data) {
            toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
        }
        obj.login = function (q) {
           return $http({
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: serviceBase+'/login/',
                        method: "POST",
                        data: $.param(q)
                  });
        };
         obj.signup = function (q) {
           return $http({
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        url: serviceBase+'/signup/',
                        method: "POST",
                        data: $.param(q)
                  });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
 
        return obj;
}]);