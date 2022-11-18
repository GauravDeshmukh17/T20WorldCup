const request=require("request");
const cheerio=require("cheerio");


function scorecards(url){
    // console.log(url);
    request(url,cb);
}

function cb(err,res,body){
    if(err){
        console.log("error");
    }
    else{
        matchDetails(body);
    }
}


function matchDetails(html){

    let selecTool=cheerio.load(html);
    let venue=selecTool('div[class="ds-text-compact-xxs ds-p-2 ds-px-4 lg:ds-py-3"]');
    console.log(venue.text());

}


module.exports={
    scorecards:scorecards
}

