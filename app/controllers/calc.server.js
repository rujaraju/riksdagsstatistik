module.exports = {
    gender: function(fs,res){
        fs.readFile(process.cwd()+'/statistics/edusJson.txt', function(err, data) {
    if (err) throw err;
    var iG = JSON.parse(data.toString('utf8'))
fs.readFile(process.cwd()+'/statistics/fullJson.txt', function(err, data) {
    if (err) throw err;
    var content = JSON.parse(data.toString('utf8')).content

var sY = 1907, // startyear
    eY = 2016, // endyear
    iG = ["Vasemmistoliiton eduskuntaryhmä", "Kansallisen kokoomuksen eduskuntaryhmä", "Sosialidemokraattinen eduskuntaryhmä", "Keskustan eduskuntaryhmä", "Vihreä eduskuntaryhmä", "Kristillisdemokraattinen eduskuntaryhmä"]// in group


var result = {"categories": [], "working": {"Total": []}, "series": [{"name": "Total", "data": []}]};

iG.forEach(function(elem){//resultarrays for all groups
    result.working[elem] = []
    result.series.push({"name": elem, "data": []})
})


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
//console.log(result.working.Total);
delete result.working  
res.send(JSON.stringify(result));

return result;

})
})
    },
    
    age: function(fs,res){
           fs.readFile(process.cwd()+'/statistics/edusJson.txt', function(err, data) {
    if (err) throw err;
    var iG = JSON.parse(data.toString('utf8'))
fs.readFile(process.cwd()+'/statistics/fullJson.txt', function(err, data) {
    if (err) throw err;
    var content = JSON.parse(data.toString('utf8')).content

    
var sY = 1907, // startyear
    eY = 2015, // endyear
    iG = ["Vasemmistoliiton eduskuntaryhmä", "Kansallisen kokoomuksen eduskuntaryhmä", "Sosialidemokraattinen eduskuntaryhmä", "Keskustan eduskuntaryhmä", "Vihreä eduskuntaryhmä", "Kristillisdemokraattinen eduskuntaryhmä"];// in group

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

})
})
        
    },
    
    leftist: function(fs,res){
           fs.readFile(process.cwd()+'/statistics/edusJson.txt', function(err, data) {
    if (err) throw err;
    var iG = JSON.parse(data.toString('utf8'))
fs.readFile(process.cwd()+'/statistics/fullJson.txt', function(err, data) {
    if (err) throw err;
    var content = JSON.parse(data.toString('utf8')).content

var sY = 1907, // startyear
    eY = 2015, // endyear
    leftist = ["Vasemmistoliiton eduskuntaryhmä", "Sosialidemokraattinen eduskuntaryhmä", "Suomen kansan demokraattisen liiton eduskuntaryhmä", "Suomen sosialistinen työväenpuolue", "Työväen ja pienviljelijäin vaaliliitto", "Sosialistinen eduskuntaryhmä \"\"kuutoset\"\"", "Työväen ja pienviljelijäin puolue", "Työväen ja pienviljelijäin sosialidemokraattinen liitto", "Suomen kristillisen työväen liitto", "Sosialidemokraattisen opposition eduskuntaryhmä", "Vasemmistoryhmä", "Sosialidemokraattinen riippumaton eduskuntaryhmä", "Ruotsalainen vasemmisto", "Vasenryhmän eduskuntaryhmä"];

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


})
})
    }
};