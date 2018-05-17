<div w-class="base base-{{it.type}}">
    {{for i,v of it.list}} {{let isLast = i>=(it.list.length-1)}}
    <div w-class="{{isLast?'each-last':'each-normal'}} is-{{v.status}} each-{{it.type}}">
        <div w-class="head">
            {{if !isLast}}
            <div w-class="line-{{it.type}}">
                <i w-class="line-inner"></i>
            </div>
            {{end}}
            <div w-class="icon">
                <span w-class="icon-inner">{{v.status=="success"?"√":i+1}}</span>
            </div>
        </div>
        <div w-class="main-{{it.type}}">
            <div w-class="title">{{v.title}}</div>
            <div w-class="description">{{v.description}}</div>
        </div>
    </div>
    {{end}}

</div>