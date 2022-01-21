
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
  const programId = new anchor.web3.PublicKey("souepX2w5hYSaN62zpgbmpcdfTwcVQoySkCG1jgoQrS");

  const program = new anchor.Program(idl, programId);

  let step = new anchor.web3.PublicKey("svtMpL5eQzdmB3uqK9NXaQkq8prGZoKQFNVJghdWCkV");
  let xStep = new anchor.web3.PublicKey("xsvtzXdo6tMD59k6NnYmRTi4ZduEoUSvSb6Keny73sr");

  [vaultPubkey, vaultBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [step.toBuffer()],
      program.programId
    );
  
  await program.rpc.initialize(
    vaultBump,
    {
      accounts: {
        tokenMint: step,
        xTokenMint: xStep,
        tokenVault: vaultPubkey,
        initializer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      }
    }
  );
}
