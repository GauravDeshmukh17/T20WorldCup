const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");

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
    let decsription=selecTool('div[class="ds-px-4 ds-py-3 ds-border-b ds-border-line"] div[class="ds-text-tight-m ds-font-regular ds-text-ui-typo-mid"]');
    let descArray=decsription.text().split(",");
    // console.log(descArray);

    // MATCH NUMBER
    let matchNumber=descArray[0];
    console.log("Match Number : "+matchNumber);

    // TEAMS
    let teams=selecTool('div[class="ds-bg-fill-canvas"]');
    let teamsArray=teams.text().split("Innings");
    // console.log(teamsArray);
    let team1=teamsArray[0];
    let team2=teamsArray[1];
    console.log(team1+" VS "+team2);

    // VENUE
    let venue=descArray[2];
    console.log("Venue :"+venue);

    // DATE
    let date=descArray[3]+descArray[4];
    console.log("Date :"+date);

    console.log("-----------------------------------------------------------------------");

    // filling data into json file 
    let obj={matchNumber,team1,team2,venue,date};
    const data=JSON.stringify(obj);
    fs.writeFileSync("scorecards.json",data,{flag:'a'});

}


module.exports={
    scorecards:scorecards
}

