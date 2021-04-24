let selected_block = NaN;
let canada_yoko;
let canada_pattern_block_list = [];

function initialize_canada(width, height) {
    canada_yoko = Math.floor(width / waku_size);
    return [canada_draw, canada_click];
}


function canada_draw() {
    const color_list = [color(200,100,50),color(50,200,100),color(200,200,50), color(100,100,200)];
    let offset_x = 0;
    let offset_y = 0;
    let pos = 0;

    if (selected_block === 0) {
        fill(color(200, 100, 50));
    } else {
        fill(255);
    }
    rect(offset_x, offset_y,waku_size);
    draw_block_sub(block_pattern_list[0][0], offset_x, offset_y);
    pos++;
    pos = Math.floor((pos + canada_yoko - 1) / canada_yoko) * canada_yoko;
    offset_x = waku_size * (pos % canada_yoko);
    offset_y = waku_size * Math.floor(pos / canada_yoko);
    let local_pos = 0;
    for (let i = 1; i <= 32; i++) {
        const block_pattern = block_pattern_list[0][i];
        const x = offset_x + waku_size * (local_pos % canada_yoko);
        const y = offset_y + waku_size * Math.floor(local_pos / canada_yoko);
        if (selected_block === i) {
            fill(color(200, 100, 50));
        } else {
            fill(255);
        }
        rect(x, y, waku_size);
        draw_block_sub(block_pattern, x, y);
        local_pos++;
        if (i === 16) {
            local_pos = Math.floor((local_pos + canada_yoko - 1) / canada_yoko) * canada_yoko;
        }
    }

    pos += local_pos;
    pos = Math.floor((pos + canada_yoko - 1) / canada_yoko) * canada_yoko;
    offset_x = waku_size * (pos % canada_yoko);
    offset_y = waku_size * Math.floor(pos / canada_yoko);
    if (!Number.isNaN(selected_block)) {
        pos += draw_selected_block(offset_x, offset_y);
        if (selected_block !== 0) {
            pos = Math.floor((pos + canada_yoko - 1) / canada_yoko) * canada_yoko;
            offset_x = waku_size * (pos % canada_yoko);
            offset_y = waku_size * Math.floor(pos / canada_yoko);
//            pos += draw_selected_symmetric_block(offset_x, offset_y);
       }
    }
    fill(0);
    textAlign(LEFT, TOP);
    let moji = canada_pattern_block_list.length;
    text(moji, waku_size + block_size, 0)
}

function canada_click(x, y) {
    const pos_x = Math.floor(x / waku_size);
    const pos_y = Math.floor(y / waku_size);

    let num = NaN;
    if (pos_x === 0 && pos_y === 0) {
        num = 0;
    } else if (pos_x <= 15 && 1 <= pos_y && pos_y <= 2) {
        num = 1 + pos_x % 16 + (pos_y - 1) * 16;
    } else {
        return;
    }
    if (num < 0 || 32 < num) {
        return;
    }
    if (selected_block === num) {
        selected_block = NaN;
    } else {
        selected_block = num;
    }
    canada_pattern_block_list = rebuild_canada_pattern_block_list();
    return;
}

function rebuild_canada_pattern_block_list() {
    if (Number.isNaN(selected_block)) {
        return [];
    }
    let result = [];
	for (let pattern of all_pattern_list) {
	    if (pattern[0] === selected_block) {
            result.push(pattern);
	    }
	}
    return result;
}

function draw_selected_block(offset_x, offset_y) {
    let color_list = [color(200,100,50),color(50,200,100),color(200,200,50), color(100,100,200)];
    let local_pos = 0;
    for (let block_list of canada_pattern_block_list) {
        const x = offset_x + waku_size * (local_pos % canada_yoko);
        const y = offset_y + waku_size * Math.floor(local_pos / canada_yoko);
        fill(230);
        rect(x, y, waku_size);
//        draw_block_waku(x, y);
        push();
        noStroke();
        for (let i = 0; i < 4; i++) {
            const block = block_pattern_list[i][block_list[i]];
            draw_block_sub(block, x, y, color_list[i]);
        }
        pop();
        local_pos++;
    }
    return local_pos;
} 

function draw_selected_symmetric_block(offset_x, offset_y) {
    const color_list = [color(200,100,50),color(50,200,100),color(200,200,50), color(100,100,200)];
    const color_list2 = [color_list[0], color_list[3], color_list[2], color_list[1]];
    let local_pos = 0;
    for (let block_list of canada_pattern_block_list) {
        const x = offset_x + waku_size * (local_pos % canada_yoko);
        const y = offset_y + waku_size * Math.floor(local_pos / canada_yoko);
        fill(255);
        rect(x, y, waku_size);
//        draw_block_waku(x, y);
        push();
        noStroke();
        let tmp_block_list = [block_list[0], block_list[3], block_list[2], block_list[1]];
        for (let i = 0; i < 4; i++) {
            tmp_block_list[i] = tmp_block_list[i] === 0 ? 0 : (tmp_block_list[i] <= 16 ? tmp_block_list[i] += 16 : tmp_block_list[i] -= 16);
            const block = block_pattern_list[i][tmp_block_list[i]];
            draw_block_sub(block, x, y, color_list2[i]);
        }
        pop();
        local_pos++;
    }
    return local_pos;
} 
