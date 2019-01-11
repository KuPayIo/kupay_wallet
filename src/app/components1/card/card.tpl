<div w-class="card {{it.shadow?'card-shadow':''}}">
    <img src="{{it.img[0]}}" w-class="card-img" />
    <div w-class="card-content">
        <div>
            <img src="{{it.img[1]}}" w-class="card-img-small" height="120px" width="120px"/>
        </div>
        <div>
            <div w-class="title">
                {{if typeof(it.title) ==='string' }}
                {{it.title}}
                {{else}}
                <pi-ui-lang>{{it.title}}</pi-ui-lang>
                {{end}}
            </div>
            <div w-class="desc">
                {{if typeof(it.desc) ==='string' }}
                {{it.desc}}
                {{else}}
                <pi-ui-lang>{{it.desc}}</pi-ui-lang>
                {{end}}
            </div>
        </div>
    </div>
</div>