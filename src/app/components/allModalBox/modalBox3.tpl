<div w-class="modal-mask" class="new-page">
    <div class="popBoxFadeIn {{it.fadeOut ? 'popBoxFadeOut' : ''}}" w-class="animate-container">
    <div w-class="body">
        <div style="position:relative;">
            <img src="{{it.img}}" style="height:300px;"/>
            <div w-class="tip-title">{{it.tipTitle}}</div>
        </div>
        <div w-class="btns">
            <div w-class="tip-content">{{it.tipContent}}</div>
            <div w-class="btn1" on-tap="btnClick()" class="popBoxZoomIn">{{it.btn}}</div>
        </div>
    </div>
    <div w-class="closeBtn"  on-tap="close">
        <img src="earn/client/app/res/image1/close-white.png" width="30px;" height="30px;" />
    </div>
    </div>
</div>