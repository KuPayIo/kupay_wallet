<div w-class="item">
    <div w-class="itemName">
        <span w-class="itemleft">{{it.name}}
            {{if it.showPin}}<span w-class="other">{{it1.cfgData.pin}}</span>{{end}}
        </span>
        <span>{{it.data}}</span>
    </div>
    <div w-class="itemTime">
        <span w-class="itemleft">{{it.time}}</span>
        {{if it.describe && it.describe!=""}}
        <span>{{it.describe}}</span>
        {{end}}
    </div>
</div>