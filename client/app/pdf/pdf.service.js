'use strict';
const angular = require('angular');

/*@ngInject*/
export function pdfService(scores) {
	var pdf = this;

	pdf.convertToPDF = function(form, clientName) {
		var doc = new jsPDF("portrait");
		var name = form.name, date = new Date();
		var datePrint = date.toLocaleDateString();
		var yMargin = 10;

		doc.setLineWidth(500);
		doc.setFontSize(12);
		doc.text('API Maturity Survey Results', 10, yMargin)
		doc.setFontSize(10);
		yMargin = yMargin+5;
		doc.text('Client: ' + clientName + ', Date: ' + datePrint, 10, yMargin)
		yMargin = yMargin+10;
		doc.setFontSize(12);
		doc.text('Form: ' + name, 10, yMargin);
		yMargin = yMargin+10;
		doc.setFontSize(10);
		doc.text('Self-Assessment:', 10, yMargin);
		doc.setFontSize(8);
		yMargin = yMargin + 5;

		var i = 0;
		for (var j = 0; j < form.questions.length; j++) {
			if (form.questions[j].category == 'Self-Assessment') {		
				++i;
				var score = scores.calcScore(form.questions[j].answer, form.questions[j].weight);
				var response = scores.setSAResponse(form.questions[j]);
				var questionString = 'Q:' + i + ' ' + form.questions[j].question + ' (Score: ' + 
				score  + ', Response: ' + response + ' / Value [' + form.questions[j].answer +
				'], Weight: ' + form.questions[j].weight + ')';
				var splitQuestion = doc.splitTextToSize(questionString, 180);

        //loop thru each line and output while increasing the vertical space
        for(var c = 0, stlength = splitQuestion.length ; c < stlength ; c++) {
        	doc.text(splitQuestion[c], 10, yMargin);
        	yMargin = yMargin + 5;
        }//End for
      }//End if
    }//End for

    var saPieBase64 = pdf.chartToBase64('#ffffff', 'saBar');
    doc.addImage(saPieBase64, 'PNG', 10, yMargin, 75, 75);
    yMargin = yMargin + 85;
    var saLineBase64 = pdf.chartToBase64('#ffffff', 'saLine');
    doc.addImage(saLineBase64, 'PNG', 10, yMargin, 150, 75);
    yMargin = yMargin + 85;
    doc.setFontSize(10);
    doc.addPage();
    yMargin = 10;
    doc.text('Quality-Assessment:', 10, yMargin);
    doc.setFontSize(8);
    yMargin = yMargin + 5;

    i = 0;
    for (var j = 0; j < form.questions.length; j++) {
    	if (form.questions[j].category == 'Quantitative-Assessment') {

    		++i;
    		var score = scores.calcScore(form.questions[j].answer, form.questions[j].weight);
    		var response = scores.setQAResponse(form.questions[j]);
    		var questionString = 'Q:' + i + ' ' + form.questions[j].question + ' (Score: ' + 
    		score  + ', Response: ' + response + ' / Value [' + form.questions[j].answer +
    		'], Weight: ' + form.questions[j].weight + ')';
    		var splitQuestion = doc.splitTextToSize(questionString, 180);

        //loop thru each line and output while increasing the vertical space
        for(var c = 0, stlength = splitQuestion.length ; c < stlength ; c++) {
        	doc.text(splitQuestion[c], 10, yMargin);
        	yMargin = yMargin + 5;
        }//End for
      }//End if
    }//End for

    var qaPieBase64 = pdf.chartToBase64('#ffffff', 'qaBar');
    doc.addImage(qaPieBase64, 'PNG', 10, yMargin, 75, 75);
    yMargin = yMargin + 85;
    var qaLineBase64 = pdf.chartToBase64('#ffffff', 'qaLine');
    doc.addImage(qaLineBase64, 'PNG', 10, yMargin, 150, 75);

    doc.save(clientName +  '_' + name + '_Results_' + datePrint + '.pdf')
  }//End convertToPdf

  // Convert transparencies in canvas to base64 example:
  //https://github.com/mikechambers/ExamplesByMesh/blob/master/HTML5/canvas/exportWithBackgroundColor/scripts/main.js
  pdf.chartToBase64 = function(backgroundColor, canvasRef) {
  	var canvas = document.getElementById(canvasRef);  
  	var context = canvas.getContext("2d");  
  	var w = canvas.width;
  	var h = canvas.height;
  	var data;       

  	if(backgroundColor)
  	{
  		data = context.getImageData(0, 0, w, h);
  		var compositeOperation = context.globalCompositeOperation;
  		context.globalCompositeOperation = "destination-over";
  		context.fillStyle = backgroundColor;
  		context.fillRect(0,0,w,h);
    }//End if

    var imageData = document.getElementById(canvasRef).toDataURL('image/png');

    if(backgroundColor)
    {
    	context.clearRect (0,0,w,h);
    	context.putImageData(data, 0,0);        
    	context.globalCompositeOperation = compositeOperation;
    }

    return imageData;
  }//End chartToBase64
}//End chartToBase64

export default angular.module('apiLocalApp.pdf', [])
.service('pdf', pdfService)
.name;
