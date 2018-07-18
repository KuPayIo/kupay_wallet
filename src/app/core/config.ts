/**
 * config file
 */
export const config = {
    dev_mode: 'dev',
    dev: {
        // tslint:disable-next-line:no-http-string
        BtcApiBaseUrl: 'http://192.168.33.154:3002/insight-api',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY'
    },

    prod: {
        BtcApiBaseUrl: '',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY'
    }
};
