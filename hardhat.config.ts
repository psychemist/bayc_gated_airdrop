import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const { vars } = require("hardhat/config");
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");
const ACCOUNT_PRIVATE_KEY = vars.get("ACCOUNT_PRIVATE_KEY");
const LISK_RPC_URL = vars.get("LISK_RPC_URL");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        // for testnet
        "lisk-sepolia": {
            url: LISK_RPC_URL!,
            accounts: [ACCOUNT_PRIVATE_KEY],
            gasPrice: 1000000000,
        },
        "sepolia": {
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            accounts: [ACCOUNT_PRIVATE_KEY],
        },
    },
    etherscan: {
        apiKey: {
            "lisk-sepolia": "123",
            "sepolia": ETHERSCAN_API_KEY,
        },
        customChains: [
            {
                network: "lisk-sepolia",
                chainId: 4202,
                urls: {
                    apiURL: "https://sepolia-blockscout.lisk.com/api",
                    browserURL: "https://sepolia-blockscout.lisk.com/",
                },
            },
        ],
    },
    sourcify: {
        enabled: false,
    },
};

export default config;