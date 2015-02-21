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

class Auth extends REST_Controller
{ 
    function __construct()
    {
        // Construct our parent class
        parent::__construct();
        $this->load->model('login_model');
        $this->load->library('session');
    }
    
    function session_get(){
         $response["uid"] =$this->session->userdata('uid');;
        $response["userID"] = $this->session->userdata('userID');
        $response["name"] = $this->session->userdata('name');
         $response["logged_in"] = $this->session->userdata('logged_in');
        $this->response($response, 200); // 200 being the HTTP response code
    }
    
    
    function login_post(){
      $userID= $this->post('userid');
      $password= $this->post('password');
      $login = $this->login_model->login_auth( $userID,$password );
          if($login)
        {
            $newdata = array(
                   'uid'  => $login[0]->uid,
                   'userID'     => $userID,
                   'name'=>$login[0]->name,
                   'logged_in' => TRUE
               );  
              
            $this->session->set_userdata($newdata); 
            $this->response($login, 200); // 200 being the HTTP response code
   
        }

        else
        {
            $this->response(array('message' => 'Login failed. Incorrect credentials','statusText'=>"fail"), 404);
        }
        
    }
    function session_logout_get(){
        $logout=$this->session->sess_destroy();
        $this->response(array('message' => 'Logout success','statusText'=>"success"), 200);
      
    }
    
    function signup_post(){
     $signupdata = array(
                   'name'  =>  $this->post('fullname'),
                   'email' =>$this->post('userId'),
                   'password'=> $this->post('password'),
                  
               );  
      $signup = $this->login_model->signUp($signupdata);
       
      $this->response(array('message' => 'signup success','statusText'=>"success"), 200); // 200 being the HTTP response code
        

        
    }
    
    
}
?>