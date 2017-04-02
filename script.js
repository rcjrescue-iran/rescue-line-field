$(document).ready(function () {
    $("#container").append(addTile(11, 11, 1));
    $("#container").append(addTile(144, 9, 2));
    $("#container").append(addTile(279, 9, 3));
    $("#container").append(addTile(407, 8, 4));
    $("#container").append(addTile(543, 7, 5));
    $("#container").append(addTile(673, 7, 6));
    $("#container").append(addTile(809, 7, 7));
    $("#container").append(addTile(13, 136, 8));
    $("#container").append(addTile(144, 135, 9));
    $("#container").append(addTile(278, 134, 10));
    $("#container").append(addTile(407, 133, 11));
    $("#container").append(addTile(542, 132, 12));
    $("#container").append(addTile(673, 134, 13));
    $("#container").append(addTile(809, 135, 14));
    $("#container").append(addTile(14, 264, 15));
    $("#container").append(addTile(144, 263, 16));
    $("#container").append(addTile(278, 264, 17));
    $("#container").append(addTile(409, 263, 18));
    $("#container").append(addTile(543, 265, 19));
    $("#container").append(addTile(673, 262, 20));
    $("#container").append(addTile(809, 260, 21));
    $("#container").append(addTile(14, 391, 22));
    $("#container").append(addTile(145, 389, 23));
    $("#container").append(addTile(278, 390, 24));
    $("#container").append(addTile(407, 388, 25));
    $("#container").append(addTile(543, 387, 26));
    $("#container").append(addTile(676, 387, 27));
    $("#container").append(addTile(809, 388, 28));
    $("#container").append(addTile(146, 515, 30));
    $("#container").append(addTile(278, 515, 31));
    $("#container").append(addTile(406, 515, 32));
    $("#container").append(addTile(543, 515, 33));
    $("#container").append(addTile(676, 517, 34));
    $("#container").append(addTile(809, 518, 35));

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
})

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
    // if (angle < 0) angle = 270;
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
    // if (angle >= 360) angle = 0;
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
    $("#mainField").append(newTile(-parseInt(xPos), -parseInt(yPos), number,tile.position().top, tile.position().left));
    $(".tile").draggable();
}

function recycle(elem) {
    $("#" + elem.id).parent().css({ 'opacity': '0' })
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