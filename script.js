$(document).ready(function () {
    var items = [[11, 11, 1], [144, 9, 2], [279, 9, 3], [407, 8, 4], [543, 7, 5], [673, 7, 6], [809, 7, 7], [13, 136, 8], [144, 135, 9], [278, 134, 10], [407, 133, 11], [542, 132, 12], [673, 134, 13], [809, 135, 14], [14, 264, 15], [144, 263, 16], [278, 264, 17], [409, 263, 18], [543, 265, 19], [673, 262, 20], [809, 260, 21], [14, 391, 22], [145, 389, 23], [278, 390, 24], [407, 388, 25], [543, 387, 26], [676, 387, 27], [809, 388, 28], [146, 515, 30], [278, 515, 31], [406, 515, 32], [543, 515, 33], [676, 517, 34], [809, 518, 35], [16, 643, 36], [147, 643, 37], [277, 643, 39], [405, 643, 40], [543, 643, 41], [675, 643, 42], [809, 643, 43]];
    for (var index in items) {
        var item = items[index];
        $("#container").append(addTile(item[0], item[1], item[2]));
    }

    $("#pickup").click(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active")
            $("#container").animate({ height: 0 })
        } else {
            $(this).addClass("active")
            $("#container").animate({ height: 145 })
        }
    })

    $("#tileField .tilePosition").droppable({
        accept: '.tile',
        hoverClass: 'hovered',
        drop: handleCardDrop
    });
    $("#mainField").height($("#tileField").height())

    $("#save").click(function () {
        var list = [];
        $("div.tile").each(function () {
            var item = $(this);
            if (item.hasClass("removed")) {
                return;
            }
            var left = $(item).position().left;
            if (left > 0) {
                return;
            }
            var top = $(item).position().top;
            var data = { "number": item.data('number'), "left": left, "top": top };
            list.push(data);
        });
        if (!list.length) {
            toast("There is nothing in your storage.");
            return;
        }
        var unix_time = Math.round(new Date().getTime() / 1000);
        localStorage.setItem(unix_time, JSON.stringify(list));

        toast("Your map has been saved to localStorage.");
    });

    $("#load").click(function () {
        toast("This function does not implemented !")
        return;
        
        var current_items = load_function();
        var last_item = current_items[current_items.length - 1];
        for (var index in last_item) {
            var item = last_item[index];
            item = items[item.number - 1];

            ui.draggable.addClass('correct');
            ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });            
        }
    });
});

function load_function() {
    var items = [];
    for (var key in window.localStorage) {
        if (!window.localStorage.hasOwnProperty(key)) {
            continue;
        }
        var item = window.localStorage.getItem(key);
        items.push(JSON.parse(item));
    }
    return items;
}

function toast(msg) {
    $(".toast").fadeIn();
    $(".toast").html(msg);
    setTimeout(() => {
        $(".toast").fadeOut();
    }, 3000);
}

function handleCardDrop(event, ui) {
    ui.draggable.addClass('correct');
    ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
}

function undo(elem) {
    var image = $("#" + elem.id).parent().find("img");
    var angle = parseInt(image.data('angle'));
    var number = $("#" + elem.id).parent().find('.number');
    number.css({ 'opacity': '0' });
    angle -= 90;
    image.data('angle', angle);
    image.attr('data-angle', angle);
    image.css({
        '-moz-transform': 'rotate(' + angle + 'deg)',
        '-webkit-transform': 'rotate(' + angle + 'deg)',
        '-o-transform': 'rotate(' + angle + 'deg)',
        '-ms-transform': 'rotate(' + angle + 'deg)',
        'transform': 'rotate(' + angle + 'deg)'
    });
    setTimeout(function () {
        number.css({ 'opacity': '0.7' });
    }, 500);
}

function repeat(elem) {
    var image = $("#" + elem.id).parent().find("img");
    var angle = parseInt(image.data('angle'));
    var number = $("#" + elem.id).parent().find('.number');
    number.css({ 'opacity': '0' });
    angle += 90;
    image.data('angle', angle);
    image.attr('data-angle', angle);
    image.css({
        '-moz-transform': 'rotate(' + angle + 'deg)',
        '-webkit-transform': 'rotate(' + angle + 'deg)',
        '-o-transform': 'rotate(' + angle + 'deg)',
        '-ms-transform': 'rotate(' + angle + 'deg)',
        'transform': 'rotate(' + angle + 'deg)'
    });
    setTimeout(function () {
        number.css({ 'opacity': '0.7' });
    }, 500);
}

function copy(elem) {
    var tile = $("#" + elem.id).parent();
    var number = tile.data('number');
    var image = tile.find("img");
    var backgroundPos = image.css('backgroundPosition').split(" ");
    var xPos = backgroundPos[0],
        yPos = backgroundPos[1];
    xPos = xPos.replace("px");
    yPos = yPos.replace("px");
    $("#mainField").append(newTile(-parseInt(xPos), -parseInt(yPos), number, tile.position().top, tile.position().left));
    $(".tile").draggable();
}

function recycle(elem) {
    $("#" + elem.id).parent().css({ 'opacity': '0' })
    $("#" + elem.id).parent().addClass("removed");
}

function newTile(x, y, number) {
    var pt = 0;
    var pl = 0;
    var i = $(".tile").length;
    var position = "relative";
    if (arguments.length == 5) {
        pt = arguments[2] + 10;
        pl = arguments[3] + 10;
        position = "absolute"
    }
    return `<div data-number='` + number + `' class='fadeIn tile' style="position:` + position + `;top:` + pt + `px; left:` + pl + `px;">
    <i id='undo-` + i + `' class='fa fa-undo' onclick='undo(this)' aria-hidden='true'></i>
    <i id='repeat-` + i + `' class='fa fa-repeat' onclick='repeat(this)' aria-hidden='true'></i>
    <i id='copy-` + i + `' class='fa fa-copy' onclick='copy(this)' aria-hidden='true'></i>
    <i id='recycle-` + i + `' class='fa fa-recycle' onclick='recycle(this)' aria-hidden='true'></i>
    <img class='tiles' data-angle='0' style='background-position:-` + x + `px -` + y + `px` + `'><span class="number">` + number + `</span></div>`;
}

function spawnTile(x, y, number) {
    $("#mainField").append(newTile(x, y, number));
    makeDraggable();
}

function addTile(x, y, number) {
    return `<div data-number='` + number + `' class='fadeIn originalTile' onclick="spawnTile(` + x + `,` + y + `,` + number + `)"><span class="number">` + number + `</span><img class="tiles" data-angle='0' style='background-position:-` + x + `px -` + y + `px` + `'></div></div>`
}

function makeDraggable() {
    $(".tile").draggable({
        containment: '#field',
        cursor: 'move',
    });
}