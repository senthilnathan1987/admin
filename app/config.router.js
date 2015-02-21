app.config(['$routeProvider',function($routeProvider){
     $routeProvider.when('/myBankAccount', {
        templateUrl: 'views/myBankAccount/myBankAccount.html',
         controller:'myBankAccountController'
      }).when('/myCreditCard', {
        templateUrl: 'views/myCreditCards/myCreditCards.html',
          controller:'myCreditCardsController'
      }).when('/myLoan', {
        templateUrl: 'views/myLoans/myLoans.html',
         controller:'myloansController'
      }).when('/myLoanDetails/:loanId', {
        templateUrl: 'views/myLoans/myLoansDetails.html',
         controller:'myloansDetailsController'
      }).when('/myIncome', {
        templateUrl: 'views/myIncomes/myIncomes.html'
      }).when('/myBill', {
        templateUrl: 'views/myBills/myBills.html'
      }).when('/myBudget', {
        templateUrl: 'views/myBudgets/myBudgets.html'
      }).when('/categoryManagement', {
        templateUrl: 'views/categoryManagement/categoryManagement.html',
         controller:'categoryController'
      }).when('/dashboard', {
        templateUrl: 'views/dashboard/dashboard.html',
        controller:'dashboardController'
      }).when('/addAccount',{
        templateUrl: 'views/myBankAccount/addAccount.html',
         controller:'addAccountController'
     }).when('/addCreditCard',{
        templateUrl: 'views/myCreditCards/addCreditCard.html',
         controller:'addCreditCardController'
     }).when('/myreminders',{
        templateUrl: 'views/myReminders/myReminders.html',
         controller:'myremindersController'
     }).when('/login',{
        templateUrl: 'views/login/login.html',
         controller:'loginController'
     }).when('/logout',{
        templateUrl: 'views/login/login.html',
         controller:'logoutController'
     }).when('/profile',{
        templateUrl: 'views/profile/profile.html',
         controller:'profileController'
     }).when('/',{
        templateUrl: 'views/dashboard/dashboard.html',
         controller:'dashboardController',
         role:0
     }).otherwise({
        redirectTo: '/login',
     });
     
}]);