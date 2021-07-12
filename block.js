'use strict';

let block_size = 10;
let waku_size = block_size * 6;
let gap = block_size;
let origin_x = block_size * 2;
let origin_y = block_size * 2;
let yoko = 10;
let color_list;

let selected_block_list = [NaN, NaN, NaN, NaN];
let selectable_pattern_list = all_pattern_list;

function initialize_block_size(width, height) {
    if (width < waku_size * 11) {
        block_size = 5;
        textSize(8);
    } else {
        block_size = 10;
        textSize(14);
    }
    waku_size = block_size * 6;
    gap = block_size;
    origin_x = block_size * 2;
    origin_y = block_size * 2;
    
    color_list = [color(200,100,50), color(50,200,100), color(200,200,50), color(100,100,200)];
    yoko = 11;
    if (height < get_list_height() * 4 + waku_size * 2) {
        yoko = Math.floor((width - origin_x - origin_x) / waku_size);
    }
    return [draw_block, select_block];
}

function get_list_height(kazu=33) {
    return waku_size * Math.ceil(kazu / yoko) + gap;
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


function draw_block() {
    const list_height = get_list_height();
    let offset_x = origin_x;
    let offset_y = origin_y;

    for (let corner_no = 0; corner_no < 4; corner_no++) {
        for (let i = 0; i < block_pattern_list[corner_no].length; i++) {
            const block = block_pattern_list[corner_no][i];
            let c1 = color(255);
            const x = offset_x + (i % yoko) * waku_size;
            const y = offset_y + Math.floor(i / yoko) * waku_size;
	    let flg = true;
            
            if (selected_block_list[corner_no] === i) {
                c1 = color_list[corner_no];
            } else {
                let tmp_selected_block_list = selected_block_list.slice();
                tmp_selected_block_list[corner_no] = i;
                if (!isSelectableBlock(tmp_selected_block_list)) {
		    flg = false;
                    c1 = color(200);
                }
            }
	    if (flg) {
		fill(c1);
	    } else {
		fill(color(200));
	    }
            stroke(0);
            rect(x, y, waku_size);
            draw_block_sub(block, x, y);
	    if (flg) {
		const corner_offset_x = [block_size * 2, -block_size * 2, -block_size * 2, block_size * 2];
		const corner_offset_y = [block_size * 2, block_size * 2, -block_size * 2, -block_size * 2];
		fill('BLACK');
		stroke('BLACK');
		textAlign(CENTER, CENTER);
		text(i, x + waku_size / 2 + corner_offset_x[corner_no], y + waku_size / 2 + corner_offset_y[corner_no]);
	    }
        }
        offset_y += list_height;
    }
    
    if (selected_block_list.filter(num => !Number.isNaN(num)).length > 0) {
        draw_selected_blocks(offset_x, offset_y);
    }
    if (!selected_block_list.some(num => Number.isNaN(num))) {
        draw_rotate_blocks(origin_x + waku_size, offset_y);
    }
}


function select_block(x, y) {
    const list_height = get_list_height();
    const pos_x = Math.floor((x - origin_x) / waku_size);
    const pos_y = Math.floor(((y - origin_y) % list_height) / waku_size);
    const corner_no = Math.floor((y - origin_y) / list_height);
    const num = pos_x + pos_y * yoko;

    if (pos_x >= yoko || num >= 33 || corner_no >= 4) {
        return;
    }

    if (selected_block_list[corner_no] === num) {
        selected_block_list[corner_no] = NaN;
    } else {
        let tmp_selected_block_list = selected_block_list.slice();
        tmp_selected_block_list[corner_no] = num;
        if (isSelectableBlock(tmp_selected_block_list)) {
            selected_block_list[corner_no] = num;
        }
    }

    selectable_pattern_list = rebuild_selectable_pattern_list();
}


function draw_selected_blocks(x, y) {
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
    moji += '/' + selectable_pattern_list.length;
    fill(0);
    textAlign(LEFT, TOP);
    text(moji, x, y + waku_size);
}

function draw_rotate_blocks(x, y) {
    const rotate_pattern_list = get_rotate_pattern_list(selected_block_list);
    let tmp_color_list = color_list.slice();
    for (let pattern of rotate_pattern_list) {
        x = x + waku_size + block_size * 3;
        fill(255);
        noStroke();
        rect(x, y, waku_size);
        for (let corner_no = 0; corner_no < 4; corner_no++) {
            const block = block_pattern_list[corner_no][pattern[corner_no]];
            draw_block_sub(block, x, y, tmp_color_list[corner_no]);
        }
        const moji = pattern[0]+','+pattern[1]+','+pattern[2]+','+pattern[3];
        tmp_color_list = [tmp_color_list[3], ...tmp_color_list.slice(0,3)];
        fill(0);
        text(moji, x, y + waku_size);
        text('No. '+get_pattern_no(pattern), x, y + waku_size + block_size * 2);
    }
}

const isSelectableBlock = (block) => {
    for (let pattern of all_pattern_list) {
        if ((Number.isNaN(block[0]) || block[0] === pattern[0]) &&
            (Number.isNaN(block[1]) || block[1] === pattern[1]) &&
            (Number.isNaN(block[2]) || block[2] === pattern[2]) &&
            (Number.isNaN(block[3]) || block[3] === pattern[3])) {
            return true;
        }
    }
    return false;
}

function get_pattern_no(pattern) {
    for (let i = 0; i < all_pattern_list.length; i++) {
        if (pattern[0] === all_pattern_list[i][0] &&
            pattern[1] === all_pattern_list[i][1] &&
            pattern[2] === all_pattern_list[i][2] &&
            pattern[3] === all_pattern_list[i][3]) {
            return i;
        }
    }
    return NaN;
}

function search_rotate_pattern(search_pattern) {
    let result = [];
    for (let i = 0; i < 4; i++) {
        const search_moji = search_pattern.toString();
        for (let j = 0; j < all_pattern_list.length; j++) {
            if (all_pattern_list[j].toString() !== search_moji) {
                continue;
            }
            if (result.indexOf(j) === -1) {
                result.push(j);
            }
            break;
        }
        search_pattern = [search_pattern[3], search_pattern[0], search_pattern[1], search_pattern[2]];
    }
    return result;
}


function get_rotate_pattern_list(pattern) {
    let result = [];
    for (let i = 0; i < 4; i++) {
        if (result.some(e => e.toString() === pattern.toString())) {
            continue;
        }
        result.push(pattern);
        pattern = [pattern[3], ...pattern.slice(0,3)];
    }
    return result;
}

function rebuild_selectable_pattern_list() {
    if (selected_block_list.filter(e => !Number.isNaN(e)).length === 0) {
        return all_pattern_list;
    }
    let result = [];
    for (let pattern of all_pattern_list) {
        if ((Number.isNaN(selected_block_list[0]) || selected_block_list[0] === pattern[0]) &&
            (Number.isNaN(selected_block_list[1]) || selected_block_list[1] === pattern[1]) &&
            (Number.isNaN(selected_block_list[2]) || selected_block_list[2] === pattern[2]) &&
            (Number.isNaN(selected_block_list[3]) || selected_block_list[3] === pattern[3])) {
            result.push(pattern);
        }
    }
    return result;
}

function count_rotate_pattern_list() {
    let counter = 0;
    let counter1 = 0;
    let counter2 = 0;
    for (let pattern of uniq_pattern_list) {
        const pattern_list = get_rotate_pattern_list(pattern);
        counter += pattern_list.length;
        if (pattern_list.length !== 4) {
            if (pattern_list.length === 2) {
                counter2 += 2;
            } else if (pattern_list.length === 1) {
                counter1++;
            }
            console.log(pattern_list);
        }
    }
    console.log(counter - counter2 - counter1, counter2, counter1);
}

function count_pattern_list() {
    let counter0 = 0;
    let counter = 0;
    for (let pattern of all_pattern_list) {
        if (pattern[0] === 0) {
            counter0++;
            } else if (pattern[0] <= 16) {
            counter++;
        }
    }
    console.log(counter0, counter, counter0 + counter * 2);
}
