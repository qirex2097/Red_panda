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
    click_func(mouseX, mouseY);
}
