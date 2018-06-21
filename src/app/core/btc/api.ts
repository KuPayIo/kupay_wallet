/**
 * BTC api
 */
export class Api {
    public static BASE_URL: string = 'https://api.blockcypher.com';
    public static ESTIMATION_FEE_URL: string = 'https://bitcoinfees.earn.com/api/v1/fees/recommended';
    public static WEBSOCKET_URL: string = 'wss://socket.blockcypher.com/v1/btc/test3';
    public static BTC_CMC_URL: string = 'https://api.coinmarketcap.com/v2/ticker/1/?convert=CNY';

    public eventQueue: any = [];
    private wss: any;

    /* tslint:disable:prefer-template */
    /* tslint:disable: no-redundant-jsdoc*/
    /* tslint:disable: no-this-assignment*/

    constructor() {
        // https://blockcypher.github.io/documentation/#websockets
        // transaction json format: https://blockcypher.github.io/documentation/#transactions

        // this.wss = new WebSocket(Api.WEBSOCKET_URL);
        // const self = this;
        // self.wss.onmessage = (event) => {
        //     const payload = JSON.parse(event.data);
        //     // filter "pong" message
        //     if (payload.event !== 'pong') {
        //         this.eventQueue.push(payload);
        //     }
        // };

        // this.wss.onopen = (event) => {
        //     event = event;
        //     // send "ping" message every 20s
        //     setInterval(() => {
        //         self.wss.send(JSON.stringify({ event: 'ping' }));
        //     }, 20000);
        // };
    }

    // batch request, 3 addresses at once.
    public async getAddrInfo(address: string | string[], unspentOnly: boolean = false): Promise<any> {
        if (Array.isArray(address)) {
            address = address.join(';');
        }

        const path = unspentOnly ? Api.BASE_URL + `/v1/btc/test3/addrs/${address}?unspentOnly=true` :
                                Api.BASE_URL + `/v1/btc/test3/addrs/${address}`;

        try {
            const  response = await fetch(path);

            return await response.json();
        } catch (e) {
            Promise.reject(e);
        }
    }

    public async sendRawTransaction(rawHexString: string): Promise<any> {
        try {
            const path = Api.BASE_URL + '/v1/btc/test3/txs/push';
            const response = await fetch(path, {
                method: 'POST',
                body: JSON.stringify({ tx: rawHexString })
            });

            return await response.json();
        } catch (e) {
            Promise.reject(e);
        }
    }

    public async getTxInfo(txHash: string): Promise<any> {
        const path = Api.BASE_URL + `/v1/btc/test3/txs/${txHash}`;

        try {
            const response = await fetch(path);

            return await response.json();
        } catch (e) {
            Promise.reject(e);
        }
    }

    public async feePerByte(): Promise<any> {
        try {
            const response = await fetch(Api.ESTIMATION_FEE_URL);

            return await response.json();
        } catch (e) {
            Promise.reject(e);
        }
    }

    public async getExchangeRate(): Promise<{}> {
        try {
            const response = await fetch(Api.BTC_CMC_URL);
            const data = await response.json();

            return {
                CNY: data.data.quotes.CNY.price,
                USD: data.data.quotes.USD.price
            };
        } catch (e) {
            return Promise.reject(e);
        }
    }

    /**
     * Subscribe incoming coins event
     *
     * @param {string} address Which address to detect?
     * @param {number} [confirmations=6] Default to 6 confirmations
     * @param {string} [event="tx-confirmation"] Event type
     * @memberof Api
     */
    public sub(address: string, confirmations: number = 6, event: string = 'tx-confirmation'): void {
        try {
            const self = this;
            // setTimeout(() => {
            //     self.wss.send(JSON.stringify({ event: event, address: address, confirmations: confirmations }));
            // }, 2000);
        } catch (e) {
            throw new Error('Error while sending subscribe events to api provider');
        }
    }
}
