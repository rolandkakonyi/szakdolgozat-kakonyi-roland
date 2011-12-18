var xlCorrect = 0
var vbCorrect = 0
var wpCorrect = 0
var wdCorrect = 0


function writeImagePP() {

	var imageTextPP = ""

	img1PP="../bookImages/special_offer_new.gif"

	imageMap="<map name='MapPP'><area shape='rect' coords='142,12,388,26' href='../bookshop/allbooks.htm'><area shape='rect' coords='149,33,379,49' href='../bookshop/office_offer.htm'><area shape='rect' coords='163,56,363,71' href='../bookshop/programming_offer.htm'></map>"

	imageTextPP = "<p align ='center'><img src=" + img1PP + " usemap='#MapPP' border='0'></p>"
imageTextPP = imageTextPP + imageMap
	document.write(imageTextPP)
}


function writeImagePH() {
	//imageMap="<map name='MapPH'><area shape='rect' coords='142,12,388,26' href='../bookshop/allbooks.htm'><area shape='rect' coords='149,33,379,49' href='../bookshop/office_offer.htm'><area shape='rect' coords='163,56,363,71' href='../bookshop/programming_offer.htm'></map>"
	//imageTextPH = "<p align ='center'><img src=" + img1PH + " usemap='#MapPH' border='0'></p>"
	//imageTextPH = imageTextPH + imageMap
	
	var  img1PH ="../bookImages/special_offer_new2.gif"
	var imageTextPH = ""
	imageTextPH = "<p align ='center'><A HREF='../bookshop/programming_offer.htm'><img src=" + img1PH + " border='0'></A></p>"
	document.write(imageTextPH)
}

function writeImageWD() {

	var imageTextWD = ""
	var img1WD="../bookImages/special_offer_new.gif"

	imageMap="<map name='MapWD'><area shape='rect' coords='142,12,388,26' href='../bookshop/allbooks.htm'><area shape='rect' coords='149,33,379,49' href='../bookshop/office_offer.htm'><area shape='rect' coords='163,56,363,71' href='../bookshop/programming_offer.htm'></map>"

	imageTextWD = "<p align ='center'><img src=" + img1WD + " usemap='#MapWD' border='0'></p>"
	imageTextWD=imageTextWD + imageMap
	document.write(imageTextWD)
}


function DoPopUp(URL, width, height) {
msgWindow = window.open(URL, "PopUp", "toolbar=no,width=" + width + ",height=" +height)
}

function DoPopUp2(URL, width, height) {
msgWindow = window.open(URL, "PopUp", "toolbar=no,scrollbars=yes,width=" + width + ",height=" +height)
}

function eAdd() {
width = 500
height = 300
msgWindow = window.open('emailAddress.htm', "PopUp", "toolbar=no,width=" + width + ",height=" +height)
}

function eAdd2() {
width = 500
height = 300
msgWindow = window.open('../emailAddress.htm', "PopUp", "toolbar=no,width=" + width + ",height=" +height)
}

function eAdd3() {
width = 650
height = 600
msgWindow = window.open('../shipping.htm', "PopUp", "toolbar=no,width=" + width + ",height=" +height)
}

function RadioCheck(qNumber) {

	var chosen = ""
	var i
	var missingAnswer = 0
	var realAnswers = ""

	realAnswers = checkAnswers(qNumber)		//Get the answers
	aryAnswers = realAnswers.split(",")

	len = document.f1.Q1.length
	answers = new Array(9)

	for (num = 0; num < answers.length; num++) {
		answers[num] = ""
	}

	for (i = 0; i <len; i++) {
		if (document.f1.Q1[i].checked) {
			answers[0] = document.f1.Q1[i].value
		}
		else  {	

		}

		if (document.f1.Q2[i].checked) {		
			answers[1] = document.f1.Q2[i].value
		}
		else {

		}

		if (document.f1.Q3[i].checked) {
			answers[2] = document.f1.Q3[i].value
		}
		else {

		}

		if (document.f1.Q4[i].checked) {
			answers[3] = document.f1.Q4[i].value
		}
		else {

		}

		if (document.f1.Q5[i].checked) {
			answers[4] = document.f1.Q5[i].value
		}
		else {

		}

		if (document.f1.Q6[i].checked) {
			answers[5] = document.f1.Q6[i].value
		}
		else {

		}

		if (document.f1.Q7[i].checked) {
			answers[6] = document.f1.Q7[i].value
		}
		else {

		}

		if (document.f1.Q8[i].checked) {
			answers[7] = document.f1.Q8[i].value
		}
		else {

		}

		if (document.f1.Q9[i].checked) {
			answers[8] = document.f1.Q9[i].value
		}

		else {

		}
		if (document.f1.Q10[i].checked) {
			answers[9] = document.f1.Q10[i].value
		}
		else {
			//answers[9] = false
		}
	}


var correctCount = 0
var num
//-----------CHECK REAL ANSWERS AGAINST USER'S ANSWERS
	for (num = 0; num < 10; num++) {
		if (aryAnswers[num] == answers[num]) {
			correctCount++
		}

	}

	alert(correctCount)

//-------SET COOKIE
cookieName = qNumber
var value = ""
value = answers.join(",")
value = value + "," + correctCount	//------ADD correctCount

makeCookie(cookieName, value, 1)

//-------READ COOKIE
//var dat
//dat = readCookie(cookieName)

//alert(dat)

}

