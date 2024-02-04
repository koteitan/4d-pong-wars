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
var blocklen;
var nball;
var Ball = new function(_q, _v){
  this.q = _q;
  this.v = _v;
}
//initMap: make a empty map
var initgame=function(){
  //init map
  ndim     = 4;
  maplen   = 8+2;
  

  blocklen = 1/(maplen/2-1);
  if(ndim!=4) throw("ndim must be 4.");
  var r42vol = 0.5*Math.PI*Math.PI;
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
          var r4 = r2*r2;
          if(r4*r42vol < 1/2){
            map[w][z][y][x]=-1;
          }else{
            map[w][z][y][x]=+1;
          }
        }
      }
    }
  }
  //init ball
  nball = 2;
  ball = new Array(nball);
  for(var b=0;b<nball;b++){
    //init q
    var p=b*2-1;
    var q=new Array(ndim);
    do{
      for(var d=0;d<ndim;d++){
        var x = Math.random()*2-1;
        q[d] = x;
      }
      var m = q2map(q);
    }while(m!=p);

    //init v
    var v=new Array(ndim);
    do{
      var v2 = 0;
      for(var d=0;d<ndim;d++){
        v[q] = Math.random()*2-1;
        v2  += v[q];
      }
      var av = Math.sqrt(v2);
      var limit = blocklen*framerate/100;
      var isover = false;
      for(var d=0;d<ndim;d++){
        v[d] /= av;
        if(v[d]<limit){
          isover = true;
          break;
        }
      }
    }while(isover);

    //resister
    ball[b] = new Ball(q, v);
  }
}
var q2map=function(q){
  var iq = q2iq(q);
  try{
    if(ndim!=4) throw("ndim must be 4.");
    return map[iq[0]][iq[1]][iq[2]][iq[3]];
  }catch(e){
    throw(e);
  }
}
var q2iq=function(q){
  var ndim=q.length;
  var iq=new Array(ndim);
  for(var d=0;d<ndim;d++){
    iq[d] = Math.floor(q[d]*(maplen/2-1))+(maplen/2-1)+1;
  }
  return iq;
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
var canlen;
var margin = 10;
var maplen;
var reqdraw = true;
/* map2color(-1 or +1) returns color of map */
var map2color  = function(m){
  return ['#CCCCFF','#CCCCFF'][(m+1)/2];
}
/* map2color(-1 or +1) returns color of ball */
var ball2color = function(b){
  return map2color(-b);
}
/* [sx0, sy0, sx1, sy1] = iq2sq(iq[d]) 
 *  iq[d]     = d-th-dimensional index */
var iq2sq=function(iq){
  var sx0 = Math.floor(((iq[0]-1)+(iq[2]-1)*_invmaplen)*_spm);
  var sy0 = Math.floor(((iq[1]-1)+(iq[3]-1)*_invmaplen)*_spm);
  var sx1 = Math.floor(sx0 + _spm2);
  var sy1 = Math.floor(sy0 + _spm2);
  return [sx0,sy0,sx1,sy1];
}
var iq2sq_init=function(){
  _spm        = scrlen/(maplen-2);
  _spm2       = scrlen/(maplen-2)/(maplen-2);
  _invmaplen  =      1/(maplen-2);
}
var _spm;
var _spm2;
var _invmaplen;
var q2sq=function(q){
  var sx = Math.floor(((q[0]+1)/2+(q[2]+1)/2*_invmaplen)*_spm);
  var sy = Math.floor(((q[1]+1)/2+(q[3]+1)/2*_invmaplen)*_spm);
  return [sx,sy];
}
var iq2sq_init=function(){
  _spm        = scrlen/(maplen-2);
  _invmaplen  =      1/(maplen-2);
}
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

  //block
  iq2sq_init();
  for(var w=1;w<maplen-1;w++){
    for(var z=1;z<maplen-1;z++){
      for(var y=1;y<maplen-1;y++){
        for(var x=1;x<maplen-1;x++){
          var m  = map[w][z][y][x];
          var sq = iq2sq([w,z,y,x]);
          ctx.fillStyle = map2color(m);
          ctx.fillRect(sq[0],sq[1],sq[2],sq[3]);
        }
      }
    }
  }
  //ball
  q2sq_init();
  for(var b=0;b<nball;b++){
    var sq = q2sq(ball[b].q);
    ctx.fillStyle = ball2color(b);
    ctx.arc(sq[0], sq[1], 10, 0, Math.PI*2, true);
  }
}
window.onresize = function(){ //browser resize
  var agent = navigator.userAgent;
  var wx = document.documentElement.clientWidth;
  var wy = document.documentElement.clientHeight;
  var cx = [(wx- 10)*0.9, 20].max();
  var cy = [(wy-250)*0.99-140, 20].max();
  canlen = [cx,cy].min();
  document.getElementById("outcanvas").width = canlen;
  document.getElementById("outcanvas").height= canlen;
};

