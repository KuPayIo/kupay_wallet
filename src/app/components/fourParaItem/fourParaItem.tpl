<div w-class="item">
    <div w-class="itemName">
        <span w-class="itemleft">
            <pi-ui-lang>{{it.name}}</pi-ui-lang>
            {{if it.showPin}}
            <span w-class="other">	
                <pi-ui-lang>{"zh_Hans":"拼","zh_Hant":"拼","en":""}</pi-ui-lang>
            </span>
            {{end}}
        </span>
        <span>{{it.data}}</span>
    </div>
    <div w-class="itemTime">
        <span w-class="itemleft">{{it.time}}</span>
        <div w-class="itemRight">
        {{if it.btnName}}
        <span style="margin-right:10px;" on-tap="continueSendClick">
            <pi-ui-lang>{{it.btnName}}</pi-ui-lang>
        </span>
        {{end}}
        {{if it.describe && it.describe!=""}}
        <span>
            <pi-ui-lang>{{it.describe}}</pi-ui-lang>
        </span>
        {{end}}
        </div>
    </div>
</div>