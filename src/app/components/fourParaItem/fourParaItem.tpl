<div w-class="item">
    <div w-class="itemName">
        <span>{{it.name}}</span>
        <span w-class="itemRight">{{it.data}}</span>
    </div>
    <div w-class="itemTime">
        <span>{{it.time}}</span>
        {{if it.describe && it.describe!=""}}
        <span w-class="itemRight">{{it.describe}}</span>
        {{end}}
    </div>
</div>