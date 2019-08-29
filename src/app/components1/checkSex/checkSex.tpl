<div w-class="modal-mask" class="new-page">
    <div w-class="body">
        <div w-class="title">
            {{if typeof(it.title) === 'string' }}
                {{it.title}}
            {{else}}
                <pi-ui-lang>{{it.title}}</pi-ui-lang>
            {{end}}
        </div>
        <div w-class="content">
            {{for i,v of it.sexList}}
            <div w-class="sex {{it.active==i?'active':''}}" on-tap="checkTypeSex({{i}})" on-down="onShow">
                <img src="{{v.src}}" alt="" w-class="sexImg"/>
                <div w-class="sexValue">{{v.sex}}</div>
            </div>
            {{end}}
        </div>

        <div w-class="btns">
            {{if it.sureText}}
                {{: sureText = {"zh_Hans":it.sureText,"zh_Hant":it.sureText,"en":""} }}
            {{else}}
                {{: sureText = {"zh_Hans":"确定","zh_Hant":"確定","en":""} }}
            {{end}}
            
            <div w-class="btn-ok" on-tap="okBtnClick" on-down="onShow"><pi-ui-lang>{{sureText}}</pi-ui-lang></div>
        </div>
    </div>
</div>