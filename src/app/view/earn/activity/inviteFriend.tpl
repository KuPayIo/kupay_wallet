<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">
    <div w-class="content" on-scroll="getMoreList">
        <div w-class="share_main">
            <div w-class="share_out">
                <div w-class="out_line"></div>
            </div>
            <div w-class="share_ticket_box">
                <div w-class="share_ticket">
                    {{% 邀请票上部}}
                    <div w-class="ticket_top">
                        {{if it.showPage ==='first'}}
                            <div w-class="ticket_top_title">
                                <widget w-tag="pi-ui-lang">{"zh_Hans":"我的邀请码","zh_Hant":"我的邀請碼","en":""}</widget>
                            </div>
                            <div w-class="ticket_top_code">{{it.inviteCode}}</div>
                        
                            {{let btnName = {"zh_Hans":"复制","zh_Hant":"複製","en":""} }}
                            <div ev-btn-tap="copyClick"><widget style="margin-top:40px;" w-tag="app-components1-btn-btn">{name:{{btnName}},color:"orange","types":"small"}</widget></div>
                            {{else}}
                            <div w-class="ticket_top_title">
                                <widget w-tag="pi-ui-lang">{"zh_Hans":"已成功邀请人数","zh_Hant":"已成功邀請人數","en":""}</widget>
                            </div>
                            <div w-class="ticket_top_code">0</div>
                        
                            {{let tip = {"zh_Hans":"已获得奖励","zh_Hant":"已獲得獎勵","en":""} }}
                            <div>
                                <widget  w-class="haveGot" w-tag="pi-ui-lang">{{tip}}</widget>
                                <span  w-class="haveGot">500KT</span>
                            </div>
                            
                        {{end}}
                    </div>
                    {{% 邀请票中部}}
                    <div w-class="ticket_center"></div>
                    {{% 邀请票下部}}
                    <div w-class="ticket_bottom">
                        {{if it.showPage ==='first'}}
                            <img src="app/res/image/wechat_pn.jpg" height="400px" width="400px"/>
                            <div w-class="ticket_bottom-text">
                                <widget w-tag="pi-ui-lang">{"zh_Hans":"成功邀请后双方均可获得奖励","zh_Hant":"成功邀請後雙方均可獲得獎勵","en":""}</widget>
                                <img on-tap="change('second')" src="app/res/image/change-blue.png" height="48px" w-class="change_icon"/>
                            </div>
                        {{else}}
                            <div w-class="rule"> 
                                <widget w-class="rule_title" w-tag="pi-ui-lang">{"zh_Hans":"活动说明","zh_Hant":"活動說明","en":""}</widget>
                                <widget w-class="rule_context" w-tag="pi-ui-lang">{"zh_Hans":"成功邀请好友下载KuPlay，在赚-兑换中输入邀请码，你就可以获得奖励哦。 注意~成功邀请的标准是好友达到1000KT。快去邀请小伙伴一起挖矿吧~","zh_Hant":"成功邀請好友下載KuPlay，在賺 - 兌換中輸入邀請碼，你就可以獲得獎勵哦。注意〜成功邀請的標準是好友達到1000KT。快去邀請小伙伴一起挖礦吧〜","en":""}</widget>
                            </div>
                            <div w-class="ticket_bottom-text">
                                <img on-tap="change('first')" src="app/res/image/change-blue.png" height="48px" w-class="change_icon"/>
                            </div>
                        {{end}}
                    </div>
                </div>
            </div>
        </div>
        {{if it.showPage ==='first'}}
            <div w-class="share_text">
                <widget w-tag="pi-ui-lang">{"zh_Hans":"一键快速邀请","zh_Hant":"一鍵快速邀請","en":""}</widget>
            </div>
            <div w-class="share_icon">
                <div w-class="img-box" on-tap="shareToWechat">
                    <img src="app/res/image/img_share_wechat.png" height="60px"/>
                </div>
                <div w-class="img-box" on-tap="shareToFriends">
                    <img src="app/res/image/img_share_wechatArea.png" height="60px"/>
                </div>
                <div w-class="img-box" on-tap="shareToQQSpace">
                    <img src="app/res/image/img_share_qqArea.png" height="60px"/>
                </div>
                <div w-class="img-box" on-tap="shareToQQ">
                    <img src="app/res/image/img_share_qq.png" height="60px"/>
                </div>
            </div>
        {{else}}
            <div w-class="share_text"></div>
            <div w-class="share_icon"></div>
        {{end}}
    </div>
    {{: topBarTitle = {"zh_Hans":"邀请好友","zh_Hant":"邀請好友","en":""} }}	
    <app-components1-topBar-topBar2>{text:{{topBarTitle}} }</app-components1-topBar-topBar2>
</div>