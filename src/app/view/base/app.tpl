<div style="width:100%;height:100%">

<div w-class="tabs">
{{if it1.type === 0}}
    {{for i, v of it1.tabBarList}}
        {{if i == it1.isActive}}
        <widget w-tag={{v.components}} style="visibility:visible;z-index:0;position:absolute;width:100%;height:100%;">{isActive:{{i == it1.isActive}}}</widget>
        {{elseif it1.old[i]}}
        <widget w-tag={{v.components}} style="visibility:hidden;z-index:-1;position: absolute;width:100%;height:100%;">{isActive:{{i == it1.isActive}}}</widget>
        {{end}}
    {{end}}
{{elseif it1.type === 1}}
    <widget w-tag={{it1.tabBarList[it1.isActive].components}} style="position:absolute;width:100%;height:100%;">{isActive:false}</widget>
{{else}}
    {{for i, v of it1.tabBarList}}
        {{if v.name !== 'chat'}}
        <widget w-tag={{v.components}} style="visibility: {{i == it1.isActive ? 'visible' : 'hidden'}}; z-index:{{i == it1.isActive ? 0 : -1}}; position:absolute; width:100%;height:100%;">{isActive:{{i == it1.isActive}}}</widget>
        {{end}}
    {{end}}
{{end}}
</div>

<div w-class="ga-bottom-tab-bar-container" >
    {{for index,item of it1.tabBarList}}
    <div w-class="ga-tab-bar-item {{it1.isActive == index ? 'ga-tab-bar-item-active' : ''}}" on-down="tabBarChangeListener(e,{{index}})">
        <img src="../../res/image/{{it1.isActive == index ? item.iconActive : item.icon}}" w-class="ga-tab-bar-icon {{index===2 ? 'iconCenter' : ''}}" />
        <span w-class="ga-tab-bar-text">{{item.text}}</span>
    </div>
    {{end}}
</div>

</div>
