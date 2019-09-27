<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"隐私政策","zh_Hant":"隱私政策","en":""} }}
    <app-components-topBar-topBar>{title:{{topBarTitle}} }</app-components-topBar-topBar> 
    <div style="height: 100%;overflow-x: hidden;overflow-y: auto;-webkit-overflow-scrolling: touch;scroll-behavior: smooth;">
        <div style="font-size: 28px;margin: 30px 20px;white-space: pre-wrap;background: #ffffff;border-radius: 12px;padding: 60px 30px;">
            {{it.privacyPolicy}}
        </div>
        <div style="height: 128px;"></div>
    </div>   
</div>