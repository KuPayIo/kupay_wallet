<div w-class="modal-mask" class="new-page">
    <div w-class="body">
        <div w-class="title">
            {{it.title}}
            <span w-class="forgetPsw" on-tap="foegetPsw">
                <pi-ui-lang>{"zh_Hans":"忘记密码？","zh_Hant":"忘記密碼？","en":""}</pi-ui-lang>
            </span>
        </div>
        <div w-class="content">
            {{for ind,val of it.content}}
            <p>{{val}}</p>
            {{end}}
        </div>

        <div style="height: 90px;border-bottom: 1px solid #3294E6;" ev-input-change="change">
            <app-components1-input-input>{placeHolder: {{it.placeholder?it.placeholder:""}},itype:{{it.itype?it.itype:"text"}},style:"padding:0;font-size:28px;" }</app-components1-input-input>
        </div>
        <div w-class="btns">
            {{if it.cancelText && typeof(it.cancelText) ==='strting' }}
                <div w-class="btn-cancel" on-tap="cancelBtnClick">{{it.cancelText}}</div>
            {{else}}
                <div w-class="btn-cancel" on-tap="cancelBtnClick"><pi-ui-lang>{"zh_Hans":"取消","zh_Hant":"取消","en":""}</pi-ui-lang></div>
            {{end}}   
            
            {{if it.sureText && typeof(it.sureText) ==='strting' }}
                <div w-class="btn-ok" on-tap="okBtnClick">{{it.sureText}}</div>
            {{else}}
                <div w-class="btn-ok" on-tap="okBtnClick"><pi-ui-lang>{"zh_Hans":"确定","zh_Hant":"確定","en":""}</pi-ui-lang></div>
            {{end}} 
        </div>
    </div>
</div>