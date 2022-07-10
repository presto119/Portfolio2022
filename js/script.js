
$(document).ready(function(){
    function resizeEvt(){
        var $win_width = $(window).width();
        console.log($win_width);
        if($win_width > 767){
            $("body").addClass("pc")
        }else{
            $("body").removeClass("pc");
        }    

        const $pc = $("body").hasClass("pc");
        if($pc){
        
            //Full Page Slider - mousewheel() 이벤트
            //mousewheel() 이벤트 : 크롬, 익스엣지, 사파리, 오페라
            //DOMMouseScroll() 이벤트: 파이어폭스 

            var elm = ".box";  //각 섹션을 지목할 클래스명을 저장
            $(elm).each(function(index){  //index = 0 -> 1 -> 2 -> 3 -> 4 -> 5 ->6
                //개별 섹션으로 접근하여 이벤트를 발생시킴

            

                $(this).on("mousewheel DOMMouseScroll", function(e){
                    //e.preventDefault();
                    console.log("마우스 휠 이벤트 발생");
                    //console.log(e);
                    //console.log(e.originalEvent.wheelDelta);
                    //console.log(e.originalEvent.detail);
                    console.log(event.wheelDelta);  //크롬, 익스엣지
                    console.log(event.detail);  //파이어폭스
                    //크롬 브라우저에서는 마우스 휠을 내렸을 때, event.wheelDelta : -120
                    //크롬 브라우저에서는 마우스 휠을 올렸을 때, event.wheelDelta : 120
                    //파이어폭스 브라우저에서는 마우스 휠을 내렸을 때, event.detail : 3
                    //파이어폭스 브라우저에서는 마우스 휠을 올렸을 때, event.detail : -3

                    var delta = 0;

                    if(event.wheelDelta){
                        //크롬, 익스엣지, 사파리, 오페라
                        //console.log("wheelDelta 값 발생");
                        delta = event.wheelDelta / 120;
                        //크롬 기준으로 휠을 내렸을 때, delta = -120 / 120 = -1 ==> 음수
                        //크롬 기준으로 휠을 올렸을 때, delta = 120 / 120 = 1 ==> 양수
                        if(window.opera){ //오페라 브라우저(내렸을 때 120 / 올렸을 때 -120)에서는 크롬에서 가져오는 값과 반대
                            delta = -delta;  //크롬 브라우저와 오페라 브라우저의 최종 값을 동일하게 맞춰준다.
                        }
                    }else if(event.detail){
                        //파이어폭스
                        //console.log("detail 값 발생");
                        delta = -event.detail/3;
                        //파이어폭스 기준으로 휠을 내렸을 때, delta = -(3) / 3 = -1 ==> 음  수
                        //파이어폭스 기준으로 휠을 올렸을 때, delta = -(-3) / 3 = 1 ==> 양수
                    }
                    console.log(delta);  //마우스 휠을 내렸을 때 -1 / 마우스 휠을 올렸을 때 1

                    //delta 값이 음수 일때 => 휠을 내린다. => 다음 섹션(현재 보여지는 화면보다 아래에 위치)이 나와야 함
                    //delta 값이 양수 일때 => 휠을 올린다. => 이전 섹션(현재 보여지는 화면보다 위에 위치)이 나와야 함

                    var moveTo = $(window).scrollTop();  //각 섹션별로 상단으로부터 이격된 절대위치를 파악함
                    var elmIndex = $(elm).eq(index);  //각 섹션별로 순차적으로 접근을 시키는 선택자를 설정
                    console.log(elmIndex);  //마우스 휠 이벤트가 발생한 장소에 대한 객체를 지목

                    if(delta < 0){
                        //console.log("마우스 휠을 내렸다");
                        try{
                            if($(elmIndex).next() != undefined){  //마우스 휠을 내리는 시점에서 다음 섹션이 존재한다면
                                moveTo = $(elmIndex).next().offset().top;  //다음 섹션의 상단 위치의 수직방향 절대 위치값

                                $(elm).removeClass("active");
                                $(elmIndex).next().addClass("active");

                                var $cur_index = $(".box.active").index();
                                console.log($cur_index);
                                $("header li").removeClass("active")
                                $("header li").eq($cur_index).addClass("active");
                            }
                        }catch(error){
                            //console.log(error);
                        }

                    }else if(delta > 0){
                        //console.log("마우스 휠을 올렸다");
                        try{
                            if($(elmIndex).prev() != undefined){
                                moveTo = $(elmIndex).prev().offset().top;  //이전 섹션의 상단 위치의 수직방향 절대 위치값

                                $(elm).removeClass("active");
                                $(elmIndex).prev().addClass("active");

                                var $cur_index = $(".box.active").index();
                                console.log($cur_index);
                                $("header li").removeClass("active")
                                $("header li").eq($cur_index).addClass("active");
                            }
                        }catch(error){
                            //console.log(error);
                        }
                    }
                    $("html, body").stop().animate({scrollTop : moveTo + "px"}, 200);

                });


            });

            //try{ ...실행문... }catch(err){} : 실행문을 시도하고 나머지 에러 발생요인은 catch에서 잡아준다. ==> 에러 발생을 강제로 막을 수 있음

            //상단 메뉴 클릭시 해당하는 페이지로 이동(+ section.box에 존재한 active라는 클래스 위치도 변경한다.)
            $("header li").click(function(){
                var $index = $(this).index();

                $("header li").removeClass("active");
                $(this).addClass("active");

                $(".box").removeClass("active");
                $(".box").eq($index).addClass("active");

                $("html, body").stop().animate({scrollTop : $(".box").eq($index).offset().top}, 1000);

                return false;
            });

            //키보드를 통해서 fullpage slider를 제어
            //$(선택자).이벤트명(function(){실행문}); ==> 기존에 완성이 종료된 시점에서 접근시 사용 => 이벤트에 관련한 실행문에 대한 메모리값(실행문)을 브라우저가 로딩시 저장(실행문의 먼저 로딩)
            //$(document).on("이벤트명", "선택자", function(){실행문}); ==> 기존에 구조의 존재여부에 상관없이 이벤트가 발생되는 시점까지 무조건 기다린다. (문서객체 구조상에서) => 이벤트 관련 실행에 대한 메모리값(실행문)을 이벤트가 발생되는 시점에서 저장을 한다.(실행문의 이후 로딩)

            //키보드 keyCode 값
            //상방향 : 38 / PageUp : 33
            //하방향 : 40 / PageDown : 34
            //Home : 36 / End : 35

            var key_num = 0;

            $(document).on("keydown", function(evt){
                //console.log(evt);
                console.log(evt.keyCode);  //숫자형 데이터
                key_num = evt.keyCode;

                var $target = $(".box.active").index();
                console.log($target);  //최종적으로 .active가 들어간 곳을 찾는 것이 아닌 키보드 이벤트가 발생한 시점에서 .active라는 클래스명이 들어간 곳의 인덱스 번호를 추출


                if(key_num == 40 || key_num == 34){  //하방향키 또는 PageDown키 눌렀을 때 ==> 현재 위치 기준으로부터 아래에 위치한 섹션이 올라온다.
                    if($target == $(".box").length - 1){  //키보드 이벤트가 발생한 장소의 인덱스번호가 섹션들의 마지막 인덱스번호와 일치한다면
                        //더이상 내려갈 곳이 없음
                    }else{
                        $("html, body").stop().animate({scrollTop : $(".box").eq($target + 1).offset().top}, 200);  //다음 섹션으로 이동을 시킨다.
                        $(".box").removeClass("active");  //전체 .box라는 섹션에 .active라는 클래스명을 제거한다.
                        $(".box").eq($target + 1).addClass("active");  //이동된 섹션에 .active라는 클래스를 추가한다. (사용자의 연속성을 위해 도구로 구성을 한다.)
                        $("header li").removeClass("active");  //전체 헤더의 메뉴 리스트에서 노란색글씨를 본래 색상인 흰색으로 돌려준다.
                        $("header li").eq($target + 1).addClass("active"); //이동 섹션과 매칭되는 리스트에만 노란색 글씨로 표현한다.
                    }
                }else if(key_num == 38 || key_num == 33){  //상방향키 또는 PageUp키 눌렀을 때 ==> 현재 위치 기준으로부터 위에 위치한 섹션이 내려온다.
                    if($target == 0){

                    }else{
                        $("html, body").stop().animate({scrollTop : $(".box").eq($target - 1).offset().top}, 200);
                        $(".box").removeClass("active");
                        $(".box").eq($target - 1).addClass("active");
                        $("header li").removeClass("active");
                        $("header li").eq($target - 1).addClass("active");
                    }
                }else if(key_num == 36){ //"Home" 키보드를 눌렀을 때
                    $("html, body").stop().animate({scrollTop : $(".box").first().offset().top}, 200);
                    $(".box").removeClass("active");
                    $(".box").first().addClass("active");
                    $("header li").removeClass("active");
                    $("header li").first().addClass("active");
                }else if(key_num == 35){ //"End" 키보드를 눌렀을 때
                    $("html, body").stop().animate({scrollTop : $(".box").last().offset().top}, 200);
                    $(".box").removeClass("active");
                    $(".box").last().addClass("active");
                    $("header li").removeClass("active");
                    $("header li").last().addClass("active");
                }
            }); //...키보드 이벤트 종료


            //모바일 환경하에서 터치기반(touch 이벤트) : touchstart(최초로 화면을 누른 시점에서 발생하는 이벤트), touchend(누른 후 드래그 이후 손가락을 화면에서 떼는 시점에서 발생하는 이벤트)
            var $t_start;  //최초로 터치한 Y 축의 값
            var $t_end;  //드래그 이후 언터치한 Y 축의 값
            var $t_move;  //$t_start에서 $t_end로 이동한 값을 계산

            function prev(){
                var $target = $(".box.active").index();
                if($target != 0){  //하단 방향으로 터치를 내리는과정에서 첫번째 인덱스 위치가 아니라면
                    $("html, body").stop().animate({scrollTop : $(".box").eq($target - 1).offset().top}, 500, function(){
                        $(".box").removeClass("active");
                        $(".box").eq($target - 1).addClass("active");
                        $("header li").removeClass("active");
                        $("header li").eq($target - 1).addClass("active");
                    });
                }
            }

            function next(){
                var $target = $(".box.active").index();
                if($target != $(".box").length - 1){  //상단 방향으로 터치를 올리는과정에서 마지막 인덱스 위치가 아니라면
                    $("html, body").stop().animate({scrollTop : $(".box").eq($target + 1).offset().top}, 500, function(){
                        $(".box").removeClass("active");
                        $(".box").eq($target + 1).addClass("active");
                        $("header li").removeClass("active");
                        $("header li").eq($target + 1).addClass("active");
                    });

                }
            }


            function touchmove(){
                $t_move = $t_start - $t_end;
                console.log($t_move);
                //터치의 이동방향이 상단 방향이라면, 하단의 컨텐츠가 나와야 함 : 양수
                //터치의 이동방향이 하단 방향이라면, 상단의 컨텐츠가 나와야 함 : 음수
                if($t_move > 10){  //터치의 이동방향이 상단 방향이라면, 하단의 컨텐츠가 나와야 함 : 양수
                    next();
                }else if($t_move < -10){  //터치의 이동방향이 하단 방향이라면, 상단의 컨텐츠가 나와야 함 : 음수
                    prev();
                }
            }


            $(".box").on("touchstart", function(evt){
                //console.log("터치의 시작");
                //console.log(evt);
                console.log(evt.changedTouches[0].clientY);
                $t_start = evt.changedTouches[0].clientY;
            });
            $(".box").on("touchend", function(evt){
                //console.log("터치의 종료");
                //console.log(evt);
                console.log(evt.changedTouches[0].clientY);
                $t_end = evt.changedTouches[0].clientY;

                touchmove();  //최초로 터치한 좌표와 마지막으로 터치를 종료한 좌표가 존재해야 터치의 방향이 위인지 또는 아래인지를 알 수가 있음
            });




            //PC 환경하에서는 마우스기반(mouse 이벤트) : mousedown(최초로 화면에서 클릭하여 누른 시점에서 발생하는 이벤트), mouseup(마우스 클릭이 풀리는 시점에서 발생하는 이벤트)
            
            var $m_down;  //마우스로 클릭했을 시점에서 y축의 좌표 값을 저장한다.
            var $m_up;    //마우스로 클릭 해제 시점에서 y축의 좌표 값을 저장한다.
            var $m_move;  //$m_down의 값과 $m_up의 값을 계산하여 이동 방향을 추정한다.

            function mousemove(){
                $m_move = $m_down - $m_up;
                console.log($m_move);
                //클릭 후의 이동방향이 상단 방향이라면, 하단의 컨텐츠가 나와야 함 : 양수
                //클릭 후의 이동방향이 하단 방향이라면, 상단의 컨텐츠가 나와야 함 : 음수
                if($m_move > 20){
                    next();
                }else if($m_move < -20){
                    prev();
                }
            }

            $(".box").on("mousedown", function(evt){
                console.log("마우스다운");
                console.log(evt);
                console.log(evt.clientY);
                $m_down = evt.clientY;
            });
            $(".box").on("mouseup", function(evt){
                console.log("마우스업");
                console.log(evt.clientY);
                $m_up = evt.clientY;
                mousemove();
            });

        }else{
            $(".introBtn").click(function(){
                $("html, body").animate({scrollTop : $("main .intro").offset().top}, 1000);
                return false;
            })
            $(".aboutBtn").click(function(){
                $("html, body").animate({scrollTop : $("main .about").offset().top}, 1000);
                return false;
            })
            $(".skillsBtn").click(function(){
                $("html, body").animate({scrollTop : $("main .skills").offset().top}, 1000);
                return false;
            })
            $(".portfolioBtn").click(function(){
                $("html, body").animate({scrollTop : $("main .portfolio").offset().top}, 1000);
                return false;
            })
            $(".contactBtn").click(function(){
                $("html, body").animate({scrollTop : $("main .contactMe").offset().top}, 1000);
                return false;
            })

            /*header-반응형*/
            //반응형메뉴 리스트 클릭시
            const $body = document.querySelector("body");
            const $menu = document.querySelector("header .menu");
            const $resBtn = document.querySelector("header .menu_btn");
            const menuList = () => {

                const $menuList = document.querySelectorAll("header .menu.active li");
                for(const v of $menuList){
                    console.log(v);
                    v.addEventListener("click", () => {
                        $menu.classList.remove("active");
                        $resBtn.classList.remove("active");
                        $body.classList.remove("showMenu");
                    });
                }

                const $logo = document.querySelector("body.showMenu header .logo");
                $logo.addEventListener("click", () => {
                    $menu.classList.remove("active");
                    $resBtn.classList.remove("active");
                    $body.classList.remove("showMenu");
                });
            }


            //반응형메뉴 클릭시
            $resBtn.addEventListener("click", function(){
                console.log("클릭 이벤트");
                const $active_resBtn = $resBtn.classList.contains("active");
                console.log($active_resBtn);
                if(!$active_resBtn){
                    $menu.classList.add("active");
                    $resBtn.classList.add("active");
                    $body.classList.add("showMenu");
                    menuList();
                }else{
                    $menu.classList.remove("active");
                    $resBtn.classList.remove("active");
                    $body.classList.remove("showMenu");
                }
            });


            
        }


    }//resizeEvt() 함수 종료

    resizeEvt();

    $(window).resize(function(){
        setTimeout(function(){
            resizeEvt();
        }, 10)
        
    });

});


