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
                        <div w-class="ticket_top_title">
                            <widget w-tag="pi-ui-lang">{"zh_Hans":"我的邀请码","zh_Hant":"我的邀請碼","en":""}</widget>
                        </div>
                        <div w-class="ticket_top_code">GY3D8S</div>
                    
                        {{let item = {"zh_Hans":"复制","zh_Hant":"複製","en":""} }}
                        <widget style="margin-top:40px;" w-tag="app-components1-btn-btn">{name:{{item}},color:"orange","types":"small"}</widget>
                        
                    </div>
                    {{% 邀请票中部}}
                    <div w-class="ticket_center" class="ticket_center">
                        <div w-class="gary_line"></div>
                    </div>
                    {{% 邀请票下部}}
                    <div w-class="ticket_bottom">
                        <img src="app/res/image/wechat_pn.jpg" height="400px" width="400px"/>
                        <div w-class="ticket_bottom-text">
                            <widget w-tag="pi-ui-lang">{"zh_Hans":"成功邀请后双方均可获得奖励","zh_Hant":"成功邀請後雙方均可獲得獎勵","en":""}</widget>
                            <img src="app/res/image/change-blue.png" height="48px" w-class="change_icon"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div w-class="share_text">
            <widget w-tag="pi-ui-lang">{"zh_Hans":"一键快速邀请","zh_Hant":"一鍵快速邀請","en":""}</widget>
        </div>
        <div w-class="share_icon">
            <div w-class="img-box">
                <img src="app/res/image/img_share_wechat.png" height="60px"/>
            </div>
            <div w-class="img-box">
                <img src="app/res/image/img_share_wechatArea.png" height="60px"/>
            </div>
            <div w-class="img-box">
                <img src="app/res/image/img_share_qqArea.png" height="60px"/>
            </div>
            <div w-class="img-box">
                <img src="app/res/image/img_share_qq.png" height="60px"/>
            </div>
        </div>
    </div>
    {{: topBarTitle = {"zh_Hans":"邀请好友","zh_Hant":"邀請好友","en":""} }}	
    <app-components1-topBar-topBar2>{text:{{topBarTitle}} }</app-components1-topBar-topBar2>
</div>