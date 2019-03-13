const fs = require("fs");
const init = (cfgPath) => {
    const str = fs.readFileSync(cfgPath, "utf8");
    const config = JSON.parse(str);
    deleteall(config.dsts[0].path);
    let arr = fs.readdirSync("./");
    arr.forEach(v => {
        if (v.indexOf(".depend") > -1) {
            fs.unlinkSync("./" + v);
        }
    });
    deleteall("../dst");
    console.log("------------ok");
}
const deleteall = (path) => {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse  
                deleteall(curPath);
            } else { // delete file  
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
init("./.conf");