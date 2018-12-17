/**
 * digging rule
 */
import { Widget } from '../../../../../../pi/widget/widget';

export class DiggingRule extends Widget {
    public ok:() => void;
    public props:any;
    public create() {
        super.create();
        this.props = {
            getMethod:[
                {
                    title:'注册：',
                    desc:'新用户注册即送两把铜锄',
                    action:'去注册'
                },{
                    title:'连续登陆：',
                    desc:'每日登陆赠送锄头，连续登陆赠送更多锄头。',
                    action:''
                },{
                    title:'邀请好友：',
                    desc:'邀请好友成功将获得不同的锄头。',
                    action:'去邀请好友'
                },{
                    title:'被邀请：',
                    desc:'被邀请人会获得邀请人同等的额外奖励，但是同一个账号只能被邀请一次。',
                    action:'去填写邀请码'
                },{
                    title:'提建议：',
                    desc:['5字以上的建议，即可获得铜锄头1-5把','有效建议可获得银锄头5把','建议被采纳获得金锄头5把'],
                    action:'去提意见'
                },{
                    title:'观看广告：',
                    desc:'每个广告奖励铜锄头一把，但是有可能会遇上金银锄头哦。',
                    action:'看广告'
                }
            ]
        };
    }
    public backClick() {
        this.ok && this.ok();
    }
}