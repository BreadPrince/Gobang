var CHESSBOARD, roundcolor, chosencolor, gamemode
var printChessBoard
$(function() {
	// 配置
	var isStart = false
	var isEnd = false

	gamemode = null  // 0 表示PVE, 1 表示PVP
	chosencolor = null  // 人机对弈选择执子颜色, 0 表示黑子, 1 表示白子
	roundcolor = 0  // 0 表示黑子, 1 表示白子, 初始 1 为白子先手

	var addChesspiece, judgement

	// 初始化棋盘
	CHESSBOARD = new Array()
	var c = 15
	for (var i=0; i<c; i++) {
		CHESSBOARD[i] = new Array()
		for (var j=0; j<c; j++) {
			CHESSBOARD[i][j] = '-'
		}
	}

	// 打印棋盘
	printChessBoard = function (chessboard) {
		if (!chessboard) {
			chessboard = CHESSBOARD
		}
		console.log('当前对局情况如下: ')
		var index = ''
		for (var i=14; i>=0; i--) {
			index = i+1 < 10 ? ' ' + (i+1) : i+1
			console.log(index + '. ' + chessboard[i])
		}
	}

	// 落子并记录棋盘
	addChesspiece = function (color, i, j, callback) {
		if (isEnd) { return }
		var left = CELL[i][j][0]
		var bottom = CELL[i][j][1]
		var chesspiece = $('<span class="chesspiece"><span>')
		chesspiece.css({
			'left': left + 'px',
			'bottom': bottom + 'px'
		})
		if (color === 1) {
			// 下白子
			chesspiece.addClass('whitepiece')
			$('.chess').append(chesspiece)
			CHESSBOARD[i][j] = 1
		} else if (color === 0){
			// 下黑子
			chesspiece.addClass('blackpiece')
			$('.chess').append(chesspiece)
			CHESSBOARD[i][j] = 0
		} else {
			console.log('Wowwwww!!! What the fucking WRONG just happened!!!')
			return
		}

		roundcolor = roundcolor === 0 ? 1 : 0  // 换手
		// 输赢裁决
		if (!judgement(i, j)) {
			if (callback) return callback()
		} else {
			return false
		}

	}

	// 输赢判断
	judgement = function (i, j, chessboard) {
		if (!chessboard) {
			chessboard = CHESSBOARD
		}
		var flag = chessboard[i][j]
		// console.log("flag: " + flag)
		var count = 0
		var direction = []
		for (var x=-1; x<=1; x++) {
			for (var y=-1; y<=1; y++) {
				if (x!=0 || y!=0) {
					var n = i, m = j
					direction[count] = 0
					var signal = true
					while(signal) {
						if ( (n+x)>=0 && (n+x)<15 && (m+y)>=0 && (m+y)<15 ) {
							if (chessboard[n+x][m+y] === flag) {
								direction[count] += 1
							} else {
								signal = false
							}
							n = n + x
							m = m + y
						} else {
							signal = false
						}
					}
					count++
				}			
			}
		}

		if (direction[0]+direction[7]==4 || direction[1]+direction[6]==4 || direction[2]+direction[5]==4 || direction[3]+direction[4]==4) {
			$('.end').css({'display': 'block'})
			var text = ''
			if ( chosencolor === null ) {
				chosencolor = 1
			}
			if (flag==chosencolor) {
				text = gamemode === 0 ? '你赢了 :)' : '白胜！'
			} else {
				text = gamemode === 0 ? '你输了 :(' : '黑胜！'
			}
			$('.end-wrapper h3').text(text)

			isEnd = true

			return true
		}

		return false
	}

	// 下棋操作都在这
	$('.chess').on('click', '.chess-click-point', function() {
		if (!isStart) return
		if (isEnd) return
		if (gamemode === 0) {
			// 人机对弈
			if (chosencolor === roundcolor) {
				var i = parseInt($(this).attr('data-point').split('-')[0])
				var j = parseInt($(this).attr('data-point').split('-')[1])
				addChesspiece(roundcolor, i, j, function() {
					// ai turn
					// var coordinate = ai_2(roundcolor)
					var coordinate = alphabetaMax(roundcolor, 2, -Infinity, Infinity, CHESSBOARD)[1]
					console.log(coordinate)
					addChesspiece(roundcolor, coordinate[0], coordinate[1])
				})
				
			} else {
				console.log('Hold on, it is Mr. Naive\'s time')
			}
		} else if (gamemode === 1) {
			// 人人对弈
			var i = parseInt($(this).attr('data-point').split('-')[0])
			var j = parseInt($(this).attr('data-point').split('-')[1])
			addChesspiece(roundcolor, i, j)
		} else {
			console.log('Wowwwww!!! What the fucking WRONG just happened!!!')
			return
		}

		// printChessBoard()
	})

	// 选择模式
	$('.gamemode').on('click', '.mode', function() {
		var that = this
		if ($(that).attr('data-mode') === 'pve') {
			gamemode = 0
			$(that).css('opacity', '1')
			$('.gamemode').children().each(function(index, elem) {
				if ($(elem).children().first()[0] !== that) {
					$(elem).children().first().css('opacity', '0.6')
				}
			})
			$('#choosecolor').css('display', 'block')
		} else if ($(that).attr('data-mode') === 'pvp') {
			gamemode = 1
			$(that).css('opacity', '1')
			$('.gamemode').children().each(function(index, elem) {
				if ($(elem).children().first()[0] !== that) {
					$(elem).children().first().css('opacity', '0.6')
				}
			})
			$('#choosecolor').css('display', 'none')
		} else {
			console.log('Wowwwww!!! What the fucking WRONG just happened!!!')
		}
	})

	// 选择黑白
	$('.radio').on('click', 'div', function() {
		if (this == $('.radio').children()[0]) {
			// 白子
			chosencolor = 1
			$(this).css('opacity', '1')
			$('.chooseblack').css('opacity', '0.6')
		} else if (this == $('.radio').children()[1]) {
			// 黑子
			chosencolor = 0
			$(this).css('opacity', '1')
			$('.choosewhite').css('opacity', '0.6')
		} else {
			console.log('Wowwwww!!! What the fucking WRONG just happened!!!')
		}
	})

	// 开始游戏
	$('.start').on('click', function() {
		if (gamemode === null) {
			$('#gamemode-label').css('color', '#f10e0e')
		} else {
			$('#gamemode-label').css('color', '#000')
		}
		if (gamemode === 0) {
			if (chosencolor === null) {
				$('#radio-label').css('color', '#f10e0e')
			} else {
				$('#radio-label').css('color', '#000')
			}
			if (gamemode === null || chosencolor === null) {
				return
			}
			isStart = true
			$('.welcome').css({'display': 'none'})
			if (chosencolor === 1) {
				// var coordinate = ai_2(0)
				var coordinate = [7, 7]
				addChesspiece(0, coordinate[0], coordinate[1])
			}
		} else if (gamemode === 1) {
			isStart = true
			$('.welcome').css({'display': 'none'})
		}
	})

	// 游戏结束确认
	$('.confirm').on('click', function() {
		isStart = false
		isEnd = false
		roundcolor = 0
		$('.chesspiece').remove()
		var c = CHESSBOARD.length
		for (var i=0; i<c; i++) {
			for (var j=0; j<c; j++) {
				CHESSBOARD[i][j] = '-'
			}
		}
		$('.end').css('display', 'none')
		$('.welcome').css('display', 'block')
	})
})