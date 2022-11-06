document.cookie = "loginToken=90cd9aca-a5a7-4152-8d14-477a49150e33";
token = getCookie("loginToken");

/* A procedure to pull the cookie of a login token from the browser.
 *	name is the name of the cookie
 *
 */
function getCookie(name){
	var cookieArr = document.cookie.split(";"); 
	// Loop through the array elements
	for(var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split("=");
		/* Removing whitespace at the beginning of the cookie name
	        and compare it with the given string */
		if(name == cookiePair[0].trim()) {
			// Decode the cookie value and read it
			return decodeURIComponent(cookiePair[1]);
		}
	}
	// Return null if not found
	return null;
}

/* A function to get the data from the database
 *	A little complex so a breakdown is provided
 *	
 *	The getData function takes the callback_function as a parameter, if it succeeds, it calls the callback_function
 */
function getData(cb_func) {
	var choice = document.getElementById("adminChoice").value;
	var apiLink = "https://api.thearmyofkindness.org/";
	var search = document.getElementById("search").value;
	var url;
	if (search != "") {
		url = apiLink + "Read" + choice + "?" + "token=" + token + "&" + "search=" + search;
	} else {
		url = apiLink + "Read" + choice + "?" + "token=" + token;
	}
	$.ajax({
		url:url,
		success:cb_func
	});
}


/* Function to capitalize the first letter of a string
 *
 */
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


/* Function to clear the inputs div for a fresh start on editing data
 *
 */
function clearInputs() {
	var inputs = document.getElementById("inputs");
	var first = inputs.firstElementChild;
	while (first) {
		first.remove();
		first = inputs.firstElementChild;
	}
	var addBtn = document.createElement("button");
	addBtn.setAttribute("id", "addBtn");
	addBtn.setAttribute("onclick","addRow()");
	addBtn.textContent="Add Row";
	inputs.appendChild(addBtn);
}


/* Function to get a row from the datatable, put it into the inputs div without the primary key
 * Then the user can add details and the next step is started to submit the inputs
 */
function addRow() {
	clearInputs();
	var choice = document.getElementById("adminChoice").value;
	document.getElementById("addBtn").style.display='none';
	$("#example").DataTable().rows(0).every( function ( rowIdx, tableLoop, rowLoop ) {
		var dataRow = this.data();
		for (let col in dataRow) {
			var input = document.createElement("input");
			var label = document.createElement("label");
			var br = document.createElement("br");
			label.innerText = col;
			label.setAttribute("for", col);
			input.setAttribute("type", "text");
			input.setAttribute("placeholder", "...");
			input.setAttribute("id", col);
			if (!col.includes(choice)) {                    
				document.getElementById("inputs").appendChild(label);
				document.getElementById("inputs").appendChild(input);
				document.getElementById("inputs").appendChild(br);
			}
		}
	});

	var addBtn = document.createElement("button");
	addBtn.setAttribute("onclick", "addDB();");
	addBtn.setAttribute("textContent", "Submit Changes");
	addBtn.textContent = "Submit Row";
	document.getElementById("inputs").appendChild(addBtn);
}


/* Function to make the ajax call of the input values from the addRow() function
 *
 */
function addDB() {
	var choice = document.getElementById("adminChoice").value;
	var apiLink = "https://api.thearmyofkindness.org/";
	var url;
	url = apiLink + "Add" + choice + "?";
	var dataform;
	var inputs = document.getElementById("inputs");
	var col = inputs.getElementsByTagName("label");
	var inp = inputs.getElementsByTagName("input");
	
	dataform = col[0].innerText +'='+inp[0].value;
	for (let i = 1; i < inp.length; i++) {
		dataform += "&"+col[i].innerText +'='+inp[i].value;
	}
	
	$.ajax({
		type:"POST",
		url: url + dataform,
		success: function(data, textStatus) { 
			clearInputs();
			
		        var p = document.createElement("p");
			p.innerText = textStatus;
			
		 	document.getElementById("inputs").appendChild(p);
			document.getElementById("addBtn").style.display="block";
		}
	});
	refresh();
}

/* Function to make an ajax call to the database to update the chosen role with values from the inputs in inputs div
 *	row is the row of the edit button clicked
 */
