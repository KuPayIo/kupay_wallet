<div w-class="modal-mask">
    <div w-class="body">
        <div w-class="title">{{it.title}}</div>
        <div w-class="content" style="{{it.style?it.style:''}}">{{it.content}}</div>
        <div w-class="btns">
            <div w-class="btn-cancel" on-tap="cancelBtnClick">{{it.cancelText ? it.cancelText : '取消'}}</div>
            <div w-class="btn-ok" on-tap="okBtnClick">{{it.sureText ? it.sureText : '确定'}}</div>
        </div>
    </div>
</div>