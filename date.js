///////allows this module to be exported/////
module.exports.getDate = getDate;
////Javascript function for dates////
function getDate(){
  let date = new Date();
  let options = {weekday: "long", day: "numeric", month: "long"};
  let day = date.toLocaleDateString("en-US", options);
  return day;
};

module.exports.getDay = getDay;
////Javascript function for getting a day////
function getDay(){
  let date = new Date();
  let options = {weekday: "long"};
  let day = date.toLocaleDateString("en-US", options);
  return day;
};
