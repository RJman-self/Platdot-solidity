var Web3 = require('web3');
const { hexToBytes, hexToUtf8, toUtf8 } = require('web3/packages/web3-utils');

var web3 = new Web3('http://127.0.0.1:6789');

ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
RELAYER_ROLE = "0xe2b7fb3b832174769106daebcfd6d1970523240dda11281102db9363b83b0dc4";
MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
PAUSER_ROLE = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";

adminAddress = "atp18hqda4eajphkfarxaa2rutc5dwdwx9z5vy2nmh";
ghjieAddress = "atp1a3x0c5v6y3nztcleh0cgqa4xca7klggwgpw6a3";
rjmanAddress = "atp1sy2tvmghdv47hwz89yu9wz2y29nd0frr9jzd2m";

bridgeAddress = "atp1ugd2pewannp76f36fk3nt3gt886e4u9d5qrz5x";
handlerAddress = "atp1rd7pjyygepf3r8a8zk8y25n3d3hy249whnuayy";
erc20Address = "atp1ktl7tjphkm5j48y2qjkvpqtjgyt25qrws4lsd0";
resourceID = "0x0000000000000000000000000000000000000000000000000000000000000000";

var bridge_abi = [
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "chainID",
        "type": "uint8"
      },
      {
        "internalType": "address[]",
        "name": "initialRelayers",
        "type": "address[]"
      },
      {
        "internalType": "uint256",
        "name": "initialRelayerThreshold",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "expiry",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "destinationChainID",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "resourceID",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "originChainID",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "enum Bridge.ProposalStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "ProposalEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "originChainID",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "enum Bridge.ProposalStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "ProposalVote",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "relayer",
        "type": "address"
      }
    ],
    "name": "RelayerAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "relayer",
        "type": "address"
      }
    ],
    "name": "RelayerRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newThreshold",
        "type": "uint256"
      }
    ],
    "name": "RelayerThresholdChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "RoleRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEFAULT_ADMIN_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_RELAYERS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "RELAYER_ROLE",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_chainID",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "name": "_depositCounts",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_expiry",
    "outputs": [
      {
        "internalType": "uint40",
        "name": "",
        "type": "uint40"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_fee",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_relayerThreshold",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "_resourceIDToHandlerAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleAdmin",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getRoleMember",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "getRoleMemberCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getRoleMemberIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "hasRole",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "renounceRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint72",
        "name": "destNonce",
        "type": "uint72"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "relayer",
        "type": "address"
      }
    ],
    "name": "_hasVotedOnProposal",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "relayer",
        "type": "address"
      }
    ],
    "name": "isRelayer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "renounceAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "adminPauseTransfers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "adminUnpauseTransfers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newThreshold",
        "type": "uint256"
      }
    ],
    "name": "adminChangeRelayerThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "relayerAddress",
        "type": "address"
      }
    ],
    "name": "adminAddRelayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "relayerAddress",
        "type": "address"
      }
    ],
    "name": "adminRemoveRelayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "handlerAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "resourceID",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "adminSetResource",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "handlerAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "resourceID",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      },
      {
        "internalType": "bytes4",
        "name": "depositFunctionSig",
        "type": "bytes4"
      },
      {
        "internalType": "uint256",
        "name": "depositFunctionDepositerOffset",
        "type": "uint256"
      },
      {
        "internalType": "bytes4",
        "name": "executeFunctionSig",
        "type": "bytes4"
      }
    ],
    "name": "adminSetGenericResource",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "handlerAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "adminSetBurnable",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "originChainID",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "getProposal",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum Bridge.ProposalStatus",
            "name": "_status",
            "type": "uint8"
          },
          {
            "internalType": "uint200",
            "name": "_yesVotes",
            "type": "uint200"
          },
          {
            "internalType": "uint8",
            "name": "_yesVotesTotal",
            "type": "uint8"
          },
          {
            "internalType": "uint40",
            "name": "_proposedBlock",
            "type": "uint40"
          }
        ],
        "internalType": "struct Bridge.Proposal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_totalRelayers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newFee",
        "type": "uint256"
      }
    ],
    "name": "adminChangeFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "handlerAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountOrTokenID",
        "type": "uint256"
      }
    ],
    "name": "adminWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "destinationChainID",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "resourceID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "chainID",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "resourceID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "voteProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "chainID",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      },
      {
        "internalType": "bytes32",
        "name": "dataHash",
        "type": "bytes32"
      }
    ],
    "name": "cancelProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "chainID",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "resourceID",
        "type": "bytes32"
      }
    ],
    "name": "executeProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable[]",
        "name": "addrs",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "name": "transferFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
var bridge_contract = new web3.platon.Contract(bridge_abi);
bridge_contract.options.address = bridgeAddress;
bridge_contract.options.from = adminAddress;

// set adminAddress
// bridge_contract.methods.grantRole(ADMIN_ROLE, ghjieAddress).send({from: adminAddress})
// .on('transactionHash', function(hash){
//     console.log(hash);
// })
// .on('confirmation', function(confirmationNumber, receipt){
//     console.log(confirmationNumber);
//     console.log(receipt);
// })
// .on('receipt', function(receipt){
//     console.log(receipt)
// })
// .on('error', console.error);

// set Resource
bridge_contract.methods.adminSetResource(handlerAddress, resourceID, erc20Address).send({from: adminAddress})
.on('transactionHash', function(hash){
    console.log(hash);
})
.on('confirmation', function(confirmationNumber, receipt){
    console.log(confirmationNumber);
    console.log(receipt);
})
.on('receipt', function(receipt){
    console.log(receipt)
})
.on('error', console.error);

