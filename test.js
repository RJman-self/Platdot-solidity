var Web3 = require('web3');
const Helpers = require('./test/helpers');
const { hexToBytes, hexToUtf8, toUtf8 } = require('web3/packages/web3-utils');

var web3 = new Web3('http://127.0.0.1:6789');

ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
RELAYER_ROLE = "0xe2b7fb3b832174769106daebcfd6d1970523240dda11281102db9363b83b0dc4";
MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
PAUSER_ROLE = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";

adminAddress = "atx18hqda4eajphkfarxaa2rutc5dwdwx9z5xzkega";
ghjieAddress = "atx1zu77fupk4knf96c3a8txttpdr7gxe3rcmpp42m";
rjmanAddress = "atx1sy2tvmghdv47hwz89yu9wz2y29nd0frr0578e3";

bridgeAddress = "atx1762m2ryuvnnrk3d9q6gfy6whk29n59xu34typ5";
handlerAddress = "atx1t3zvgf73mmhzax24epgv02vqznzw24a5m78cnz";
erc20Address = "atx1lfhrcc6xectcfe850kf83rcntlw0ha7wck9qjz";
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

// deposit

// helper
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

const PolkadotRecipient = "0x1cbd2d43530a44705ad088af313e18f80b53ef16b36177cd4b77b846f2a5f07c"
depositData = Helpers.createERCDepositData(
  1000,
  20,
  PolkadotRecipient);
console.log(depositData)
// bridge_contract.methods.deposit(1, resourceID, depositData).send({from: adminAddress, value: 0})
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

// set adminAddress

// bridge_contract.methods.grantRole(ADMIN_ROLE, rjmanAddress).send({from: adminAddress})
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

// set RelayerThreshold

// bridge_contract.methods.adminChangeRelayerThreshold(1).send({from: adminAddress})
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


// set DepositFee

// bridge_contract.methods.adminChangeFee(0).send({from: adminAddress})
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

// bridge_contract.methods.adminSetResource(handlerAddress, resourceID, erc20Address).send({from: adminAddress})
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

// adminWithdraw
// bridge_contract.methods.adminWithdraw(handlerAddress, erc20Address, ghjieAddress, 10000).send({from: adminAddress})
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

// vote Proposal
// bridge_contract.methods.voteProposal(1, 0, resourceID, resourceID).send({from: rjmanAddress})
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

// execute Proposal
// calldata = "0x0000000000000000000000000000000000000000000000000000000000000000";

// bridge_contract.methods.executeProposal(1, 0, hexToBytes(calldata), resourceID).send({from: rjmanAddress})
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


// adminUnpauseTransfers
// bridge_contract.methods.adminUnpauseTransfers().send({from: adminAddress})
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


// bridge_contract.methods.adminAddRelayer(adminAddress).send({from: adminAddress})
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

// bridge_contract.methods.adminAddRelayer(rjmanAddress).send({from: adminAddress})
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

// bridge_contract.methods.paused().call()
// .then(console.log);
// bridge_contract.methods.getRoleMember(RELAYER_ROLE, 4).call()
// .then(console.log);
// bridge_contract.methods.hasRole(ADMIN_ROLE, adminAddress).call()
// .then(console.log);
// bridge_contract.methods.isRelayer(ghjieAddress).call()
// .then(console.log);
// bridge_contract.methods._totalRelayers().call()
// .then(console.log);
// bridge_contract.methods.getProposal(1, 967551, "0x13dedb5980ca62ef0aac12321bdadb0594a2828f6b11357d9d4925ce549f317e").call()
// .then(console.log);


// ERC20 contract
var erc20miner_abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
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
        "indexed": true,
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "previousAdminRole",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newAdminRole",
        "type": "bytes32"
      }
    ],
    "name": "RoleAdminChanged",
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
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
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
    "name": "MINTER_ROLE",
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
    "name": "PAUSER_ROLE",
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
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
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
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "burnFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
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
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
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
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
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
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
var erc20_minter_contract = new web3.platon.Contract(erc20miner_abi);
erc20_minter_contract.options.address = erc20Address;
erc20_minter_contract.options.from = adminAddress;

