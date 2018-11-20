<div w-class="pi-loading-mask">
    <div w-class="pi-loading-spinner">
        <div w-class="loading-img"></div>
        <p w-class="pi-loading-text">
            {{if it.text}}
                {{if typeof(it.text) === 'string'}}
                    {{it.text}}
                {{else}}
                    <pi-ui-lang>{{it.text}}</pi-ui-lang>
                {{end}}
            {{else}}
                <pi-ui-lang>{"zh_Hans":"加载中","zh_Hant":"加載中","en":""}</pi-ui-lang>
            {{end}}
        </p>
    </div>
</div>