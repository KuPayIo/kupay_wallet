<div w-class="modal-mask" class="new-page">
    <div w-class="body">
        <div w-class="title">{{it.title}}</div>
        <div w-class="box" on-tap="deleteAccountClick">
            {{if it1.deleteAccount}}
            <img src="../../res/image/icon_right2.png" w-class="choosed"/>
            {{else}}
            <div w-class="choose-box">
                <div w-class="choose-inner"></div>
            </div>
            {{end}}
            <div w-class="content" style="{{it.style?it.style:''}}">{{it.content}}</div>
        </div>
        <div w-class="btns">
            <div w-class="btn-cancel" on-tap="cancelBtnClick">{{it.cancelText ? it.cancelText : it1.cfgData.cancelText}}</div>
            <div w-class="btn-ok" on-tap="okBtnClick">{{it.sureText ? it.sureText : it1.cfgData.sureText}}</div>
        </div>
    </div>
</div>