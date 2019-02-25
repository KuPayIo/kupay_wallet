<div w-class="modal-mask" class="new-page" style="{{it.fadeOut ? 'background-color: rgba(50, 50, 50, 0);' : ''}} ">
    <div class="popBoxFadeIn {{it.fadeOut ? 'popBoxFadeOut' : ''}}" w-class="animate-container">
        <div w-class="body" >
            <img w-class="three" src="../../res/image/toLogin_bg.png" class="popBoxShake" />
            <widget w-class="four" on-tap="goLogin" w-tag="pi-ui-lang" class="popBoxZoomIn">{"zh_Hans":"登录领取","zh_Hant":"登錄領取","en":""}</widget>
        </div>
        <div w-class="closeBtn" on-tap="close">
            <img src="../../res/image/close_white.png" width="30px;" height="30px;" />
        </div>
    </div>
</div>