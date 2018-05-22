<div>
    {{for ind,val of it.data}}
    <div w-class="listItem_div" on-tap="goNext">
        <span>{{val.value}}</span>
        <span style="float: right;">></span>
    </div>
    {{end}}
</div>