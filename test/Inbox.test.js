/**
 * Modules usage explanation:
 * 
 * - "assert": For making assertions about the test,
 * mostly used to assert some value is equal to another
 * 
 * - "ganache-cli": for deploying a local test network
 * 
 * - "web3": a library for interacting with the test network
 * (here only use web3 constructor, hence using a capital Web3)
 * (web3 only supports promises + async/await since v1.*.*)
 * 
 * - provider(): a communication layer between web3 library 
 * and some specific ETH network, which is Ganache (the 
 * local test network) in this case
 */
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

/**
 * Mocha functions:
 * - it: Run a test and make an assertion
 * - describe: Group "it" tests together
 * - beforeEach: Execute some general setup code before each test
 */
let accounts;
let inbox;
const INITIAL_MESSAGE = "Hi there!";
const NEW_MESSAGE = "Hello there!";

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_MESSAGE] })
        .send({ from: accounts[0], gas: "1000000" });
});

describe("Inbox", () => {
    it("should deploy a contract", () => {
        // assert.ok makes an assertion of what is
        // passed into the function is truthy
        assert.ok(inbox.options.address);
    });

    it("should have a default message", async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_MESSAGE);
    });

    it("should be able to change the message", async () => {
        await inbox.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, NEW_MESSAGE);
    });
});
