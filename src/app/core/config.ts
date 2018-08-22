/**
 * config file
 */
export const config = {
    // 当前网络处于什么环境  dev--开发，prod--发布
    dev_mode: 'dev',
    dev: {
        // tslint:disable-next-line:no-http-string
        BtcApiBaseUrl: 'http://yinengyun.iok.la:3002/insight-api',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY',
        // https://ropsten.infura.io/Y4zS49bjsYwtRU3Tt4Yj
        // http://yinengyun.iok.la:8545
        EthApiBaseUrl: 'http://222.212.171.94:8545',
        EthMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1027/?convert=CNY',
        EthscanRopstenUrl: 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=',
        EthscanRopstenTokenTransferEvent: 'https://api-ropsten.etherscan.io/api?module=account&action=tokentx'
    },
    prod: {
        BtcApiBaseUrl: 'http://39.104.129.43:3001/insight-api',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY',
        EthApiBaseUrl: 'http://39.104.185.112:37298',
        EthMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1027/?convert=CNY',
        EthscanRopstenUrl: 'http://api.etherscan.io/api?module=account&action=txlist&address=',
        EthscanRopstenTokenTransferEvent: 'https://api.etherscan.io/api?module=account&action=tokentx'
    },
    ERC20TokensMainnet: {
        // mainnet
        BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        VEN: '0xd850942ef8811f2a866692a623011bde52a462c1',
        OMG: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
        ZRX: '0xe41d2489571d322189246dafa5ebde1f4699f498',
        MKR: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        XUC: '0xc324a2f6b05880503444451b8b27e6f9e63287cb',
        REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
        BTM: '0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750',
        GNT: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
        PPT: '0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a',
        SNT: '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
        AION: '0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466',
        FUN: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
        KNC: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
        MCO: '0xb63b606ac810a52cca15e44bb630fd42d8d1d83d',
        POWR: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
        MANA: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
        KIN: '0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5',
        VERI: '0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374'
    }, 
    ERC20TokensTestnet: {
        // testnet: ropsten
        // YNC: '0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        BNB: '0x1a8C96e79353EB39e169e9a2ED70B5297dcF9904',
        VEN: '0x8dc0c34aAe1F8Ef96480cDa6eACaf5587c1B4ccB',
        OMG: '0xF1076Dd18997A0e4A4Cd88502eb154148fc82018',
        ZRX: '0x0E1b61ddDbbe0ca418F20b6B8e356f9Df2687Bca',
        MKR: '0xB16F986BC0Db2A3f8cB7980c495caF47b7b6F9C4',
        BAT: '0x518EeE62abBC06adb46659928D77CB65CE3d5c5B',
        XUC: '0x329740F5f81FB0e02eE24a3dd95779089752905B',
        REP: '0xD3fb29e1d5386faea38fFb01A74bdfa2Fc056942',
        BTM: '0xb6A0954792F021D0c03b42d85Bf41b0BE2C835E1',
        USDT: '0x3569bd94f0A6d27BE3ee92bb6a20849a0635Adb6',
        PPT: '0xF58ee0c436Ba9F39A772F0F5f615be4D4307819a',
        SNT: '0xC003c2cFb6d9369CEaeBe8c62728E09160a096d9',
        AION: '0x3b018094BaFDC1A416ccCdbb83f18D3D666e3c44',
        FUN: '0x3111e6Aa5A49F72b2D19573723d6fe81a2E33eDB',
        KNC: '0x81C512d1b04b082cd519D4e72Cb5432E031Df4CC',
        // MCO: '0xBd01eC3a457918C67aDCfF65cDb68942171cd383',
        POWR: '0x81c6AC04761fe77a8b9190631980fa0aBcb9ad8C',
        MANA: '0xF7b2a69F5D625D390da1d1A3c26921E5c0E0E57c',
        KIN: '0x338713f113328F411D3b3A0E962DF0727844e938'
    }
};
