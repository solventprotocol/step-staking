
// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

const anchor = require("@project-serum/anchor");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const fs = require('fs');

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider);

  // Read the generated IDL.
  const idl = JSON.parse(
    require("fs").readFileSync("../target/idl/step_staking.json", "utf8")
  );

  // Address of the deployed program.
  const programId = new anchor.web3.PublicKey("AbntkGcaYc5RuAzyomxY5sEmvkpd87DeDKh2FVuQm4pU");

  const program = new anchor.Program(idl, programId);

  let mintPubkey = new anchor.web3.PublicKey("svtMpL5eQzdmB3uqK9NXaQkq8prGZoKQFNVJghdWCkV");

  const [vaultPubkey, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
    [mintPubkey.toBuffer()],
    program.programId
  )

  const [stakingPubkey, stakingBump] =
  await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode('staking'))],
    program.programId
  )
  console.log(vaultPubkey.toString(), vaultBump);
  console.log(stakingPubkey.toString(), stakingBump);

  const lockEndDate = new anchor.BN("1642933205")

  await program.rpc.initialize(vaultBump, stakingBump, lockEndDate, {
    accounts: {
      tokenMint: mintPubkey,
      tokenVault: vaultPubkey,
      stakingAccount: stakingPubkey,
      initializer: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    },
  });

  // Uncomment below to call updateLockEndDate

  // const newLockEndDate = new anchor.BN("1648742400")

  // await program.rpc.updateLockEndDate(stakingBump, newLockEndDate, {
  //   accounts: {
  //     initializer: provider.wallet.publicKey,
  //     stakingAccount: stakingPubkey,
  //   },
  // });
}
