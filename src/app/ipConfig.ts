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
export const erlangLogicIp = sourceIp;

// erlang逻辑服务器port
export const erlangLogicPort = '2081';

// 活动逻辑服务器ip
export const activeLogicIp = '192.168.9.30';   //何宗林

// 活动逻辑服务器port
export const activeLogicPort = 2234;

// 聊天逻辑服务器ip
export const chatLogicIp = sourceIp;

// 聊天逻辑服务器port
export const chatLogicPort = 1234;

console.log('sourceIp=',sourceIp);
console.log('sourcePort=',sourcePort);

console.log('erlangLogicIp=',erlangLogicIp);
console.log('erlangLogicPort=',erlangLogicPort);

console.log('activeLogicIp=',activeLogicIp);
console.log('activeLogicPort=',activeLogicPort);

console.log('chatLogicIp=',chatLogicIp);
console.log('chatLogicPort=',chatLogicPort);