<div w-class="card {{it.shadow?'card-shadow':''}}">
    <img src="{{it.img}}" w-class="card-img"/>
    <div w-class="card-content">
        <div w-class="desc">
            {{if typeof(it.desc) ==='string' }}
                {{it.desc}}
            {{else}}    
            <pi-ui-lang>{{it.desc}}</pi-ui-lang>
            {{end}}
        </div>
        <div w-class="title">
            {{if typeof(it.title) ==='string' }}
                {{it.title}}
            {{else}}    
            <pi-ui-lang>{{it.title}}</pi-ui-lang>
            {{end}}
        </div>
    </div>
</div>