// unpause
// erc20_minter_contract.methods.unpause().send({from: adminAddress})
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

// balance 

// erc20_minter_contract.methods.balanceOf(adminAddress).call()
// .then(console.log);

// erc20_minter_contract.methods.totalSupply().call()
// .then(console.log);


// erc20_minter_contract.methods.hasRole(MINTER_ROLE, handlerAddress).call().
// then(console.log);

// allow the handler to directly process your amount
// erc20_minter_contract.methods.allowance(rjmanAddress, handlerAddress).call()
// .then(console.log);

// fundERC20
// erc20_minter_contract.methods.fundERC20(erc20Address, ghjieAddress, 10000).send({from: ghjieAddress})
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

// add miner
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

// // mint
var expandDecimals = BigInt(1000000000000000000)

// erc20_minter_contract.methods.mint(bridgeAddress, (expandDecimals * 10000000n).toString()).send({from: adminAddress})
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

// erc20_minter_contract.methods.mint(handlerAddress, (expandDecimals * 10000000n).toString()).send({from: adminAddress})
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

// erc20_minter_contract.methods.mint(adminAddress, (expandDecimals * 10000000n).toString()).send({from: adminAddress})
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
// erc20_minter_contract.methods.approve(handlerAddress, (expandDecimals * 10000000n).toString()).send({from: rjmanAddress})
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
//   fromBlock: 156308,
//   toBlock: 'latest'
// }, function(error, events){ console.log(events); });

// bridge_contract.getPastEvents('Deposit', {
//   fromBlock: 231034,
//   toBlock: 'latest'
// }, function(error, events){ console.log(events); });

// erc20_minter_contract.getPastEvents('Approval', {
//   fromBlock: 16631,
//   toBlock: 'latest'
// }, function(error, events){ console.log(events); });


var handler_abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "bridgeAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32[]",
        "name": "initialResourceIDs",
        "type": "bytes32[]"
      },
      {
        "internalType": "address[]",
        "name": "initialContractAddresses",
        "type": "address[]"
      },
      {
        "internalType": "address[]",
        "name": "burnableContractAddresses",
        "type": "address[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "_bridgeAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "_burnList",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "_contractWhitelist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "_depositRecords",
    "outputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_destinationChainID",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "_resourceID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "_destinationRecipientAddress",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_depositer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "_resourceIDToTokenContractAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "_tokenContractAddressToResourceID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "fundERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "name": "setBurnable",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "resourceID",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "contractAddress",
        "type": "address"
      }
    ],
    "name": "setResource",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      },
      {
        "internalType": "uint8",
        "name": "destId",
        "type": "uint8"
      }
    ],
    "name": "getDepositRecord",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "_tokenAddress",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "_destinationChainID",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "_resourceID",
            "type": "bytes32"
          },
          {
            "internalType": "bytes",
            "name": "_destinationRecipientAddress",
            "type": "bytes"
          },
          {
            "internalType": "address",
            "name": "_depositer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "internalType": "struct ERC20Handler.DepositRecord",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "resourceID",
        "type": "bytes32"
      },
      {
        "internalType": "uint8",
        "name": "destinationChainID",
        "type": "uint8"
      },
      {
        "internalType": "uint64",
        "name": "depositNonce",
        "type": "uint64"
      },
      {
        "internalType": "address",
        "name": "depositer",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
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
    "name": "executeProposal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
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
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

var handler_contract = new web3.platon.Contract(handler_abi);
handler_contract.options.address = handlerAddress;
handler_contract.options.from = adminAddress;

// handler_contract.methods.getDepositRecord(154, 1).call()
// .then(console.log)

// erc20_minter_contract.getPastEvents('Approval', {
//   fromBlock: 16631,
//   toBlock: 'latest'
// }, function(error, events){ console.log(events); });