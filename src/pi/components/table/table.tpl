<div>
    {{if it.title}}
    <div w-class="header {{it.showBoder?'header_boder':''}}">
        <table w-class="table">
            <thead w-class="has-gutter">
                <tr w-class="tr {{it.showBoder?'tr_boder':''}}">
                    {{for i,v of it.title}}
                    <th colspan="1" rowspan="1" w-class="is-leaf th {{it.showBoder?'th_boder':''}}">
                        <div w-class="cell">{{v}}</div>
                    </th>
                    {{end}}
                </tr>
            </thead>
        </table>
    </div>
    {{end}}
    <div w-class="body {{it.showBoder?'body_boder':''}}" style="{{it.maxHeight?'max-height: '+it.maxHeight +'px;overflow-y: auto;':''}}">
        <table w-class="table">
            <tbody>
                {{for i,v of it.datas}}
                <tr w-class="row {{it.showBoder?'row_boder':''}}">
                    {{for i1,v1 of v}}
                    <td w-class="is-leaf td {{it.showBoder?'td_boder':''}}">
                        <div w-class="cell">{{v1}}</div>
                    </td>
                    {{end}}
                </tr>
                {{end}}
            </tbody>
        </table>
    </div>
</div>