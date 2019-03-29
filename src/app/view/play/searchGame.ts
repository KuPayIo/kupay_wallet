/**
 * 搜索游戏
 */
import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { hasWallet } from '../../utils/tools';
import { activityList } from './home/gameConfig';

interface Props {
    searchText:string;  // 输入的搜索文字
    gameList:any[];   // 游戏列表
    showGameList:any[];  // 搜索后的游戏列表
}
export class SearchGame extends Widget {
    public ok:() => void;
    public props:Props = {
        searchText: '',
        gameList: activityList,
        showGameList: activityList
    };
    
    public backPrePage() {
        this.ok && this.ok();
    }
    
    public searchTextChange(e:any) {
        this.props.searchText = e.value;
        if (this.props.searchText) {
            this.props.showGameList = this.props.gameList.filter(item => new RegExp(this.props.searchText).test(item.title.zh_Hans));
        } else {
            this.props.showGameList = this.props.gameList;
        }
        this.paint();
    }

    public searchTextClear() {
        this.props.showGameList = this.props.gameList;
        this.paint();
    }

    /**
     * 活动点击
     * @param index 序号
     */
    public activityClick(index:number) {
        if (!hasWallet()) return;
        popNew(this.props.gameList[index].url);
    }
    
}