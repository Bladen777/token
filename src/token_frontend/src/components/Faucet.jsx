import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { token_backend } from "../../../declarations/token_backend";


function Faucet(props) {

  const [user_claimed, set_user_claimed] = useState("Gimme Gimme");

  const [btn_disabled, set_btn_disabled] =useState(false);

  async function handleClick(event){
    set_btn_disabled(true);
    set_user_claimed(await token_backend.pay_out());
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free {props.get_currency_name} tokens here! Claim {props.get_faucet_amount} {props.get_currency_symbol} coins to {props.get_current_user}'s account.</label>
      <p className="trade-buttons">
        <button id="btn-payout"
                disabled={btn_disabled} 
                onClick={handleClick}       
        >
          {user_claimed}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
