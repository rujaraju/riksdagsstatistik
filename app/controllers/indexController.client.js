'use strict';

(function () {
   console.log("working")
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var bS = document.querySelector('#bS');
   var apiUrl = 'https://riksdagsstatistik-ruja.c9users.io/age';
   var apiUrl2 = 'https://riksdagsstatistik-ruja.c9users.io/gender';
   var apiUrl3 = 'https://riksdagsstatistik-ruja.c9users.io/leftist';
   
   function ready (fn) { //function to execute other function only if document is completely loaded
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   }
   
   function ajaxRequest (method, url, callback) {
      console.log("sending", url)
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () { // check if readyState is 4, then execute callback on response
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
   

   
   function graph (data) {
      if (data) {console.log("data")}
      
      //bS.innerHTML = data
      var json = JSON.parse(data)
      
      var myChart = Highcharts.chart('graph', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Medelålder i riksdagsgrupper'
        },
        xAxis: {
            categories: json.categories
        },
        yAxis: {
           softMax: 65,
           softMin: 20,
            title: {
                text: 'Medelålder'
            }
        },
        series: json.series
    });
   }
   
   function graph2 (data) {
      if (data) {console.log("data2")}
      
      //bS.innerHTML = data
      var json = JSON.parse(data)
      
      var myChart = Highcharts.chart('graph2', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Könsfördelningen i riksdagsgrupper'
        },
        xAxis: {
            categories: json.categories
        },
        yAxis: {
           softMax: 80,
           softMin: 20,
            title: {
                text: 'Procent'
            }
        },
        series: json.series
    });
   }
   
   function graph3 (data) {
      if (data) {console.log("data3")}
      
      //bS.innerHTML = data
      var json = JSON.parse(data)
      
      var myChart = Highcharts.chart('graph3', {
        chart: {
            type: 'area'
        },
        title: {
            text: 'Vänsterns andel i riksdagen'
        },
        xAxis: {
            categories: json.categories
        },
        yAxis: {
           softMax: 80,
           min: 20,
            title: {
                text: 'Procent'
            }
        },
        series: json.series
    });
   }
   
   ready(ajaxRequest('GET', apiUrl, graph)); //using the ready function from above to send request for number of clicks and then update clicknumber-span
   ready(ajaxRequest('GET', apiUrl2, graph2));
   ready(ajaxRequest('GET', apiUrl3, graph3));
   /*addButton.addEventListener('click', function () { //on addbutton-click send a post-request then update clicknumber as callback
      ajaxRequest('POST', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updateClickCount)
      });

   }, false);
    
     deleteButton.addEventListener('click', function () {

      ajaxRequest('DELETE', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updateClickCount);
      });

   }, false);*/
    
})();