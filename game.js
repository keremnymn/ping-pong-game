(function () {
    let enterPressed = 0;
    let paused = false;
    const restartEvent = new Event('restart');
    let restartCount = 0;
    let choice = 0;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';    

    document.head.appendChild(script);
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
            cursor: 'pointer',
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
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
        },
        stick2: {
            right: 0,
            background: '#d3ffce',
            top: 150
        },
        stick1: {
            left: 0,
            background: '#C6A62F',
            top: 150
        },
        startText: {
            color: 'white',
            marginTop: '20%',
            fontFamily: 'Verdana,Charcoal,sans-serif',
            zIndex: '1090'
        },
        firstDiv: {
            textAlign: 'center',
            opacity: '0%',
            marginTop: '-20%',
            marginLeft: '15%',
            marginRight: '15%',
            fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
            fontSize: 'large',
            color: 'white',
            zIndex: 1,
        },
        secondDiv: {
            marginTop: '-30px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 'x-large'
        },
        textDiv: {
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
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
    function scoreTable() {
        let firstDiv = document.createElement('div')
        firstDiv.className = 'first-div'
        firstDiv.id = 'score-table'
        let secondDiv = document.createElement('div')
        secondDiv.className = 'second-div'
        let title = document.createElement('h2')
        title.innerHTML = 'Score'
        let firstScore = document.createElement('h3')
        firstScore.innerHTML = CONSTS.score1
        let secondScore = document.createElement('h3')
        secondScore.innerHTML = CONSTS.score2
        secondDiv.append(firstScore, secondScore)
        firstDiv.appendChild(title)
        $(secondDiv).css(CSS.secondDiv).appendTo(firstDiv);
        return firstDiv
    }
    function drawTable() {
        let tables = document.getElementsByClassName('first-div')
        for (i=0; i < tables.length; i++) {
            tables[i].remove()
        }
        let table = scoreTable()
        $(table).css(CSS.firstDiv).appendTo('#pong-game');
        document.getElementById('pong-game').appendChild(table)
    }
    function start() {
        draw();
        drawTable();
        setEvents();
        roll(isNew=true);
        loop();
    }
    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick)).appendTo('#pong-game')
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick)).appendTo('#pong-game')
        $('<div/>', {id: 'text-div'}).css(CSS.textDiv).appendTo('#pong-game')
        $('<h1/>', {id: 'start-text'}).css(CSS.startText)
                                    .html('<p style="text-align: center;">Press 1 and enter for singleplayer<br>Press 2 and enter for multiplayer</p>')
                                    .appendTo('#text-div')
    }

    function moveSliders(keyCode) {
        if (keyCode == 87) {
            CONSTS.stick1Speed = -15;
        }
        else if (keyCode == 83) {
            CONSTS.stick1Speed = 15;
        }
        else if (keyCode == 38 && choice == 1) {
            CONSTS.stick2Speed = -15;
        }
        else if (keyCode == 40 && choice == 1) {
            CONSTS.stick2Speed = 15;
        }
    }
    function manipulateScores() {
        if (CSS.ball.left < CSS.arena.width / 2) {
            CONSTS.score2 += 1
        }
        else {
            CONSTS.score1 += 1
        }
        drawTable()
    }
    function gameOver(msg) {
        freeze()
        CSS.firstDiv.opacity = '0%'
        let _msg = '<p style="text-align: center; z-index: 1080;" id="restart-game">' + msg + '<br>Click here to restart</p>'
        $('#start-text').html(_msg)
        $('#restart-game').click(()=> {
            CSS.firstDiv.opacity = '60%'
            document.getElementById('pong-game').remove()
            CONSTS.score1 = 0;
            CONSTS.score2 = 0;
            paused = false;
            enterPressed = 0;
            restartCount = 0;
            choice = 0;
            draw();
            drawTable();
            roll(isNew=true);
        })
    }

    function setEvents() {
        $(document).on('restart', ()=> {
            if (CONSTS.score2 >= 4) {
                if (choice == 0) {
                    gameOver("You've lost")
                }
                else {
                    confetti({zIndex: 1051})
                    gameOver("Player 2 won.")
                }
            }
            else if (CONSTS.score1 >= 4) {
                if (choice == 0) {
                    confetti({zIndex: 1051})
                    gameOver("You've win!")
                }
                else {
                    confetti({zIndex: 1051})
                    gameOver("Player 1 won.")
                }
            }
            else {
                manipulateScores()
            }
        })
        $(document).on('keydown', function (e) {
            if (e.keyCode == 13) {
                $('#start-text').html(null)
                enterPressed += 1
                CSS.firstDiv.opacity = '60%'
                roll(isNew=true);
            }
            if (e.keyCode == 50) {
                choice = 1;
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
            let stick2keys = [38, 40]
            if (stick1keys.includes(e.keyCode)) {
                CONSTS.stick1Speed = 0
            }
            else if (choice == 1 && stick2keys.includes(e.keyCode)) {
                CONSTS.stick2Speed = 0
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
        let luck = randomIntFromInterval(20, 100) / 100
        CSS.stick2.top = clamp(CSS.ball.top + CONSTS.stick2Speed * luck, 0, CSS.arena.height - CSS.stick1.height)
        $('#stick-2').css('top', CSS.stick2.top)
    }
    function freeze() {
        paused = true;
        CONSTS.stick2Speed = 0
        CONSTS.stick1Speed = 0
        CONSTS.ballLeftSpeed = 0
        CONSTS.ballTopSpeed = 0
        CONSTS.gameSpeed = 0
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
            freeze();
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
            CSS.stick1.top = clamp(CSS.stick1.top + CONSTS.stick1Speed, 0, CSS.arena.height - CSS.stick.height)
            $('#stick-1').css('top', CSS.stick1.top);
            if (choice == 1) {
                CSS.stick2.top = clamp(CSS.stick2.top + CONSTS.stick2Speed, 0, CSS.arena.height - CSS.stick.height)
                $('#stick-2').css('top', CSS.stick2.top);
            }
            if (paused) {
                //pass
            }
            else if (enterPressed) {
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
            let onLeft = CSS.ball.left <= CSS.arena.width / 2 ? true : false
            let currentStick = onLeft ? CSS.stick1 : CSS.stick2
            if (CSS.ball.left <= CSS.stick.width || CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
            	CSS.ball.top > currentStick.top && CSS.ball.top < currentStick.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll(isNew=false);
            }
            if (onLeft == true) {
                if (CSS.ball.left - CSS.ball.width > CSS.arena.width - CSS.stick.width) {
                    roll(isNew=false);
                }
            }
            else if (onLeft == false) {
                if (CSS.ball.left < CSS.stick.width) {
                    roll(isNew=false);
                }
            }
            if (choice == 0) {
                stick2AI()
            }
        }, CONSTS.gameSpeed);
    }

    function roll(isNew) {
        if (! isNew) {
            restartCount += 1
        }
        if (restartCount > 0) {
            document.dispatchEvent(restartEvent);
        }
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