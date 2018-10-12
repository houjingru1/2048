function showNumberWithAnimation(i,j,randNum){

	var numberCell=$("#nums-cell-"+i+"-"+j);
	numberCell.css("background",getNumberBackGroundColor(randNum));
	numberCell.css("color",getNumberColor(randNum));
	numberCell.text(randNum);
	numberCell.animate({
		width:cellWidth,
		height:cellWidth,
		top:getPostTop(i,j),
		left:getPostLeft(i,j)
	}, 500);
}
// 移动动画
function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell=$("#nums-cell-"+fromx+"-"+fromy);
	numberCell.animate({
		top:getPostTop(tox,toy),
		left:getPostLeft(tox,toy)
	},300);
}