function ResetRadios() {

	len = document.f1.Q1.length

	for (i = 0; i <len; i++) {
		document.f1.Q1[i].checked = false
		document.f1.Q2[i].checked = false
		document.f1.Q3[i].checked = false
		document.f1.Q4[i].checked = false
		document.f1.Q5[i].checked = false
		document.f1.Q6[i].checked = false
		document.f1.Q7[i].checked = false
		document.f1.Q8[i].checked = false
		document.f1.Q9[i].checked = false
		document.f1.Q10[i].checked = false
	}

}


function checkAnswers(getAnswers) {

	var q1 = "B,D,A,B,C,B,D,D,A,C"
	var q2 = "B,B,C,B,D,A,D,B,C,A"
	var q3 = "D,C,D,A,B,C,B,B,D,C"
	var q4 = "B,C,B,A,B,C,A,D,D,C"
	var q5 = "B,D,B,A,A,D,A,B,D,A"

	var q6 = "B,C,B,A,D,C,B,A,C,C"
	var q7 = "A,C,D,A,C,A,D,B,D,A"
	var q8 = "D,B,A,C,C,C,A,D,A,B"
	var q9 = "B,A,C,B,D,C,A,C,A,B"
	var q10 = "B,C,D,B,A,B,A,C,B,B"

	var q11 = "C,C,A,D,A,C,D,C,B,C"
	var q12 = "D,C,B,B,C,D,D,B,C,D"
	var q13 = "B,A,B,D,D,B,A,A,D,C"
	var q14 = "D,D,B,B,A,D,D,D,A,C"
	var q15 = "D,C,D,B,D,C,C,B,D,C"

	var q16 = "B,D,B,C,A,D,A,C,C,D"
	var q17 = "C,B,B,A,D,A,C,B,B,B"
	var q18 = "C,B,C,A,A,C,A,D,B,B"
	var q19 = "A,B,C,B,D,A,A,C,A,B"

	if (getAnswers == "xlQ1-10") {
		return q1;
	}
	else if(getAnswers == "xlQ11-20") {
		return q2;
	}
	else if(getAnswers == "xlQ21-30") {
		return q3;
	}
	else if(getAnswers == "xlQ31-40") {
		return q4;
	}
	else if(getAnswers == "xlQ41-50") {
		return q5;
	}

	else if(getAnswers == "vbQ1-10") {
		return q6;
	}
	else if(getAnswers == "vbQ11-20") {
		return q7;
	}
	else if(getAnswers == "vbQ21-30") {
		return q8;
	}
	else if(getAnswers == "vbQ31-40") {
		return q9;
	}
	else if(getAnswers == "vbQ41-50") {
		return q10;
	}

	else if(getAnswers == "wpQ1-10") {
		return q11;
	}
	else if(getAnswers == "wpQ11-20") {
		return q12;
	}
	else if(getAnswers == "wpQ21-30") {
		return q13;
	}
	else if(getAnswers == "wpQ31-40") {
		return q14;
	}
	else if(getAnswers == "wpQ41-50") {
		return q15;
	}

	else if(getAnswers == "wdQ1-10") {
		return q16;
	}
	else if(getAnswers == "wdQ11-20") {
		return q17;
	}
	else if(getAnswers == "wdQ21-30") {
		return q18;
	}
	else if(getAnswers == "wdQ31-40") {
		return q19;
	}
}

//function setCookie (cookieName, value) {

//BASIC COOKIE:  document.cookie="nameofCookie=cookieData"

	//document.cookie = cookieName + "=" + value

//escape()
//}


//----HAVE BACK BUTTON LINK CALL THE parseCookieData(qNumber) FUNCTION
//----THEN READ THE COOKIE AND PUT DATA INTO RADIO BUTTONS. 
//----qNumber is the Name of the Cookie

