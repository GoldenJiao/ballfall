var canvas = document.querySelector("canvas");
const scorecard = document.querySelector('.gameover');
var leftinterval;
var rightinterval;
canvas.height = innerHeight;
canvas.width = innerWidth;
var ctx = canvas.getContext("2d");
console.log(canvas.height, canvas.width);
var onGoingPlatform = [];
var ballz = [];
var hrtz=[];
var life = 3;
var score=0;
const playagain = document.querySelector('.playagain');
const image = document.getElementById('img');

class platform {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.contact = false;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, innerWidth*0.1, 20);
    ctx.fill();
  }
}

class bonuslife{
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.contact = false;
  }
  draw() {
    ctx.beginPath();
    ctx.drawImage(image, 0, 0, 108, 100, this.x, this.y, 20, 20);
    ctx.fill();
  }
}

class ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.contact = false;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();
  }
}

var timeoutl;
function moveleft() {

  timeoutl = setTimeout(() => {
    // console.log("movingl");
    ballz[0].x -= 5;
  }, 1000 / 60);
}
var timeoutr;
function moveright() {

  timeoutr = setTimeout(() => {
    // console.log("movingr");
    ballz[0].x += 5;
  }, 1000 / 60);
}

var timeoutscr;

function scorecal(){
  timeoutscr = setInterval(() => {
    score += 10;
    // console.log("score");
  }, 1000 / 2);
}

function nxtgame(){

  location.reload();
}

function gameStart() {
  var p = new ball(innerWidth / 2, 200);
  ballz.push(p);
}

var timeoutn;

 var hx = Math.floor(Math.random() * (innerWidth - innerWidth*0.1));
 var hy = Math.floor(Math.random() * (innerHeight - 200));
 let h = new bonuslife(hx, hy);
 hrtz.push(h);

function lifespawn() {
  hrtspawn = setInterval(()=> {
     hx = Math.floor(Math.random() * (innerWidth - innerWidth*0.1));
       hy = Math.floor(Math.random() * (innerHeight - 200));
       h = new bonuslife(hx, hy);
      hrtz[0]=h;
    // clearInterval(hrtz);
    // timeoutn = setTimeout(() => {

    //   // var hx = Math.floor(Math.random() * (innerWidth - innerWidth*0.1));
    //   // var hy = Math.floor(Math.random() * (innerHeight - 200));
    //   // let h = new bonuslife(hx, hy);
    //   hrtz.pop();
    //   // hrtz.push(h);
    //   // hrtdraw= setInterval(()=> {
    //   //   // hrtz[0].draw();
    //   // }, 1000/60);


    // }, 5000);
  }, 10000);

}


cp = setInterval(()=> {
  var xran = Math.floor(Math.random() * (innerWidth - innerWidth*0.1));
  let p = new platform(xran, innerHeight);
  onGoingPlatform.push(p);
}, 1000);

var lifecorrection=true;

function gameRunning() {
  lifespawn();
  setInterval(() => {
    // console.log(hrtz, hrtz[0]);

    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if(hy <= ballz[0].y  &&
      hy + 20 >= ballz[0].y &&
      hx <= ballz[0].x &&
      ballz[0].x <= hx + 20){
        if(lifecorrection){
          life+=1;
        }

        console.log(life);
        h.contact= true;
        setTimeout(() => {
          h.contact= false;
        }, 5000);

    }

    if(!(h.contact)){
      hrtz[0].draw();
    }


    // hrtz[0].draw();
    if(ballz[0].y>=innerHeight) {
      ballz.splice(0,1);
      if(life==0){
        clearTimeout(timeoutscr);
        document.getElementById('L').innerHTML = "Your Score:"+score;


    saveLeadBoard(score);
    document.getElementById('L1').innerHTML = getLeaderBoard()[0];
    document.getElementById('L2').innerHTML = getLeaderBoard()[1];
    document.getElementById('L3').innerHTML = getLeaderBoard()[2];
    document.getElementById('L4').innerHTML = getLeaderBoard()[3];


    scorecard.classList.remove('hidden');
      }
      else{
        life-=1;
        gameStart();
       // gameRunning();
      }
    }
    onGoingPlatform.forEach((e) => {
    e.y = e.y - 1;
      if (
        e.y <= ballz[0].y + 20 &&
        e.y + 20 >= ballz[0].y + 20 &&
        e.x <= ballz[0].x &&
        ballz[0].x <= e.x + innerWidth*0.1
      ) {
        e.contact = true;
      } else {
        e.contact = false;
      }
      e.draw();
    });
    ballz[0].contact = false;
    onGoingPlatform.forEach((e) => {
      if (e.contact) {
        ballz[0].contact = true;
      }
    });
    if(ballz[0].contact){
        // console.log(" contaced ");
        ballz[0].y -= 1;
    }
    else{
        // console.log(" falling")
        ballz[0].y += 2;
    }
    ballz[0].draw();


  }, 1000 / 60);
}

function saveLeadBoard(new_score){
  let scores = getLeaderBoard();

  scores.sort(function(a, b){return a-b});

  if (scores.length == 4){
  for (let i=0; i<scores.length; i++){
    if (scores[i]<new_score){
      scores[i] = new_score;
      break;
    }
  }
}
  else if (!(new_score in scores)){
    scores.push(new_score);
  }
  scores.sort(function(a, b){return a-b});

  localStorage.setItem("leaderboard", JSON.stringify(scores));
}

function getLeaderBoard(){
  arr = JSON.parse(localStorage.getItem("leaderboard"))
  if (arr ==  null){
    return [0,0,0,0];
  }
  return arr.sort(function(a, b){return b-a});
}


// game start

gameStart();

gameRunning();
scorecal();

document.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) {
      // console.log("l");
      clearTimeout(timeoutr);
      moveleft();
    }
    if (e.keyCode == 39) {
      // console.log("r");
      clearTimeout(timeoutl);
      moveright();
    }
  });

playagain.addEventListener('click', nxtgame);
