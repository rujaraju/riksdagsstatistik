'use strict';

var express = require('express'),
    //routes = require('./app/routes/index.js'),
    fs = require('fs');
    //mongo = require('mongodb').MongoClient; // npm install mongodb & the rest of setup for c9, ./mongod to start it

var app = express();
var port = process.env.PORT || 8080;

function gender(res, content, sY, eY, iG) {
    
if (!content) {content = []};
if (!sY) {sY = 1907}; // startyear
if (!eY) {eY = 2016}; // endyear
if (!iG) {iG = ["Vasemmistoliiton eduskuntaryhmä", "Kansallisen kokoomuksen eduskuntaryhmä", "Sosialidemokraattinen eduskuntaryhmä", "Keskustan eduskuntaryhmä", "Vihreä eduskuntaryhmä", "Kristillisdemokraattinen eduskuntaryhmä"]}// in group

var result = {"categories": [], "working": {"Total": []}, "series": [{"name": "Total", "data": []}]};
iG.forEach(function(elem){
    result.working[elem] = []
    result.series.push({"name": elem, "data": []})
})

//console.log(JSON.stringify(result))

for (var y = sY; y < eY+1; y++) {//for every year between start and end
result.categories.push(y)
Object.keys(result.working).forEach(function(key){result.working[key].push({"year": y, "tot": 0, "n": 0, "%": 0}) });


content.forEach(function(elem){
    
if ((elem.edusRyhmPer[0].start[2] < y || elem.edusRyhmPer[0].start.reduce(function(acc, curr){return acc+curr}) == y+2) /* dvs första dan på året, året + 1 +1 */&& elem.edusRyhmPer[elem.edusRyhmPer.length-2].end[2] >= y){//if year is within boundaries of persons period in parlament

for (var i = 0; i <elem.edusRyhmPer.length-1; i++) {
    if ((y > elem.edusRyhmPer[i].start[2] || elem.edusRyhmPer[i].start.reduce(function(acc, curr){return acc+curr}) == y+2) && y <= elem.edusRyhmPer[i].end[2] ){//hittade året inom gruppen [i] och gruppen var med i iG

if (iG.indexOf(elem.edusRyhmPer[i].ryhmName) > -1){
result.working[elem.edusRyhmPer[i].ryhmName][result.working[elem.edusRyhmPer[i].ryhmName].length-1].tot++; if (elem.sukup == "n") {result.working[elem.edusRyhmPer[i].ryhmName][result.working[elem.edusRyhmPer[i].ryhmName].length-1].n++}    
}

result.working["Total"][result.working.Total.length-1].tot++; if (elem.sukup == "n") {result.working["Total"][result.working.Total.length-1].n++}


    }
    }
}

})//looping through all persons ends
Object.keys(result.working).forEach(function(key){
    if (result.working[key][result.working[key].length-1].tot > 0)//if there's any results
    {result.working[key][result.working[key].length-1]["%"] = Math.round(result.working[key][result.working[key].length-1].n/result.working[key][result.working[key].length-1].tot*1000)/10} 
    else {result.working[key][result.working[key].length-1]["%"] = null}; 
    for (var s = 0; s < result.series.length; s++) {//push result into the correct series
    if (result.series[s].name == key) {result.series[s].data.push(result.working[key][result.working[key].length-1]["%"])}
}
    
})
}//the loop for all years ends here
console.log(result.working.Total);
delete result.working  
res.send(JSON.stringify(result));
console.log("sent")
return result;
}//function gender ends

