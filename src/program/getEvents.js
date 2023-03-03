import { getProgram } from "./getProgram.js";

window.events = window.events || null;
window.lastEventsUpdate = window.lastEventsUpdate || 0;
export const getEvents = async (wallet) => {
  console.log(window.lastEventsUpdate);
  const program = await getProgram(wallet);
  const amms = await program.account.zeusAmm.all();
  // console.log(amms);

  if (new Date().getTime() > window.lastEventsUpdate + 10000) {
    window.lastEventsUpdate = new Date().getTime();
    console.log("get events from main net");
    window.events = await program.account.zeusEvent.all();
  }
  return (window.events || [])
    .map((e) => {
      const myAmms = amms.filter((a) => {
        return a.account.eventPk.toString() === e.publicKey.toString();
      });
      e.ammsArr = myAmms;
      return e;
    })
    .map((e) => {
      e.amms = {};
      e.ammsArr.forEach((a) => {
        e.amms[a.account.code] = a;
        switch (a.account.status) {
          case 1:
            e.status = "open";
            break;
          case 2:
            e.status = "closed";
            break;
          case 3:
            e.status = "settled-" + a.account.code;
            break;
          case 4:
            if (!(e?.status || "").indexOf("settled") >= 0) {
              e.status = "settled-no-win";
            }
            break;
          case 5:
            e.status = "rolled-back";
            break;
          default:
            break;
        }
      });
      delete e.ammsArr;
      return e;
    })
    .filter(e => {
      return Object.values(e.amms).length > 0
    });
  // .map((e) => acctToString(e))
};
