import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ammBuy } from "./program/ammBuy";
import { getEvents } from "./program/getEvents";
import Swal from 'sweetalert2'
import './index.css';

import Spinner from "react-text-spinners";

window.Buffer = window.Buffer || require("buffer").Buffer;

function AmmCard({ amm, onChange }) {
  const wallet = useAnchorWallet();
  const [amountBuy, setAmountBuy] = useState(0);
  const [amountBetShares, setBetShares] = useState(0);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    /*
            let amm_collateral = ctx.accounts.amm.amount_collateral;
            let amm_outcome = ctx.accounts.amm.amount_outcome;
            let invariant = amm_collateral.checked_mul(amm_outcome).unwrap();
            let new_collateral = amm_collateral.checked_add(amount as u128).unwrap();
            let new_outcome = invariant.checked_div(new_collateral).unwrap();
            ctx.accounts.amm.amount_collateral = new_collateral;
            ctx.accounts.amm.amount_outcome = new_outcome;
    
            // amount collateral in the user_bet_account is only used in case of rollback, to return how much the user spent
            let token_out = amm_outcome - new_outcome;
            ctx.accounts.user_bet_account.amount_collateral = ctx.accounts.user_bet_account.amount_collateral + amount as u128;
            ctx.accounts.user_bet_account.amount_outcome = ctx.accounts.user_bet_account.amount_outcome + token_out ;
            ctx.accounts.user_bet_account.amount_outcome = ctx.accounts.user_bet_account.amount_outcome.checked_div(1000).unwrap().checked_mul(995).unwrap();
            ctx.accounts.amm.amount_outcome_sold = ctx.accounts.amm.amount_outcome_sold + token_out;
    */
   const ammCollateral = Number(amm.account.amountCollateral) 
   const ammOutcome = Number(amm.account.amountOutcome)
   const invariant = ammCollateral * ammOutcome
   const newCollateral = ammCollateral + (amountBuy * 1e3)
   const newOutcome = invariant / newCollateral
   const tokenOut = ammOutcome - newOutcome
   setBetShares((tokenOut / 1e3) / 1000 * 995)

  }, [amountBuy])
  const buy = () => {
    setIsLoading(true)
    if (!wallet?.publicKey) {
      Swal.fire(
        'Wallet Not Connected',
        'Please connect your Solana Wallet',
        'error'
      )
    } else {
      ammBuy(wallet, amm.publicKey, Number(amountBuy))
        .then((data) => {
          console.log(data);
          onChange();
          setIsLoading(false)
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false)
        });
    }
  };
  return (
    <div style={{ border: "red thin solid", padding: "5px", margin: "5px" }}>
      {/* <div>{JSON.stringify(amm)}</div> */}
      <div>{isLoading && <Spinner theme="bullseye"/>}</div>
      <div>Code: {amm.account.code}</div>
      <div>
        Odds:
        {Number(
          amm.account.amountOutcome / amm.account.amountCollateral
        ).toFixed(2)}
      </div>
      <div>
        <input
          placeholder="0"
          value={amountBuy}
          onChange={(e) => setAmountBuy(e.target.value)}
        />
        <button onClick={buy}>buy</button>
      </div>
      <div>
        bet shares: <div>{amountBetShares}</div>
      </div>
    </div>
  );
}

export default function EventCard({ event, onChange }) {
  return (
    <div style={{ border: "blue thick solid", padding: "5px", margin: "5px", width: "400px"}}>
      <div>{event.account.description}</div>
      <div>{event.status}</div>
      {event.status === "open" && (
        <>
          <AmmCard amm={event.amms["1"]} onChange={onChange} />
          <AmmCard amm={event.amms["X"]} onChange={onChange} />
          <AmmCard amm={event.amms["2"]} onChange={onChange} />
        </>
      )}
    </div>
  );
}
