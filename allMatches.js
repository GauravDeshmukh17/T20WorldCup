const request=require("request");
const cheerio=require("cheerio");
const scorecards=require("./scorecards");

function allMatches(url){
    request(url,cb);
}

function cb(err,res,body){
    if(err){
        console.log("error");
    }
    else{
        getAllMatchLink(body);
    }
}


function getAllMatchLink(html){

    let selecTool=cheerio.load(html);
    let storeMatchLink=selecTool('div[class="ds-grow ds-px-4 ds-border-r ds-border-line-default-translucent"]>a');
    // console.log(storeMatchLink[1]);
    // console.log(storeMatchLink.length);
    for(let i=0;i<storeMatchLink.length;i++){
        let eachMatchLink=selecTool(storeMatchLink[i]).attr('href');
        let fullMatchLink="https://www.espncricinfo.com"+eachMatchLink;
        scorecards.scorecards(fullMatchLink);
        // break;
        // console.log(i+1,fullMatchLink);
    }

}


module.exports={
    allMatches:allMatches
}