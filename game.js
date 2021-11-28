(function () {
    let enterPressed = 0;
    let paused = false;
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)',
            cursor: 'none'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick2: {
            right: 0,
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#d3ffce',
            top: 150
        },
        stick1: {
            left: 0,
            width: 12,
            height: 85,
            background: '#C6A62F',
            position: 'absolute',
            top: 150
        },
        startText: {
            position: 'absolute',
            top: '30%',
            left: '30%',
            color: 'white',
            display: 'inline',
            fontFamily: 'Verdana,Charcoal,sans-serif'
        }
    };

    var CONSTS = {
    	gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0
    };

    function start() {
        draw();
        setEvents();
        roll();
        loop();
    }
    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css(CSS.stick1).appendTo('#pong-game')
        $('<div/>', {id: 'stick-2'}).css(CSS.stick2).appendTo('#pong-game')
        $('<h1/>', {id: 'start-text'}).css(CSS.startText)
                                    .html('Press Enter to start')
                                    .appendTo('#pong-game')
        .appendTo('#pong-game');
    }

    function moveSliders(keyCode) {
        switch (keyCode) {
            case 87:
                CONSTS.stick1Speed = -15;
                break;
            case 83:
                CONSTS.stick1Speed = 15;
                break;
        }
    }

    function setEvents() {
        $(document).on('keydown', function (e) {
            if (e.keyCode == 13) {
                $('#start-text').html(null)
                enterPressed += 1
                roll();
            }
            if (enterPressed == 1) {
                if (e.keyCode == 80) {
                    pause()
                }
                else if (!paused) {
                    moveSliders(e.keyCode)
                }
            }
        });

        $(document).on('keyup', function (e) {
            let stick1keys = [87, 83]
            if (stick1keys.includes(e.keyCode)) {
                CONSTS.stick1Speed = 0
            }
        });
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
    
    function stick2AI() {
        if (enterPressed == 0) {
            CONSTS.stick2Speed = 0
            CSS.stick2.top = 150
        }
        else if (CSS.ball.top == CSS.stick2.top / 2 || paused) {
            CONSTS.stick2Speed = 0
        }
        else {
            CONSTS.stick2Speed = clamp(CONSTS.stick2Speed - 15, -15, 15)
        }
        let luck = randomIntFromInterval(35, 100) / 100
        CSS.stick2.top = clamp(CSS.ball.top + CONSTS.stick2Speed * luck, 0, CSS.arena.height - CSS.stick1.height)
        $('#stick-2').css('top', CSS.stick2.top)
    }
    function pause() {
        let state;
        if (!paused) {
            state = {
                'stick2Speed': CONSTS.stick2Speed,
                'stick1Speed': CONSTS.stick1Speed,
                'ballLeftSpeed': CONSTS.ballLeftSpeed,
                'ballTopSpeed': CONSTS.ballTopSpeed
            }
            localStorage.setItem('paused', JSON.stringify(state))
            paused = true;
            CONSTS.stick2Speed = 0
            CONSTS.stick1Speed = 0
            CONSTS.ballLeftSpeed = 0
            CONSTS.ballTopSpeed = 0
            CONSTS.gameSpeed = 0
            $('#start-text').html('Paused')
        }
        else {
            let state = JSON.parse(localStorage.getItem('paused'))
            paused = false;
            CONSTS.stick2Speed = state['stick2Speed']
            CONSTS.ballLeftSpeed = state['ballLeftSpeed']
            CONSTS.ballTopSpeed = state['ballTopSpeed']
            CONSTS.gameSpeed = 20
            $('#start-text').html(null)
        }
    }
    function loop() {
        window.pongLoop = setInterval(function () { 
            CSS.stick1.top = clamp(CSS.stick1.top + CONSTS.stick1Speed, 0, CSS.arena.height - CSS.stick1.height)
            $('#stick-1').css('top', CSS.stick1.top);

            if (enterPressed) {
                CSS.ball.top += CONSTS.ballTopSpeed;
                CSS.ball.left += CONSTS.ballLeftSpeed;
            }
            else {
                CSS.ball.left = 110;
            }

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }

            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            if (CSS.ball.left <= 12) {
            	CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick1.height && (CONSTS.ballLeftSpeed *= - 1) || roll();
            }

            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - 12) {
                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick2.height && (CONSTS.ballLeftSpeed *= -1) || roll();
            }
            stick2AI()
        }, CONSTS.gameSpeed);
    }

    function roll() {
        CSS.ball.top = 300;
        CSS.ball.left = 450;
        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 9;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 9);
    }

    start();
})();