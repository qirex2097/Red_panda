'use strict';

let draw_func;
let click_func;
let isTouched = false;
function setup() {
    createCanvas(windowWidth, windowHeight);
    isTouched = false;
//    [draw_func, click_func] = initialize_canada(windowWidth, windowHeight);
    [draw_func, click_func] = initialize_block_size(windowWidth, windowHeight);
}

function draw() {
    background(220);
    draw_func();
}

function touchStarted() {
    isTouched = true;
    clicked();
}
function mousePressed() {
    if (!isTouched) {
        clicked();
    }
}


function clicked() {
    click_func(mouseX, mouseY);
}



