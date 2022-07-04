/**
 * Read documentation on Inbox.test.js for more details
 * about module usages
 */
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const { abi, evm } = require("./compile");

/**
 ** Remember to duplicate the mnemonic.js.sample and
 ** the infuraAPI.js.sample into .js files and put
 ** your own mnemonic and infuraAPI key in there.
 */
const mnemonic = require("./mnemonic");
const infuraAPI = require("./infuraAPI");
const provider = new HDWalletProvider(mnemonic, infuraAPI);
const web3 = new Web3(provider);

let accounts;
let inbox;
const INITIAL_MESSAGE = "Hi there!";

/**
 * To use the async/await syntax, we need to
 * wrap the code in a function
 */
const deploy = async () => {
    accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: "1000000" });

    console.log("Contract deployed to: ", inbox.options.address);

    // To prevent the hanging deployment
    provider.engine.stop();
};
deploy();

/**
 * Attempting to deploy from account 0x6a10491a8fDD29e3E8b0598bDAf95acc0E89A296
 * Contract deployed to:  0x15A4dd28F0aFf9b7D5752E5340fa97B413fdcabF
 */