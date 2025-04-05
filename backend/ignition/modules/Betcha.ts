// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const BetchaModule = buildModule("Betcha", (m) => {
  const deployBetcha = m.contract("Betcha");;

  return { deployBetcha };
});

export default BetchaModule;
