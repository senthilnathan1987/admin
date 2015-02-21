<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Example
 *
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array.
 *
 * @package		CodeIgniter
 * @subpackage	Rest Server
 * @category	Controller
 * @author		Phil Sturgeon
 * @link		http://philsturgeon.co.uk/code/
*/

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Services extends REST_Controller
{
	function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('Account_model');
        // Configure limits on our controller methods. Ensure
        // you have created the 'limits' table and enabled 'limits'
        // within application/config/rest.php
        $this->methods['user_get']['limit'] = 500; //500 requests per hour per user/key
        $this->methods['user_post']['limit'] = 100; //100 requests per hour per user/key
        $this->methods['user_delete']['limit'] = 50; //50 requests per hour per user/key
    }
    
    function account_detail_get()
    {
        if(!$this->get('id'))
        {
        	$this->response(NULL, 400);
        }
        
         $accounts = $this->Account_model->get_account( $this->get('id') );
         if($accounts)
        {
            $this->response($accounts, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
         
    }
    
    function user_account_post()
    {
       
        $data = array(
                        'account_name'=>$this->post('account_name'),
                        'user_id'=>$this->post('userId'),
                        'account_number'=>$this->post('account_number'),
                        'account_type'=>$this->post('account_type'),
                        'account_balance'=>$this->post('account_balance')  
                    );
       $this->Account_model->add_account($data);

    }
    
    function account_delete()
    {
        $this->Account_model->delete_account($this->get('id'));
       
    }
    
    function user_accounts_get()
    {
        
         $accounts = $this->Account_model->get_accounts( $this->get('id') );
        
        if($accounts)
        {
            $this->response($accounts, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t find any accounts!'), 404);
        }
    }


	public function update_account_put()
	{
		$accontID= $this->put('id');
        $data = array(
                        'account_name'=>$this->put('account_name'),
                        'user_id'=>0,
                        'account_number'=>$this->put('account_number'),
                        'account_type'=>$this->put('account_type'),
                        'account_balance'=>$this->put('account_balance')  
                    );
        
       
        $accounts = $this->Account_model->update_accounts($data,$accontID);
         if($accounts)
        {
            $this->response($accounts, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t find any accounts!'), 404);
        }
	}
    
    //---------------------- transcationService start here ------------------------------//
    
    public function addTranscation_post(){
         $strDate=substr($this->post('transcation_date'),4,11);
        $date= date( 'Y-m-d', strtotime( $strDate ) );;
        
        
        
        
       $formatedDate=(strtotime($date)*1000);
       
        $data = array(
                        'transcation_date'=>$formatedDate,
                        'user_id'=>$this->post('userId'),
                        'transcation_account'=>$this->post('transcation_account'),
                        'transcation_amount'=>$this->post('transcation_amount'),
                        'transcation_tag'=>$this->post('transcation_tag'),
                        'transcation_description'=>$this->post('transcation_description'),
                         'category'=>$this->post('category'),
                         'sub_category'=>$this->post('subCategory'),
                        'created_date'=>"now()"
                    );
       $this->Account_model->add_transcation($data);
    }
    
    function account_transcations_get(){
         $transcations = $this->Account_model->get_account_transcations( $this->get('id') );
         if($transcations)
        {
            $this->response($transcations, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
        
    }
    
        //---------------------- categoryService start here ------------------------------//
    
    public function addCategory_post(){
        
        if($this->post('category')=="addNewCategory"){
            $category=$this->post('addCategory');
        }else{
             $category=$this->post('category');
        }
        
        $data = array(
                        'user_id'=>$this->post('userId'),
                        'category'=>$category,
                        'sub_category'=>$this->post('subCategory'),
                        'created_date'=>"now()"
                    );
        
      $this->Account_model->add_category($data);    
    }
    
     function getCategory_get(){
         $category = $this->Account_model->get_categorys();
         if($category)
        {
            $this->response($category, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
        
    }
    
    function getSubCategory_get(){
         $subcategory = $this->Account_model->get_sub_categorys($this->get('cat'));
          if($subcategory)
        {
            $this->response($subcategory, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
    }
    
    
    function addReminders_post(){
         $data = array(
                        'user_id'=>$this->post('userId'),
                        'event_title'=>$this->post('event_title'),
                        'event_dueDate'=>$this->post('event_date'),
                        'event_color'=>$this->post('colorCode'),
                        'event_recurrence'=>$this->post('recurrence')
                    );
        $subcategory = $this->Account_model->add_reminders($data);
        $this->response($subcategory, 200); // 200 being the HTTP response code
        
    }
    
    function getReminders_get(){
         $getReminders = $this->Account_model->get_reminders($this->get('id'));
          if($getReminders)
        {
            $this->response($getReminders, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
    }
    
     function getCreditCards_get(){
         $getCreditCards = $this->Account_model->get_CreditCards($this->get('id'));
          if($getCreditCards)
        {
            $this->response($getCreditCards, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
    }
    
    function addCreditCards_post(){
         $data = array(
                        'user_id'=>$this->post('userId'),
                        'account_name'=>$this->post('cardaccountname'),
                        'account_type'=>$this->post('cardaccounttype'),
                        'account_number'=>$this->post('cardaccountnumber'),
                        'outstanding_balance'=>$this->post('cardaccountbalance'),
                           'interest'=>$this->post('cardaccountintrest'),
                           'credit_limit'=>$this->post('cardcreditlimit'),
                           'due_date'=>$this->post('cardduedate')
                    );
        $addCreditCards = $this->Account_model->add_creditCards($data);
        $this->response($addCreditCards, 200); // 200 being the HTTP response code
    }
    
     function addLoans_post(){
         $data = array(
                        'user_id'=>$this->post('userId'),
                        'bank_name'=>$this->post('bankName'),
                        'loan_number'=>$this->post('loanaccountnumber'),
                        'loan_type'=>$this->post('loantype'),
                        'opening_balance'=>$this->post('openingbalance'),
                           'interest'=>$this->post('loanintrest'),
                           'loan_start_date'=>$this->post('loansatrtdate'),
                           'loan_tenure'=>$this->post('loanstenure'),
                           'payment_due_day'=>$this->post('loanduedate')
                    );
        $addLoans = $this->Account_model->add_Loans($data);
        $this->response($addLoans, 200); // 200 being the HTTP response code
    }
    function getloans_get(){
        $getloans = $this->Account_model->get_Loans($this->get('id'));
          if($getloans)
        {
            $this->response($getloans, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
    }
    
      function getloan_get(){
        $getloan = $this->Account_model->get_Loan($this->get('id'));
          if($getloan)
        {
            $this->response($getloan, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
    }
    
    
     function getProfile_get(){
        $getProfile = $this->Account_model->get_Profile($this->get('id'));
          if($getProfile)
        {
            $this->response($getProfile, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t fetch any accounts!'), 404);
        }
    }
    
    function updateProfilePic_put(){
        	
   
                        $profile_pic=$this->put('profileImgDate');
                        $uid=$this->put('user_id');
                 
        
       
        $profilePicUpdate = $this->Account_model->update_profile_pic($profile_pic,$uid);
   
    }
        
    
    
}