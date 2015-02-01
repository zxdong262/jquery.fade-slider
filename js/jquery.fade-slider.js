/* ------------------------------------------------------------------------
    plugin-name:jQuery fade slider
    Developped By: ZHAO Xudong, zxdong@gmail.com -> http://html5beta.com/jquery-2/jquery-fade-slider/
    License: MIT
------------------------------------------------------------------------ */

;(function($){
	function FS(opts, ob) {
		var defaults = {
			speed: 500
			,timer: 4000
			,autoSlider: true
			,hasNav: true
			,pauseOnHover: true
			,navLeftTxt: '&laquo;'
			,navRightTxt: '&raquo;'
			,zIndex:20
			,showIndicator: true
			,beforeAction: null
			,afterAction: null
		}
		,th = this
		,defs = th.defs = $.extend(defaults, opts)
		,cssSet = {
			position:'absolute'
			,left: '0'
			,top:0
			,width:'100%'
			,height:'100%'
			,'overflow': 'hidden'
			,'z-index': defs.zIndex
		}
		th.t = ob.show().wrapInner('<div class="fade-slides" />')
		th.p = th.t.children().css(cssSet)
		th.ss = th.p.children().addClass('fade-slide').css(cssSet).fadeTo(0,0)
		th.len = th.ss.length
		th.flag = null
		th.pause = false
		th.onAction = false
		th.currentPage = 0

		//init 
		th.ss.eq(0).fadeTo(0,1).css('z-index', defs.zIndex + 2).end().filter(':odd').addClass('fs-odd')
		
		//dots
		if(defs.showIndicator) {
			var len1 = th.len
			,th0 = '<span class="fs-dots">'
			for(var k = 0;k < len1;k ++) {
				th0 += '<a data-fs-page="' + k + '" href="javascript:;" class="fs-dot fs-on"></a>'
			}
			var c = th.t.append(th0 + '</span>')
			.children('.fs-dots').css('z-index', defs.zIndex + 5 + th.len)
			th.t.on('click', '.fs-dot', function() {
				var ta = $(this)
				,i = parseInt(ta.data('fs-page'), 10)
				if(th.onAction || i === th.currentPage) return
				th.onAction = true
				th.action(i)
			})
		}
		
		//navs
		if(defs.hasNav) {
			th.t.append('<a href="javascript:;" class="fs-nav fs-nav-prev">' + defs.navLeftTxt +
			'</a><a href="javascript:;" class="fs-nav fs-nav-next">' + defs.navRightTxt + '</a>')
			.children('.fs-nav').css('z-index', defs.zIndex + 10 + th.len)
			th.t.on('click', '.fs-nav', function() {
				if(th.onAction) return
				th.onAction = true
				var len = th.len
				,isNext = $(this).hasClass('fs-nav-next')
				,i = isNext? (th.currentPage + 1 + len) % len : (th.currentPage - 1 + len) % len 
				th.action(i)
			})
		}
		
		//auto start
		if(th.defs.autoSlider) {
			th.autoroll()
		}
		
		//OnHover
		th.t.hover(function() {
		  $(this).addClass('fs-hover')
			if(defs.pauseOnHover) th.pause = true
		},function() {
		  $(this).removeClass('fs-hover')
			if(defs.pauseOnHover) th.pause = false
		})
  	}
	
	FS.prototype = {
		action: function(index) {
			var th = this
			,defs = th.defs
			,speed = defs.speed
			,c = th.currentPage
			,ss = th.ss
			,cp = ss.eq(c).show()
			,cds = th.t.find('.fs-dot')
			,ip = ss.eq(index).css('z-index', defs.zIndex + 1).fadeTo(0,0)
			cds.eq(c).addClass('fs-on').siblings().removeClass('fs-on')
			ip.fadeTo(speed, 1, function() {
				ip.css('z-index', defs.zIndex + 2)
			})
			$.isFunction(th.defs.beforeAction) && th.defs.beforeAction.call(th)
			cp.fadeTo(speed, 0, function() {
				cp.css('z-index', defs.zIndex)
				th.currentPage = index
				cds.eq(th.currentPage).addClass('fs-on').siblings().removeClass('fs-on')
				th.onAction = false
				$.isFunction(th.defs.afterAction) && th.defs.afterAction.call(th)
				if(defs.autoSlider) {
					clearTimeout(th.flag)
					th.flag = setTimeout(function() {
						th.autoroll()
					}, defs.timer)
				}
			})
		}
		,autoroll: function() {
			var t = this
			if(!t.onAction && !t.pause) {
				t.onAction = true
				var i = (t.currentPage + 1 + t.len) % t.len
				t.action(i)
			}
			else {
				clearTimeout(t.flag)
				t.flag = setTimeout(function() {
					t.autoroll()
				}, t.defs.timer)
			}
		}
		,destroy: function() {
			var t = this
			clearTimeout(t.flag)
			t.ss.unwrap()
			t.t.off( 'click', '**' ).removeAttr('style').children('.fs-nav').remove()
			t.t.children('.fs-dots').remove()
			t.t.children('.fade-slide').removeAttr('style').removeClass('fade-slide')
			$.each( t, function( key, value ) {
				delete t[key]
			})
		}
		
	}
	
	//jquery plugin
	$.fn.fadeSlider = function(opts) {
		return new FS(opts, this)
    }
})(jQuery)
 