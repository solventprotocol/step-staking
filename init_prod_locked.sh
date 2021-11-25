source ./set_env_prod_locked.sh;
# remove in prod
#spl-token create-token keys/token.json;

anchor build;
solana program deploy --program-id $program_id_keypair  target/deploy/step_staking.so;
# only first deploy
anchor idl init -f target/idl/step_staking.json $program_id;

# remove in prod
#spl-token create-account $token
#spl-token mint $token 100000000 $ATAtoken