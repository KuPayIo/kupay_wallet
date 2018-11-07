<div style="width:100%;height:100%;display: flex;">

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
        <widget w-tag={{v.components}} style="visibility: {{v.identfy == it1.isActive ? 'visible' : 'hidden'}}; z-index:{{v.identfy == it1.isActive ? 0 : -1}}; position:absolute; width:100%;height:100%;">{isActive:{{v.identfy == it1.isActive}}}</widget>
    {{end}}
{{end}}
{{if it1.loading}}
<div w-class="loading-container"><app-components1-loading-loading1>{}</app-components1-loading-loading1></div>
{{end}}
</div>

<div w-class="ga-bottom-tab-bar-container" >
    {{for index,item of it1.tabBarList}}
    <div w-class="ga-tab-bar-item {{it1.isActive == item.identfy ? 'ga-tab-bar-item-active' : ''}}" on-down="tabBarChangeListener(e,{{index}})">
        <img src="../../res/image1/{{it1.isActive == item.identfy ? item.iconActive : item.icon}}" w-class="ga-tab-bar-icon" />
        <span w-class="ga-tab-bar-text">
            <pi-ui-lang>{{item.text}}</pi-ui-lang>
        </span>
    </div>
    {{end}}
</div>

</div>
