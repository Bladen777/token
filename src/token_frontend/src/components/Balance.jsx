import React from "react";
import { useState } from "react";
import {token_backend} from "../../../declarations/token_backend"
import { Principal } from "@dfinity/principal";

const token = token_backend;

function Balance(props) {

  const [user_id, set_user_id] = useState("");
  const [balance, set_balance] = useState("0");
  const [is_hidden, set_is_hidden] = useState(true);


  async function handleClick() {
    const principal_id =  Principal.fromText(user_id);
    console.log("the user ID: ", principal_id);
    let user_balance = await token_backend.balance_of(principal_id);
    user_balance = user_balance.toLocaleString();
    console.log("user_balance: ", user_balance);
    set_balance(user_balance);
    set_is_hidden(false);
  }

  function handleChange(event){
    const input = event.target.value;
    console.log("input: ", input );
    set_user_id(input);

  }

  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={user_id}
          onChange={handleChange}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      {is_hidden ? "" :<p> This account has a balance of {balance} {props.get_currency_symbol}.</p>}
    </div>
  );
}

export default Balance;