function parseCookieData(qNumber) {

	var dat

if (document.cookie.length > 0) {
	dat = readCookie(qNumber)	//dat WILL EITHER BE "" OR RETURN THE COOKIE DATA
	var aryCookie
	var numberCorrect

	if (dat != "" || dat != -1) {

		//parse cookie data and fill radio buttons
		aryCookie = dat.split(",")

		q1 = getradio(aryCookie[0])
		q2 = getradio(aryCookie[1])
		q3 = getradio(aryCookie[2])
		q4 = getradio(aryCookie[3])
		q5 = getradio(aryCookie[4])
		q6 = getradio(aryCookie[5])
		q7 = getradio(aryCookie[6])
		q8 = getradio(aryCookie[7])
		q9 = getradio(aryCookie[8])
		q10 = getradio(aryCookie[9])
	
		if (q1 >=0 && q1 <=3) {
			document.f1.Q1[q1].checked = true
		}
		else {
			document.f1.Q1[0].checked = false
			document.f1.Q1[1].checked = false
			document.f1.Q1[2].checked = false
			document.f1.Q1[3].checked = false
		}


		if (q2 >=0 && q2 <=3) {
			document.f1.Q2[q2].checked = true
		}
		else {
			document.f1.Q2[0].checked = false
			document.f1.Q2[1].checked = false
			document.f1.Q2[2].checked = false
			document.f1.Q2[3].checked = false
		}


		if (q3>=0 && q3<=3) {
			document.f1.Q3[q3].checked = true
		}
		else {
			document.f1.Q3[0].checked = false
			document.f1.Q3[1].checked = false
			document.f1.Q3[2].checked = false
			document.f1.Q3[3].checked = false
		}


		if (q4 >=0 && q4 <=3) {
			document.f1.Q4[q4].checked = true
		}
		else {
			document.f1.Q4[0].checked = false
			document.f1.Q4[1].checked = false
			document.f1.Q4[2].checked = false
			document.f1.Q4[3].checked = false
		}


		if (q5 >=0 && q5 <=3) {
			document.f1.Q5[q5].checked = true
		}
		else {
			document.f1.Q5[0].checked = false
			document.f1.Q5[1].checked = false
			document.f1.Q5[2].checked = false
			document.f1.Q5[3].checked = false
		}


		if (q6 >=0 && q6 <=3) {
			document.f1.Q6[q6].checked = true
		}
		else {
			document.f1.Q6[0].checked = false
			document.f1.Q6[1].checked = false
			document.f1.Q6[2].checked = false
			document.f1.Q6[3].checked = false
		}


		if (q7 >=0 && q7 <=3) {
			document.f1.Q7[q7].checked = true
		}
		else {
			document.f1.Q7[0].checked = false
			document.f1.Q7[1].checked = false
			document.f1.Q7[2].checked = false
			document.f1.Q7[3].checked = false
		}


		if (q8 >=0 && q8 <=3) {
			document.f1.Q8[q8].checked = true
		}
		else {
			document.f1.Q8[0].checked = false
			document.f1.Q8[1].checked = false
			document.f1.Q8[2].checked = false
			document.f1.Q8[3].checked = false
		}

		if (q9 >=0 && q9 <=3) {
			document.f1.Q9[q9].checked = true
		}
		else {
			document.f1.Q9[0].checked = false
			document.f1.Q9[1].checked = false
			document.f1.Q9[2].checked = false
			document.f1.Q9[3].checked = false
		}


		if (q10 >=0 && q10 <=3) {
			document.f1.Q10[q10].checked = true
		}
		else {
			document.f1.Q10[0].checked = false
			document.f1.Q10[1].checked = false
			document.f1.Q10[2].checked = false
			document.f1.Q10[3].checked = false
		}

	}
}


}

function checkState(aNumber) {
	var radioNumber
	if (aNumber == "A") {
		radioNumber = 0
	}
	if (aNumber == "B") {
		radioNumber = 1
	}
	if (aNumber == "C") {
		radioNumber = 2
	}
	if (aNumber == "D") {
		radioNumber = 3
	}
	return radioNumber
}


function getradio(num) {

	for (i=0;i<4;i++) {
		checkedState1 = checkState(num)
		if (checkedState1 == i) {
			return i
		}
	}
}

function getScores() {
var q1, q2, q3, q4, q5
var aryQ1, aryQ2, aryQ3, aryQ4, aryQ5
var a1, a2, a3, a4, a5

q1 = readCookie("xlQ1-10")
q2 = readCookie("xlQ11-20")
q3 = readCookie("xlQ21-30")
q4 = readCookie("xlQ31-40")
q5 = readCookie("xlQ41-50")

if (q1 != "") {
	aryQ1 = q1.split(",")
	a1 = aryQ1[10]
	a1 = parseInt(a1)
}
if (q2 != "") {
	aryQ2 = q2.split(",")
	a2 = aryQ2[10]
	a2 = parseInt(a2)
}
if (q3 != "") {
	aryQ3 = q3.split(",")
	a3 = aryQ3[10]
	a3 = parseInt(a3)
}
if (q4 != "") {
	aryQ4 = q4.split(",")
	a4 = aryQ4[10]
	a4 = parseInt(a4)
}
if (q5 != "") {
	aryQ5 = q5.split(",")
	a5 = aryQ5[10]
	a5 = parseInt(a5)
}

xlCorrect = eval(a1 + a2 + a3 + a4 + a5)

}


