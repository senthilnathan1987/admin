<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Account_model extends CI_Model{
	
	function add_account($data)
	{
		   $this->db->set($data);
		   $this->db->insert('accounts',$data);
		   $this->db->insert_id();
	}
    function delete_account($id)
	{
		    $this->db->where('id',$id);
		   $this->db->delete('accounts');
	}
    function get_accounts($id)
	{
		    $this->db->select('*');
            $this->db->from('accounts');
           $this->db->where('user_id ='.$id);
            $result = $this->db->get();
           
            return $result->result();
	}
     function get_account($id)
	{
		    $this->db->select('*');
            $this->db->from('accounts');
           $this->db->where('id ='.$id);
            $result = $this->db->get();
           
            return $result->result();
	}
    function update_accounts($data,$id){
         $this->db->where('id', $id);
         $result=$this->db->update('accounts', $data);
         return $result;
    }
    
    function add_transcation($data){
           $this->db->set($data);
		   $this->db->insert('transcations',$data);
		   $this->db->insert_id();
    }
    function get_account_transcations($id){
            $this->db->select('*');
            $this->db->from('transcations');
            $this->db->where('user_id ='.$id);
            $result = $this->db->get();
            return $result->result();
    }
    
    function add_category($data){
           $this->db->set($data);
		   $this->db->insert('category_managent',$data);
		   $this->db->insert_id();
    }
    function get_categorys(){
            $this->db->select('*');
            $this->db->from('category_managent');
           /* $this->db->where('user_id ='.$id);*/
            $result = $this->db->get();
            return $result->result();
    }
    function get_sub_categorys($category){
           $this->db->select('*');
            $this->db->from('category_managent');
           $this->db->where('category',$category);
            $result = $this->db->get();
            return $result->result();
    }
    function add_reminders($data){
           $this->db->set($data);
		   $this->db->insert('reminders',$data);
		   $this->db->insert_id();
    }
    
    function get_reminders($id){
           $this->db->select('*');
            $this->db->from('reminders');
           $this->db->where('user_id ='.$id);
            $result = $this->db->get();
            return $result->result();
    }
    function get_CreditCards($id){
          $this->db->select('*');
            $this->db->from('credit_cards');
           $this->db->where('user_id ='.$id);
            $result = $this->db->get();
            return $result->result();
    }
    function add_creditCards($data){
         $this->db->set($data);
		   $this->db->insert('credit_cards',$data);
		   $this->db->insert_id();
    }
    
    function add_Loans($data){
           $this->db->set($data);
		   $this->db->insert('loans',$data);
		   $this->db->insert_id();
    }
    function get_Loans($id){
         $this->db->select('*');
            $this->db->from('loans');
           $this->db->where('user_id ='.$id);
            $result = $this->db->get();
            return $result->result();
    }
      function get_Loan($id){
         $this->db->select('*');
            $this->db->from('loans');
          $this->db->where('id ='.$id);
            $result = $this->db->get();
            return $result->result();
    }
    
    
    function get_Profile($id){
         $this->db->select('*');
            $this->db->from('customers');
            $this->db->where('uid ='.$id);
            $result = $this->db->get();
            return $result->result();
    }
    function update_profile_pic($picDate,$uid){
        $data=array(
                        'profile_pic'=>$picDate,
        );
          $this->db->where('uid', $uid);
         $result=$this->db->update('customers', $data);
         return $result;
    }

}
?>