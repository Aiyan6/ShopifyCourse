kaboom({
  root: document.getElementById("game-container"),
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

let player;

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function setMarioSpriteFromQuery() {
  const marioParam = getQueryParam("mario");
  if (marioParam === "andrew") {
    loadSprite("mario", "https://i.imgur.com/DVrAJUK.png");
  } else {
    loadSprite("mario", "https://i.imgur.com/Wb1qfhK.png");
  }
}

function setEvilMushroomSpriteFromQuery() {
  const evilMushroomParam = getQueryParam("evil-mushroom");
  if (evilMushroomParam === "aiyan") {
    loadSprite("evil-mushroom", "https://i.imgur.com/qafHsCN.png");
  } else {
    loadSprite("evil-mushroom", "https://i.imgur.com/KPO3fR9.png");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setMarioSpriteFromQuery();
  setEvilMushroomSpriteFromQuery();
});

let MOVE_SPEED = 120; //sets difficulty
const JUMP_FORCE = 400;
const BIG_JUMP_FORCE = 500;
let ENEMY_SPEED = 30;
const FALL_DEATH = 400;
let isJumping;
let current_jump_force = JUMP_FORCE;

loadSound(
  "jump",
  "https://raw.githubusercontent.com/dtellz/mario-browser-game/main/docs/sounds/smb_jump-small.wav"
);
loadSound(
  "getCoin",
  "https://raw.githubusercontent.com/dtellz/mario_game/main/docs/sounds/smb_coin.wav"
);
loadSound(
  "die",
  "https://raw.githubusercontent.com/dtellz/mario_game/main/docs/sounds/smb_mariodie.wav"
);
loadSound(
  "gameOver",
  "https://raw.githubusercontent.com/dtellz/mario_game/main/docs/sounds/smb_gameover.wav"
);

loadSprite("coin", "https://i.imgur.com/wbKxhcd.png");
loadSprite("evil-mushroom", "https://i.imgur.com/KPO3fR9.png");
loadSprite("brick", "https://i.imgur.com/pogC9x5.png");
loadSprite("block", "https://i.imgur.com/M6rwarW.png");
loadSprite("mario", "https://i.imgur.com/Wb1qfhK.png");
loadSprite("mushroom", "https://i.imgur.com/0wMd92p.png");
loadSprite("surprise", "https://i.imgur.com/gesQ1KP.png");
loadSprite("unboxed", "https://i.imgur.com/bdrLpi6.png");
loadSprite("pipe-top-left", "https://i.imgur.com/ReTPiWY.png");
loadSprite("pipe-top-right", "https://i.imgur.com/hj2GK4n.png");
loadSprite("pipe-bottom-left", "https://i.imgur.com/c1cYSbt.png");
loadSprite("pipe-bottom-right", "https://i.imgur.com/nqQ79eI.png");
loadSprite("hidden-surprise", "https://i.imgur.com/dh2hhyc.png"); //this image is a single black pixel

loadSprite("blue-block", "https://i.imgur.com/fVscIbn.png");
loadSprite("blue-brick", "https://i.imgur.com/3e5YRQd.png");
loadSprite("blue-steel", "https://i.imgur.com/gqVoI2b.png");
loadSprite("blue-evil-mushroom", "https://i.imgur.com/SvV4ueD.png");
loadSprite("blue-surprise", "https://i.imgur.com/RMqCc1G.png");

scene("game", ({ level, score, mov_speed, en_speed }) => {
  MOVE_SPEED = mov_speed;
  ENEMY_SPEED = en_speed;

  layers(["bg", "obj", "ui"], "obj"); // in [] we have game layers. the last one is the default layer.

  const maps = [
    [
      //level 1
      "=                                                                                                     =",
      "=                                                                                                     =",
      "=                                       ¿                                                             =",
      "=                                                                                                     =",
      "=                                                                                                     =",
      "=       ^          *                    %                                                             =",
      "=                                                                                                     =",
      "=          $$$$   ^ $$$$                                                                              =",
      "=        ======$$========            $b$$b$                                            ^              =",
      "=    %                           $ b  b  b  b            *                                         -+ =",
      "=                               b  b  b  b  b $b                                                   () =",
      "=                     ^         b  b  b $b  b  b                       ^^^  ^^^  ^^^ ^  ^ ^ ^ ^ ^  () =",
      "==========================   ====  =  =¿¿=  =  =============       ====================================",
    ],
    [
      //level 2
      "€                                                 $                                                  €",
      "€                                                                                                    €",
      "€                                                 ¿                                                  €",
      "€                                            €                                                       €",
      "€                                      €€       €€€€€€€€€                      €€€€€€                €",
      "€                  *             €€                                  €€€€€€                   %      €",
      "€                          €€                               €€€€€€                                   €",
      "€          $$$$   z $$$$ ^                                                                           €",
      "€           €€€€$$€€€€€€€                                                                            €",
      "€     %  x                                                                                        -+ €",
      "€       xxx                                                          €€€                          () €",
      "€      xxxxxx      z  ^                         z                                                 () €",
      "!!!!!!!!!!!!!!!!!!!!!!!  !!!!!                 !!!!!!!!!!!!!!!!!!!!        !!!!!!!!!!!!!!!!!!!!!!!!!!!",
    ],
    [
      //level 3 (testing)
      "=                                                                                           -+        =",
      "=                                                                                           ()        =",
      "=                                       ¿                                                   ()        =",
      "=                                                                                      ==   ==        =",
      "=                                                                                                     =",
      "=       ^          *                    %                ======                  ======               =",
      "=                                           =========                                                 =",
      "=          $$$$   ^ $$$$                                                  =======                     =",
      "=        ======$$========            $b$$b$                                                           =",
      "=    %                          =======            *              ========                            =",
      "=                                                                                                     =",
      "=== =========                   ^                                           ^                         =",
      "=                                  =  =¿¿=  =                                                         =",
    ],
  ];

  /*
    loadSprite('blue-block', 'fVscIbn.png')
loadSprite('blue-brick', '3e5YRQd.png')
loadSprite('blue-steel', 'gqVoI2b.png')
loadSprite('blue-evil-mushroom', 'SvV4ueD.png')
loadSprite('blue-surprise', 'RMqCc1G.png')

    */
  const levelCfg = {
    width: 20,
    height: 20,
    b: [sprite("block"), solid()],
    "=": [sprite("block"), solid()],
    $: [sprite("coin"), "coin" /*, solid()*/],
    "*": [sprite("surprise"), solid(), "mushroom-surprise"],
    "%": [sprite("surprise"), solid(), "coin-surprise"],
    "}": [sprite("unboxed"), solid()],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
    "-": [sprite("pipe-top-left"), solid(), scale(0.5), "pipe"],
    "+": [sprite("pipe-top-right"), solid(), scale(0.5), "pipe"],
    "^": [sprite("evil-mushroom"), solid(), "dangerous", body(), origin("bot")],
    "#": [
      sprite("mushroom"),
      "mushroom" /*<-tag to identify for movement*/,
      body(),
    ], //body() gives gravity to sprites
    "¿": [sprite("hidden-surprise"), solid(), "hidden-surprise"],

    //level 2 colored elements
    "!": [sprite("blue-block"), solid(), scale(0.5)],
    "€": [sprite("blue-brick"), solid(), scale(0.5)],
    x: [sprite("blue-steel"), solid(), scale(0.5)],
    z: [sprite("blue-evil-mushroom"), body(), solid(), scale(0.5), "dangerous"],
    "@": [sprite("blue-surprise"), solid(), scale(0.5), "mushroom-surprise"],
  };

  const gameLevel = addLevel(maps[level], levelCfg);

  const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer("ui"),
    {
      value: score,
    },
  ]);

  add([text("level" + parseInt(level + 1)), pos(40, 6)]); // we show level 1 when level-value is 0 with parseInt(level + 1) in order to make sense on the context of the game

  //big function controls mario size when getting a mushroom
  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          timer -= dt(); //its delta time since last frame
          if (timer <= 0) {
            //time runs out so mario comes back to be small
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        current_jump_force = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(1.5);
        current_jump_force = BIG_JUMP_FORCE;
        timer = time; //increasing time we can prolongue the time mario is big
        isBig = true;
      },
    };
  }

  player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(), //will make mario be affected by gravity
    big(),
    origin("bot"), //will avoid issues derived by body() use
  ]);

  //makes non-mario elemnts movement effects
  action("mushroom", (m) => {
    m.move(50, 0); // the number is the speed of the movement
  });
  action("dangerous", (d) => {
    d.move(-ENEMY_SPEED, 0);
  });

  //MARIO MOVEMENTS AND EFFECTS keboard detection for player movement
  player.on("headbump", (obj) => {
    //effects when hitting something with the head
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1)); // obj.gridPos.sub(0, 1) gives the coin the same position as the obj
      destroy(obj); //destroy() make the block to dissapear in order to have the coin appereance
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1)); // obj.gridPos.sub(0, 1) gives the coin the same position as the obj
      destroy(obj); //destroy() make the block to dissapear in order to have the coin appereance
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("hidden-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1)); // obj.gridPos.sub(0, 1) gives the coin the same position as the obj
      destroy(obj); //destroy() make the block to dissapear in order to have the coin appereance
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });

  //effects on touching elements with mario

  player.collides("dangerous", (d) => {
    if (isJumping) {
      destroy(d);
      score = score + 5;
    } else {
      go("game", { level: 0, score: 0, mov_speed: 120, en_speed: 30 });
    }
  });

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify(4); // the number we pass to biggify is the time spent while big
  });
  player.collides("coin", (c) => {
    destroy(c);
    play("getCoin");
    scoreLabel.value++; //mario earns cash on hitting coins
    scoreLabel.text = scoreLabel.value;
  });
  player.collides("pipe", () => {
    keyPress("down", () => {
      go("game", {
        score: scoreLabel.value,
        level: (level + 1) % maps.length,
        mov_speed: MOVE_SPEED,
        en_speed: ENEMY_SPEED,
      });
    });
  });

  //MARIO DEATH BY FALLING
  player.action(() => {
    camPos(player.pos); // with camPos we set camera position to follow mario
    if (player.pos.y >= FALL_DEATH) {
      go("game", { level: 0, score: 0, mov_speed: 120, en_speed: 30 });
    }
  });

  //mario movement

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  });

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0); //negative value of MOVE_SPEED will move player to the left
  });
  keyDown("right", () => {
    player.move(MOVE_SPEED, 0); //positive value of MOVE_SPEED in order to move player to the right
  });
  keyPress("space", () => {
    if (player.grounded()) {
      play("jump");
      isJumping = true;
      player.jump(current_jump_force);
    }
  });
});

