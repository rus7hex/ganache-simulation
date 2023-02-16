import { Interface } from "ethers";
import Axios from "axios";


const erc20 = [
    "event Transfer(address indexed _from, address indexed _to, uint256 _value)",
    "event Approval(address indexed _owner, address indexed _spender, uint256 _value)",
];

const erc721 = [
    "event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId)",
    "event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId)",
    "event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)",

    // ERC-2309
    "event ConsecutiveTransfer(uint256 indexed fromTokenId, uint256 toTokenId, address indexed fromAddress, address indexed toAddress)",
];

const erc1155 = [
    "event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value)",
    "event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values)",
    "event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)",
    "event URI(string _value, uint256 indexed _id)",
];

const defaultEvents = new Interface([...erc20, ...erc721, ...erc1155]);


export async function getContractInterface(contract) {
    try {
        const response = await Axios(
            `https://api.etherscan.io/api?module=contract&action=getabi&address=${contract}`
        );
        const abi = response.data.result;

        return new Interface(abi);
    } catch (error) {
        return defaultEvents;
    }
}