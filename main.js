let url="https://www.espncricinfo.com/series/icc-men-s-t20-world-cup-2022-23-1298134";

const request=require("request");
const cheerio=require("cheerio");

request(url,cb);

function cb(err,res,body){
    if(err){
        console.log("error");
    }
    else{
        handleHtml(body);
    }
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
    console.log(fullLink);

}
