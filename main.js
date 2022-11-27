let url="https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2022-23-1298134";

const request=require("request");
const cheerio=require("cheerio");
const allMatches=require("./allMatches");
const path=require("path");
const fs=require("fs");

request(url,cb);

function cb(err,res,body){
    if(err){
        console.log("error");
    }
    else{
        handleHtml(body);
    }
}

let iplPath=path.join(__dirname,"IPL");
if(!fs.existsSync(iplPath)){
    fs.mkdirSync(iplPath);
}


function handleHtml(html){
    
    let selecTool=cheerio.load(html);
    let anchorElement=selecTool('div[class="ds-border-t ds-border-line  ds-text-center ds-py-2"]>a');
    // console.log(anchorElement.text());

    // console.log(anchorElement);
    // attr -> it is method which is used to get values of attribs from html 

    let relativeLink=anchorElement.attr('href');
    // console.log(relativeLink);
    let fullLink="https://www.espncricinfo.com"+relativeLink;
    // console.log(fullLink);

    allMatches.allMatches(fullLink);

}
