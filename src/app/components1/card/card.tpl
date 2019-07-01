<div w-class="card {{it.shadow?'card-shadow':''}} {{it.isFirst?'firstcard':''}}">
    <img src="{{it.img[0]}}" w-class="card-img" height="{{it.isFirst?'100%':'420px'}}" />
    <div w-class="card-content {{it.isFirst?'firstcard-content':''}}">
        <div>
            <img src="{{it.img[1]}}" w-class="card-img-small" height="120px" width="120px" />
        </div>
        <div>
            <div w-class="title" style="color:{{it.isFirst?'white':'#222222'}}">
                {{if typeof(it.title) ==='string' }}
                {{it.title}}
                {{else}}
                <pi-ui-lang>{{it.title}}</pi-ui-lang>
                {{end}}
            </div>
            <div w-class="desc" style="color:{{it.isFirst?'white':'#888888'}}">
                {{if typeof(it.desc) ==='string' }}
                {{it.desc}}
                {{else}}
                <pi-ui-lang>{{it.desc}}</pi-ui-lang>
                {{end}}
            </div>
        </div>
    </div>
</div>