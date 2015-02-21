<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login_model extends CI_Model{
    
    function login_auth($userId,$password){
        
           $this->db->select('uid,name,password,email,created');
           $this->db->from('customers');
           $this->db->where('email',$userId);
           $result = $this->db->get();
           return $result->result();
        
    }
    
   function  signUp($data){
           $this->db->set($data);
		   $this->db->insert('customers',$data);
		   $this->db->insert_id();
   }
    
}
?>