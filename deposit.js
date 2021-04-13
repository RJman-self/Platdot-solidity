const { toUtf8Bytes } = require('ethers/utils');
var Web3 = require('web3');
const { hexToBytes, utf8ToHex, bytesToHex } = require('web3/packages/web3-utils');
const Helpers = require('./test/helpers');

var web3 = new Web3('http://47.110.34.31:6789');
var expandDecimals = BigInt(1000000000000000000)

ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
RELAYER_ROLE = "0xe2b7fb3b832174769106daebcfd6d1970523240dda11281102db9363b83b0dc4";
MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
PAUSER_ROLE = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";

adminAddress = "atp18hqda4eajphkfarxaa2rutc5dwdwx9z5vy2nmh";

// ghjieAddress = "atx1zu77fupk4knf96c3a8txttpdr7gxe3rcmpp42m";
rjmanAddress = "atp1sy2tvmghdv47hwz89yu9wz2y29nd0frr9jzd2m";
// Relayer1 = "atp1hfhgzgluf9qneuguyw36jrnnsexn388d2lu6xr";
// Relayer2 = "atp1kaptzrfz7v8w4xn7xw88nuxmt5e5uyvhysxqth";
// Relayer3 = "atp1tdk4rtlu3pv440r96hqn8s33et7kn25730tpjr";
// #### RJman


bridgeAddress = "atp15ysxv3f9qudxnlu8cel9sx6lp6asguful3yz5z";
handlerAddress = "atp142a30tfa8jae8gpxhn2xye0hyy9xlmnaajpapa";
erc20Address = "atp1s8y6ulfaajje430erl5nnf0q3szy0g5g7u03dt";
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



// bridge_contract.methods.deposit(1, resourceID, "0x3062353365663136623336313737636434623737623834366632613566303763").send({from: rjmanAddress})
// .on('transactionHash', function(hash){
//     console.log(hash);
// })

bridge_contract.getPastEvents('ProposalEvent', {
     fromBlock: 0,
     toBlock: 'latest'
 }, function(error, events){ console.log(events); });

// bridge_contract.methods.getProposal(
//   1,
//   134101, 
//   "0x7ea4b942ab973337f68ba8be7c98b10418cc7da64b5763fdab574c1f124ca4ee").call()
// .then(console.log);
