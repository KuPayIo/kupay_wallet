/**
 * config file
 */
// dev--开发，prod--发布
// tslint:disable-next-line:variable-name
export const dev_mode = 'dev';

// 主网erc20
const ERC20TokensMainnet = {
    BNB:{
        contractAddr:'0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        description:'BNB',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    VEN:{
        contractAddr:'0xd850942ef8811f2a866692a623011bde52a462c1',
        description:'VeChain',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    OMG:{
        contractAddr:'0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
        description:'OmiseGO',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    ZRX:{
        contractAddr:'0xe41d2489571d322189246dafa5ebde1f4699f498',
        description:'ZRX',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    MKR:{
        contractAddr:'0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
        description:'Maker',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    BAT:{
        contractAddr:'0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        description:'BAT',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    XUC:{
        contractAddr:'0xc324a2f6b05880503444451b8b27e6f9e63287cb',
        description:'ExchangeUnion',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    REP:{
        contractAddr:'0x1985365e9f78359a9B6AD760e32412f4a445E862',
        description:'Reputation',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    BTM:{
        contractAddr:'0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750',
        description:'Bytom',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    GNT:{
        contractAddr:'0xa74476443119A942dE498590Fe1f2454d7D4aC0d',
        description:'Golem',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    PPT:{
        contractAddr:'0xd4fa1460f537bb9085d22c7bccb5dd450ef28e3a',
        description:'Populous',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    SNT:{
        contractAddr:'0x744d70fdbe2ba4cf95131626614a1763df805b9e',
        description:'StatusNetwork',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    AION:{
        contractAddr:'0x4CEdA7906a5Ed2179785Cd3A40A69ee8bc99C466',
        description:'AION',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    FUN:{
        contractAddr:'0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
        description:'FunFair',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    KNC:{
        contractAddr:'0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
        description:'KyberNetwork',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    MCO:{
        contractAddr:'0xb63b606ac810a52cca15e44bb630fd42d8d1d83d',
        description:'Monaco',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    POWR:{
        contractAddr:'0x595832f8fc6bf59c85c527fec3740a1b7a361269',
        description:'PowerLedger',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    MANA:{
        contractAddr:'0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
        description:'Decentraland',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    KIN:{
        contractAddr:'0x818Fc6C2Ec5986bc6E2CBf00939d90556aB12ce5',
        description:'Kin',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    },
    VERI:{
        contractAddr:'0x8f3470A7388c05eE4e7AF3d01D8C722b0FF52374',
        description:'Veritaseum',
        decimals:18,
        rate:{ CNY: 1, USD: 1 }
    }
};

// 测试网erc20
const ERC20TokensTestnet = {
    BNB:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'BNB',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    VEN:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'VeChain',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    OMG:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'OmiseGO',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    ZRX:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'ZRX',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    MKR:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Maker',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    BAT:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'BAT',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    XUC:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'ExchangeUnion',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    REP:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Reputation',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    BTM:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Bytom',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    GNT:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Golem',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    PPT:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Populous',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    SNT:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'StatusNetwork',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    AION:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'AION',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    FUN:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'FunFair',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    KNC:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'KyberNetwork',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    MCO:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Monaco',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    POWR:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'PowerLedger',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    MANA:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Decentraland',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    KIN:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Kin',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    },
    VERI:{
        contractAddr:'0xBC23ef0B97954a0F7e0402A66B3EB5171DE19702',
        description:'Veritaseum',
        decimals:8,
        rate:{ CNY: 1, USD: 1 }
    }
};
// 导出ERC20Tokens
export const ERC20Tokens = dev_mode === 'dev' ?  ERC20TokensTestnet : ERC20TokensMainnet;

// 主网的币种
export const MainChainCoin = {
    ETH:{
        description:'Ethereum',
        rate:{ CNY: 3337.01, USD: 517.42 }
    },
    BTC:{
        description:'Bitcoin',
        rate:{ CNY: 42868.55, USD: 6598.71 }
    },
    KT:{
        description:'KT',
        rate:{ CNY:0.03,USD:0.19 }
    }
};

// 默认ETH ERC20转账地址,预估矿工费的时候使用
export const defaultEthToAddr = '0x040e7783A06e9b994F6e90DF5b2933C03F1b8F21';

// tslint:disable
export const Config = {
    //理财声明
    notice:`KuPay钱包资产管理平台服务协议
    为了保障您的权益，请在使用KuPay钱包资产管理平台服务前，详细阅读本协议的所有内容，特别是粗体下划线标注的内容。如您不同意本协议的任何内容，请勿注册或使用本平台提供的服务。该协议是您与KuPay钱包的所有者KuPay基金会、KuPay的钱包资产管理平台上部分资产供应方即与KuPay合作的数字资产交易机构达成的三方协议。该协议具有法律效力。
    您通过网络页面点击确认或以其他方式（包括但不限于签字或签章确认等方式）接受本协议，或者使用本协议项下服务，即视为您已同意本协议。在您接受本协议或使用本协议项下服务后，不得以未阅读本协议内容为理由做任何形式的抗辩。  
    为了保障KuPay钱包资产管理服务的持续正常进行，KuPay钱包资产管理平台已经发布或将来可能发布的各项规则、页面展示、操作流程、公告或通知（以下统称“KuPay钱包资产管理平台规则”），也是本协议的重要组成部分。如本协议发生变更，导致您的权利义务发生变化，我们网站公告的方式予以公布或者其他合理的方式向您告知，请您留意变更后的协议内容。如您在本协议变更生效后，继续使用KuPay钱包资产管理平台服务的，表示您愿意接受变更后的协议，也将遵循变更后的协议使用KuPay钱包资产管理平台服务。
    一、相关定义
    除非本协议另有约定，本协议下列术语定义如下：
    1.1 KuPay钱包资产管理平台服务包括：
    一、KuPay钱包资产管理平台为您提供的查询数字资产产品行情、数字资产行业及产品资讯服务；
    二、KuPay资产管理平台直接为您提供的基于POS共识机制的数字货币增值服务以及其他数字资产价值管理服务；
    三、由KuPay合作的数字资产交易机构提供的，并在KuPay钱包数字资产平台展示的数字资产产品价值管理、数字资产产品交易及交易管理、信息查询等服务。具体服务内容以其实际提供的为准。
    1.2 KuPay多功能跨链数字货币钱包：是注册在新加坡的KuPay基金会、运营、管理、并享有合法所有权的软件平台/网站/手机app客户端，提供基于区块链技术的数字货币安全存储、点对点社交通信、DAPP商城、数字资产管理、托管和交易等服务，域名为https://KuPay.io/ 支持在Android系统和iOS系统上使用。您可以使用KuPay钱包进入KuPay钱包的资产管理平台接受本服务。
    如果您选择的是由KuPay资产管理平台直接为您提供的基于POS共识机制的无风险数字货币增值服务以及其他的低风险数字资产价值管理服务，KuPay提供产品展示、数字资产管理、数字资产的归集或划拨、清结算服务。
    如果您选择的是由KuPay合作的数字资产交易机构提供的服务。KuPay作为平台方，在接受您和（或）数字资产交易机构的授权或委托的前提下，提供服务的展示，数字资产的归集或划拨、清结算等服务。您与之间的资产交易和管理等合作与KuPay无关。
    您应当根据自己的风险承受水平，谨慎选择相关产品或服务，并承担相应的后果。KuPay不对您选择的服务产品承诺保本保息，或者任何形式的确定或可实现的承诺。
    1.3 数字资产交易机构：KuPay合作的数字资产交易机构致力于在资金安全的前提下，为客户提供数字资产的本地、在线管理服务。您可以通过KuPay钱包资产管理平台接受本服务，机构仅根据本协议接受您和（或）KuPay的授权或委托，提供数字资产的管理运作等服务。您与KuPay之间的其他资产交易和管理等合作与机构无关，您应当谨慎选择产品或者服务，由此造成的损失与数字资产交易结构无关。
    1.4 KuPay云账户：指您通过KuPay身份验证后取得的供您使用KuPay服务的虚拟账户。
    二、声明与承诺
    2.1 您应遵守本协议以及KuPay在过去及将来制定的包括但不限于与用户服务相关的规则等约定，特别是关于个人信息更新、KuPay登录名及KuPay云账户安全、KuPay服务使用规则、KuPay服务等方面的约定。
    2.2 为了便于您使用本服务，您需要注册使用KuPay钱包服务，但KuPay钱包资产管理平台规则另有规定的除外。使用KuPay平台服务在线进行数字资产产品价值管理、数字资产产品交易及交易管理、信息查询前，您需要确保自己符合KuPay平台规则的规定，且必须主动了解相关数字资产产品的具体信息，确认自己具有相应的风险识别能力和风险承受能力。否则，请不要做出价值管理或交易行为。
    2.3 您需通过KuPay登录名登入KuPay钱包资产管理平台。您承诺使用本人手机号码，或者KuPay允许的其他方式登录手段。为提高服务安全性，KuPay可能采取各种必要手段对您进行身份验证，并据此决定为您提供服务的种类、范围及进行业务操作的权限。为保障您的数字资产安全，KuPay将根据您的账户类别、身份认证措施、交易风险度等因素的不同，设定不同的安全策略。
    2.4 身份认证要素是KuPay识别用户的依据。使用身份要素所发出的指令将视为您本人所为，并由您对此产生的后果负责，所以KuPay特别提醒您，必须妥善保管身份认证要素，不得将其提供给任何第三方或交于任何第三方使用。否则，对非KuPay原因造成的账户、密码等信息被冒用、盗用或非法使用，由此引起的风险、责任、损失、费用等，需要由您自行承担。
    2.5 本协议项下涉及您的所有意思表示，您需要按照KuPay或者KuPay的业务流程发出，且符合本协议、《KuPay用户协议》的约定。为了保障服务或交易安全，前述意思表示（包括但不限于同意、承诺、授权、认可或指令等形式）不可变更、撤回、撤销，但本协议、KuPay平台规则另有规定或与您另有约定的除外。
    2.6 即便您符合本协议约定的条件，交易的实现仍可能受制于其他因素（包括但不限于市场风险、各方交易意愿、合作数字资产机构系统能力），交易机构及关联公司仅向您提供数字资产信息平台服务及相关技术服务，请您知晓并理解，KuPay对此不作确定可实现的承诺。
    2.7 您同意将KuPay或者其他KuPay认为符合产品交易需要的数字资产路径作为交易数字资产渠道之一，且KuPay及关联公司可能根据系统技术要求合理调整您的交易数字资产渠道，具体以可在KuPay平台使用的数字资产渠道为准。
    2.8 为更好地为您提供服务，KuPay会根据合作数字资产机构及相关产品需要，在线为您提供产品信息查询服务，但信息查询结果应以合作数字资产机构系统记载的数据为准。如出现因KuPay平台及其关联公司原因、系统差错、故障或其他原因引发的展示延误、错误或者发生用户不当得利等情形的，您同意KuPay可采取更正差错、扣划款项、暂停服务等适当纠正措施。在您不当得利情形下，您同意并授权KuPay可以直接或通过第三方机构，从您的相关数字资产渠道上（包括但不限于KuPay账户余额、KuPay等）通过扣款和（或）赎回KuPay份额等方式，扣划相应款项。您同意并授权KuPay及其他第三方机构根据我们的指令进行相应操作，且第三方机构不因前述操作需要对您承担责任。
    三、交易数字资产结算
    为保障您的交易安全及使用便利，您在KuPay平台产生的所有数字资产结算都将委托给KuPay处理。由于您的KuPay账户或其他指定账户状态不正常，无法提供足额数字资产，从而使得交易数字资产不能正常划转或者无法达成交易的，相关后果及损失需要由您自行承担。
    四、服务费用
    由于运营成本原因，您在使用本服务时，KuPay及交易机构有权向您收取一定的服务费用，但现阶段KuPay及交易机构暂不收取服务费。如果将来收取服务费，服务费用的收取标准请以KuPay钱包资产管理平台展示的最新规定为准。根据运营状况，我们可能单方面调整上述收费标准，但会提前进行通知，该等通知将构成本协议的有效补充。在通知所载明的起始日起，如您继续使用本服务的，将视为您同意我们按照调整后的收费标准向您收取服务费用，如您不同意，您需要停止使用KuPay平台服务。
    五、风险提示
    5.1 您知晓并同意，您通过KuPay钱包资产管理平台与合作数字资产机构所完成的交易可能面临如下风险，该等风险需由您自行承担：
    5.1.1 监管风险：有关法律、法规及相关政策、规则发生变化，导致无法实现产品交易，您由此可能遭受损失；
    5.1.2 违约风险：因您的交易相对方无力或无意愿按时足额履约或履行义务，您由此可能遭受损失；
    5.1.3 本金损失和收益风险：您所参与的交易因特定原因无法实现预期收益，您由此无法获得更多收益或奖励，甚至可能损失本金；
    5.1.4 成交风险：您所参与的交易可能无法最终达成，您由此遭受的损失；
    5.1.5 技术风险：由于产品交易基于互联网技术开展，所以如果相关网络、电信基础设施发生故障或遭遇非法攻击，则您可能因此遭受经济损失；
    5.1.6 不可抗力因素导致的风险；
    5.1.7 因您的过错导致的任何损失，该等过错包括但不限于：决策失误、操作不当、遗忘或泄露账户密码、您使用的计算机系统被第三方侵入、您委托他人进行代理交易等。
    5.2 我们不对您及/或任何交易提供任何担保或条件，无论是明示、默示或法定的。相关产品信息是合作数字资产机构提供并向您展示，您应独立判断后做出价值管理决策。请您特别注意，以上内容并不能揭示您我们进行交易的全部风险及市场的全部情形。您在做出交易决策前，应仔细阅读相关产品合同以及风险揭示文件，全面了解相关交易，谨慎决策，并自行承担全部风险。
    六、有限责任
    由于网络技术服务的特殊性，KuPay钱包资产管理平台因下列状况无法正常运作，使您无法使用KuPay钱包资产管理平台服务时，我们不承担损害赔偿责任，该等状况包括：
    6.1 KuPay钱包资产管理平台的系统停机维护或升级期间；
    6.2 KuPay钱包资产管理平台所依赖的电信设备出现故障；
    6.3 因台风、地震、海啸、洪水、停电、战争、恐怖袭击等不可抗力之因素，造成KuPay钱包资产管理平台系统障碍的
    6.4 您的手机软件、系统、硬件和通信线路、供电线路出现故障的；
    6.5 您操作不当或通过非KuPay授权或认可的方式使用本服务的；
    6.6 由于病毒、木马、恶意程序攻击、网络拥堵、系统不稳定、系统或设备故障、通讯故障、交易所原因、其他第三方问题等原因而造成的服务中断或者延迟；
    6.7 不可抗力造成的其他情形。
    在我们向您收费的情形下，我们对本协议所承担的违约赔偿责任总额不超过向您收取的服务费用总额。由于合作数字资产机构系统或者人为原因，导致数字资产到账迟滞等问题，我们将协调尽快解决，但对此不承担赔偿责任。
    七、协议解除、提前终止和权利义务的转让
    7.1 协议变更
    由于运营调整等原因，我们可能会适时修改本协议，如相关修改使您权利义务发生变化的，我们将按照本协议约定，及时向您履行公告或告知程序。我们也鼓励您在每次使用本服务时都查阅本协议内容。
    7.2 协议解除与终止
    在您使用KuPay钱包资产管理平台服务的过程中，如果有下列情形发生，为防止风险，我们将根据需要解除本协议：
    7.2.1 您的KuPay账户因任何原因注销的；
    7.2.2 您的行为可能对交易相对方利益造成重大损害的；
    7.2.3 在应从您的相关账户内扣除有关款项时，您的相关账户内没有足额数字资产，且您在规定的期间内未及时提供的；
    7.2.4 冒用他人名义、盗用他人账户使用KuPay钱包资产管理平台服务的；
    7.2.5 从事任何可能侵害KuPay钱包资产管理平台系统行为的；
    7.2.6 违反本协议约定和KuPayk钱包资产管理平台规则的；
    除上述原因外，根据风险管控及自身业务运营等情况，KuPay可能也会终止向您提供本服务，届时KuPay将会提前公告或充分告知。鉴于这属于我们的正常商业决策行为，如因此导致您无法使用本服务或服务受到限制的，您理解KuPay无须对此承担责任。
    7.3 协议权利义务的转让
    未经KuPay书面同意，您不得将本协议项下的权利和义务转让给任何第三方。但为给您提供持续服务，经书面通知或在线公告后，KuPay可以将本协议项下的权利和义务全部或部分转让给第三方。
    八、通知
    本协议履行过程中，KuPay向您发出的书面通知方式包括但不限于邮寄纸质通知、KuPay平台公告、电子邮件、手机短信和传真等方式。如KuPay以邮寄方式向您发出书面通知的，则在KuPay按照您在KuPay或KuPay留存的通讯地址交邮后的第三个自然日即视为送达。如以KuPay平台公告、电子邮件、手机短信和传真等电子方式发出书面通知的，则在通知发送成功即视为送达。
    九、凡因本协议引起的或与本协议有关的任何争议，双方（或三方）应当协商解决，如果协商不成的，双方（或三方）一致同意在KuPay的所有者KuPay基金会所在地法院诉讼解决。`
};


/**
 * 理财产品配置
 */
export const financialProductList = {
    60001:{
        id:60001,// 产品id
        title: '优选理财-随存随取',// 产品标题
        profit: '8',// 预期年化收益
        productName: 'ETH资管第1期',// 产品名称
        productDescribe: '赎回T+0到账 | 0.1 ETH/份',// 首页显示的产品描述
        unitPrice: null,// 单价
        coinType:'',// 购买币种
        days: 'T+0',// 锁定日期
        total:0,// 产品总量
        surplus: 0,// 剩余量
        purchaseDate: '无',// 起购日
        interestDate: '无',// 起息日
        endDate: '无',// 结束日
        productIntroduction: 'ETH资管第1期是KuPay退出的一种固定收益类，回报稳定、无风险定期产品。',// 产品介绍
        limit: '5',// 购买上限
        lockday:'无',// 锁定期
        isSoldOut:true// 是否售完
    }
}


/**
 * 提币手续费
 */
export const withdrawMinerFee = {
    ETH:0.01,
    BTC:0.001
}

