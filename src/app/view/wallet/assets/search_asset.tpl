<div w-class="base">
    <div w-class="header" title="36px">
        <div w-class="input" ev-input-change="onInputChange" ev-input-clear="onInputChange">
            <app-components-input-input_search>{placeHolder:"输入资产名",clearable:true }</app-components-input-input_search>
        </div>
        <div w-class="back" on-tap="doClose">
            <span>取消</span>
        </div>
    </div>

    <div w-class="body">
        
        {{if it1.list.length<=0}}
            <div style="height: 100%;background-color: white;position: relative;">
                <div w-class="no-record"></div>
                <div w-class="no-record-text">并没有结果</div>
            </div>
        {{else}}
        <div>
            {{for i,each of it1.list}}
            <div w-class="each">
                <img src="../../../res/image/{{each.name}}.png" w-class="icon-img"/>
                <div w-class="box">
                    <div w-class="name">{{each.name}}</div>
                    <div w-class="description">{{each.description}}</div>
                </div>
                {{if each.isChoose}}
                <div w-class="switched">
                    <span>已添加</span>
                </div>
                {{else}}
                <div w-class="unswitch" on-tap="doAdd(e,{{i}})">
                    <span>添加</span>
                </div>
                {{end}}
            </div>
            {{end}}
        </div>
        {{end}}
    </div>

</div>