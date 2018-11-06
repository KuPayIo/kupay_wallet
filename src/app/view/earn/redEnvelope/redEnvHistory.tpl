<div class="new-page" w-class="new-page" ev-back-click="backPrePage" ev-refresh-click="refreshPage">

    <div w-class="content" on-scroll="getMoreList" id="redEnvHistory">
        <img src="../../../res/image/redEnvtop1.png" w-class="topBackimg" />
        <div id="historyRecords" w-class="records">

            <div w-class="topBack">
                <img src="../../../res/image/default_avater_big.png" w-class="userHead" />
                <div style="margin-top: 20px;">
                    <pi-ui-lang>{"zh_Hans":"������","zh_Hant":"���l��","en":""}</pi-ui-lang>
                </div>
                <div style="margin-bottom: 90px;"><span style="font-size: 64px;">{{it1.sendNumber}}</span>
                    <pi-ui-lang>{"zh_Hans":"�����","zh_Hant":"���t��","en":""}</pi-ui-lang>
                </div>
            </div>
            <div w-class="bottom">
                {{if it1.recordList.length==0}}
                    <div style="text-align: center;height: 100%;">
                        <img src="../../../res/image/redEnvEmpty.png" style="width: 200px;height: 200px;margin-top: 210px;" />
                        <div style="font-size: 32px;color: #888888;margin-top: 20px;">
                        <pi-ui-lang>{"zh_Hans":"���Է�һ�����","zh_Hant":"ԇԇ�lһ���t��","en":""}</pi-ui-lang></div>
                    </div>
                {{else}}
                    <div w-class="tips">
                        <pi-ui-lang>{"zh_Hans":"24Сʱδ����ȡ�ĺ�����˻����˻�","zh_Hant":"24С�rδ���Iȡ�ļt�����˻���~��","en":""}</pi-ui-lang>
                    </div>
                    {{for ind,val of it1.recordList}}
                    <div on-tap="goDetail({{ind}})">
                        {{let desc = {"zh_Hans":val.curNum+"/"+val.totalNum + "��","zh_Hant":val.curNum+"/"+val.totalNum + "��","en":""} }}
                        {{let outDate = {"zh_Hans":"�ѹ���","zh_Hant":"���^��","en":""} }}	
                        {{let rtypeShow = [{"zh_Hans":"��ͨ���","zh_Hant":"��ͨ�t��","en":""},{"zh_Hans":"ƴ�������","zh_Hant":"ƴ�֚�t��","en":""},{"zh_Hans":"������","zh_Hant":"��Ո�t��","en":""}] }}

                        <app-components-fourParaItem-fourParaItem>
                            {name:{{rtypeShow[val.rtype]}},data:{{val.amount+" "+val.ctypeShow}},time:{{val.timeShow}},describe:{{val.outDate ? outDate :desc}} }
                        </app-components-fourParaItem-fourParaItem>
                    </div>
                    {{end}}
                {{end}}

                {{if it1.showMoreTips && it1.recordList.length>0}}
                <div w-class="endMess" id="more"><pi-ui-lang>{"zh_Hans":"���˽�����","zh_Hant":"���˽Y����","en":""}</pi-ui-lang>^_^</div>
                {{end}}

            </div>

        </div>
    </div>
   {{: topBarTitle = {"zh_Hans":"�����¼","zh_Hant":"�t��ӛ�","en":""} }}	
    <app-components1-topBar-topBar2>{scrollHeight:{{it1.scrollHeight}},text:{{topBarTitle}} }</app-components1-topBar-topBar2>
</div>