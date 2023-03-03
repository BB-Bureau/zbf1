import { getProgram } from "./getProgram";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";

export const getBetAccounts = async (wallet) => {
  console.log("getBetAccounts")
  const program = getProgram(wallet);
  console.log(program);
  const accts = await program.account.userBet.all([
    {
      memcmp: {
        offset: 8,
        bytes: wallet.publicKey.toBase58()
      }
    }
  ])
  return accts.filter(a => a.account.amountCollateral>0)
};