/*skills*/
$(document).ready(function(){
    //stroke-dashoffset: calc(440 - 440 * 95 / 100);

    var startCount = 0;

    $("#circle_bar .Cbox").each(function(index){
        //console.log(index);
        var sel_count = $(this).find(".count").attr("data-limit");
        console.log(sel_count);

        $(this).find("circle").css("stroke-dashoffset", `calc(440 - 440 * ${sel_count} / 100)`);

        var counter = setInterval(function(){
            if(startCount < sel_count){
                startCount++;
                console.log(startCount);
                $(".Cbox").eq(index).find(".count").text(startCount);
            }else if(startCount === sel_count){ 
                $(".Cbox").eq(index).find(".count").text(sel_count);
            }else{
                clearInterval(counter);
            }
        }, 50);
    });

});

/*portfolio*/
//구조를 구성하는 부분
//2차 배열의 패턴 (기준은 acticle)
//["구분(Dsign, Publishing, Develop(php, ajax등), App(날씨))","이미지","타이틀", ["소스마크1","소스마크2", "소스마크3", ...], "내용", "사이트 링크 주소"]

const portArr = [
    ["Publishing", "img_01.png", "Kuliner", ["html.png","css.png"], "HTML/CSS/구글맵 연동을 이용한 Kuliner Restaurant 사이트 제작", "https://presto119.github.io/kuliner/"],
    ["Publishing", "cakehouse.png", "Cakehouse", ["html.png","css.png"], "HTML/CSS/wow.js/구글맵 연동을 이용한 Cakehouse website renewal 디저트 사이트 제작", "https://presto119.github.io/CakeHouse/"],
    ["Publishing", "img_04.png", "Cashmere", ["html.png","css.png","jquery_transparent.png"], "HTML/CSS/jQuery를 이용한 Cashmere website renewal 의류 사이트 제작", "https://presto119.github.io/CASHMERE/"],
    //["Publishing", "img_03.png", "세종병원", ["html.png","css.png"], "HTML/CSS를 이용한 병원사이트 제작", "https://presto119.github.io/SejongHospital/"],
    ["Publishing", "img_05.png", "Aisle", ["html.png","css.png"], "HTML/CSS/wow.js를 이용한 웨딩사이트 제작", "https://presto119.github.io/Aisle/"],
    ["Publishing", "img_06.png", "B&O play", ["html.png","css.png"], "HTML/CSS를 이용한 제품 광고사이트", "https://presto119.github.io/B-O-play/"],
    ["Publishing", "img_07.png", "Origin", ["html.png","css.png","jquery_transparent.png"], "HTML/CSS/jQuery를 이용한 Portfolio사이트 제작", "https://presto119.github.io/origin/"],
    ["Publishing", "img_08.png", "InvestPlan", ["html.png","css.png", "jquery_transparent.png"], "HTML/CSS/jQuery를 이용한 투자회사 사이트 제작", "https://presto119.github.io/InvestPlan/"],
    ["App", "img_09.png", "weatherApp", ["html.png","css.png", "jquery_transparent.png"], "jQuery/ajax를 이용하여 실시간 날씨 앱 제작", "https://presto119.github.io/weatherApp/"],
    ["Develop", "img_10.png", "Battle of Jangsari", ["html.png","css.png","ajax_transparent.png"], "jQuery/ajax를 이용한 Battle of Jangsari 영화 사이트 제작","https://presto119.github.io/BattleOfJangsari/"],
    ["Publishing", "img_11.png", "musicBox", ["html.png","css.png", "js.png"], "HTML/CSS/Javascript를 이용한 MusicBox website 음악 재생 사이트 제작", "https://presto119.github.io/musicBox/"],
    ["Develop", "img_12.png", "Filmmakers", ["html.png","css.png","js.png", "Vuejs.png"], "Vue Component 기능을 이용한 오디션 사이트 제작", "https://presto119.github.io/audition/"],
    ["SAP", "national_geographic.png", "National Geographic", ["html.png","css.png","js.png", "Vuejs.png"], "Vue router기능을 이용한 National Geographic", "https://presto119.github.io/ngeo2022/"],
    ["Develop", "mychat.png", "My Chat", ["html.png","css.png", "js.png", "php.png"], "php를 이용한 채팅 앱 제작", "http://presto112.dothome.co.kr/chattingApp/"],
    ["Publishing", "img_15.png", "adAge", ["html.png","css.png","js.png"], "Javascript BOM을 이용한 광고사이트 제작", "https://presto119.github.io/adAge/"],
    ["Develop", "img_16.png", "OClass", ["html.png","css.png","js.png","jquery_transparent.png", "php.png"], "php를 이용한 클래스 사이트 제작", "http://presto112.dothome.co.kr/oclass/"],
    ["Publishing", "kangol.png", "KANGOL", ["html.png","css.png","js.png","jquery_transparent.png", "php.png"], "기획 디자인 퍼블리싱까지 개인작업으로 제작한 KANGOL 가방 판매 사이트", "https://presto119.github.io/KANGOL/"],
    
];

