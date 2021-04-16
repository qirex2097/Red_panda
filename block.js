'use strict';

const block_size = 8;
const waku_size = block_size * 6;
const yoko = 10;
const gap = block_size;
const origin_x = waku_size / 2;
const origin_y = waku_size / 2;
const list_height = waku_size * Math.ceil(33 / yoko) + gap;

let selected_block_list = [NaN, NaN, NaN, NaN];
let selectable_pattern_list = all_pattern_list;

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

function select_block(x, y) {
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