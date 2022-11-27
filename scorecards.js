const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");
const xlsx=require("xlsx");

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


    console.log();

    let teamChangeCheck=0;
    let teamDetails=selecTool('[class="ds-w-full ds-table ds-table-md ds-table-auto  ci-scorecard-table"] tbody tr');
    // for(let i=0;i<teamDetails.length;i++){
        // let allRows=selecTool(teamDetails[i]).find("tr");
        // console.log(teamDetails.length);
        // console.log(allRows.text());
        for(let j=0;j<teamDetails.length;j++){
            let eachCol=selecTool(teamDetails[j]).find("td");
            // console.log(eachCol.length);
            // console.log(eachCol.text());
            if(eachCol.length==4){
                teamChangeCheck=1;
            }
            if(eachCol.length==8){

                //BATSMAN
                let batsman=selecTool(eachCol[0]).text();
                console.log("Batsman : "+batsman);

                // TEAM DETAILS
                if(teamChangeCheck==0){
                    ownTeam=team1;
                    oppTeam=team2;
                    console.log("Own Team : "+team1);
                    console.log("Opponent Team : "+team2);
                }
                else{
                    ownTeam=team2;
                    oppTeam=team1;
                    console.log("Own Team : "+team2);
                    console.log("Opponent Team : "+team1);
                }
                
                // RUNS
                let runs=selecTool(eachCol[2]).text();
                console.log("Runs : "+runs);

                // BALLS
                let balls=selecTool(eachCol[3]).text();
                console.log("Balls : "+balls);

                // 4's
                let fours=selecTool(eachCol[5]).text();
                console.log("4's : "+fours);

                // 6's
                let sixes=selecTool(eachCol[6]).text();
                console.log("6's : "+sixes);

                // Strike Rate
                let sr=selecTool(eachCol[7]).text();
                console.log("Strike-Rate : "+sr);

                //BATSMAN WICKET DETAILS
                let bwd=selecTool(eachCol[1]).text();
                console.log("Batsman Wicket Details : "+bwd);

                console.log();


                // FILLING DATA INTO JSON FILE
                let obj={
                    "Match Number":matchNumber,
                    "Batsman":batsman,
                    "Own Team":ownTeam,
                    "Opponent Team":oppTeam,
                    "Runs":runs,
                    "Balls":balls,
                    "4's":fours,
                    "6's":sixes,
                    "Strike Rate":sr,
                    "Batsman Wicket Details":bwd,
                    "Venue":venue,
                    "Date":date
                };

                const data=JSON.stringify(obj);
                fs.writeFileSync("scorecards.json",data,{flag:'a'});

                processInformation(matchNumber,batsman,ownTeam,oppTeam,runs,balls,fours,sixes,sr,bwd,venue,date);
            }

        }
    // }
    console.log("======================================================================");

}



function processInformation(matchNumber,batsman,ownTeam,oppTeam,runs,balls,fours,sixes,sr,bwd,venue,date){

    let teamNamePath=path.join(__dirname,"IPL",ownTeam);
        if(!fs.existsSync(teamNamePath)){
            fs.mkdirSync(teamNamePath);
        }

    let playerFilePath=path.join(teamNamePath,batsman+".xlsx");
    let content=excelReader(playerFilePath,batsman);
    
    let obj={
        "Match Number":matchNumber,
        "Batsman":batsman,
        "Own Team":ownTeam,
        "Opponent Team":oppTeam,
        "Runs":runs,
        "Balls":balls,
        "4's":fours,
        "6's":sixes,
        "Strike Rate":sr,
        "Batsman Wicket Details":bwd,
        "Venue":venue,
        "Date":date
    };

    content.push(obj);
    excelWriter(playerFilePath,content,batsman);
}


function excelReader(playerFilePath,sheetName){
    if(!fs.existsSync(playerFilePath)){
        return[];
    }
    
    let workBook=xlsx.readFile(playerFilePath);
    let excelData=workBook.Sheets[sheetName];
    let playerObj=xlsx.utils.sheet_to_json(excelData);
    return playerObj;
}

function excelWriter(playerFilePath,jsObject,sheetName){

    // creates new book
    let newWorkBook=xlsx.utils.book_new();

    // converts an array of JS objects to worksheet
    let newWorkSheet=xlsx.utils.json_to_sheet(jsObject);

    // aapends worksheet to workbook
    xlsx.utils.book_append_sheet(newWorkBook,newWorkSheet,sheetName);
    
    xlsx.writeFile(newWorkBook,playerFilePath);
}


module.exports={
    scorecards:scorecards
}

