






var game_area = document.getElementById("game-area");
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var speed = 10;
let title = document.getElementById('value');
let ball = document.getElementById('ball')
let left_door = document.getElementById("ldoor");
let right_door = document.getElementById("rdoor");


function GetDistanceBetweenTwoPoints(e1, e2) {
    let diff1 = Math.pow((e2.offsetLeft - e1.offsetLeft), 2);
    let diff2 = Math.pow((e2.offsetTop - e1.offsetTop), 2);

    return Math.sqrt(diff1 + diff2);
}

function IsCollided(element1, element2) {
    let c1 = element1.getBoundingClientRect();
    let c2 = element2.getBoundingClientRect();
    let r1 = (c1.right - c1.left) / 2;
    let r2 = (c2.right - c2.left) / 2;
    let x1 = c1.left + r1;
    let y1 = c1.top + r1;
    let x2 = c2.left + r2;
    let y2 = c2.top + r2;

    let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

    if (distance <= r1 + r2) {
        if (x1 >= c2.left && x1 <= c2.right && y1 >= c2.top && y1 <= c2.bottom) {
            return false; // The center of the ball is inside the player's boundaries
        }
        return true;
    }

    return false;
}

function MovePlayer(up, down, left, right, id, keys) {
    var player = document.getElementById(id);
    var position_x = player.offsetLeft;
    var position_y = player.offsetTop;
    var max_width = game_area.offsetWidth - player.offsetWidth - 5;
    var max_height = game_area.offsetHeight - player.offsetHeight - 5;


    keys[up] = false;
    keys[down] = false;
    keys[left] = false;
    keys[right] = false;

    document.addEventListener('keydown', function (event) {

        if (event.code === up) {
            keys[up] = true;
        }
        else if (event.code === down) {
            keys[down] = true;
        }
        else if (event.code === left) {
            keys[left] = true;
        }
        else if (event.code === right) {
            keys[right] = true;
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.code === up) {
            keys[up] = false;
        }
        else if (event.code === down) {
            keys[down] = false;
        }
        else if (event.code === left) {
            keys[left] = false;
        }
        else if (event.code === right) {
            keys[right] = false;
        }
    });

    setInterval(function () {

        let hasCollided = IsCollided(player, id === 'player1' ? player2 : player1);



        if (keys[up]) {
            if (position_y - speed > 0) {
                player.style.top = `${position_y -= speed}px`;


            }
        }
        else if (keys[down]) {
            if (position_y + speed < max_height) {
                player.style.top = `${position_y += speed}px`;
            }
        }


        if (keys[left]) {
            if (position_x - speed > 0) {
                player.style.left = `${position_x -= speed}px`;
            }
        }
        else if (keys[right]) {
            if (position_x + speed < max_width) {
                player.style.left = `${position_x += speed}px`;
            }
        }

    }, 50);
}

var ball_position_x = ball.offsetLeft;
var ball_position_y = ball.offsetTop;
var ball_max_width = game_area.offsetWidth - ball.offsetWidth - 5;
var ball_max_height = game_area.offsetHeight - ball.offsetHeight - 10;
var ball_direction_x = 1;
var ball_direction_y = 1;
var audio = new Audio("sounds\\soccerballkick-6770 (mp3cut.net).mp3");
var goal = new Audio("sounds\\goal.mp3")
var hasStarted = false;
var ball_speed = 3;
function MoveBall() {

    // Set the initial position of the ball to the center of the game area
    ball.style.left = `${(game_area.offsetWidth / 2) - (ball.offsetWidth / 2)}px`;
    ball.style.top = `${(game_area.offsetHeight / 2) - (ball.offsetHeight / 2)}px`;

    setInterval(function () {
        // Check if the ball collides with player 1 or player 2
        if (IsCollided(ball, player1) || IsCollided(ball, player2)) {
            // Calculate the angle of incidence
            var angle = GetCollisionAngle(ball, IsCollided(ball, player1) ? player1 : player2);

            // Calculate the new horizontal and vertical directions
            ball_direction_x = Math.cos(angle) * ball_speed;
            ball_direction_y = Math.sin(angle) * ball_speed;

            // Increase the speed of the ball by 0.1
            ball_speed += 0.03;
            hasStarted = true;

            // Play the sound effect
            audio.play();
        }

        // Update the position of the ball based on its direction and speed
        if (hasStarted) {
            ball_position_x += ball_direction_x * ball_speed;
            ball_position_y += ball_direction_y * ball_speed;

            // Check if the ball collides with the top or bottom wall
            if (ball_position_y <= 0 || ball_position_y >= ball_max_height) {
                // Change the vertical direction of the ball
                ball_direction_y *= -1;
                audio.play();
            }

            // Check if the ball collides with the left or right wall
            if (ball_position_x <= 0 || ball_position_x >= ball_max_width) {
                // Change the horizontal direction of the ball
                ball_direction_x *= -1;
                // Increase the speed of the ball by 0.1
                ball_speed += 0.03;
                hasStarted = true;

                // Play the sound effect
                audio.play();
            }

            // Set the new position of the ball
            ball.style.left = `${ball_position_x}px`;
            ball.style.top = `${ball_position_y}px`;
            CheckGoal();
            
        }
    }, 50);
}

function GetCollisionAngle(ball, player) {
    // Calculate the center of the ball
    var ball_center_x = ball.offsetLeft + ball.offsetWidth / 2;
    var ball_center_y = ball.offsetTop + ball.offsetHeight / 2;

    // Calculate the center of the player
    var player_center_x = player.offsetLeft + player.offsetWidth / 2;
    var player_center_y = player.offsetTop + player.offsetHeight / 2;

    // Calculate the angle between the ball and the player
    var angle = Math.atan2(ball_center_y - player_center_y, ball_center_x - player_center_x);

    return angle;
}

let player2_score = 0;
let player1_score = 0;

hasScored = true;;

function CheckGoal() {
    if (ball_position_x < 0) {
        if (hasScored) {
            player2_score++;
            hasScored = true;
        }
        title.innerText = `Player 1: ${player1_score} - Player 2: ${player2_score}`;
        goal.play();
        ResetBall();
    } else if (ball_position_x > ball_max_width) {
        if (hasScored) {
            hasScored = true;
            player1_score++;
        }
        title.innerText = `Player 1: ${player1_score} - Player 2: ${player2_score}`;
        goal.play();
        ResetBall();
    }

}

function ResetBall() {
    hasScored=false;
    setTimeout(function () {
        // Action to be executed after 2 seconds
        ball_position_x = game_area.offsetWidth / 2 - ball.offsetWidth / 2;
        ball_position_y = game_area.offsetHeight / 2 - ball.offsetHeight / 2;
        ball_direction_x = 1;
        ball_direction_y = 1;
        ball_speed = 3;
        hasScored=true; // Delay time in milliseconds (2 seconds in this case)
        
    }, 2000);
}




function GameStart() {
    var keys1 = {};
    var keys2 = {};



    MovePlayer('KeyW', 'KeyS', 'KeyA', 'KeyD', 'player1', keys1);
    MovePlayer('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'player2', keys2);

    MoveBall();
}

GameStart();