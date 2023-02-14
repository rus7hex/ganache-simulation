import Ganache from "ganache";
import { ethers } from "ethers";


// keungz.eth
const account = "0x6C8Ee01F1f8B62E987b3D18F6F28b22a0Ada755f";


const ganache = Ganache.provider({
    chain: {
        asyncRequestProcessing: false,
    },
    wallet: {
        totalAccounts: 0,
        unlockedAccounts: [account]
    },
    fork: {
        url: "https://eth.llamarpc.com",
        blockNumber: 16599830,
        disableCache: true,
        deleteCache: true,
    }
});
const web3 = new ethers.BrowserProvider(ganache);

const balance = await ganache.send("eth_getBalance", [account]);
console.log(parseInt(balance, 16) / 1e18);

await ganache.send("eth_subscribe", ["logs"]);

const txid = await ganache.send("eth_sendTransaction", [{
    from: account,
    to: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
    data: "0x8264fe980000000000000000000000000000000000000000000000000000000000001cbd",
    value: `0x${(128 * 1e18).toString(16)}`,
}]);

const event = await ganache.once("message");
console.log(event);
console.log(event.data.result.topics);

const receipt = await ganache.send("eth_getTransactionReceipt", [txid]);
console.log(JSON.stringify(receipt))

const code = await web3.getCode("0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb");
const iface = new ethers.Interface(code);

for (const log of receipt.logs) {
    const event = iface.parseLog(
        log.topics,
        log.data,
    );

    console.log(event)
}
