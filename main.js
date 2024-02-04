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
var ndim;
var maplen;
var nball;
var ball = new function(_q, _v){
  this.q = _q;
  this.v = _v;
}
//initMap: make a empty map
var initgame=function(){
  //init map
  ndim   = 4;
  maplen = 8+2;
  map = new Array(maplen);
  for(var w=0;w<maplen;w++){
    map[w] = new Array(maplen);
    for(var z=0;z<maplen;z++){
      map[w][z] = new Array(maplen);
      for(var y=0;y<maplen;y++){
        map[w][z][y] = new Array(maplen);
        for(var x=1;x<maplen;x++){
          map[w][z][y][x] = 0;
          var r2 = x*x+y*y+z*z+w*w;
          if(2*Math.PI*r2 < 1/2){
            map[w][z][y][x]=-1;
          }else{
            map[w][z][y][x]=+1;
          }
        }
      }
    }
  }
  //init ball
  nball=2;
}
var q2map=function(q){
  var ndim=q.length;
  var mq=new Array(ndim);
  for(var d=0;d<ndim;d++){
    mq[d] = Math.floor(q[d]*(maplen/2-1))+(maplen/2-1)+1;
  }
  return mq;
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