scene("lose", ({ score, level }) => {
  go("game", { level: 0, score: 0, mov_speed: 120, en_speed: 30 });
});
//lets try to make a MENU
scene("menu", () => {
  add([
    text("MARIO kaBOOOOM!", 24),
    pos(20, 80), //POSITION MIGHT HAVE TO BE SET AS WE DID BEFORE DUE TO GAME SCREEN SIZE OF THE PROJECT
    color(220, 220, 220),
  ]);
  add([
    text("Main Menu", 22),
    pos(100, 130), //POSITION MIGHT HAVE TO BE SET AS WE DID BEFORE DUE TO GAME SCREEN SIZE OF THE PROJECT
    color(220, 220, 220),
  ]);
  //LET'S ADD BUTTONS FOR PLAYER CONTROL OVER THE MENU
  add([
    rect(170, 25),
    pos(120, 180),
    "button",
    {
      clickAction: () =>
        go("game", { level: 0, score: 0, mov_speed: 120, en_speed: 30 }),
    },
  ]);
  add([text("Play game", 18), pos(122, 182), color(0, 0, 0)]);

  add([
    rect(170, 25),
    pos(120, 210),
    "button",
    {
      clickAction: () => go("dificultySelection"), //IMPLEMENT HERE THE LEVEL DIFICULTY SELECTION
    },
  ]);
  add([text("DIFICULTY", 18), pos(122, 212), color(0, 0, 0)]);

  action("button", (b) => {
    if (b.isHovered()) b.use(color(128, 128, 128));
    else b.use(color(192, 192, 192));
    if (b.isClicked()) b.clickAction();
  });
});
scene("dificultySelection", () => {
  add([
    text("Choose game", 24),
    pos(20, 80), //POSITION MIGHT HAVE TO BE SET AS WE DID BEFORE DUE TO GAME SCREEN SIZE OF THE PROJECT
    color(220, 220, 220),
  ]);
  add([
    text("dificulty!", 22),
    pos(20, 110), //POSITION MIGHT HAVE TO BE SET AS WE DID BEFORE DUE TO GAME SCREEN SIZE OF THE PROJECT
    color(220, 220, 220),
  ]);
  //LET'S ADD BUTTONS FOR PLAYER CONTROL OVER THE MENU
  add([
    rect(140, 25),
    pos(40, 180),
    "button",
    {
      clickAction: () =>
        go("game", { level: 0, score: 0, mov_speed: 90, en_speed: 25 }),
    },
  ]);
  add([text("EASY", 18), pos(72, 182), color(0, 0, 0)]);

  add([
    rect(140, 25),
    pos(40, 210),
    "button",
    {
      clickAction: () =>
        go("game", { level: 0, score: 0, mov_speed: 120, en_speed: 30 }),
    },
  ]);
  add([text("MEDIUM", 18), pos(58, 212), color(0, 0, 0)]);

  add([
    rect(140, 25),
    pos(40, 240),
    "button",
    {
      clickAction: () =>
        go("game", { level: 0, score: 0, mov_speed: 240, en_speed: 80 }),
    },
  ]);
  add([text("HARD", 18), pos(72, 242), color(0, 0, 0)]);

  action("button", (b) => {
    if (b.isHovered()) b.use(color(128, 128, 128));
    else b.use(color(192, 192, 192));
    if (b.isClicked()) b.clickAction();
  });
});

// start("menu");

start("game", { level: 0, score: 0, mov_speed: 240, en_speed: 80 });
