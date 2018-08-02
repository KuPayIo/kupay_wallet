/**
 * ERC20 tokens that we are intrested in
 */
const ERC20TokensMainnet = {
    // mainnet
    BNB:'0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    VEN:'0xd850942ef8811f2a866692a623011bde52a462c1',
    OMG: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
    ZRX:'0xe41d2489571d322189246dafa5ebde1f4699f498',
    // ICX: '0xb5A5F22694352C15B00323844aD545ABb2B11028',
    MKR:'0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    BAT:'0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    XUC:'0xc324a2f6b05880503444451b8b27e6f9e63287cb',
    REP:'0x1985365e9f78359a9B6AD760e32412f4a445E862',
    BTM:'0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750',
    GNT:'0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
    PPT:'0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a',
    SNT:'0x744d70fdbe2ba4cf95131626614a1763df805b9e',
    // DGD:'0xe0b7927c4af23765cb51314a0e0521a9645f0e2a',
    AION:'0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466',
    // LRC:'0xef68e7c694f40c8202821edf525de3782458639f',
    FUN:'0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
    KNC:'0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    MCO:'0xb63b606ac810a52cca15e44bb630fd42d8d1d83d',
    POWR:'0x595832f8fc6bf59c85c527fec3740a1b7a361269',
    MANA:'0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    KIN:'0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5',
    VERI:'0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374',
    HEALP:'0x7b2f9706cd8473b4f5b7758b0171a9933fc6c4d6'
};
const ERC20TokensTestnet = {
    // testnet: ropsten
    YNC: '0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702'
};

// todo 测试网络与正式网络切换
export const ERC20Tokens = ERC20TokensMainnet;

// Basic ERC20 interfaces
export const minABI = [
    {
        constant: true,
        inputs: [
            {
                name: '_owner',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                name: 'balance',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                name: '',
                type: 'uint8'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_to',
                type: 'address'
            },
            {
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'transfer',
        outputs: [
            {
                name: 'success',
                type: 'bool'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];
