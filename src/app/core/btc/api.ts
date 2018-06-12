export class Api {
    static BASE_URL = 'https://api.blockcypher.com';
    static ESTIMATION_FEE_URL = 'https://bitcoinfees.earn.com/api/v1/fees/recommended';
    static WEBSOCKET_URL = "wss://socket.blockcypher.com/v1/btc/test3";

    public eventQueue = [];
    private wss;

    constructor() {
        // https://blockcypher.github.io/documentation/#websockets
        // transaction json format: https://blockcypher.github.io/documentation/#transactions    
        this.wss = new WebSocket(Api.WEBSOCKET_URL);
        var self = this;
        self.wss.onmessage = (event) => {
            let payload = JSON.parse(event.data);
            console.log(payload);
            //filter "pong" message
            if(payload.event !== "pong")
                this.eventQueue.push(payload);
        }

        this.wss.onopen = (event) => {
            event = event;
            // send "ping" message every 20s
            setInterval(function(){self.wss.send(JSON.stringify({"event": "ping"}))}, 20000);
        }
    }

    // batch request, 3 addresses at once.
    async getAddrInfo(address: string | string[], unspentOnly = false): Promise<any> {
        if(Array.isArray(address)) {
            address = address.join(';');
        }
        let path = unspentOnly ? Api.BASE_URL + `/v1/btc/test3/addrs/${address}?unspentOnly=true`:
                                Api.BASE_URL + `/v1/btc/test3/addrs/${address}`;

        try {
            let  response = await fetch(path);
            let data = await response.json();
            return data;
        } catch (e) {
            Promise.reject(e);
        }
    }

    async sendRawTransaction(rawHexString: string): Promise<any> {
        try {
            let path = Api.BASE_URL + '/v1/btc/test3/txs/push';
            let response = await fetch(path, {
                method: 'POST',
                body: JSON.stringify({"tx": rawHexString})
            });
            let data = await response.json();
            return data;
        } catch(e) {
            Promise.reject(e);
        }
    }

    async getTxInfo(txHash: string): Promise<any> {
        let path = Api.BASE_URL + `/v1/btc/test3/txs/${txHash}`;

        try {
            let response = await fetch(path);
            let data = await response.json();
            return data;
        } catch(e) {
            Promise.reject(e);
        }
    }

    async feePerByte(): Promise<any> {
        try {
            let response = await fetch(Api.ESTIMATION_FEE_URL);
            let data = await response.json();
            return data;
        } catch(e) {
            Promise.reject(e);
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
    sub(address: string, confirmations = 6, event = "tx-confirmation"): void {
        try {
            let self = this;
            setTimeout(function(){
                self.wss.send(JSON.stringify({"event": event, "address": address, "confirmations": confirmations}));
            }, 2000);            
        } catch(e) {
            throw new Error("Error while sending subscribe events to api provider");
        }
    }
}