const circling = document.querySelector("#circling");

let iconList = ``;
let articleBox = ``;

portArr.forEach((v, i, a) => {
    iconList = ``;  //forEach문에서 초기화
    for(m of v[3]){
        iconList += `<li><img src="./img/${m}" alt=""></li>`;
    }
    console.log(`${i}번째 ${iconList}`);
    articleBox += `
    <article class="surface1" style="--i:${i+1}">
        <h1>${v[0]}</h1>
        <div class="inner">
            <div class="space">
                <div class="web_img" style = "background-image:url(./img/view/${v[1]})"></div>
                <div class="web_info">
                    <div class="top">
                        <h3>${v[2]}</h3>
                        <ul>
                            ${iconList}
                        </ul>
                    </div>
                    <div class="bottom">
                        <p>${v[4]}</p>
                        <div class="detail_btn">
                            <a href="${v[5]}" target="_blank">Detial More</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </article>
    `;
});

circling.innerHTML = articleBox;


//사용자에 의한 회전 일시정지
const articles = circling.querySelectorAll("article");
for(v of articles){
    console.log(v);

    v.addEventListener("mouseenter", () => {
        circling.style.animationPlayState = "paused";
        ctrlBtn.querySelector("img").setAttribute("src", "./img/play.svg")
    });

    v.addEventListener("mouseleave", () => {
        circling.style.animationPlayState = "running";
        ctrlBtn.querySelector("img").setAttribute("src", "./img/pause.svg")
    });
}


//사용자 버튼 클릭에 의한 일시 정지
const ctrlBtn = document.querySelector(".controlBtn");
ctrlBtn.addEventListener("click", () =>{
    const $active = ctrlBtn.classList.contains("active");
    if(!$active){
        ctrlBtn.classList.add("active");
        circling.style.animationPlayState = "paused";
        ctrlBtn.querySelector("img").setAttribute("src", "./img/play.svg")
    }else{
        ctrlBtn.classList.remove("active");
        circling.style.animationPlayState = "running";
        ctrlBtn.querySelector("img").setAttribute("src", "./img/pause.svg")
    }
});




/*contact*/
$(document).ready(function(){
    $(".typed").typed({
        strings: ["Thank you!", "감사합니다!"],
        typeSpeed: 200,
        loop: true,
    });
});
