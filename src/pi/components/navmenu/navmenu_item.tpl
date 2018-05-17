<div>
	{{if it.submenu}}
	<li class="nav-submenu" on-mouseover="itemMouseover" on-mouseout="itemMouseout">
		<div class="nav-menu-item {{it.isActivated?'is-active':''}} {{it.isdisabled?'is-disabled':''}}" style="{{it1.isopen?'color:black':''}};">
			{{it.subtitle}}
			<span style="float: right;right: 20px; {{it1.isopen?'transform:rotate(180deg)':'' }}" >></span>
		</div>
		<div style="position: absolute;margin-left: 4px; left:{{it1.left+'px'}}; top:{{it1.top+'px'}}; display:{{it1.isopen?'block':'none'}};">
			<ul class="nav-menu nav-menu--popup nav-menu--popup-bottom-start">
				{{for index, value of it.arr}}
					{{: value.mod = it.mod}}
					<navmenu_item$>{{value}}</navmenu_item$> 
				{{end}}
			</ul>		
		</div>
	</li>

	{{elseif it.mod=="horizontal"}}
	<li class="nav-menu-item {{it.isActivated?'is-active':''}} {{it.isdisabled?'is-disabled':''}}" on-click="doClick">
		{{it.title}}
	</li>	
	{{else}}
	<li class="nav-menu-item {{it.isActivated?'is-active':''}} {{it.isdisabled?'is-disabled':''}}" style="padding-left: {{it.index.split("-").length*20+'px'}}" on-click="doClick">
		{{it.title}}
	</li>	　
	{{end}}
</div>