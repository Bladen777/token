// API imports
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

//local inports
import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";
import Transfer from "./Transfer";
import { token_backend } from "../../../declarations/token_backend";


function App() {

  const [currency_info, set_currency_info] = useState({
    name: "",
    symbol:""
  }); 

  const [faucet_payout, set_faucet_payout] = useState("");

  const [current_user, set_current_user] = useState("user");

  useEffect(()=>{
    fetchData();

  },[]);

  async function fetchData(){
    set_currency_info({
      name:(await token_backend.get_currency_info()).name,
      symbol:(await token_backend.get_currency_info()).symbol
    });
    set_faucet_payout((await (token_backend.get_faucet_amount())).toLocaleString());
    set_current_user((await token_backend.user_principal()).toLocaleString());
    console.log("current_user: ", current_user);
  }




  return (
    <div id="screen">
      <Header />
      <Faucet 
        get_currency_name = {currency_info.name}
        get_currency_symbol = {currency_info.symbol}
        get_faucet_amount = {faucet_payout}
        get_current_user = {current_user}
      />
      <Balance 
        get_currency_symbol = {currency_info.symbol}
      />
      <Transfer />
    </div>
  );
}

export default App;