function updateDB(row) {
	var choice = document.getElementById("adminChoice").value;
	var apiLink = "https://api.thearmyofkindness.org/";
	
	var url;
	url = apiLink + "Update" + choice + "?";

	var inputs = document.getElementById("inputs");
	var col = inputs.getElementsByTagName("label");
	var inp = inputs.getElementsByTagName("input");

	dataform = col[0].innerText +'='+inp[0].value;
	for (let i = 1; i < inp.length; i++) {
		dataform += "&"+ col[i].innerText +'='+inp[i].value;
	}
	
	$.ajax({
		type:"POST",
		url: url + dataform,
		success: function(data, textStatus) {
			clearInputs();
			var p = document.createElement("p");
			p.innerText = textStatus;
			document.getElementById("inputs").appendChild(p);
		}	
	});
	refresh();
}


/* Function to fill the input div with the current data from the datatable to edit it
 * 	row is still the row of the edit button
 */
function update(row) {
	var choice = document.getElementById("adminChoice").value;
	$("#example").DataTable().rows(row).every( function ( rowIdx, tableLoop, rowLoop ) {
    		var data = this.data();
		clearInputs();
		for(let da in data) {
			var input = document.createElement("input");
 	                input.setAttribute("type", "text");
         	        input.setAttribute("value", data[da]);
			input.setAttribute("id", data[da]);
			var label = document.createElement("label");
			label.innerText = da;
			label.setAttribute("for", da);
       			if (da.includes(choice)) {
				input.disabled = true;
			}	
			var br = document.createElement("br");
			document.getElementById("inputs").appendChild(label);
			document.getElementById("inputs").appendChild(input);
			document.getElementById("inputs").appendChild(br);
		}
		this.data(data);
	});
	
	var submitBtn = document.createElement("button");
	submitBtn.setAttribute("onclick", "setRow("+row+");");
	submitBtn.setAttribute("textContent", "Submit Changes");
	submitBtn.textContent = "Submit Changes";
	document.getElementById("inputs").appendChild(submitBtn);
}

/* functio to set the data in the datatabe to the values in the input.
 * 	Kind of a relic, should just go straight to the database and refresh
 */
function setRow(row) {
	$("#example").DataTable().rows(row).every( function ( rowIdx, tableLoop, rowLoop ) {
		var data = this.data();
		for(let da in data) {
			var input = document.getElementById(data[da]);
			data[da] = input.value;
		}
		this.data(data);
	});
	updateDB();
}

/* Function to make an ajax call to set the softDelete value of a row to 1.
 * 	Afterwards, it should disappear on reload
 *
 */
function softDelete(row) {
	var choice = document.getElementById("adminChoice").value;
	var apiLink = "https://api.thearmyofkindness.org/";
	var url;
	url = apiLink + "Update" + choice + "?";
	var datatable;
	$("#example").DataTable().rows(row).every( function ( rowIdx, tableLoop, rowLoop ) {
		datatable = this.data();	
	});
	var id="";
	for (let col in datatable) {
		if (col.includes("Id")) {
			id+=col+"="+datatable[col]+"&";
		}
	}
	$.ajax({
		type:"POST", 
		url: url + id + "softDeleted=1",
		//data: datatable,	
		success: function(data, textStatus) { console.log(data);}
		
	});
}

/* Function to immediately load the data in once the page is ready
 */
$(document).ready(function() {
	refresh();	
});


/* Function to redraw the table and reformat it to the proper header values
 *	Called everytime an ajax that changes the data is done
 *
 */
function refresh() {
	getData(function (data) {
		var columns = [];
		data = JSON.parse(data);
		columnNames = Object.keys(data[0]);
		for (var i in columnNames) {
			
			columns.push({data:columnNames[i],
				  title:capitalizeFirstLetter(columnNames[i])});
			
		}
		var divWipe = document.getElementById("wiper");
		var child = divWipe.firstElementChild;
		divWipe.removeChild(child);
		var table = document.createElement("table");
		table.setAttribute("id","example");
		table.setAttribute("class","datatable table table-bordered table-striped table-hover");
		divWipe.appendChild(table);
		$('#example').DataTable( {
			aoColumnDefs: [{
				"aTargets": [columns.length],
				"mRender": function (data, type, row, meta) {
				return '<button onclick="update('+meta.row+');">Edit</button><button onclick="softDelete('+meta.row+');">Delete</button>';
				}
			}],
			searching: false,
			destroy: true,
			data: data,		
			columns:columns,
	   
		}); // End datatable initialization
	  
	}); // End getData function's parameter

	document.getElementById("wiper").setAttribute("class", "table-responsive");
} 