function getScoresVB() {
var q1, q2, q3, q4, q5
var aryQ1, aryQ2, aryQ3, aryQ4, aryQ5
var a1, a2, a3, a4, a5


q1 = readCookie("vbQ1-10")
q2 = readCookie("vbQ11-20")
q3 = readCookie("vbQ21-30")
q4 = readCookie("vbQ31-40")
q5 = readCookie("vbQ41-50")

if (q1 != "") {
	aryQ1 = q1.split(",")
	a1 = aryQ1[10]
	a1 = parseInt(a1)
}
if (q2 != "") {
	aryQ2 = q2.split(",")
	a2 = aryQ2[10]
	a2 = parseInt(a2)
}
if (q3 != "") {
	aryQ3 = q3.split(",")
	a3 = aryQ3[10]
	a3 = parseInt(a3)
}
if (q4 != "") {
	aryQ4 = q4.split(",")
	a4 = aryQ4[10]
	a4 = parseInt(a4)
}
if (q5 != "") {
	aryQ5 = q5.split(",")
	a5 = aryQ5[10]
	a5 = parseInt(a5)
}

vbCorrect = eval(a1 + a2 + a3 + a4 + a5)

}

function getScoresWP() {
	var q1, q2, q3, q4, q5
	var aryQ1, aryQ2, aryQ3, aryQ4, aryQ5
	var a1, a2, a3, a4, a5

	q1 = readCookie("wpQ1-10")
	q2 = readCookie("wpQ11-20")
	q3 = readCookie("wpQ21-30")
	q4 = readCookie("wpQ31-40")
	q5 = readCookie("wpQ41-50")

if (q1 != "") {
	aryQ1 = q1.split(",")
	a1 = aryQ1[10]
	a1 = parseInt(a1)
}
if (q2 != "") {
	aryQ2 = q2.split(",")
	a2 = aryQ2[10]
	a2 = parseInt(a2)
}
if (q3 != "") {
	aryQ3 = q3.split(",")
	a3 = aryQ3[10]
	a3 = parseInt(a3)
}
if (q4 != "") {
	aryQ4 = q4.split(",")
	a4 = aryQ4[10]
	a4 = parseInt(a4)
}
if (q5 != "") {
	aryQ5 = q5.split(",")
	a5 = aryQ5[10]
	a5 = parseInt(a5)
}

wpCorrect = eval(a1 + a2 + a3 + a4 + a5)

}


function getScoresWD() {
	var q1, q2, q3, q4
	var aryQ1, aryQ2, aryQ3, aryQ4
	var a1, a2, a3, a4

	q1 = readCookie("wdQ1-10")
	q2 = readCookie("wdQ11-20")
	q3 = readCookie("wdQ21-30")
	q4 = readCookie("wdQ31-40")

if (q1 != "") {
	aryQ1 = q1.split(",")
	a1 = aryQ1[10]
	a1 = parseInt(a1)
}
if (q2 != "") {
	aryQ2 = q2.split(",")
	a2 = aryQ2[10]
	a2 = parseInt(a2)
}
if (q3 != "") {
	aryQ3 = q3.split(",")
	a3 = aryQ3[10]
	a3 = parseInt(a3)
}
if (q4 != "") {
	aryQ4 = q4.split(",")
	a4 = aryQ4[10]
	a4 = parseInt(a4)
}


wdCorrect = eval(a1 + a2 + a3 + a4)

}

function readCookie(cookieName) {

   var searchName = cookieName + "="
   var cookies = document.cookie
   var start = cookies.indexOf(cookieName)

  
	if (start == -1) { 			// cookie not found 
     		return ""
     	}
   	
	start += searchName.length 		//start of the cookie data

	var end = cookies.indexOf(";", start)
   	
	if (end == -1) {
     		end = cookies.length
     	}
   	
	return cookies.substring(start, end)

	

}

function getCookieExpireDate(noDays) {
	var today = new Date()
	var expr = new Date(today.getTime()+noDays*24*60*60*1000)
	return  expr.toGMTString()
}

function makeCookie(name, data, noDays) {
	var cookieStr = name + "="+ data

	if (makeCookie.arguments.length > 2){
		cookieStr += "; expires=" + getCookieExpireDate(noDays)
	}

	document.cookie = cookieStr

}

function test() {

//document.f1.Q10[0].checked = true
//aryCookie = "A"

//indexNumber = getradio(aryCookie)
//document.f1.Q10[indexNumber].checked = true

			//for (i=0;i<4;i++) {
				//checkedState1 = checkState(aryCookie[7])
				//if (checkedState1 == i) {
					//document.f1.Q8[i].checked = true
				//}
			//}
			//}
}


