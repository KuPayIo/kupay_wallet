<div class="ga-new-page">
    <app-components-topBar-topBar>{title:"关于我们"}</app-components-topBar-topBar>
    <div w-class="aboutus-img">
        <img src="../../res/image/u2458.png" style="width: 100%;"/>
    </div>
    
    {{for ind,val of it.data}}
        <listItem$>{{val}}</listItem$>
    {{end}}
</div>