<div w-class="base">
    <div w-class="nav">
        {{for i,v of it.list}} {{let isActive = i===it.activeNum}}
        <div w-class="nav-item {{isActive ? 'is-active' : ''}}" on-tap="doClick(e,{{i}})">
            {{v.tab}}
        </div>
        {{end}}
    </div>
    <div w-class="components" ev-import-success="importSuccess">
    {{for i,v of it.list}} {{let isActive = i===it.activeNum}}
    <widget w-tag={{v.components}} style="visibility: {{isActive ? 'visible' : 'hidden'}}; z-index:{{isActive ? 0 : -1}}; position:absolute; width:100%;height:100%;">{isActive:{{isActive}}}</widget>
    {{end}}
    </div>  
</div>


