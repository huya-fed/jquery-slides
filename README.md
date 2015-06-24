jQuery幻灯片插件
=========

> 简介：
> 
> Slides – 是一个简单的，容易定制和风格化，的jQuery幻灯片插件。
> 
> Slides提供褪色或幻灯片过渡效果，图像淡入淡出，图像预压，自动生成分页，循环，自动播放的自定义等很多选项。
> 
> 用Slides插件，你可以随机播放幻灯片，设定那一套您想要开始幻灯片。
> 
> 本插件是通过http://slidesjs.com/改造而成的。


----------

##基本的HTML结构


	<div id="slides">
	    <div>
	      <h1>Slide 1</h1>
	      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
	    </div>
	    <div>
	      <h1>Slide 2</h1>
	      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
	    </div>
	    <div>
	      <h1>Slide 3</h1>
	      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
	    </div>
	    <div>
	      <h1>Slide 4</h1>
	      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
	    </div>
	</div>

##基本CSS代码
	#slides {
		width:470px;
	}


##使用

	require('jquery-slides');

	$("#slides").slidesjs({
	    width: 470,
	    height: 170
	});

##参数

###width (number) & height (number)
	//设置宽和高
	$("#slides").slidesjs({
		width: 700,
		height: 393
	});

###start (number)
	//从第几页开始
	$("#slides").slidesjs({
    	start: 3
  	});

###navigation (object)
	 //上一页、下一页
	 $("#slides").slidesjs({
	    navigation: {
	      active: true,
	        // [boolean] Generates next and previous buttons.
	        // You can set to false and use your own buttons.
	        // User defined buttons must have the following:
	        // previous button: class="slidesjs-previous slidesjs-navigation"
	        // next button: class="slidesjs-next slidesjs-navigation"
	      effect: "slide"
	        // [string] Can be either "slide" or "fade".
	    }
	  });

###pagination (object)
	//页码
	$("#slides").slidesjs({
	    pagination: {
	      active: true,
	        // [boolean] Create pagination items.
	        // You cannot use your own pagination. Sorry.
	      effect: "slide"
	        // [string] Can be either "slide" or "fade".
	    }
	  });

###play (object)
	//设置开始和暂停按钮
	 $("#slides").slidesjs({
	    play: {
	      active: true,
	        // [boolean] Generate the play and stop buttons.
	        // You cannot use your own buttons. Sorry.
	      effect: "slide",
	        // [string] Can be either "slide" or "fade".
	      interval: 5000,
	        // [number] Time spent on each slide in milliseconds.
	      auto: false,
	        // [boolean] Start playing the slideshow on load.
	      swap: true,
	        // [boolean] show/hide stop and play buttons
	      pauseOnHover: false,
	        // [boolean] pause a playing slideshow on hover
	      restartDelay: 2500
	        // [number] restart delay on inactive slideshow
	    }
	  });

###effect (object)
	//效果参数
	$("#slides").slidesjs({
	    effect: {
	      slide: {
	        // Slide effect settings.
	        speed: 200
	          // [number] Speed in milliseconds of the slide animation.
	      },
	      fade: {
	        speed: 300,
	          // [number] Speed in milliseconds of the fade animation.
	        crossfade: true
	          // [boolean] Cross-fade the transition.
	      }
	    }
	  });

###callback (function)

	$("#slides").slidesjs({
	    callback: {
	      loaded: function(number) {
	        // Do something awesome!
	        // Passes start slide number
	      },
	      start: function(number) {
	        // Do something awesome!
	        // Passes slide number at start of animation
	      },
	      complete: function(number) {
	        // Do something awesome!
	        // Passes slide number at end of animation
	      }
	    }
	  });