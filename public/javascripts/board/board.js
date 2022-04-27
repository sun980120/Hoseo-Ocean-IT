'use strict';

var pageQuery = location.search;
var queryParams = new URLSearchParams(pageQuery);
// function privX2page(){
//     if(queryParams.get('page') <= 7) queryParams.set('page', 1);
//     else queryParams.set('page', queryParams.get('page')-7);
//     location.search = queryParams.toString();
// }
function privpage(){
    queryParams.set('page', queryParams.get('page')-1);
    location.search = queryParams.toString();
}
function addpage(page){
    queryParams.set('page', page);
    location.search = queryParams.toString();
}
function nextpage(){
    queryParams.set('page', Number(queryParams.get('page'))+1);
    location.search = queryParams.toString();
}
// function nextX2page(){
//     if(queryParams.get('page') <= <%=Math.ceil(db_data.length / 5 )%>-7) queryParams.set('page', <%=Math.ceil(db_data.length / 5 )%>);
//     else queryParams.set('page', Number(queryParams.get('page'))+7);
//     location.search = queryParams.toString();
// }