# Karmic Dapp

install dependencies: `yarn`

run locally: `yarn dev`

## Run smart contracts

in the smart contracts repo:

in one terminal window: `npx hardhat node --no-deploy`
in another terminal window run the following commands:
`npx hardhat --network localhost deploy --reset`
`npx hardhat --network localhost prepare --recipient "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"`

use the hardhat default address `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` for testing