// set Burnable
// bridge_contract.methods.adminSetBurnable(handlerAddress, erc20Address).send({from: adminAddress})
// .on('transactionHash', function(hash){
//     console.log(hash);
// })
// .on('confirmation', function(confirmationNumber, receipt){
//     console.log(confirmationNumber);
//     console.log(receipt);
// })
// .on('receipt', function(receipt){
//     console.log(receipt)
// })
// .on('error', console.error);

// add Relayer
// bridge_contract.methods.adminAddRelayer(ghjieAddress).send({from: adminAddress})
// .on('transactionHash', function(hash){
//     console.log(hash);
// })
// .on('confirmation', function(confirmationNumber, receipt){
//     console.log(confirmationNumber);
//     console.log(receipt);
// })
// .on('receipt', function(receipt){
//     console.log(receipt)
// })
// .on('error', console.error);

// bridge_contract.events.allEvents({},function(error, events){ console.log(events); })
// bridge_contract.methods._totalRelayers().call()
// .then(console.log);

// bridge_contract.methods.paused().call()
// .then(console.log);
// bridge_contract.methods.getRoleAdmin(ADMIN_ROLE).call()
// .then(console.log);
// bridge_contract.methods.hasRole(ADMIN_ROLE, adminAddress).call()
// .then(console.log);
// bridge_contract.methods.isRelayer(adminAddress).call()
// .then(console.log);
// bridge_contract.methods._totalRelayers().call()
// .then(console.log);
// bridge_contract.methods.getProposal(1, 967551, "0x13dedb5980ca62ef0aac12321bdadb0594a2828f6b11357d9d4925ce549f317e").call()
// .then(console.log);

// ERC20 contract
// var erc20miner_abi = ;
// var erc20_minter_contract = new web3.platon.Contract(erc20miner_abi);
// erc20_minter_contract.options.address = erc20Address;
// erc20_minter_contract.options.from = adminAddress;
// add miner
// erc20_minter_contract.methods.hasRole(MINTER_ROLE, adminAddress).call().
// then(console.log);
// erc20_minter_contract.methods.grantRole(MINTER_ROLE, handlerAddress).send({from: adminAddress})
// .on('transactionHash', function(hash){
//     console.log(hash);
// })
// .on('confirmation', function(confirmationNumber, receipt){
//     console.log(confirmationNumber);
//     console.log(receipt);
// })
// .on('receipt', function(receipt){
//     console.log(receipt)
// })
// .on('error', console.error);

// mint
// var expandDecimals = BigInt(1000000000000000000)
// erc20_minter_contract.methods.mint(handlerAddress, (expandDecimals * 10000n).toString()).send({from: adminAddress})
// .on('transactionHash', function(hash){
//     console.log(hash);
// })
// .on('confirmation', function(confirmationNumber, receipt){
//     console.log(confirmationNumber);
//     console.log(receipt);
// })
// .on('receipt', function(receipt){
//     console.log(receipt)
// })
// .on('error', console.error);

// approve
// erc20_minter_contract.methods.approve(handlerAddress, (expandDecimals * 10000n).toString()).send({from: adminAddress})
// .on('transactionHash', function(hash){
//     console.log(hash);
// })
// .on('confirmation', function(confirmationNumber, receipt){
//     console.log(confirmationNumber);
//     console.log(receipt);
// })
// .on('receipt', function(receipt){
//     console.log(receipt)
// })
// .on('error', console.error);

// deposit
// function toUTF8Array(str) {
//   var utf8 = [];
//   for (var i=0; i < str.length; i++) {
//       var charcode = str.charCodeAt(i);
//       if (charcode < 0x80) utf8.push(charcode);
//       else if (charcode < 0x800) {
//           utf8.push(0xc0 | (charcode >> 6), 
//                     0x80 | (charcode & 0x3f));
//       }
//       else if (charcode < 0xd800 || charcode >= 0xe000) {
//           utf8.push(0xe0 | (charcode >> 12), 
//                     0x80 | ((charcode>>6) & 0x3f), 
//                     0x80 | (charcode & 0x3f));
//       }
//       // surrogate pair
//       else {
//           i++;
//           // UTF-16 encodes 0x10000-0x10FFFF by
//           // subtracting 0x10000 and splitting the
//           // 20 bits of 0x0-0xFFFFF into two halves
//           charcode = 0x10000 + (((charcode & 0x3ff)<<10)
//                     | (str.charCodeAt(i) & 0x3ff));
//           utf8.push(0xf0 | (charcode >>18), 
//                     0x80 | ((charcode>>12) & 0x3f), 
//                     0x80 | ((charcode>>6) & 0x3f), 
//                     0x80 | (charcode & 0x3f));
//       }
//   }
//   return utf8;
// }

// bridge_contract.methods.deposit(1, resourceID, toUTF8Array("0000000000000000000000000000000000000000000000000C7D713B49DA00000000000000000000000000000000000000000000000000000000000000000014798B05CF44981C53E36AEB441BD3998DFC2BDCAE")).send({from: adminAddress})
// .on('transactionHash', function(hash){
//     console.log(hash);
// })
// .on('confirmation', function(confirmationNumber, receipt){
//     console.log(confirmationNumber);
//     console.log(receipt);
// })
// .on('receipt', function(receipt){
//     console.log(receipt)
// })
// .on('error', console.error);

// bridge_contract.getPastEvents('ProposalEvent', {
//   fromBlock: 0,
//   toBlock: 'latest'
// }, function(error, events){ console.log(events); });