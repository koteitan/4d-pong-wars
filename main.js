var version = "0.01";
//entry point--------------------
window.onload = function(){
  document.getElementById('version').innerHTML=version;
  initdraw();
  initgame();
  window.onresize();
  setInterval(procAll, 1000/framerate); //enter gameloop
}
//game loop ------------------
var framerate  = 24; //[fps]
var lasttimedraw = 0;

var procAll=function(){
  procgame();
  procdraw();
}
var gettime = function(){
  return (new Date()).getTime();
}
//game -----------------
var map;
//initMap: make a empty map
var initgame=function(_unit){
  unit = _unit;
  map = new Array(unit);
  for(var y=0;y<unit;y++){
    map[y] = new Array(unit);
    for(var x=0;x<unit;x++){
      map[y][x]=0;
    }
  }
}
var procgame=function(){
}
// debugout ------------------------
var isdebugout = false; // false for release
var debugout = function(str){
  if(isdebugout){
    console.log(str);
  }
}
var debug;
// graphics ------------------------
var ctx;
var can;
var margin = 10;
var maplen;
var reqdraw = true;
//init
var initdraw=function(){
  can = document.getElementById("outcanvas");
  ctx = can.getContext('2d');
}
//proc
var procdraw = function(){

  //background
  ctx.fillStyle  ="white";
  ctx.fillRect  (0,0,can.width, can.height);
  
  //pattern
  if(false){
    for(var x=0;x<unit;x++){
      for(var y=0;y<unit;y++){
        if(map[y][x]){
          ctx.strokeStyle="white";
          ctx.fillStyle  ="black";
          ctx.fillRect  (margin+x*childlen, margin+y*childlen, childlen, childlen);
          ctx.strokeRect(margin+x*childlen, margin+y*childlen, childlen, childlen);
        }else{
          ctx.strokeStyle="black";
          ctx.fillStyle  ="white";
          ctx.fillRect  (margin+x*childlen, margin+y*childlen, childlen, childlen);
          ctx.strokeRect(margin+x*childlen, margin+y*childlen, childlen, childlen);
        }
      }
    }
  }
}
window.onresize = function(){ //browser resize
  var agent = navigator.userAgent;
  var wx=document.documentElement.clientWidth;
  var wy=document.documentElement.clientHeight;
  var cx= [(wx- 10)*0.9, 20].max();
  var cy= [(wy-250)*0.99-140, 20].max();
  direction = wy>=wx;
  document.getElementById("outcanvas").width = [cx,cy].min();
  document.getElementById("outcanvas").height= [cx,cy].min();
};

