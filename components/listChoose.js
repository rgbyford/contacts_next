const load = require ('../pages/load');

class ListChoose extends React.Component {
    constructor (props) {
        super (props);
        console.log (`LC props: `, props);
        this.state = {aoCats: []};
    }

    makeCatsList(isSubCatOf) {
        console.log(`makeCatsList - subCatsOf: |${isSubCatOf}|`);
        let aoCatsList = [];
        let j = 0;
//        let aoCats = load.getCats();
//console.log ("this.props: ", this.props);
        let aoCatsLocal = this.state.aoCats;
        console.log (`aoCats: ${aoCatsLocal}`);
        // for (let i = 0; i < aoCats.length; i++) {
        //     if (aoCats[i].isSubCatOf === iSubCatOf) {
        //         aoCatsList.push(aoCats[i]);
        //         //            aoCatsList[j].key = j++;
        //     }
        // }
        console.log(`aoCL length: ${aoCatsList.length}`);
        return (aoCatsList);
    }

        //    let aoCatsList = makeCatsList ("");
    render() {
        return (
            <div>
            <select> {
                this.makeCatsList("").map((x, y) => <option key = {y.sThisCat}> {x} </option>)}
            </select>
            </div>
        );
    }
}

export default ListChoose;