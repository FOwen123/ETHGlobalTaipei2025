export const contractAddress = "0xc8a2d4C87BEa01da4583f344543F3c5CfC40E58c";

export const contractAbi = [
  {
    inputs: [],
    name: "Betcha__BetAmountMusbtBeGreaterThanZero",
    type: "error",
  },
  { inputs: [], name: "Betcha__BetIsNotOpen", type: "error" },
  { inputs: [], name: "Betcha__IncorrectAmount", type: "error" },
  { inputs: [], name: "Betcha__InvalidOpponent", type: "error" },
  { inputs: [], name: "Betcha__NotResolvableYet", type: "error" },
  { inputs: [], name: "Betcha__NotTheInvitedOpponent", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "opponent",
        type: "address",
      },
    ],
    name: "BetAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BetCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "betId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "BetResolved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "NotificationSend",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "_betId", type: "uint256" }],
    name: "acceptBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "bets",
    outputs: [
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "address", name: "opponent", type: "address" },
      { internalType: "uint256", name: "betAmount", type: "uint256" },
      { internalType: "uint256", name: "distanceGoal", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint256", name: "opponentDistance", type: "uint256" },
      { internalType: "string", name: "betDescription", type: "string" },
      { internalType: "enum Betcha.BetStatus", name: "status", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_opponent", type: "address" },
      { internalType: "uint256", name: "_distanceGoal", type: "uint256" },
      { internalType: "uint256", name: "_deadline", type: "uint256" },
      { internalType: "string", name: "_desc", type: "string" },
    ],
    name: "createBet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
];
