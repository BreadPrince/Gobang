var CELL
$(function() {
	var SIZE = Math.min(window.innerWidth, window.innerHeight)  // 棋盘大小
	CELL = new Array() // 棋盘坐标

	console.log('棋盘尺寸：' + SIZE + ' x ' + SIZE)
	var chess_width = Math.floor(SIZE - SIZE * 0.1)
	chess_width = chess_width % 2 == 0 ? chess_width : chess_width - 1

	// 设置棋盘大小
	$('.chessboard').css({
		'width': SIZE + 'px',
		'height': SIZE + 'px',
		'padding': (SIZE - chess_width) / 2 + 'px'
	})
	$('.chess').css({
		'border-right': '2px solid #000',
		'border-top': '2px solid #000'
	})
	
	var cell_size = (chess_width - 2) / 14
	var n = 14, m = 15
	// 添加棋格
	while (n--) {
		var cell_vertical = $('<div></div>').css({
			'width': cell_size + 'px',
			'height': '100%',
			'right': cell_size * n + 'px',
			'bottom': '0px'
		})
		var cell_across = $('<div></div>').css({
			'width': '100%',
			'height': cell_size + 'px',
			'right': '0px',
			'bottom': cell_size * n + 'px'
		})
		$('.chess').append(cell_vertical)
		$('.chess').append(cell_across)
	}

	// 添加棋格标号
	var vertical_index = $('<div class="vertical-index"></div>')
	var across_index = $('<div class="across-index"></div>')
	vertical_index.css({
		'height': cell_size * m + 'px',
		'top': cell_size * -0.5 + 'px'
	})
	across_index.css({
		'width': cell_size * m + 'px',
		'left': cell_size * -0.5 + 'px'
	})
	while (m--) {
		var cell_vertical_index = $('<span></span>').css({
			'display': 'block',
			'height': cell_size + 'px',
			'line-height': cell_size + 'px'
		}).text(m + 1)
		var cell_across_index = $('<span></span>').css({
			'display': 'inline-block',
			'width': cell_size + 'px',
		}).text(String.fromCharCode(15-m+64))
		vertical_index.append(cell_vertical_index)
		across_index.append(cell_across_index)
	}
	$('.chess').append(vertical_index)
	$('.chess').append(across_index)

	// 获取棋盘坐标
	var c = 15
	for (var i=0; i<c; i++) {
		CELL[i] = new Array()
		for (var j=0; j<c; j++) {
			CELL[i][j] = [i*cell_size+1, j*cell_size+1]
		}
	}

	// 添加棋盘圆点
	var point
	point = $('<span class="chess-point"></span>').css({
		'left': CELL[7][7][0] + 'px',
		'bottom': CELL[7][7][1] + 'px'
	})
	$('.chess').append(point)
	point = $('<span class="chess-point"></span>').css({
		'left': CELL[3][3][0] + 'px',
		'bottom': CELL[3][3][1] + 'px'
	})
	$('.chess').append(point)
	point = $('<span class="chess-point"></span>').css({
		'left': CELL[11][11][0] + 'px',
		'bottom': CELL[11][11][1] + 'px'
	})
	$('.chess').append(point)
	point = $('<span class="chess-point"></span>').css({
		'left': CELL[3][11][0] + 'px',
		'bottom': CELL[3][11][1] + 'px'
	})
	$('.chess').append(point)
	point = $('<span class="chess-point"></span>').css({
		'left': CELL[11][3][0] + 'px',
		'bottom': CELL[11][3][1] + 'px'
	})
	$('.chess').append(point)

	// 添加每个点的可点击范围
	for (var i=0; i<c; i++) {
		for (var j=0; j<c; j++) {
			point = $('<span class="chess-click-point"></span>').css({
				'left': CELL[i][j][0] + 'px',
				'bottom': CELL[i][j][1] + 'px'
			}).attr('data-point', i+'-'+j)
			$('.chess').append(point)
		}
	}

})