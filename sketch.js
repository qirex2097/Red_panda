'use strict';

function setup() {
  createCanvas(640, 1024);
}

let uniq_pattern_no = 0;
let patterns = [];
function draw() {
  background(220);

  if (frameCount % 10 === 0) {
    uniq_pattern_no++;
    if (uniq_pattern_no >= uniq_pattern_list.length) {
      uniq_pattern_no = 0;
    }
    patterns = search_rotate_pattern(uniq_pattern_list[uniq_pattern_no]);
  }
  draw_block(patterns);
}

function mouseClicked() {
  select_block(mouseX, mouseY);
}

function draw_block_sub(block, x, y, c1=color(255)) {
    for (const pos of block) {
        const pos_x = pos % 5;
        const pos_y = Math.floor(pos / 5);
        const offset_x = x + pos_x * block_size + Math.floor(block_size / 2);
        const offset_y = y + pos_y * block_size + Math.floor(block_size / 2);

        fill(c1);
        rect(offset_x, offset_y, block_size);
    }
}

function draw_block(patterns) {
  let color_list = [color(200,100,50),color(50,200,100),color(200,200,50), color(100,100,200)];
  for (let corner_no = 0; corner_no < 4; corner_no++) {
    const offset_x = origin_x;
    const offset_y = origin_y + corner_no * list_height;

    for (let i = 0; i < block_pattern_list[corner_no].length; i++) {
      const block = block_pattern_list[corner_no][i];
      let c1 = color(255);
      const x = offset_x + (i % yoko) * waku_size;
      const y = offset_y + Math.floor(i / yoko) * waku_size;

      let tmp_selected_block_list = selected_block_list.slice();
      tmp_selected_block_list[corner_no] = i;
      if (selected_block_list[corner_no] === i) {
        c1 = color_list[corner_no];
      } else if (!isSelectableBlock(tmp_selected_block_list)) {
        c1 = color(200);
      }
      fill(c1);
      stroke(0);
      rect(x, y, waku_size);
      draw_block_sub(block, x, y);
    }
  }

  if (selected_block_list.filter(num => !Number.isNaN(num)).length > 0) {
    let x = origin_x;
    let y = origin_y + 4 * list_height;

    fill(255);
    noStroke();
    rect(x, y, waku_size);
    for (let corner_no = 0; corner_no < 4; corner_no++) {
      if (Number.isNaN(selected_block_list[corner_no])) {
        continue;
      }
      const block = block_pattern_list[corner_no][selected_block_list[corner_no]];
      draw_block_sub(block, x, y, color_list[corner_no]);
    }

    let moji = '';
    for (let i = 0; i < selected_block_list.length; i++) {
      if (Number.isNaN(selected_block_list[i])) {
        moji += '-';
      } else {
        moji += selected_block_list[i];
      }
      if (i < selected_block_list.length - 1) {
        moji += ',';
      }
    }
    fill(0);
    textAlign(LEFT, TOP);
    text(moji, x, y + waku_size);
    text(selectable_pattern_list.length, x, y + waku_size + block_size * 2);

    if (!selected_block_list.some(num => Number.isNaN(num))) {
      x = x + waku_size;
      const rotate_pattern_list = get_rotate_pattern_list(selected_block_list);
      let tmp_color_list = color_list.slice();
      for (let pattern of rotate_pattern_list) {
        x = x + waku_size;
        fill(255);
        noStroke();
        rect(x, y, waku_size);
        for (let corner_no = 0; corner_no < 4; corner_no++) {
          const block = block_pattern_list[corner_no][pattern[corner_no]];
          draw_block_sub(block, x, y, tmp_color_list[corner_no]);
        }
        tmp_color_list = [tmp_color_list[3], ...tmp_color_list.slice(0,3)];
        fill(0);
        text(get_pattern_no(pattern), x + block_size, y + waku_size);
      }
    }
  }
}