// 打分
var valueTheChess = function (color, chess_model) {
	var score = 0
	chess_model.forEach(function (line) {
		if (color !== 1) {
			var len = line.length
			for (var index=0; index<len; index++) {
				if (line[index] == 0) {
					line[index] = 1
				} else  if (line[index] == 1) {
					line[index] = 0
				}
			}
		}
		var target = line.join('')
		// 活二
		if (target.indexOf('-11-') === 3 || target.indexOf('-11-') === 4) {
			score += 51
		}
		// 活三
		if (target.indexOf('-111-') === 2 || target.indexOf('-111-') === 3 || target.indexOf('-111-') === 4) {
			score += 101
		}
		// 活四
		if (target.indexOf('-1111-') === 1 || target.indexOf('-1111-') === 2 || target.indexOf('-1111-') === 3 || target.indexOf('-1111-') === 4) {
			score += 10001
		}
		// 死三
		if (target.indexOf('0111--') === 2 || target.indexOf('0111--') === 3 ||
			target.indexOf('0111--') === 4) {
			score += 51
		}
		if (target.indexOf('--1110') === 1 || target.indexOf('--1110') === 2 || 
			target.indexOf('--1110') === 3) {
			score += 51
		}
		if (target.indexOf('#111--') === 2 || target.indexOf('#111--') === 3 ||
			target.indexOf('#111--') === 4) {
			score += 51
		}
		if (target.indexOf('--111#') === 1 || target.indexOf('--111#') === 2 || 
			target.indexOf('--111#') === 3) {
			score += 51
		}
		// 死四
		if (target.indexOf('01111-') === 1 || target.indexOf('01111-') === 2 || 
			target.indexOf('01111-') === 3 || target.indexOf('01111-') === 4) {
			score += 5001
		}
		if (target.indexOf('-11110') === 1 || target.indexOf('-11110') === 2 || 
			target.indexOf('-11110') === 3 || target.indexOf('-11110') === 4) {
			score += 5001
		}
		if (target.indexOf('#1111-') === 1 || target.indexOf('#1111-') === 2 || 
			target.indexOf('#1111-') === 3 || target.indexOf('#1111-') === 4) {
			score += 5001
		}
		if (target.indexOf('-1111#') === 1 || target.indexOf('-1111#') === 2 || 
			target.indexOf('-1111#') === 3 || target.indexOf('-1111#') === 4) {
			score += 5001
		}
		// 冲四
		if (target.indexOf('-1-111-') !== -1 || target.indexOf('01-111-') !== -1 || target.indexOf('-1-1110') !== -1 || target.indexOf('01-1110') !== -1 || target.indexOf('-1-111#') !== -1 || target.indexOf('#1-111-') !== -1 || target.indexOf('#1-111#') !== -1) {
			score += 1001
		}
		// 五连
		if (target.indexOf('-11111-') !== -1 || target.indexOf('011111-') !== -1 || target.indexOf('-111110') !== -1 || target.indexOf('0111110') !== -1 || target.indexOf('-11111#') !== -1 || target.indexOf('#11111-') !== -1 || target.indexOf('#11111#') !== -1) {
			score = color === chosencolor ? 100001 : 1000001
		}
	})

	return score
}

// 获取估分
var getScore = function (color, i, j) {
	var chess_model = []
	var slot_len = 5
	var stack = []

	/* 阳线部分 */
	// 从左到右
	stack = [color]
	for (var x=1; x<=slot_len; x++) {
		if (i-x>=0) {
			stack.unshift(CHESSBOARD[i-x][j])
		} else {
			stack.unshift('#')
		}
		if (i+x<15) {
			stack.push(CHESSBOARD[i+x][j])
		} else {
			stack.push('#')
		}
	}
	chess_model.push(stack)
	// 从下到上
	stack = [color]
	for (var x=1; x<=slot_len; x++) {
		if (j-x>=0) {
			stack.unshift(CHESSBOARD[i][j-x])
		} else {
			stack.unshift('#')
		}
		if (j+x<15) {
			stack.push(CHESSBOARD[i][j+x])
		} else {
			stack.push('#')
		}
	}
	chess_model.push(stack)
	/* 阴线部分 */
	// 从左下到右上
	stack = [color]
	for (var x=1; x<=slot_len; x++) {
		if (i-x>=0 && j-x>=0) {
			stack.unshift(CHESSBOARD[i-x][j-x])
		} else {
			stack.unshift('#')
		}
		if (i+x<15 && j+x<15) {
			stack.push(CHESSBOARD[i+x][j+x])
		} else {
			stack.push('#')
		}
	}
	chess_model.push(stack)
	// 从左上到右下
	stack = [color]
	for (var x=1; x<=slot_len; x++) {
		if (i-x>=0 && j+x<15) {
			stack.unshift(CHESSBOARD[i-x][j+x])
		} else {
			stack.unshift('#')
		}
		if (i+x<15 && j-x>=0) {
			stack.push(CHESSBOARD[i+x][j-x])
		} else {
			stack.push('#')
		}
	}
	chess_model.push(stack)

	return valueTheChess(color, chess_model)
}

var ai_2 = function (color) {
	var chessboard_size = CHESSBOARD.length
	// console.log('chessboard_size: ' + chessboard_size)
	var max_score = 1
	var result = []
	for (var x=0; x<chessboard_size; x++) {
		for (var y=0; y<chessboard_size; y++) {
			if (CHESSBOARD[x][y] === '-') {
				var anti_color = color === 0 ? 1 : 0
				var ai_score = getScore(color, x, y)
				var player_score = getScore(anti_color, x, y)
				// console.log('ai_score: ' + ai_score + '   ' + 'player_score: ' + player_score)
				var score = ai_score + player_score

				if (score > max_score) {
					max_score = score
					result = [{
						score: score,
						coordinate: [x, y]
					}]
				} else if (score === max_score) {
					result.push({
						score: score,
						coordinate: [x, y]
					})
				}
			}
		}
	}

	if (result.length === 1) {
		result = result[0].coordinate
	} else if (result.length > 1) {
		result = result[Math.floor(result.length*Math.random())].coordinate
	} else {
		result = [7, 7]
	}

	return result
}