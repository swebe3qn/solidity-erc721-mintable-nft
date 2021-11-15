const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const AccountIndex = 0;

require('dotenv').config({path: './.env'});

const Mnemonic = process.env.MNEMONIC;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      network_id: '*',
      host: '127.0.0.1'
    },
    ganache_local: {
      provider: function() {
        return new HDWalletProvider(Mnemonic, "http://127.0.0.1:7545", AccountIndex)
      },
      network_id: '*'
    },
    ropsten_infura: {
      provider: function() {
        return new HDWalletProvider(Mnemonic, "https://ropsten.infura.io/v3/5c8c58fc6bc143168a8ebf3b6944c138", AccountIndex)
      },
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: '0.8.7'
    }
  }
};
