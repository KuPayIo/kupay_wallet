/**
 * group wallet
 */
import { Widget } from '../../../pi/widget/widget';
import { popNew } from '../../../pi/ui/root';

export class PrivacyAgreement extends Widget {
    public ok: () => void;
    constructor() {
        super();
       
    }

    public create(){
        super.create();
        this.init();
    }
    public init(){
        this.state = {
            userProtocolReaded:false,
            agreement:"尊敬的用户：某某（以下简称“我们”）尊重并保护用户（以下简称“您”）的隐私，您使用FairBlock时，某某将按照本隐私政策（以下简称“本政策”）收集、使用您的个人信息。某某建议您在使用本产品（以下简称“FairBlock”）之前仔细阅读并理解本政策全部内容, 针对免责声明等条款在内的重要信息将以加粗的形式体现。本政策有关关键词定义与某某《FairBlock服务协议》保持一致。本政策可由某某在线随时更新，更新后的政策一旦公布即代替原来的政策，如果您不接受修改后的条款，请立即停止使用FairBlock，您继续使用FairBlock将被视为接受修改后的政策。经修改的政策一经在FairBlock上公布，立即自动生效。您知悉本政策及其他有关规定适用于FairBlock及FairBlock上某某所自主拥有的DApp。一、 我们收集您的哪些信息请您知悉，我们收集您的以下信息是出于满足您在FairBlock服务需要的目的，且我们十分重视对您隐私的保护。在我们收集您的信息时，将严格遵守“合法、正当、必要”的原则。且您知悉，若您不提供我们服务所需的相关信息，您在FairBlock的服务体验可能因此而受到"
            
        }
    }

    public checkBoxClick(e: any) {
        this.state.userProtocolReaded = (e.newType === 'true' ? true : false);
        this.paint();
    }

    public readedClick(){
        if (!this.state.userProtocolReaded) {
            return;
        }
        popNew('app-view-guidePages-displayPage');
        this.ok && this.ok();
    }
}