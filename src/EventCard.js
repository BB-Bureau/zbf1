import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ammBuy } from "./program/ammBuy";
import { getEvents } from "./program/getEvents";
import Swal from 'sweetalert2'

window.Buffer = window.Buffer || require("buffer").Buffer;

function AmmCard({ amm, onChange }) {
  const wallet = useAnchorWallet();
  const [amountBuy, setAmountBuy] = useState(0);
  const buy = () => {
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
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  return (
    <div style={{ border: "red thin solid", padding: "5px", margin: "5px" }}>
      {/* <div>{JSON.stringify(amm)}</div> */}
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