/*var test = [{"sukup": "m", "syntVuosi": '1800', "edusRyhmPer": [{"ryhmName": "Vasemmistoliiton eduskuntaryhmä", "start": [1,2,1987], "end": [2,3,1995]}, {"allRyhm": "Vasemmistoliiton eduskuntaryhmä", "yrsTot": 8}]}, {"id":28,"sukunimi":"Aho","etunimi":"Raila Orvokki","edustajana":"21.03.1987 - 23.03.1995","synt":"31.10.1937","syntVuosi":"","syntPaik":"Pomarkku","edusRyhm":"Vasemmistoliiton eduskuntaryhmä 21.03.1987 - 23.03.1995","piiri":"Turun läänin pohjoinen vaalipiiri 21.03.1987 - 23.03.1995","elimet":"\"Lakivaliokunta (varajäsen) 1987 - 1994\nLaki- ja talousvaliokunta (jäsen) 1987 - 1990\nHallintovaliokunta (jäsen) 1991 - 1994\nValitsijamiehet (jäsen) 1987 - 1994\nKansaneläkelaitoksen valtuutetut (varajäsen) 1987 - 1990, (ensimmäinen varajäsen) 1991 - 1991\"","valtNeuv":"","ekstra":"","ryhmTeht":"\"SKDL:n/ Vasemmistoliiton eduskuntaryhmä, työvaliokunta 1989-1990, 1992-1994 -\nSuomen kansan demokraattisen liiton eduskuntaryhmä (vpj) 1990 -\"","kuntTeht":"\"Porin raittiuslautakunta, pj 1969-1976\nPorin kaupunginhallitus 1981-1984, 1997-\nPorin kaupunginhallitus, 1. vpj 1985-1990\nPorin kaupunginvaltuusto, 2. vpj 1991-1996\nPorin kaupunginvaltuusto 1973-\"","valtTeht":"presidentin valitsijamies 1987","arvonimi":"","ammatti":"toimistonhoitaja","ura":"\"leipomoapulainen 1955-1956\ntoimistonhoitaja 1956-1972\npiirisihteeri 1972-1978\ntoimistonhoitaja 1978-1987\"","sukup":"n","edusPer":[{"start":[21,3,1977],"end":[23,3,1995],"yrs":8},{"yrsTot":8}],"edusRyhmPer":[{"ryhmName":"Vasemmistoliiton eduskuntaryhmä","start":[21,3,1977],"end":[23,3,1995],"yrs":8},{"allRyhm":["Vasemmistoliiton eduskuntaryhmä"],"yrsTot":8}]}, {"id":35,"sukunimi":"Ainali","etunimi":"Sakari","edustajana":"01.05.1924 - 31.07.1929, 21.10.1930 - 31.08.1933","synt":"","syntVuosi":"1900","syntPaik":"Himanka","edusRyhm":"\"Kansallisen kokoomuksen eduskuntaryhmä 01.05.1924 - 31.07.1929\nKansallisen kokoomuksen eduskuntaryhmä 21.10.1930 - 31.08.1933\"","piiri":"\"Oulun läänin eteläinen vaalipiiri 01.05.1924 - 31.07.1929\nOulun läänin eteläinen vaalipiiri 21.10.1930 - 31.08.1933\"","elimet":"\"Kulkulaitosvaliokunta  - \nTyöväenasiainvaliokunta  -\"","valtNeuv":"","ekstra":"","ryhmTeht":"","kuntTeht":"\"Himangan kuntakokous, pj \nHimangan kunnanvaltuusto, pj\"","valtTeht":"","arvonimi":"","ammatti":"maanviljelijä, liikemies, maallikkosaarnaaja","ura":"\"USA:ssa kultakaivoksen työmies ja työnjohtaja 1895-1905\nrakennustyönjohtaja Himangalla 1905-1918\nosakas Himangan saha- ja myllyosakeyhtiössä ja sen toimitusjohtaja \nmaanviljelijä ja osakas osakeyhtiössä 1918-\nmaallikkosaarnaaja\"","sukup":"n","edusPer":[{"start":[1,5,1924],"end":[31,7,1929],"yrs":5.2},{"start":[21,10,1930],"end":[31,8,1933],"yrs":2.8},{"yrsTot":8}],"edusRyhmPer":[{"ryhmName":"Mongoliitto","start":[1,5,1924],"end":[31,7,1929],"yrs":5.2},{"ryhmName":"Kansallisen kokoomuksen eduskuntaryhmä","start":[21,10,1930],"end":[31,8,1967],"yrs":2.8},{"allRyhm":["Mongoliitto", "Kansallisen kokoomuksen eduskuntaryhmä"],"yrsTot":8}]}]*/


