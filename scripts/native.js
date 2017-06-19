document.addEventListener("DOMContentLoaded",function (event) {
  
  var width 	= document.getElementById("slide-container").offsetWidth;
  var slides 	= document.getElementById("slides");
  var slidesLi 	= slides.getElementsByTagName("li");
  var btnPrev 	= document.getElementById("btnPrev");
  var btnNext 	= document.getElementById("btnNext");
  var dots 		= document.getElementById("dots");
  var dotsLi 	= dots.getElementsByTagName("li");

  //установим слайдам ширину окна для слайдов
  Array.prototype.forEach.call(slidesLi, function(slide, index) {
    slide.style.width = "" + width +"px";
	
	// создадим для каждого слайда точку	
	var newDot = document.createElement('li');
	newDot.setAttribute("data-number", slide.getAttribute("data-number"));
	newDot.onclick = dotClick;
	dots.appendChild(newDot);
  });// forEach

  // вычислим ширину слайда с внешними и внутренними отступами и границами
  var element = slidesLi[0];
  var elemStyle = element.currentStyle || window.getComputedStyle(element),
      elemWidth = element.offsetWidth,
      margin    = parseFloat(elemStyle.marginLeft) + parseFloat(elemStyle.marginRight),
      padding   = parseFloat(elemStyle.paddingLeft) + parseFloat(elemStyle.paddingRight),
      border    = parseFloat(elemStyle.borderLeftWidth) + parseFloat(elemStyle.borderRightWidth);

  var elemFullWidth = elemWidth + margin - padding + border;
  // сделаем контейнер слайдов такой ширины, чтобы все слайды поместились в строку
  slides.style.width = "" + (elemFullWidth * slidesLi.length) +"px";

  // поместим последний слайд перед первым
  slides.insertBefore(slides.lastElementChild,slides.firstElementChild);

  // сместим слайды на 1 влево, чтобы первый слайд был в окне
  slides.style.left = ""+(-elemFullWidth) + "px";
  
  markDotSlide();
  
  var animationOn = false;
  
  btnNext.onclick = function () {
	moveSlide(-1);
  } //nextSlide

  btnPrev.onclick = function () {
	moveSlide();
  } // prevSlide

  function moveSlide(vector = 1, numOfSlides = 1){
	
	if(!animationOn){
		var delay 		= 25;
		var step  		= elemFullWidth*numOfSlides / delay;
		var progress 	= 0;
		
		animationOn = true;
		var timer = setInterval(function() {		  		  
		  
		  // обработка конца анимации
		  if (progress >= elemFullWidth*numOfSlides) {
			clearInterval(timer); 

			for (var i = 1; i <= numOfSlides; i++){
				if(vector == -1){
					// первый элемент, который за кадром, перекинем в конец
					slides.appendChild(slides.firstElementChild);
				}else{
					// последний слайд перекинем в начало
					slides.insertBefore(slides.lastElementChild,slides.firstElementChild);
				}
				
				// сдвинем контейнер слайдов назад, чтобы не было перескоков
				slides.style.marginLeft = "0px";				
			} //for
			
			// анимация завершена
			animationOn = false;
			
			// отметим точку
			markDotSlide();			
			
			return;
		  }

		  draw(vector*progress);
		  progress += step;

		}, delay); // setinterval
    } // if animationOn
	
  }//moveSlide
  
  function draw(progress) {
    slides.style.marginLeft = "" + progress + 'px';
  }
  
  function markDotSlide(){
	// найдем и отметим точку слайда	
	var slideNumber = slidesLi[1].getAttribute("data-number");
	var activeDot = document.querySelector('#dots li[data-number="'+slideNumber+'"]');
			
	//предварительно удалим класс active  всех точек
	Array.prototype.forEach.call(dotsLi, function(slide, index) {
		slide.classList.remove("active");				
	});
			
	// добавим класс active нужной точке
	activeDot.classList.add("active");
	
  }// markDotSlide
  
  function dotClick(){

  // определим номер слайда по точке
	var slideNumber = this.getAttribute("data-number");

	// найдем слайд и его индекс в массиве слайдов
	var targetSlide = document.querySelector('#slides li[data-number="'+slideNumber+'"]');
	var index = Array.prototype.indexOf.call(slidesLi,targetSlide);
	
	// поймем слева или справа от кадра находится слайд
	// и двиганем как ближе
	if(index >1){
		moveSlide(-1,index-1);
	}else if(index < 1){
		moveSlide();
	}
	
  } //dotClick
  
});
