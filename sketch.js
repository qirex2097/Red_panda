'use strict';

let draw_func;
let click_func;
function setup() {
    createCanvas(windowWidth, windowHeight);
//    [draw_func, click_func] = initialize_canada(windowWidth, windowHeight);
    [draw_func, click_func] = initialize_block_size(windowWidth, windowHeight);
}

function draw() {
  background(220);
  draw_func();
}

function touchStarted() {
    clicked();
}
function mousePressed() {
    clicked();
}
function mouseReleased() {
    released();
}
function mouseEnded() {
    released();
}

let mouse_status = false;
function clicked() {
    if (mouse_status) {
        return;
    }
    click_func(mouseX, mouseY);
    mouse_status = true;
}
function released() {
    mouse_status = false;
}
