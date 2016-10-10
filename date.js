/**
 * 
 * @authors csy (xjcjcsy@sina.cn)
 * @date    2016-10-08 11:07:28
 * @version 1.0
 */
/*
 @param 
 @param id ： input的id
*/

function _Cale(){
	this.init.apply(this, arguments);
}
_Cale.prototype = {
	_template : '<div class="calender-ctx">' +
					'<div class="calender-head">' +
						'<span class="prevyear"></span>' +
						'<span class="prevmonth"></span>' +
						'<span class="nextyear"></span>' +
						'<span class="nextmonth"></span>' +
						'<p></p>' +
					'</div>' +
					'<div class="calender-title">' +
						'<a href="javascript:;"><strong>日</strong></a>' +
						'<a href="javascript:;">一</a>' +
						'<a href="javascript:;">二</a>' +
						'<a href="javascript:;">三</a>' +
						'<a href="javascript:;">四</a>' +
						'<a href="javascript:;">五</a>' +
						'<a href="javascript:;"><strong>六</strong></a>' +
					'</div>' +
					'<div class="calender-date">' +
					'</div>' +
				'</div>',
	_getRect : function(element){
		var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
            scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        var pos = element.getBoundingClientRect();
        // 在IE中，默认坐标从(2,2)开始计算，导致最终距离比其他浏览器多出两个像素，我们需要做个兼容。
        var top = document.documentElement.clientTop;
    	var left= document.documentElement.clientLeft;
    	return {
    		top : pos.top - top,
    		bottom : pos.bottom - top,
    		left : pos.left - left,
    		right : pos.right - left
    	}
	},
	init : function(options){
		this.id = options.id;
		this.input = $(this.id);
		this.initEvent();
	},
	initEvent : function(){
		var that = this;
		this.input.focus(function(){
			that.createContainer();
			that.drawDate(new Date());
		})
	},
	createContainer : function(){
		var div = $("#" + this.id + "-date");
		if(!!div){
			div.remove();
		}
		var ctx;
		this.ctx =  ctx = document.createElement("div");
		ctx.id = this.id + '-date';
		ctx.style.position = 'absolute';
		ctx.zIndex = 9999;

		var calePos = this._getRect(this.input[0]);
		ctx.style.top = calePos.bottom + "px";
		ctx.style.left = calePos.left + "px";

		$(ctx).click(function(e){
			e.stopPropagation();
		})
		$("body").append(ctx);

	},
	drawDate : function(pdate){
		var nowdate = new Date(),
			nowyear = nowdate.getFullYear(),
			nowmonth = nowdate.getMonth(),
			nowdate = nowdate.getDate(),
			dateWrap,
			year,
			month,
			date,
			days,
			weekStart,
			contHtml = [];
		this.dateWrap = dateWrap = document.createElement("div");
		dateWrap.className = 'calender-w';
		dateWrap.innerHTML = this._template;  //innerHtml 居然不可以

		this.year = year = pdate.getFullYear();
		this.month = month = pdate.getMonth() + 1; 
		this.date = date = pdate.getDate();
		
		$(this.dateWrap).find("p").text(year + '年' + month + '月');

		//获取日历区域
		this.calCont = $(dateWrap).find(".calender-date");
		//获取本月天数
		days = new Date(year, month, 0).getDate();
		//获取第一天星期几
		weekStart = new Date(year, month-1, 1).getDay();
		//日期入栈
		for(var i = 0; i < weekStart; i++){
			contHtml.push("<a>&nbsp;</a>");
		}
		// 循环显示日期
        for (i = 1; i <= days; i++) {
            if (year < nowyear) {
                contHtml.push('<a class="live disabled">' + i + '</a>'); // 传入的时间对象的年份小于当前年份
            } else if (year == nowyear) {
                if (month < nowmonth + 1) {
                    contHtml.push('<a class="live disabled">' + i + '</a>'); // 传入的时间对象的月份小于当前月份
                } else if (month == nowmonth + 1) {
                    if (i < nowdate) {
                    	contHtml.push('<a class="live disabled">' + i + '</a>'); // 传入的时间对象的日期小于当前日期
                    }
                    if (i == nowdate) {
                    	contHtml.push('<a class="live tody">' + i + '</a>'); // 传入的时间对象的日期等于当前日期
                    } 
                    if (i > nowdate) {
                    	contHtml.push('<a class="live">' + i + '</a>'); // 传入的时间对象的日期大于当前日期
                    }  
                } else if (month > nowmonth + 1) {
                    contHtml.push('<a class="live">' + i + '</a>'); // 传入的时间对象的月份大于当前月份
                }
            } else if (year > nowyear) {
                contHtml.push('<a class="live">' + i + '</a>'); // 传入的时间对象的年份大于当前年份
            }
        }

        //重绘之前清除日历
        //this.removeDate();

        //日期写入div
        $(this.calCont).html(contHtml.join(""));
        $(this.ctx).html(dateWrap);

        //日期点击事件
        this.caleClick();
        //空白点击事件
        this.blankClick();
        //切换日期
        this.btnEvent();
        console.log("xx")
	},
	btnEvent : function(){
		var that = this;
 		
 		$(".nextyear").click(function(){
 			var nextdate = new Date(that.year + 1,that.month - 1, that.date);
 			that.drawDate(nextdate);
 		})
 		$(".nextmonth").click(function(){
 			var nextdate = new Date(that.year , that.month, that.date);
 			that.drawDate(nextdate);
 		})
 		$(".prevyear").click(function(){
 			console.log("123")
 			var nextdate = new Date(that.year - 1, that.month - 1, that.date);
 			that.drawDate(nextdate);
 		})
 		$(".prevmonth").click(function(){
 			console.log("month")
 			var nextdate = new Date(that.year, that.month - 2, that.date);
 			that.drawDate(nextdate);
 		})
	},
	removeDate : function(){
		$(this.ctx).html("");
	},
	caleClick : function(){
		var that = this;
		$(".calender-w .live").click(function(){
			if($(this).hasClass("disabled")){
				return;
			}
			that.date = $(this).html();
            that.input.val(that.year + '-' + that.month + '-' + that.date);
            that.removeDate();
		})
	},
	blankClick : function(){
		var that = this;
		$(document).click(function(e){
			var e = e || window.event;
			var target = e.target || e.srcElement;
			if(target == that.input[0]){
				return;
			}
			that.removeDate();
		})
	}
}
