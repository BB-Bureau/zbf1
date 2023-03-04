import { getProgram } from "./getProgram";
import { PublicKey, Transaction } from "@solana/web3.js";
import { signAndSend } from "./signAndSend";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  createApproveInstruction,
} from "@solana/spl-token";
import { BN } from "bn.js";


export const ammBuy = async (wallet, ammPk, amount) => {
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
  let userBetAcount = undefined;
  try {
    userBetAcount = await program.account.userBet.fetch(userBetAcountPk);
  } catch (error) {}
  if (!userBetAcount) {
    // create if doesn't exists
    transaction.add(
      await program.methods
        .createUserBetAccount("user-bet")
        .accounts({
          payer: wallet.publicKey,
          amm: ammPk,
          userBetAccount: userBetAcountPk,
        })
        .signers([wallet])
        .instruction()
    );
  }
  const zeusAcct = await program.account.zeusInfo.fetch(zeusInfoPk);
  const collateralMintPk = zeusAcct.collateralMint;
  const userAtaPk = await getAssociatedTokenAddress(
    collateralMintPk,
    wallet.publicKey
  );
  const userAtaBalance =
    await program.provider.connection.getTokenAccountBalance(userAtaPk);
  console.log(userAtaBalance);
  const approveinstruction = createApproveInstruction(
    userAtaPk,
    zeusInfoPk,
    wallet.publicKey,
    Number(amount) * 1e3
  );
  transaction.add(approveinstruction);

  const collateralTokenAccount = await getAssociatedTokenAddress(
    collateralMintPk,
    zeusInfoPk,
    true
  );

  const buyInstruction = await program.methods
    .buyBetWithCollateral(new BN(Number(amount) * 1e3))
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

  transaction.add(buyInstruction);

  await signAndSend(program.provider.connection, transaction, wallet, []);
};
