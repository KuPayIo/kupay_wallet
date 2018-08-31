<div class="new-page" style="height: 100%;width: 100%;background: #fff;overflow-y: auto;overflow-x: hidden;" ev-btn-tap="doTap">
    <div style="font-size: 32px;margin: 50px 0;">**************按钮****************</div>
    
    <app-components-btn-btn>{"name":"塞钱进红包","types":"big","color":"blue"}</app-components-btn-btn>
    <app-components-btn-btn>{"name":"塞钱进红包","types":"big"}</app-components-btn-btn>
    <app-components-btn-btn>{"name":"塞钱进红包","types":"big","style":"width:280px;"}</app-components-btn-btn>
    <app-components-btn-btn>{"name":"做任务","types":"small"}</app-components-btn-btn>
    <app-components-btn-btn>{"name":"做任务","types":"small","color":"white"}</app-components-btn-btn>    
    <div style="background: #3EB3F0"><app-components-btn-btn>{"name":"做任务","types":"small","color":"transparent"}</app-components-btn-btn></div> 
    
    <div style="font-size: 32px;margin: 50px 0;">***************头部标题*****************</div>
    
    <app-components1-topBar-topBar>{"title":"领红包","background":"orange"}</app-components1-topBar-topBar>
    <div style="margin-top: 200px;"><app-components1-topBar-topBar>{"title":"领红包","centerTitle":true}</app-components1-topBar-topBar></div> 
    <div style="height: 150px"></div>

    <div style="font-size: 32px;margin: 50px 0;">**************基础列表项*************</div>

    <app-components-basicItem-basicItem>{"name":"用户名","describe":"未设置"}</app-components-basicItem-basicItem>
    <app-components-basicItem-basicItem>{"name":"用户名"}</app-components-basicItem-basicItem>

    <div style="font-size: 32px;margin: 50px 0;">***************四参数列表项****************</div>

    <app-components-fourParaItem-fourParaItem>{"name":"拼手气红包","data":"1 ETH","time":"04-30 14:32:00","describe":"1/4个"}</app-components-fourParaItem-fourParaItem>
    <app-components-fourParaItem-fourParaItem>{"name":"拼手气红包","data":"1 ETH","time":"04-30 14:32:00"}</app-components-fourParaItem-fourParaItem>
    
    <div style="font-size: 32px;margin: 50px 0;">***************带图片的四参数列表项**************</div>

    <app-components-fourParaImgItem-fourParaImgItem>{"name":"拼手气红包","data":"1 ETH","time":"04-30 14:32:00","describe":"手气最好",img:"../../res/image/cloud_icon_cloud.png"}</app-components-fourParaImgItem-fourParaImgItem>
    <app-components-fourParaImgItem-fourParaImgItem>{"name":"拼手气红包","data":"1 ETH","time":"04-30 14:32:00",img:"../../res/image/cloud_icon_cloud.png"}</app-components-fourParaImgItem-fourParaImgItem>
    
    <div style="font-size: 32px;margin: 50px 0;">**************带图片和按钮的列表项**************</div>

    <app-components-imgAndBtnItem-imgAndBtnItem>{"name":"创建钱包","describe":"创建钱包+300KT","img":"../../res/image/cloud_icon_cloud.png","btnName":"做任务"}</app-components-imgAndBtnItem-imgAndBtnItem>
    <app-components-imgAndBtnItem-imgAndBtnItem>{"name":"创建钱包","describe":"创建钱包+300KT","img":"../../res/image/cloud_icon_cloud.png","btnName":"完成",style:"background:#3294E6;box-shadow: 0px 10px 15px 0px rgba(60, 161, 248, 0.2);"}</app-components-imgAndBtnItem-imgAndBtnItem>
    
    <div style="font-size: 32px;margin: 50px 0;">*****************排名列表项******************</div>

    <app-components-imgRankItem-imgRankItem>{"name":"微邦一号","describe":"挖矿25222325 KT","img":"../../res/image/cloud_icon_cloud.png","rank":"001"}</app-components-imgRankItem-imgRankItem>
    <app-components-imgRankItem-imgRankItem>{"name":"微邦一号","describe":"挖矿25222325 KT","img":"../../res/image/cloud_icon_cloud.png","rank":"002"}</app-components-imgRankItem-imgRankItem>
    
    <div style="font-size: 32px;margin: 50px 0;">*****************环形进度条******************</div>
    
    <app-components-ringProgressBar-ringProgressBar>{
            "width":82,
            "borderWidth":4,
            "activeColor":"#F7931A",
            "activePercent":0.7
    }</app-components-ringProgressBar-ringProgressBar>
    <app-components-ringProgressBar-ringProgressBar>{
            "width":82,
            "borderWidth":4,
            "activeColor":"#F7931A",
            "activePercent":0,
            "centerText":"售罄"
    }</app-components-ringProgressBar-ringProgressBar>

    <div style="font-size: 32px;margin: 50px 0;">*****************开关******************</div>

    <app-components-switch-switch>{types:true,activeColor:"#3294E6",inactiveColor:"#38CFE7"}</app-components-switch-switch>
    <app-components-switch-switch>{types:true}</app-components-switch-switch>

    <div style="font-size: 32px;margin: 50px 0;">**************带三子项目的卡片*************</div>
    
    <div style="background: orange;height: 210px;padding-top: 10px;">
        <app-components-threeParaCard-threeParaCard>{"name":["年华收益","本次分红","已分红天数"],"data":["8%","0","1"]}</app-components-threeParaCard-threeParaCard>
    </div>
    <div style="background: orange;height: 210px;padding-top: 10px;">
        <app-components-threeParaCard-threeParaCard>{"name":["年华收益","本次分红"],"data":["8%","0"]}</app-components-threeParaCard-threeParaCard>
    </div>

    <div style="font-size: 32px;margin: 50px 0;">***********验证手机号**************</div>

    <div ev-getCode="getCode">
        <app-components-bindPhone-bindPhone></app-components-bindPhone-bindPhone>
    </div>

    <div style="font-size: 32px;margin: 50px 0;">***********输入密码**************</div>
    
    <app-components-password-password>{length:8,hideTips:true,limit:1}</app-components-password-password>

    <div style="font-size: 32px;margin: 50px 0;">***********输入框**************</div>
    
    <div style="height: 110px;width: 100%;">
        <app-components1-input-input>{placeHolder:"搜索",clearable:true}</app-components1-input-input>
    </div>

    <div style="font-size: 32px;margin: 50px 0;">***********输入框**************</div>
    
    
    
</div>