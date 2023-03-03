import { getProgram } from "./getProgram";
import { PublicKey, Transaction } from "@solana/web3.js";
import { signAndSend } from "./signAndSend";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  createApproveInstruction,
} from "@solana/spl-token";
import { BN } from "bn.js";


export const ammSell = async (wallet, ammPk, amount) => {
  const program = getProgram(wallet);
  const transaction = new Transaction();
  const [zeusInfoPk] = await PublicKey.findProgramAddress(
    [Buffer.from(`zeus`)],
    program.programId
  );

  const [userBetAcountPk] = await PublicKey.findProgramAddress(
    [
      Buffer.from("user-bet"),
      new PublicKey(ammPk).toBytes(),
      wallet.publicKey.toBytes(),
    ],
    program.programId
  );

  const zeusAcct = await program.account.zeusInfo.fetch(zeusInfoPk);
  const collateralMintPk = zeusAcct.collateralMint;
  const userAtaPk = await getAssociatedTokenAddress(
    collateralMintPk,
    wallet.publicKey
  );
  const userAtaBalance =
    await program.provider.connection.getTokenAccountBalance(userAtaPk);
  console.log(userAtaBalance);

  const collateralTokenAccount = await getAssociatedTokenAddress(
    collateralMintPk,
    zeusInfoPk,
    true
  );

  const sellInstruction = await program.methods
    .sellBetForCollateral(new BN(amount))
    .accounts({
      payer: wallet.publicKey,
      zeusInfo: zeusInfoPk,
      userCollateralTokenAccount: userAtaPk,
      amm: ammPk,
      collateralTokenAccount,
      userBetAccount: userBetAcountPk,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([wallet])
    .instruction();

  transaction.add(sellInstruction);

  await signAndSend(program.provider.connection, transaction, wallet, []);
};
