var nums=[];
var score=0;
var hasConflicted=[];//已经叠加的，用来解决单元格重复叠加的问题
$(function(){
// 开始新游戏
	newgame();

});
function newgame(){
	if(documentWidth>500){
		containerWidth=500;
		cellWidth=100;
		cellSpace=20;
	}else{
		//设置移动端尺寸
		settingForMobile();
	}
	
 	init();
 	//在随机的两个单元格中生成数字
 	generateOneNumber();
 	generateOneNumber();
}
function settingForMobile(){
	$(".game_score").css('width',containerWidth);
	$(".grid-container").css('width',containerWidth-cellSpace*2);
	$(".grid-container").css('height',containerWidth-cellSpace*2);
	$(".grid-container").css('padding',cellSpace);
	$(".grid-container").css('border-radius',containerWidth*0.02);
	$(".grid-cell").css('width',cellWidth);
	$(".grid-cell").css('height',cellWidth);
	$(".grid-cell").css('border-radius',cellWidth*0.06);
}
// 初始化页面
function init(){
	//初始化单元格位置(下层单元格)
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$("#grid-cell-"+i+"-"+j);
			gridCell.css("top",getPostTop(i,j));
			gridCell.css("left",getPostLeft(i,j));
		}
	}
	//初始化数组
	for(var i=0;i<4;i++){
		nums[i]=new Array();
		hasConflicted[i]=new Array();
		for(var j=0;j<4;j++){
			nums[i][j]=0;
			hasConflicted[i][j]=false;//表示未曾叠加
		}
	}
	//动态创建上层单元格并初始化
	updateView();
	//每次新游戏的时候分数都初始化
	score=0;
	updateScore(score);
}
function updateView(){
	$(".nums-cell").remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$(".grid-container").append("<div class='nums-cell' id='nums-cell-"+i+"-"+j+"'></div>");
			var numsCell=$("#nums-cell-"+i+"-"+j);
			if(nums[i][j]==0){
				numsCell.css("width","0px");
				numsCell.css("height","0px");
				numsCell.css("top",getPostTop(i,j)+cellWidth*0.5);
				numsCell.css("left",getPostLeft(i,j)+cellWidth*0.5);
			}else{
				numsCell.css("width",cellWidth);
				numsCell.css("height",cellWidth);
				numsCell.css("top",getPostTop(i,j));
				numsCell.css("left",getPostLeft(i,j));
				numsCell.css("background",getNumberBackGroundColor(nums[i][j]));
				numsCell.css("color",getNumberColor(nums[i][j]));
				numsCell.text(nums[i][j]);
			}
		hasConflicted[i][j]=false;
		$(".nums-cell").css('border-radius',cellWidth*0.06);
		$(".nums-cell").css('font-size',cellWidth*0.5);
		$(".nums-cell").css('line-height',cellWidth+'px');
		}

	}
}
/*
	在随机的单元格中生成一个随机数：
	1.在空余的单元格中随机找一个
	2.随机产生一个2或4
*/
function generateOneNumber(){
	//判断是否还有空间，如果没有空间则直接返回
	if(noSpace(nums)){
		return;
	}	
	//随机一个位置
	var count=0;
	var temp=[];
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(nums[i][j]==0){
				temp[count]=i*4+j;
				count++;
			}
		}
	}
	var pos=Math.floor(Math.random()*count);
	var randx=Math.floor(temp[pos]/4);
	var randy=Math.floor(temp[pos]%4);
	//随机一个数字
	var randNum=Math.random()<0.5?2:4;
	//在随机位置上显示随机数字
	nums[randx][randy]=randNum;
	showNumberWithAnimation(randx,randy,randNum);	
}
//实现键盘响应
$(document).keydown(function(even){
	//阻止事件的默认动作
	event.preventDefault();

	switch(event.keyCode){
		case 37://左移
			//判断是否可以左移
			if(canMoveLeft(nums)){
				moveLeft();
				//左移之后都要随机产生一个新的数字
				setTimeout(generateOneNumber,300);
				setTimeout(isGameOver,500);
			}
			break;
		case 38://上移
				//判断是否可以上移
			if(canMoveup(nums)){
				moveUp();
				//上移之后都要随机产生一个新的数字
				setTimeout(generateOneNumber,300);
				setTimeout(isGameOver,500);
			}
			break;
		case 39://右移
			//判断是否可以右移
			if(canMoveRight(nums)){
				moveRight();
				//右移之后都要随机产生一个新的数字
				setTimeout(generateOneNumber,300);
				setTimeout(isGameOver,500);
			}
			break;
		case 40://下移
			if(canMoveDown(nums)){
				moveDown();
				setTimeout(generateOneNumber,300);
				setTimeout(isGameOver,500);
			}
			break;

	}
});
//实现触摸滑动响应
document.addEventListener('touchstart',function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;

	//判断滑动方向
	var deltax=endx-startx;
	var deltay=endy-starty;

	//判断当滑动距离小于一定的阈值时不做任何操作
	if(Math.abs(deltax)<documentWidth*0.08 && Math.abs(deltay)<documentWidth*0.08){
		return;
	}

	if(Math.abs(deltax)>=Math.abs(deltay)){ //水平方向移动
		if(deltax>0){ //向右移动
			if(canMoveRight(nums)){
				moveRight();
				setTimeout(generateOneNumber,200);
				setTimeout(isGameOver,500);
			}
		}else{ //向左移动
			if(canMoveLeft(nums)){
				moveLeft();
				setTimeout(generateOneNumber,200);
				setTimeout(isGameOver,500);
			}
		}
	}else{ //垂直方向移动
		if(deltay>0){ //向下移动
			if(canMoveDown(nums)){
				moveDown();
				setTimeout(generateOneNumber,200);
				setTimeout(isGameOver,500);
			}
		}else{ //向上移动
			if(canMoveup(nums)){
				moveUp();
				setTimeout(generateOneNumber,200);
				setTimeout(isGameOver,500);
			}
		}
	}

});
/*
	向左移动
	需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况：
		1.落脚点没有数字，并且移动路径中没有障碍物
		2.落脚点数字和自己相同，并且移动路径中没有障碍物
*/
function moveLeft(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(nums[i][j]!=0){
				for(var k=0;k<j;k++){
					//情况一
					if(nums[i][k]==0 && noBlockHorizontal(i,k,j,nums)){//判断第i行第k-j列是否有障碍物
						//移动
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
						//情况二
					}else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,k,j,nums)&& !hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						nums[i][j]=0;
						//统计分数
						score+=nums[i][k];
						//更新分数
						updateScore(score);
						//表示已经叠加
						hasConflicted[i][k]=true;
						break;
					}
				}
			}
			
		}
	}
	setTimeout(updateView,300);
}
//向上移动
function moveUp(){
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(nums[i][j]!=0){
				for(var k=0;k<i;k++){
					if(nums[k][j]==0 && noBlockVertical(j,k,i,nums)){//判断第j列第k-i行是否有障碍物
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[k][j]==nums[i][j] && noBlockVertical(j,k,i,nums)&& !hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						nums[i][j]=0;
						score+=nums[k][j];
						updateScore(score);
						hasConflicted[k][j]=true;
						break;
					}
				}
			}
		}
	}
	setTimeout(updateView,300);
}
//向右移动
function moveRight(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(nums[i][j]!=0){
				for(var k=3;k>j;k--){
					//情况一
					if(nums[i][k]==0 && noBlockHorizontal(i,j,k,nums)){//判断第i行第k-j列是否有障碍物
						//移动
						showMoveAnimation(i,j,i,k);
						nums[i][k]=nums[i][j];
						nums[i][j]=0;
						break;
						//情况二
					}else if(nums[i][k]==nums[i][j] && noBlockHorizontal(i,j,k,nums)&& !hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						nums[i][k]+=nums[i][j];
						nums[i][j]=0;
						//统计分数
						score+=nums[i][k];
						//更新分数
						updateScore(score);
						//表示已经叠加
						hasConflicted[i][k]=true;
						break;
					}
				}
			}
		}
	}
	setTimeout(updateView,300);
}
//向下移动
function moveDown(){
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(nums[i][j]!=0){
				for(var k=3;k>i;k--){
					if(nums[k][j]==0 && noBlockVertical(j,i,k,nums)){//判断第j列第k-i行是否有障碍物
						showMoveAnimation(i,j,k,j);
						nums[k][j]=nums[i][j];
						nums[i][j]=0;
						break;
					}else if(nums[k][j]==nums[i][j] && noBlockVertical(j,i,k,nums)&& !hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						nums[k][j]+=nums[i][j];
						nums[i][j]=0;
						score+=nums[k][j];
						updateScore(score);
						hasConflicted[k][j]=true;
						break;
					}
				}
			}
		}
	}
	setTimeout(updateView,300);
}