function age(res, content, sY, eY, iG) {
    
if (!content) {content = []};
if (!sY) {sY = 1907}; // startyear
if (!eY) {eY = 2015}; // endyear
if (!iG) {iG = ["Vasemmistoliiton eduskuntaryhmä", "Kansallisen kokoomuksen eduskuntaryhmä", "Sosialidemokraattinen eduskuntaryhmä", "Keskustan eduskuntaryhmä", "Vihreä eduskuntaryhmä", "Kristillisdemokraattinen eduskuntaryhmä"]}// in group

var result = {"categories": [], "working": {"Total": []}, "series": [{"name": "Total", "data": []}]};
iG.forEach(function(elem){
    result.working[elem] = []
    result.series.push({"name": elem, "data": []})
})

//console.log(JSON.stringify(result))

for (var y = sY; y < eY+1; y++) {//for every year between start and end
result.categories.push(parseInt(y))
Object.keys(result.working).forEach(function(key){result.working[key].push({"year": y, "sum": 0, "amount": 0, "average": 0}) });


content.forEach(function(elem){

if (elem.syntVuosi != undefined && elem.syntVuosi != null) {
if (elem.syntVuosi.length > 3) {


if ((elem.edusRyhmPer[0].start[2] < y || elem.edusRyhmPer[0].start.reduce(function(acc, curr){return acc+curr}) == y+2) /* dvs första dan på året, året + 1 +1 */&& elem.edusRyhmPer[elem.edusRyhmPer.length-2].end[2] >= y){//if year is within boundaries of persons period in parlament

for (var i = 0; i <elem.edusRyhmPer.length-1; i++) {
    if ((y > elem.edusRyhmPer[i].start[2] || elem.edusRyhmPer[i].start.reduce(function(acc, curr){return acc+curr}) == y+2) && y <= elem.edusRyhmPer[i].end[2]){//hittade året inom gruppen [i] 

if(iG.indexOf(elem.edusRyhmPer[i].ryhmName) > -1){ //och gruppen var med i iG
result.working[elem.edusRyhmPer[i].ryhmName][result.working[elem.edusRyhmPer[i].ryhmName].length-1].sum += y-parseInt(elem.syntVuosi); 
result.working[elem.edusRyhmPer[i].ryhmName][result.working[elem.edusRyhmPer[i].ryhmName].length-1].amount++ }

result.working.Total[result.working.Total.length-1].sum += y-parseInt(elem.syntVuosi);
result.working.Total[result.working.Total.length-1].amount++


    
    }
}
}
}
} 
})//looping through all persons ends
Object.keys(result.working).forEach(function(key){if (result.working[key][result.working[key].length-1].sum > 0) {result.working[key][result.working[key].length-1]["average"] = Math.round(result.working[key][result.working[key].length-1].sum/result.working[key][result.working[key].length-1].amount*10)/10} else {result.working[key][result.working[key].length-1]["average"] = null}; for (var s = 0; s < result.series.length; s++) {
    if (result.series[s].name == key) {result.series[s].data.push(result.working[key][result.working[key].length-1]["average"])}

}
    
})
}//the loop for all years ends here


delete result.working;
res.send(JSON.stringify(result))
return result;
}

