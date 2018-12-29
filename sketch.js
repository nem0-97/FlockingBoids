//TODO: Diff 'species' if same species flock together(what already does), add in if different either runs away, chases, or doesn't care(build map of species relationships)

let boids=[];
let awareness;//how close 2 boids have to be to be same flock
let maxSpeed;//fastest a boid can go
let maxA=1;//fastest a boid can accelerate/deccelrate
let viewAngle;//angle +/- in radians that a boid can 'see in'

let sep;
let co;
let al;
//let boid=[p,v,a](position, velocity, acceleration)

function setup() {
  createCanvas(innerWidth,innerHeight);
  for(let i=0;i<100;i++){
    let v=p5.Vector.random2D();
    v.setMag(random(.5,1.5));
    boids.push([createVector(random(width),random(height)),v,createVector(0,0)]);
  }
}

function draw() {
  background(0);
  sep=Number(document.getElementById('sep').value);
  co=Number(document.getElementById('co').value);
  al=Number(document.getElementById('al').value);
  viewAngle=Number(document.getElementById('va').value);
  awareness=Number(document.getElementById('aw').value);
  maxSpeed=Number(document.getElementById('ms').value);

  for(let i=0;i<boids.length;i++){
    let flockSize=0;//size of flock not including this boid
    //alignment
    let avgV=createVector(0,0);
    //cohesion
    let avgP=createVector(0,0);
    //seperation
    let avgD=createVector(0,0);
    //take average velocity along x and y
    for(let j=0;j<boids.length;j++){
      let d=dist(boids[i][0].x,boids[i][0].y,boids[j][0].x,boids[j][0].y);
      if(j!=i&&d<=awareness&&boids[i][0].angleBetween(boids[j][0])<viewAngle){//if not this boid but this boid is aware of it
        flockSize++;
        //alignment
        avgV.add(boids[j][1]);
        //cohesion
        avgP.add(boids[j][0]);
        //seperation
        let steer=p5.Vector.sub(boids[i][0],boids[j][0]);
        steer.div(d*d);
        avgD.add(steer);
      }
    }
    //apply flocking behaviors
    if(flockSize!=0){
      boids[i][2].mult(0);
    //alignment
      //calc steering force
      avgV.div(flockSize);
      avgV.setMag(maxSpeed);
      avgV.sub(boids[i][1]);
      //update acceleration to steer towards desired velocity(avg velocity of surrounding boids)
      boids[i][2].add(avgV.mult(al));
    //cohesion
      //calc steering force
      avgP.div(flockSize);
      avgP.sub(boids[i][0]);
      avgP.setMag(maxSpeed);
      avgP.sub(boids[i][1]);
      //update acceleration to steer towards desired location(avg location of surrounding boids)
      boids[i][2].add(avgP.mult(co));
    //seperation
      //calc steering force
      avgD.div(flockSize);
      avgD.setMag(maxSpeed);
      avgD.sub(boids[i][1]);
      //update acceleration to steer away from flockmates(in weighted average of opposite directions)
      boids[i][2].add(avgD.mult(sep));
      boids[i][2].limit(maxA);
    }
    //bounce off edges
    /*if(boids[i][0].x<0||boids[i][0].x>width){
      boids[i][1].x*=-1;
    }
    if(boids[i][0].y<0||boids[i][0].y>width){
      boids[i][1].y*=-1;
    }*/
    // or loop around screen
    if(boids[i][0].x<0){
      boids[i][0].x=width;
    }else if(boids[i][0].x>width){
      boids[i][0].x=0;
    }
    if(boids[i][0].y<0){
      boids[i][0].y=height;
    }else if(boids[i][0].y>height){
      boids[i][0].y=0;
    }
    //update position with velocity
    boids[i][0].add(boids[i][1]);
    //update velocity with acceleration
    boids[i][1].add(boids[i][2]);
    //limit velocity
    boids[i][1].limit(maxSpeed);
    //draw boid
    strokeWeight(6);
    stroke(255-(50*flockSize),50*flockSize,flockSize*25);
    point(boids[i][0].x,boids[i][0].y);
  }
}
