action.js->createNewVaultAndKeychain->metamask-controller.js

metamask-controller.js->this.createVaultMutex.acquire()

eth-keyring-controller(module)->persistAllKeyrings//给密码加密，并且存在了store里
//每次对账户的更改都会重新调用该函数

browser-passworder(module)->generateSalt//这个方法可以直接复制粘贴使用importKey+deriveKey双重加密

eth-hd-keyring(module)->deserialize->addAccounts

助记词的生成遵循Bitcoin BIP39规范：JS实现bip39 

https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
BIP39的流程：https://www.jianshu.com/p/700b4e264521
这种钱包可以从种子生成母钥，子钥，孙钥，形成层级结构。使用兼容HD钱包的根种子也可重新创造整个HD钱包。
所以知识转移HD钱包的根种子就可以实现让HD钱包中所包含的成千上百万的密钥被复制，储存导出以及导入
HD 钱包是生成不重复使用地址的方法 ，记住一个种子就可以访问所有地址的钱而不需要每个地址都备份私钥。

bitcoin BIP32规范:JS实现bip32

It consists of two parts: generating the mnemonic, and converting it into a binary seed. This seed can be later used to generate deterministic wallets using BIP-0032 or similar methods.

比特币密码学：http://www.lechain.com/portal.php?mod=view&aid=1137

备份了助记词或者种子就相当于备份您的所有钱包了

根密钥：![根秘钥](./root.png)

助记词->种子->钱包->hdkey->nodejs内置加密模块crypto

action.js -> placeSeedWords

eth-hd-keyring(module)->deserialize->_initFromMnemonic(根据助记词生成根密钥)
hdkey(module)->deriveChild
ethereumjs-wallet/hdkey.js(module)->derivePath(生成根密钥)
hdkey(module)->deriveChild(生成子钱包)
一个新钱包:![新钱包](./newWallet.png),只有私钥，私钥能生成公钥，公钥能生成地址

ethereumjs-wallet/hdkey.js(module)->getWallet(从私钥导出一个钱包)
ethereumjs-wallet/index.js(module)-> publicToAddress(从公钥导出地址)

keyring和助记词是对应的，一个keyring对应了一个助记词

eth-keyring-controller(module)

生成地址是一个完全本地的过程！跟服务器和区块链没有任何关系




获取账户信息:
setSelectedAddress
