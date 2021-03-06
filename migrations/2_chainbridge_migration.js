const Bridge = artifacts.require("Bridge");
const ERC20Handler = artifacts.require("ERC20Handler");
const ERC20 = artifacts.require("ERC20PresetMinterPauser");


module.exports = function(deployer) {
    deployer.deploy(Bridge, 0, [], 1, 0, 10)
    .then(() => Bridge.deployed())
    .then(() => deployer.deploy(ERC20Handler, Bridge.address, [], [], []));
    deployer.deploy(ERC20, "PDOT", "PDOT");
}