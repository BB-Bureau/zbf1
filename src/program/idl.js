export const idl = {
  version: "0.1.0",
  name: "zeus_anchor",
  instructions: [
    {
      name: "createUserBetAccount",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userBetAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "amm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "seed",
          type: "string",
        },
      ],
    },
    {
      name: "lateClaim",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "zeusInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userCollateralTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collateralTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userBetAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "claim",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "zeusInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userCollateralTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collateralTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userBetAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "amm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "sellBetForCollateral",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "zeusInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userCollateralTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collateralTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userBetAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "amm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "buyBetWithCollateral",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "zeusInfo",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userCollateralTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collateralTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userBetAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "amm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "ZeusInfo",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "operators",
            type: {
              vec: "publicKey",
            },
          },
          {
            name: "collateralTokenAccount",
            type: "publicKey",
          },
          {
            name: "maxSellPressure",
            type: "u128",
          },
          {
            name: "collateralMint",
            type: "publicKey",
          },
          {
            name: "currentInfoUrl",
            type: "string",
          },
        ],
      },
    },
    {
      name: "ZeusEvent",
      type: {
        kind: "struct",
        fields: [
          {
            name: "description",
            type: "string",
          },
          {
            name: "ammsPk",
            type: {
              vec: "publicKey",
            },
          },
        ],
      },
    },
    {
      name: "ZeusAmm",
      type: {
        kind: "struct",
        fields: [
          {
            name: "status",
            type: "u8",
          },
          {
            name: "eventPk",
            type: "publicKey",
          },
          {
            name: "code",
            type: "string",
          },
          {
            name: "autoclose",
            type: "u128",
          },
          {
            name: "amountCollateral",
            type: "u128",
          },
          {
            name: "amountOutcome",
            type: "u128",
          },
          {
            name: "amountOutcomeSold",
            type: "u128",
          },
        ],
      },
    },
    {
      name: "UserBet",
      type: {
        kind: "struct",
        fields: [
          {
            name: "user",
            type: "publicKey",
          },
          {
            name: "amountCollateral",
            type: "u128",
          },
          {
            name: "amountOutcome",
            type: "u128",
          },
          {
            name: "amm",
            type: "publicKey",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "Teapot",
      msg: "I'm a Teapot!",
    },
    {
      code: 6001,
      name: "NotOpen",
      msg: "Amm not open",
    },
  ],
  metadata: {
    address: "BXMH1F15xn9gZaMoY2hRdEwrnZf3JHeuXWLsZAuoeFhR",
  },
};
;
