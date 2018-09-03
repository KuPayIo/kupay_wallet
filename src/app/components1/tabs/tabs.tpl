<div w-class="base">
    <div w-class="nav-wrap">
        <div w-class="nav">
            {{for i,v of it.list}} {{let isActive = i===it.activeNum}}{{let isFirst = i===0}}
            <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="doClick(e,{{i}})">
                {{v}}
            </div>
            {{end}}
        </div>
    </div>
</div>


