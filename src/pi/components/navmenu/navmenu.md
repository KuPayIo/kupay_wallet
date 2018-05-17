导航菜单栏

- 引用外部样式，添加自定义样式文件navmenu.css
- 不允许对含有子模块的选项设置isdisabled
- horizontal模式只支持三层结构，超过三层的部分会被依次第三层下方


### 使用方法
使用navmenu组件，将所有需要的参数以json格式传递进去即可
```html
<div style="height: 500px; padding: 10px; background-color: white;">
	<components-navmenu-navmenu>
		{
			mod:"horizontal",		
			arr:[
				{index:"1",title:"选项111111",isActivated:true}, 
				{index:"2",title:"选项222222"}, 
				{
					index:"3",
					submenu:true,
					subtitle:"选项33333",					
					arr:[
						{index:"3-1",title:"选项3-1"}, 
						{index:"3-2",title:"选项3-2"}, 
						{index:"3-2",title:"选项3-2",isdisabled:true}, 
						{
							index:"3-3",
							submenu:true,
							subtitle:"选项3-3",							
							arr:[
								{index:"3-3-1",title:"选项3-3-1"},
								{index:"3-3-2",title:"选项3-3-2"}
							]
						}
					]
				},
				{index:"4",title:"选项444444"}
			]
		}
	</components-navmenu-navmenu>
</div>
```

参数说明
- mod 设置导航栏的类型，vertical和horizontal，默认是vertical垂直导航栏
- isopen 子模块是否展开，默认不展开
- arr 数组，没有子模块，直接传递包含title的json数据，有子模块传递包含submenu，subtitle及arr的json数据
- index 唯一标识
- title 名称
- submenu 是否含有子模块
- subtitle 模块组的名称
- isActivated 是否选中，默认未选中
- isdisable 是否不可选择，默认可选择