function leftist(res, content, sY, eY, iG) {
    
if (!content) {content = []};
if (!sY) {sY = 1907}; // startyear
if (!eY) {eY = 2015}; // endyear
if (!iG) {iG = ["Vasemmistoliiton eduskuntaryhmä", "Kansallisen kokoomuksen eduskuntaryhmä", "Sosialidemokraattinen eduskuntaryhmä"]}// in group
var leftist = ["Vasemmistoliiton eduskuntaryhmä", "Sosialidemokraattinen eduskuntaryhmä", "Suomen kansan demokraattisen liiton eduskuntaryhmä", "Suomen sosialistinen työväenpuolue", "Työväen ja pienviljelijäin vaaliliitto", "Sosialistinen eduskuntaryhmä \"\"kuutoset\"\"", "Työväen ja pienviljelijäin puolue", "Työväen ja pienviljelijäin sosialidemokraattinen liitto", "Suomen kristillisen työväen liitto", "Sosialidemokraattisen opposition eduskuntaryhmä", "Vasemmistoryhmä", "Sosialidemokraattinen riippumaton eduskuntaryhmä", "Ruotsalainen vasemmisto", "Vasenryhmän eduskuntaryhmä"]

var result = {"categories": [], "working": {"Total": []}, "series": [{"name": "Total", "data": []}]};


for (var y = sY; y < eY+1; y++) {//for every year between start and end
result.categories.push(parseInt(y))
Object.keys(result.working).forEach(function(key){result.working[key].push({"year": y, "total": 0, "leftist": 0, "%": 0}) });


content.forEach(function(elem){

if ((elem.edusRyhmPer[0].start[2] < y || elem.edusRyhmPer[0].start.reduce(function(acc, curr){return acc+curr}) == y+2) /* dvs första dan på året, året + 1 +1 */&& elem.edusRyhmPer[elem.edusRyhmPer.length-2].end[2] >= y){//if year is within boundaries of persons period in parlament

for (var i = 0; i <elem.edusRyhmPer.length-1; i++) {
    if ((y > elem.edusRyhmPer[i].start[2] || elem.edusRyhmPer[i].start.reduce(function(acc, curr){return acc+curr}) == y+2) && y <= elem.edusRyhmPer[i].end[2]){//hittade året inom gruppen [i] 


result.working.Total[result.working.Total.length-1].total++
if (leftist.indexOf(elem.edusRyhmPer[i].ryhmName) > -1) {result.working.Total[result.working.Total.length-1].leftist++}


    
    }
}
}

 
})//looping through all persons ends
Object.keys(result.working).forEach(function(key){if (result.working[key][result.working[key].length-1].total > 0) {result.working[key][result.working[key].length-1]["%"] = Math.round(result.working[key][result.working[key].length-1].leftist/result.working[key][result.working[key].length-1].total*1000)/10} else {result.working[key][result.working[key].length-1]["average"] = null}; for (var s = 0; s < result.series.length; s++) {
    if (result.series[s].name == key) {result.series[s].data.push(result.working[key][result.working[key].length-1]["%"])}

}
    
})
}//the loop for all years ends here

var t = 0, l = 0;
for (var i = 0; i < result.working.Total.length; i++) {
    t += result.working.Total[i].total;
    l += result.working.Total[i].leftist;
}
result.working.Total.push({"years": "1907-2015", "total": t, "leftist": l, "%": Math.round(l/t*1000)/10})


delete result.working;
res.send(JSON.stringify(result))
return result;
}

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        }); 

app.route('/age')
        .get(function (req, res) {
            
fs.readFile('edusJson.txt', function(err, data) {
    if (err) throw err;
    var iG = JSON.parse(data.toString('utf8'))
fs.readFile('fullJson.txt', function(err, data) {
    if (err) throw err;
    var content = JSON.parse(data.toString('utf8')).content
age(res,content, 1930, undefined);
console.log("request came")
})
})
});

app.route('/gender')
        .get(function (req, res) {
            
fs.readFile('edusJson.txt', function(err, data) {
    if (err) throw err;
    var iG = JSON.parse(data.toString('utf8'))
fs.readFile('fullJson.txt', function(err, data) {
    if (err) throw err;
    var content = JSON.parse(data.toString('utf8')).content
gender(res,content, undefined, undefined);
console.log("request came2")
})
})
});

app.route('/leftist')
        .get(function (req, res) {
            
fs.readFile('edusJson.txt', function(err, data) {
    if (err) throw err;
    var iG = JSON.parse(data.toString('utf8'))
fs.readFile('fullJson.txt', function(err, data) {
    if (err) throw err;
    var content = JSON.parse(data.toString('utf8')).content
leftist(res,content, undefined, undefined, iG);
console.log("leftist requested")
})
})
});

app.listen(port, function () {
        console.log('Listening on port ' + port);
    });