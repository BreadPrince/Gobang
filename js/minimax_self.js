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

// 评估函数
var getScore = function (color, i, j, chessboard) {
	if (!chessboard) {
		chessboard = CHESSBOARD
	}
	var chess_model = []
	var slot_len = 5
	var stack = []

	/* 阳线部分 */
	// 从左到右
	stack = [color]
	for (var x=1; x<=slot_len; x++) {
		if (i-x>=0) {
			stack.unshift(chessboard[i-x][j])
		} else {
			stack.unshift('#')
		}
		if (i+x<15) {
			stack.push(chessboard[i+x][j])
		} else {
			stack.push('#')
		}
	}
	chess_model.push(stack)
	// 从下到上
	stack = [color]
	for (var x=1; x<=slot_len; x++) {
		if (j-x>=0) {
			stack.unshift(chessboard[i][j-x])
		} else {
			stack.unshift('#')
		}
		if (j+x<15) {
			stack.push(chessboard[i][j+x])
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
			stack.unshift(chessboard[i-x][j-x])
		} else {
			stack.unshift('#')
		}
		if (i+x<15 && j+x<15) {
			stack.push(chessboard[i+x][j+x])
		} else {
			stack.push('#')
		}
	}
	chess_model.push(stack)
	// 从左上到右下
	stack = [color]
	for (var x=1; x<=slot_len; x++) {
		if (i-x>=0 && j+x<15) {
			stack.unshift(chessboard[i-x][j+x])
		} else {
			stack.unshift('#')
		}
		if (i+x<15 && j-x>=0) {
			stack.push(chessboard[i+x][j-x])
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

var getAllLegalPoints = function (chessboard) {
	if (!chessboard) {
		chessboard = CHESSBOARD
	}

	var points = []
	var illegal_points = []
	var illegal_points_x = []
	var illegal_points_y = []

	// 获取所有合法点
	for (var i=0; i<15; i++) {
		for (var j=0; j<15; j++) {
			if (chessboard[i][j] !== '-') {
				illegal_points_x.push(i)
				illegal_points_y.push(j)
				illegal_points.push([i, j].toString())
			}
		}
	}

	illegal_points_x.sort(function (a, b) { return a-b })
	illegal_points_y.sort(function (a, b) { return a-b })

	var min_x = illegal_points_x[0]
	min_x = min_x-2 >= 0 ? min_x-2 : (min_x-1 >= 0 ? min_x-1 : min_x)
	var max_x = illegal_points_x[illegal_points_x.length-1]
	max_x = max_x+2 < 15 ? max_x+2 : (max_x+1 < 15 ? max_x+1 : max_x)
	var min_y = illegal_points_y[0]
	min_y = min_y-2 >= 0 ? min_y-2 : (min_y-1 >= 0 ? min_y-1 : min_y)
	var max_y = illegal_points_y[illegal_points_y.length-1]
	max_y = max_y+2 < 15 ? max_y+2 : (max_y+1 < 15 ? max_y+1 : max_y)

	for (var i=min_x; i<=max_x; i++) {
		for (var j=min_y; j<=max_y; j++) {
			if (illegal_points.indexOf([i, j].toString()) === -1) {
				points.push([i, j])
			}
		}
	}

	return points
}

var MIN = 0, MAX = 0
var minmax = function (color, deep) {
	var chessboard = CHESSBOARD
	var points = getAllLegalPoints(chessboard)
	var anti_color = color === 0 ? 1 : 0
	var best = 0

	var points_len = points.length
	var best_points = []
	for (var i=0; i<points_len; i++) {
		var score, p = points[i]
		score = getScore(color, p[0], p[1], chessboard) + getScore(anti_color, p[0], p[1], chessboard)
		chessboard[p[0]][p[1]] = color
		if (deep <= 1 || win(p[0], p[1], chessboard)) {
			score = score
		} else {
			score = score - min(chessboard, anti_color, deep-1)
		}
		chessboard[p[0]][p[1]] = '-'

		if (score === best) {
			best_points.push(p)
		}
		if (score > best) {
			best = score
			best_points = [p]
		}
	}

	result = Math.floor(best_points.length * Math.random())

	return best_points[result]
}

var min = function (chessboard, color, deep) {
	var points = getAllLegalPoints(chessboard)
	var best = 0
	var anti_color = color === 0 ? 1 : 0

	var points_len = points.length
	for (var i=0; i<points_len; i++) {
		var score, p = points[i]
		score = getScore(color, p[0], p[1], chessboard) + getScore(anti_color, p[0], p[1], chessboard)
		chessboard[p[0]][p[1]] = color
		if (deep <= 1 || win(p[0], p[1], chessboard)) {
			score = score
		} else {
			score = max(chessboard, anti_color, deep-1) - score
		}
		chessboard[p[0]][p[1]] = '-'

		if (score > best) {
			best = score
		}
	}
	return score
}

var max = function (chessboard, color, deep) {
	var points = getAllLegalPoints(chessboard)
	var best = 0
	var anti_color = color === 0 ? 1 : 0

	var points_len = points.length
	for (var i=0; i<points_len; i++) {
		var score, p = points[i]
		score = getScore(color, p[0], p[1], chessboard) + getScore(anti_color, p[0], p[1], chessboard)
		chessboard[p[0]][p[1]] = color
		if (deep <= 1 || win(p[0], p[1], chessboard)) {
			score = score
		} else {
			score = score - min(chessboard, anti_color, deep-1)
		}
		chessboard[p[0]][p[1]] = '-'

		if (score > best) {
			best = score
		}
	}
	return score
}

var win = function (i, j, chessboard) {
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
		return true
	} else {
		return false
	}
}

var ai_3 = function (color) {

}