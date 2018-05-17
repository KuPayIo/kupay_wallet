{{let isCard = it.type==="card"}} {{let isBorderCard = it.type==="border_card"}} {{let isShowRight = it.position==='right'}}
{{let isShowLeft = it.position==='left'}}
<div w-class="base" style="{{isShowRight||isShowLeft?('height: '+40*(it.list.length+1)+'px;'):''}}">
    <div w-class="nav-wrap-{{it.position}} {{isBorderCard?'nav-wrap-border_card-'+it.position:''}}" class="tabs-nav-wrap-{{it.position}}">
        <div w-class="nav-scroll">
            <div w-class="nav {{isCard?'nav-card-'+it.position:''}}">
                {{for i,v of it.list}} {{let isActive = i===it.activeNum}}{{let isFirst = i===0}}
                <div w-class="nav-item-{{it.position}} {{isFirst?'first-item-'+it.position:''}} {{isActive?'is-active-'+it.type +(isBorderCard&&isFirst?'-first':'')+'-'+it.position:''}} {{isCard?'is-card-'+it.position:''}}"
                    class="tabs-item" on-tap="doClick(e,{{i}})">
                    <span w-class="{{isActive?('nav-span-'+it.type+'-'+it.position):''}}">{{v}}</span>
                </div>
                {{end}}
            </div>
        </div>
    </div>
</div>