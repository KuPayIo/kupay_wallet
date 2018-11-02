<div class="new-page">
    <div w-class="topBack">
        <img src="../../../res/image1/topbar_backimg.png" w-class="backImg"/>
        <img src="../../../res/image1/default_avatar.png" w-class="userHead" on-tap="showMine"/>
        <img src="../../../res/image1/refresh_white.png" w-class="refreshBtn" on-tap="refreshPage" class="{{it.refresh ?'refreshing':''}}"/>
    </div>
    <div style="text-align: center;">
        <img src="../../../res/image/chatEmpty.png" w-class="emptyImg"/>
        <div w-class="emptyText">
            <pi-ui-lang>{"zh_Hans":"尚未登录，无法进行聊天","zh_Hant":"尚未登錄，無法進行聊天","en":""}</pi-ui-lang>
        </div>
        <div style="margin: 50px 60px;" ev-btn-tap="login">
            {{let item = {"zh_Hans":"去登录","zh_Hant":"去登錄","en":""} }}
            <app-components1-btn-btn>{name:{{item}},color:"blue"}</app-components1-btn-btn>
        </div>
    </div>
</div>