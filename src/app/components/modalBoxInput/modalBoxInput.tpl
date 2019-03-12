<div w-class="modal-mask" class="new-page">
    <div w-class="body">
        <div w-class="title">
            {{if typeof(it.title) === 'string' }}
                {{it.title}}
            {{else}}
                <pi-ui-lang>{{it.title}}</pi-ui-lang>
            {{end}}
            <span w-class="forgetPsw" on-tap="foegetPsw">
                <pi-ui-lang>{"zh_Hans":"忘记密码？","zh_Hant":"忘記密碼？","en":""}</pi-ui-lang>
            </span>
        </div>
        <div w-class="content">
            {{for ind,val of it.content}}
            <p>{{val}}</p>
            {{end}}
        </div>

        <div style="height: 90px;" ev-input-change="change">
            <app-components1-input-input>{placeHolder: {{it.placeholder?it.placeholder:""}},itype:{{it.itype?it.itype:"text"}},style:"padding:0;font-size:28px;",underLine:true,autofocus:true }</app-components1-input-input>
        </div>
        <div w-class="btns">
            {{if it.cancelText}}
                {{: cancelText = {"zh_Hans":it.cancelText,"zh_Hant":it.cancelText,"en":""} }}
            {{else}}
                {{: cancelText = {"zh_Hans":"取消","zh_Hant":"取消","en":""} }}
            {{end}}

            {{if it.sureText}}
                {{: sureText = {"zh_Hans":it.sureText,"zh_Hant":it.sureText,"en":""} }}
            {{else}}
                {{: sureText = {"zh_Hans":"确定","zh_Hant":"確定","en":""} }}
            {{end}}
            
            <div w-class="btn-cancel" on-tap="cancelBtnClick"><pi-ui-lang>{{cancelText}}</pi-ui-lang></div>
            <div w-class="btn-ok" on-tap="okBtnClick"><pi-ui-lang>{{sureText}}</pi-ui-lang></div>
        </div>
    </div>
</div>