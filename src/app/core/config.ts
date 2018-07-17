/**
 * config file
 */
export const config = {
    dev_mode: 'dev',
    dev: {
        BtcApiBaseUrl: 'http://localhost:3002/insight-api',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY'
    },

    prod: {
        BtcApiBaseUrl: '',
        BtcMarketPriceOracleUrl: 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY'
    }
};
