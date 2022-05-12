// contract test code will go here
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

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
        // assert.ok makes an assertion that what is
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
