<div w-class="modal-mask" class="new-page">
    <div w-class="body">
        <div w-class="title">
            {{if typeof(it.title)==='string'}}
                {{it.title}}
            {{else}}
                <pi-ui-lang>{{it.title}}</pi-ui-lang>
            {{end}}
        </div>
        <div w-class="content" style="{{it.style?it.style:''}}">
            {{if typeof(it.content)==='string'}}
                {{it.content}}
            {{else}}
                <pi-ui-lang>{{it.content}}</pi-ui-lang>
            {{end}}
        </div>
        <div w-class="btns">
            {{if !it.onlyOk}}
            <div w-class="btn-cancel" on-tap="cancelBtnClick">
                {{if it.cancelText}}
                    {{if typeof(it.cancelText)==='string'}}
                        {{it.cancelText}}
                    {{else}}
                        <pi-ui-lang>{{it.cancelText}}</pi-ui-lang>
                    {{end}}
                {{else}}
                <pi-ui-lang>{"zh_Hans":"取消","zh_Hant":"取消","en":""}</pi-ui-lang>
                {{end}}
            </div>
            {{end}}
            <div w-class="btn-ok" on-tap="okBtnClick">
                {{if it.sureText}}
                    {{if typeof(it.sureText)==='string'}}
                        {{it.sureText}}
                    {{else}}
                        <pi-ui-lang>{{it.sureText}}</pi-ui-lang>
                    {{end}}
                {{else}}
                <pi-ui-lang>{"zh_Hans":"确定","zh_Hant":"確定","en":""}</pi-ui-lang>
                {{end}}
            </div>
        </div>
    </div>
</div>