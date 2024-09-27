import React from "react";
import { useState } from "react";
import { token_backend } from "../../../declarations/token_backend";
import { Principal } from "@dfinity/principal";
//import { Nat } from "@dfinity/Nat";

function Transfer() {
  const [btn_disabled, set_btn_disabled] = useState(false);

  const [to_account, set_to_account] = useState("");

  const [transfer_amt, set_transfer_amt] = useState("");

  const [transfer_status, set_transfer_status] = useState("");

  function handle_change(section, event) {
    let input =  event.target.value;
    switch (section) {
      case "account":
        set_to_account(input);
        break;

      case "transfer":
        set_transfer_amt(input);
        break;
    };
  }

  async function handleClick() {
    set_btn_disabled(true);
    const transfer_id = Principal.fromText(to_account);
    const trans_amt = Number(transfer_amt);
    const result = await token_backend.transfer(transfer_id, trans_amt);
    set_transfer_status(result);
    set_btn_disabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                onChange={(event)=>{handle_change("account", event)}}
                // a simpler way to do this would be the following:
                // onChange = {(e)=>{set_transfer_amt(e.target.value)}}
                value={to_account}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                onChange={(event)=>{handle_change("transfer", event)}}
                // a simpler way to do this would be the following:
                // onChange = {(e)=>{set_to_accoun(e.target.value)}}
                value={transfer_amt}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" 
                  onClick={handleClick} 
                  disabled= {btn_disabled}
          >
            Tansfer
          </button>
        </p>
        <p>{transfer_status}</p>
      </div>
    </div>
  );
}

export default Transfer;
