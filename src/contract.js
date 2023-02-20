import { Interface } from "@ethersproject/abi";


const erc20 = [
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
];

const erc721 = [
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "event Approval(address indexed owner, address indexed operator, uint256 indexed tokenId)",
    "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",

    // ERC-2309
    "event ConsecutiveTransfer(uint256 indexed fromTokenId, uint256 toTokenId, address indexed from, address indexed to)",
];

const erc1155 = [
    "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
    "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",
    "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
    "event URI(string value, uint256 indexed id)",
];


export function parseLog(log) {
    try {
        // token
        const iface = createInterface([...erc20]);
        return iface.parseLog(log);
    } catch (error) {
        // do nothing
    }

    try {
        // NFT
        const iface = createInterface([...erc721, ...erc1155]);
        return iface.parseLog(log);
    } catch (error) {
        // do nothing
    }

    throw Error("cannot parse log");
}

function createInterface(fragments) {
    const fragSet = {};
    for (const frag of fragments) {
        const head = frag.split('(');
        if (fragSet[head[0]]) continue;

        fragSet[head[0]] = frag;
    }

    return new Interface(Object.values(fragSet));
}