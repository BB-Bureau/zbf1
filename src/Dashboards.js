import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import EventCard from "./EventCard";
import { ammClaim } from "./program/ammClaim";
import { ammLateClaim } from "./program/ammLateClaim";
import { ammSell } from "./program/ammSell";
import { getBetAccounts } from "./program/getBetAccounts";
import { getEvents } from "./program/getEvents";
import { getHmbBalance } from "./program/getHmbBalance";
import Spinner from "react-text-spinners";

window.Buffer = window.Buffer || require("buffer").Buffer;

function UserBetDetails({ allEvents, betAccount, refreshAll }) {
  console.log({ allEvents, betAccount });
  const [eventDetails, setEventDetails] = useState({});
  const [betStatus, setBetStatus] = useState(1);
  const [isLoading, setIsLoading] = useState(false)
  const wallet = useAnchorWallet();

  useEffect(() => {
    const baAmmPk = betAccount.account.amm;
    let eventAndBet = null;
    for (let e of allEvents) {
      console.log(
        baAmmPk.toString(),
        e.amms["1"]?.publicKey.toString(),
        e.amms["X"].publicKey.toString(),
        e.amms["2"].publicKey.toString()
      );
      if (baAmmPk.toString() === e.amms["1"].publicKey.toString()) {
        eventAndBet = { e, amm: e.amms["1"] };
      }
      if (baAmmPk.toString() === e.amms["X"].publicKey.toString()) {
        eventAndBet = { e, amm: e.amms["X"] };
      }
      if (baAmmPk.toString() === e.amms["2"].publicKey.toString()) {
        eventAndBet = { e, amm: e.amms["2"] };
      }
    }
    setEventDetails(eventAndBet);
    const status = eventAndBet?.amm?.account?.status;
    if (status === 1) {
      setBetStatus("open");
    }
    if (status === 2) {
      setBetStatus("close");
    }
    if (status === 3) {
      setBetStatus("win");
    }
    if (status === 4) {
      setBetStatus("lose");
    }
    if (status === 5) {
      setBetStatus("rolled-back");
    }
  }, [allEvents, betAccount.account.amm]);
  const sell = async () => {
    setIsLoading(true)
    await ammSell(
      wallet,
      betAccount.account.amm,
      Number(betAccount.account.amountOutcome)
    );
    refreshAll();
    setIsLoading(false)
  };
  const claim = async () => {
    setIsLoading(true)
    await ammClaim(wallet, betAccount.account.amm);
    refreshAll();
    setIsLoading(false)
  };
  const lateClaim = async () => {
    setIsLoading(true)
    await ammLateClaim(wallet, betAccount.account.amm);
    refreshAll();
    setIsLoading(false)
  };
  return (
    <div style={{ margin: "10px" }}>
      <div>{isLoading && <Spinner theme="bullseye"/>}</div>
      <div>
        event: {eventDetails?.e?.account?.description} (
        {eventDetails?.e?.publicKey.toString()})
      </div>
      {betStatus && (
        <>
          <div>status: {eventDetails?.e?.status}</div>
          <div>Result: {betStatus}</div>
        </>
      )}
      <div>outcome: {eventDetails?.amm?.account?.code}</div>
      <div>
        Bet Shares: {Number(betAccount.account.amountOutcome / 1e9).toFixed(2)}
      </div>
      <div>
        HMBs Spent:{" "}
        {Number(betAccount.account.amountCollateral / 1e9).toFixed(2)}
      </div>
      {betStatus === "open" && <button onClick={sell}> sell </button>}
      {["win", "lose", "rolled-back"].includes(betStatus) && (
        <button onClick={claim}> claim </button>
      )}
      {!eventDetails && <button onClick={lateClaim}> late claim </button>}
      <div>
        Actual Odds:{" "}
        {Number(
          betAccount.account.amountOutcome / betAccount.account.amountCollateral
        ).toFixed(2)}
      </div>
    </div>
  );
}

export default function Dashboard(props) {
  const wallet = useAnchorWallet();
  const [events, setEvents] = useState([]);
  const [hmbBalance, setHmbBalance] = useState();
  const [betAccounts, setBetAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const refreshAll = useCallback(() => {
    setIsLoading(true)
    console.log("refresh on wallet change", { wallet });
    getEvents(wallet)
      .then((data) => {
        setEvents(data);
      })
      .then(() => {
        if (wallet?.publicKey) {
          console.log("extra requests");
          getBetAccounts(wallet).then((data) => {
            setBetAccounts(data);
          });
          getHmbBalance(wallet).then((data) => {
            setHmbBalance(data.value.uiAmount);
          });
        }
        setIsLoading(false)
      });
  }, [wallet]);

  const onEventChange = () => {
    setIsLoading(true)
    refreshAll(wallet);
    setIsLoading(false)
  };
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return (
    <div>
      <div>{isLoading && <Spinner theme="bullseye"/>}</div>

      {!wallet?.publicKey && <div>Wallet Not Connected</div>}
      {wallet?.publicKey && (
        <>
          <div>
            <div>{wallet?.publicKey?.toString()}</div>
            <div>HMB balance: {hmbBalance}</div>
          </div>
          <div>
            <div>My bets</div>
            {betAccounts.map((b) => {
              return (
                <UserBetDetails
                  key={b.publicKey.toString()}
                  allEvents={events}
                  betAccount={b}
                  refreshAll={refreshAll}
                ></UserBetDetails>
              );
            })}
          </div>
        </>
      )}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {events
          .filter((e) => e.status === "open")
          .map((e) => (
            <EventCard
              event={e}
              key={e.publicKey.toString()}
              onChange={onEventChange}
            ></EventCard>
          ))}
      </div>
    </div>
  );
}
