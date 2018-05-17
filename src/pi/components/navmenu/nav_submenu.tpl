
{{if it.mod=="horizontal"}}
<li class="nav-submenu {{it.isActivated?'is-active':''}}" on-mouseover="subMouseover" on-mouseout="subMouseout">
	<div class="nav-submenu__title {{it.isdisabled?'is-disabled':'' }}" style="{{it.isopen?'color:black':''}};">
		{{it.subtitle}}				
		<span style="float: right;margin-left: 10px; {{it.isopen?'transform:rotate(-90deg)':'transform:rotate(90deg)' }}" >></span>
	</div>
	
	<div class="nav-menu--horizontal" style="position:absolute; background-color:white; margin-top: 2px; top:{{it1.top+'px'}}; left:{{it1.left+'px'}}; display: {{it.isopen?'block':'none'}};">
		<ul class="nav-menu nav-menu--popup nav-menu--popup-bottom-start">
			{{for index, value of it.arr}}
				{{: value.mod=it.mod}}
				<navmenu_item$>{{value}}</navmenu_item$> 		
			{{end}}
		</ul>
	</div>
</li>
{{else}}
<li>
	<div class="nav-submenu__title nav-menu-item {{it.isdisabled?'is-disabled':'' }}" style="padding-left: {{it.index.split("-").length*20+'px' }}" on-click="subClick">
		{{it.subtitle}}
		<span style="float: right;right: 20px; {{it.isopen?'transform:rotate(-90deg)':'transform:rotate(90deg)' }}" >></span>
	</div>

	<ul class="nav-submenu {{it.isopen?'is-open':''}}" >
		{{for index, value of it.arr}}
			{{if value.submenu}}
				<nav_submenu$>{{value}}</nav_submenu$>
			{{else}}
				<navmenu_item$>{{value}}</navmenu_item$> 
			{{end}}
	
		{{end}}
	</ul>	
</li>
{{end}}
	
