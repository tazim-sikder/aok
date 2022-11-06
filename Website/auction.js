var apiLink = "https://api.thearmyofkindness.org/";
var data_dummy = "[{\"storeItemId\":\"1\",\"itemName\":\"1\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"1\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null},{\"storeItemId\":\"2\",\"itemName\":\"2\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"2\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null},{\"storeItemId\":\"3\",\"itemName\":\"3\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"3\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null},{\"storeItemId\":\"4\",\"itemName\":\"4\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"4\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null},{\"storeItemId\":\"5\",\"itemName\":\"5\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"5\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null},{\"storeItemId\":\"6\",\"itemName\":\"6\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"6\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null},{\"storeItemId\":\"7\",\"itemName\":\"7\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"7\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null},{\"storeItemId\":\"8\",\"itemName\":\"8\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"8\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null},{\"storeItemId\":\"9\",\"itemName\":\"9\",\"description\":null,\"pictureURL\":null,\"storeCategory\":null,\"price\":\"9\",\"listedDate\":\"10/17/2022 3:11:00 PM\",\"isActive\":\"False\",\"softDeleted\":null,\"msg\":null,\"permission\":null}]";
var data;
var picData;

async function getData() {
	var apiLink = "https://api.thearmyofkindness.org/";
    let html = '';
	var token = "90cd9aca-a5a7-4152-8d14-477a49150e33";
	var url = apiLink + "ReadStoreItem?token=" + token + "&search=1";
    var pictureUrl = apiLink + "ReadStorePictures?token=" + token + "&search=1";
    // Retrieve JSON StoreItem data from url and stringify
    const response = await fetch(url);
    data = await response.json();
    data = JSON.parse(data);
    printData(data);
    // Retrieve JSON StoreItem data from url and stringify
    const responsePictures = await fetch(pictureUrl);
    picData = await responsePictures.json();
    picData = JSON.parse(picData);
    //printData(picData);
    data.forEach(obj => {
        let htmlSegment = '<div>';
        Object.entries(obj).forEach(([key, value]) => {
            //if(`${key}` == "storeItem")
            htmlSegment += '<p>' + `${key} ${value}` + "</p>";
        });
        htmlSegment += '</div>';
        html += htmlSegment;
        console.log(htmlSegment);
    });
    // Iterate through the response text and display each store
    // item in a div.
    let container = document.querySelector('.product-list');
    container.innerHTML = html;
    console.log("Hello world");
}

// Helper function used for debugging
function printData(data){
    data.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            console.log(`${key} ${value}`);
        });
        console.log('-------------------');
    });
}
getData();


