import { dev_mode, DevMode } from '../config';

/**
 * config file
 */
export const config = {
    // 当前网络处于什么环境  dev--开发，prod--发布
    dev_mode,
    [DevMode.Ropsten]: {
        // https://api.blockcypher.com/v1/btc/main
        // tslint:disable-next-line:no-http-string
        BtcApiBaseUrl: 'http://39.104.129.43:3002/insight-api',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY',
        // http://192.168.33.115:8545       
        EthApiBaseUrl: 'https://ropsten.infura.io/Y4zS49bjsYwtRU3Tt4Yj',
        EthMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1027/?convert=CNY',
        EthscanRopstenUrl: 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=',
        EthscanRopstenTokenTransferEvent: 'https://api-ropsten.etherscan.io/api?module=account&action=tokentx'
    },
    [DevMode.Rinkeby]: {
        // https://api.blockcypher.com/v1/btc/main
        // tslint:disable-next-line:no-http-string
        BtcApiBaseUrl: 'http://39.104.129.43:3002/insight-api',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY',
        // https://rinkeby.infura.io/Y4zS49bjsYwtRU3Tt4Yj
        // http://192.168.33.115:8545       
        EthApiBaseUrl: 'https://rinkeby.infura.io/Y4zS49bjsYwtRU3Tt4Yj',
        EthMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1027/?convert=CNY',
        EthscanRopstenUrl: 'http://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=',
        EthscanRopstenTokenTransferEvent: 'https://api-rinkeby.etherscan.io/api?module=account&action=tokentx'
    },
    [DevMode.Prod]: {
        BtcApiBaseUrl: 'http://39.104.129.43:3001/insight-api',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY',
        EthApiBaseUrl: 'https://mainnet.infura.io/Y4zS49bjsYwtRU3Tt4Yj',
        EthMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1027/?convert=CNY',
        EthscanRopstenUrl: 'http://api.etherscan.io/api?module=account&action=txlist&address=',
        EthscanRopstenTokenTransferEvent: 'https://api.etherscan.io/api?module=account&action=tokentx'
    }
};

export const getEthApiBaseUrl = () => {
    let ETH_API_BASE_URL;
    if (config.dev_mode === DevMode.Ropsten) {
        ETH_API_BASE_URL = config[DevMode.Ropsten].EthApiBaseUrl;
    } else if (config.dev_mode === DevMode.Rinkeby) {
        ETH_API_BASE_URL = config[DevMode.Rinkeby].EthApiBaseUrl;
    } else if (config.dev_mode === DevMode.Prod) {
        ETH_API_BASE_URL = config[DevMode.Prod].EthApiBaseUrl;
    }
    
    return ETH_API_BASE_URL;
};