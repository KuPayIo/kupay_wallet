/**
 * 服务IP配置
 */

declare var pi_modules: any;
// 资源服务器ip
export const sourceIp = pi_modules.store.exports.severIp || '127.0.0.1';

// 资源服务器port
export const sourcePort = pi_modules.store.exports.severPort || '80';

// erlang逻辑服务器ip
// app.herominer.net
// export const erlangLogicIp = '192.168.9.30';   //何宗林
export const erlangLogicIp = sourceIp; 

// erlang逻辑服务器port
export const erlangLogicPort = '2081';

// 活动逻辑服务器ip
// export const activeLogicIp = '192.168.9.30';   //何宗林
export const activeLogicIp = sourceIp;

// 活动逻辑服务器port
export const activeLogicPort = 2234;

// 聊天逻辑服务器ip 
// 外网正式 39.104.203.151
export const chatLogicIp = sourceIp;

// 聊天逻辑服务器port
// 外网正式 9080
export const chatLogicPort = 9080;

console.log('sourceIp=',sourceIp);
console.log('sourcePort=',sourcePort);

console.log('erlangLogicIp=',erlangLogicIp);
console.log('erlangLogicPort=',erlangLogicPort);

console.log('activeLogicIp=',activeLogicIp);
console.log('activeLogicPort=',activeLogicPort);

console.log('chatLogicIp=',chatLogicIp);
console.log('chatLogicPort=',chatLogicPort);