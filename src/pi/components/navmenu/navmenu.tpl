
<ul class="nav-menu nav-menu--{{it.mod=='horizontal'?'horizontal':'vertical'}}" ev-navmenu-click="{{it.mod=='horizontal'?'doClick1':'doClick'}}" style="min-width: 240px; width:{{it.mod=='horizontal'?'auto':'240px'}}; ">
	{{for index, value of it.arr}}
		{{if value.submenu}}
			{{: value.mod=it.mod}}
			<nav_submenu$>{{value}}</nav_submenu$>
		{{else}}
			<navmenu_item$>{{value}}</navmenu_item$> 
		{{end}}
	{{end}}
</ul> 