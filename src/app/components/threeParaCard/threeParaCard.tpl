<div w-class="groupcard">
    <div w-class="threedata">
        {{for ind,val of it.name}}
        <div w-class="data">
            <div w-class="data-title">{{val}}</div>
            <div w-class="data-num" style="{{it.style}}">{{it.data[ind]}}</div>
        </div>
            {{if it.name.length-1>ind}}
            <span w-class="line"></span>
            {{end}}

        {{end}}
    </div>   
</div>