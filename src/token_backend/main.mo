import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";



// principal id
// ens7c-3docb-4a5fy-lru33-3wsan-66jdt-qp5kb-okpja-muwgo-p7z7u-nae

actor Token{
  Debug.print(debug_show ("Token Canister loaded"));

  // define the type "currency" to be able to create a object
  public type Currency = {
    name: Text;
    symbol: Text;
  };

  public type UserInfo = {
    id: Principal;
    balance: Nat;
    used_faucet: Text;
  };

  //set the Pricipal ID of the owner
  let owner : Principal = Principal.fromText("ens7c-3docb-4a5fy-lru33-3wsan-66jdt-qp5kb-okpja-muwgo-p7z7u-nae");
  //set the Principal ID of the Canister
  let canister_id : Principal = Principal.fromText("ajuq4-ruaaa-aaaaa-qaaga-cai");
  // set the total supply of tokens
  let total_supply : Nat = 10000000000;
  // set the object to store basic naming conventions for the token
  let currency : Currency = {
    name = "Freedom";
    symbol = "FREED"
  };
  
  

  // set the amount the faucet is supposed to pay out
  let faucet_payout : Nat = 10000;

  // set a varibale to store the current user's Principal ID
  var current_user : Principal = owner; 

  //store the HashMap in a array upon upgrading
  private stable var balance_entries : [(Principal, UserInfo)] = [];

  // Define the HashMap to store the information of various accounts
  private var balances = HashMap.HashMap<Principal, UserInfo>(1, Principal.equal, Principal.hash);

  // function to send the currency info
  public query func get_currency_info() :async Currency{
 
    return currency;
  };

  // if the hashmap is empty add the owner and the canister
  if (balances.size() < 1){
    // put the total supply into the owners account
    balances.put(owner, {id = owner; balance = total_supply; used_faucet = "no"});
    // add the canister to the HashMap
    balances.put(canister_id, {id=canister_id; balance=0; used_faucet="yes"});
    };

  // function to send the faucet_payout amount
  public query func get_faucet_amount() : async Nat{
    return faucet_payout;
  };

  // function to get the current user
  public shared(msg) func user_principal() : async Principal{
     Debug.print(debug_show("msg.caller value ", msg.caller));
     current_user := msg.caller;
     return current_user;
  };

  // function to send the current_user
  public query func get_current_user() : async Principal{
    Debug.print(debug_show("the current user: ", current_user));
    return current_user;
  };

  // function to check the balance of a user based on their Principal ID
  
  public query func balance_of(who: Principal) : async Nat {
    Debug.print(debug_show("the Principal user: ", who));
    let balance : Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) {
        current_user := who;
        return result.balance;};
    };
    return balance;
  };
  
  

  // Function to pay out using the faucet 
  public shared(msg) func pay_out() : async Text{
    Debug.print(debug_show("msg.caller value ", msg.caller));
    current_user := msg.caller;
    let canister_balance = await balance_of(canister_id);
    if (canister_balance != 0 ){
    switch (balances.get(current_user)){
      case null {
        balances.put(current_user, {id = current_user; balance = 0; used_faucet = "yes"});
        let transfer_money : Text = await transfer(current_user, faucet_payout);
        Debug.print(debug_show(transfer_money));
        return "Created new account, and added funds!!!"

      };
      case(?result){
        if (result.used_faucet == "no"){
          balances.put(current_user, {id = current_user; balance = result.balance; used_faucet = "yes"});
          let transfer_money : Text = await transfer(current_user, faucet_payout);
          return transfer_money;
        } else {
          return "Already Claimed"
        };
      };
    }; 
    }else {
      return "Faucet has run dry, try again"
    };
    
  };

  // function for transfering funds
  public shared(msg) func transfer(to : Principal, amount : Nat) : async Text{
    Debug.print(debug_show("transfer to: ", to, " amount: ", amount));
    current_user := msg.caller;
    switch(balances.get(current_user)){
      case null {
        return "user doesn't have a account yet"
      };
      case(?result){
        let from_balance = await balance_of(current_user);
        Debug.print(debug_show ("from_balance:", from_balance));
        if (from_balance > amount){
      
          let new_from_balance : Nat = from_balance - amount;
          balances.put(current_user, {id = result.id; balance = new_from_balance; used_faucet = result.used_faucet;});
        
          switch(balances.get(to)){
            case null{
              return "target user doesn't exitst"
            };
            case(?result){
            let to_balance = await balance_of(to);
            let new_to_balance : Nat = to_balance + amount;
            balances.put(to, {id=to; balance = new_to_balance; used_faucet = result.used_faucet;});
              return "Success"
            }
          };
        } else {
          Debug.print(debug_show ("insuffiecent funds"));
          return "insuffiecent funds"
        };
      };
    }
  };


  // method for the pre-upgrade
  system func preupgrade(){
    balance_entries := Iter.toArray(balances.entries())
  };

  // method for the post-upgrade
  system func postupgrade(){
    balances := HashMap.fromIter<Principal, UserInfo>(balance_entries.vals(),1, Principal.equal, Principal.hash);
 
  // if the hashmap is empty add the owner and the canister
  if (balances.size() < 1){
    // put the total supply into the owners account
    balances.put(owner, {id = owner; balance = total_supply; used_faucet = "no"});
    // add the canister to the HashMap
    balances.put(canister_id, {id=canister_id; balance=0; used_faucet="yes"});
    };
 
  };
  
}; 