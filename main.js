let game;
let backgroundMusic;
const pleaseRotate = document.getElementById("pleaseRotate");

// Check if the game is on a mobile device.
function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function createPlayerAnimations(character) {
  const playerKey = character === "male" ? "malePlayer" : "femalePlayer";
  console.log("CREATING ANIMATIONS FOR", playerKey);

  //Destroy old animations if they exist
  this.anims.remove("idle");
  this.anims.remove("run");
  this.anims.remove("jump");
  this.anims.remove("shoot");
  this.anims.remove("die");

  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers(playerKey, { start: 0, end: 2 }),
    frameRate: 7,
  });

  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers(playerKey, { start: 8, end: 13 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "jump",
    frames: [{ key: playerKey, frame: 7 }],
    frameRate: 5,
    repeat: -1,
  });

  this.anims.create({
    key: "shoot",
    frames: this.anims.generateFrameNumbers(playerKey, { start: 14, end: 15 }),
    frameRate: 20,
    repeat: 0,
  });

  this.anims.create({
    key: "die",
    frames: this.anims.generateFrameNumbers(playerKey, { start: 16, end: 17 }),
    frameRate: 2,
  });
}

function createBalloonAnimations() {
  if (this.currentLevel === 1) {
    const balloonTypes = [
      "boss_balloon",
      "rent_balloon",
      "medical_balloon",
      "groceries_balloon",
      "car_balloon",
      "staging_balloon",
      "ski_balloon",
      "tuition_balloon",
      "phone_balloon",
      "jewelry_balloon",
    ];

    for (let i = 0; i < balloonTypes.length; i++) {
      const type = balloonTypes[i];
      this.anims.create({
        key: `${type}_move`,
        frames: this.anims.generateFrameNumbers(type, { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1,
      });

      this.anims.create({
        key: `${type}_pop`,
        frames: this.anims.generateFrameNumbers(type, { start: 2, end: 4 }),
        frameRate: 5,
        hideOnComsplete: true,
      });
    }
  }
}

function createCardAnimations() {
  this.anims.create({
    key: "rotate",
    frames: this.anims.generateFrameNumbers("tongo_card", { start: 0, end: 7 }),
    frameRate: 7,
    repeat: -1,
  });
}

function __preload() {
  this.assetsLoaded = false;
  // Load Tiled map and tileset
  this.load.tilemapTiledJSON("level1", "assets/level1.json");
  this.load.tilemapTiledJSON("level2", "assets/level2.json");
  this.load.tilemapTiledJSON("level3", "assets/level3.json");
  //this.load.image('Tongo Tileset', 'assets/tiles.png');

  // Load player spritesheet
  this.load.spritesheet("malePlayer", "assets/male.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.spritesheet("femalePlayer", "assets/female.png", {
    frameWidth: 128,
    frameHeight: 128,
  });

  // Load background image
  //this.load.image('background', 'assets/background.png');
  this.load.image("background1", "assets/background/background1.png");
  this.load.image("background2", "assets/background/background2.png");
  this.load.image("background3", "assets/background/background3.png");

  this.load.image("sky", "assets/background/sky.png");
  this.load.image("clouds", "assets/background/clouds.png");

  // Load animated card projectile spritesheet
  this.load.spritesheet("tongo_card", "assets/card.png", {
    frameWidth: 20,
    frameHeight: 20,
  });

  // Load balloon spritesheets
  this.load.spritesheet("boss_balloon", "assets/balloons/boss.png", {
    frameWidth: 200,
    frameHeight: 400,
  });

  this.load.spritesheet("rent_balloon", "assets/balloons/rent_lg.png", {
    frameWidth: 96,
    frameHeight: 210,
  });
  this.load.spritesheet("tuition_balloon", "assets/balloons/tuition_lg.png", {
    frameWidth: 96,
    frameHeight: 210,
  });
  this.load.spritesheet("ski_balloon", "assets/balloons/ski_lg.png", {
    frameWidth: 96,
    frameHeight: 210,
  });

  this.load.spritesheet("car_balloon", "assets/balloons/car_med.png", {
    frameWidth: 64,
    frameHeight: 140,
  });
  this.load.spritesheet("jewelry_balloon", "assets/balloons/jewelry_med.png", {
    frameWidth: 64,
    frameHeight: 140,
  });
  this.load.spritesheet("medical_balloon", "assets/balloons/medical_med.png", {
    frameWidth: 64,
    frameHeight: 140,
  });

  this.load.spritesheet(
    "groceries_balloon",
    "assets/balloons/groceries_sm.png",
    { frameWidth: 48, frameHeight: 120 }
  );
  this.load.spritesheet("phone_balloon", "assets/balloons/phone_sm.png", {
    frameWidth: 48,
    frameHeight: 120,
  });
  this.load.spritesheet("staging_balloon", "assets/balloons/staging_sm.png", {
    frameWidth: 48,
    frameHeight: 120,
  });

  // Ensure the game waits for the tiles to be loaded
  this.tileNames = [];
  fetch("assets/tiles.json")
    .then((response) => response.json())
    .then((fileList) => {
      if (fileList && fileList.files) {
        // console.log(fileList.files);
        fileList.files.forEach((file) => {
          this.tileNames.push(file.name);
          this.load.image(file.name, file.path);
          //Increase image saturation
        });
      }
    })
    .catch((error) => {
      console.error("Error loading tiles JSON:", error);
    });
}

function _preload() {
  this.__preload = __preload.bind(this);
  this.__preload();

  // Load score display images
  this.load.image(
    "checking_0",
    "assets/ui/scoring/tongo_UI_benefit-meter_purple-00.png"
  );
  this.load.image(
    "checking_1",
    "assets/ui/scoring/tongo_UI_benefit-meter_purple-01.png"
  );
  this.load.image(
    "checking_2",
    "assets/ui/scoring/tongo_UI_benefit-meter_purple-02.png"
  );
  this.load.image(
    "checking_3",
    "assets/ui/scoring/tongo_UI_benefit-meter_purple-03.png"
  );
  this.load.image(
    "checking_4",
    "assets/ui/scoring/tongo_UI_benefit-meter_purple-04.png"
  );

  this.load.image(
    "savings_0",
    "assets/ui/scoring/tongo_UI_benefit-meter_green-00.png"
  );
  this.load.image(
    "savings_1",
    "assets/ui/scoring/tongo_UI_benefit-meter_green-01.png"
  );
  this.load.image(
    "savings_2",
    "assets/ui/scoring/tongo_UI_benefit-meter_green-02.png"
  );
  this.load.image(
    "savings_3",
    "assets/ui/scoring/tongo_UI_benefit-meter_green-03.png"
  );
  this.load.image(
    "savings_4",
    "assets/ui/scoring/tongo_UI_benefit-meter_green-04.png"
  );

  this.load.image(
    "business_0",
    "assets/ui/scoring/tongo_UI_benefit-meter_yellow-00.png"
  );
  this.load.image(
    "business_1",
    "assets/ui/scoring/tongo_UI_benefit-meter_yellow-01.png"
  );
  this.load.image(
    "business_2",
    "assets/ui/scoring/tongo_UI_benefit-meter_yellow-02.png"
  );
  this.load.image(
    "business_3",
    "assets/ui/scoring/tongo_UI_benefit-meter_yellow-03.png"
  );
  this.load.image(
    "business_4",
    "assets/ui/scoring/tongo_UI_benefit-meter_yellow-04.png"
  );

  this.load.image(
    "retirement_0",
    "assets/ui/scoring/tongo_UI_benefit-meter_red-00.png"
  );
  this.load.image(
    "retirement_1",
    "assets/ui/scoring/tongo_UI_benefit-meter_red-01.png"
  );
  this.load.image(
    "retirement_2",
    "assets/ui/scoring/tongo_UI_benefit-meter_red-02.png"
  );
  this.load.image(
    "retirement_3",
    "assets/ui/scoring/tongo_UI_benefit-meter_red-03.png"
  );
  this.load.image(
    "retirement_4",
    "assets/ui/scoring/tongo_UI_benefit-meter_red-04.png"
  );

  this.load.image("mobile_left", "assets/ui/mobile/left.png");
  this.load.image("mobile_right", "assets/ui/mobile/right.png");
  this.load.image("mobile_jump", "assets/ui/mobile/jump.png");
  this.load.image("mobile_shoot", "assets/ui/mobile/shoot.png");

  // Load heart images for lives
  this.load.image("heart_empty", "assets/ui/lives/tongo_ui_lives-empty.png");
  this.load.image("heart_full", "assets/ui/lives/tongo_ui_lives-full.png");

  //load sound
  this.load.audio("coinSound", "assets/sounds/coin.wav");

  this.load.audio("gameOverSound", "assets/sounds/gameOver.wav");
  this.load.audio("youWonSound", "assets/sounds/youWon.wav");

  this.load.audio("hitSound", "assets/sounds/hurt.wav");
  this.load.audio("jumpSound", "assets/sounds/jump.wav");
  this.load.audio("shootSound", "assets/sounds/throw.wav");
  this.load.audio("popSound", "assets/sounds/pop.wav");
  this.load.audio("levelUpSound", "assets/sounds/levelUp.wav");

  this.load.audio("lobbyMusic", "assets/sounds/lobbyMusic.mp3");
  this.load.audio("level1Music", "assets/sounds/retroloop1.mp3");
  this.load.audio("level2Music", "assets/sounds/retroloop2.mp3");
  this.load.audio("level3Music", "assets/sounds/retroloop3.mp3");

  this.assetsLoaded = true;
}

function updateScoreDisplay() {
  // Update the textures for each score display based on score values
  const scoreMapping = [
    { type: "checking", score: checkingScore },
    { type: "savings", score: savingsScore },
    { type: "business", score: businessScore },
    { type: "retirement", score: retirementScore },
  ];

  //Type2idx
  const type2idx = { checking: 0, savings: 1, business: 2, retirement: 3 };

  scoreMapping.forEach(({ type, score }) => {
    let newTexture;
    if (score <= 0) {
      newTexture = `${type}_0`;
    } else if (score < 250) {
      newTexture = `${type}_1`;
    } else if (score < 500) {
      newTexture = `${type}_2`;
    } else if (score < 750) {
      newTexture = `${type}_3`;
    } else {
      newTexture = `${type}_4`;
    }

    if (this.scoreDisplays[type]) {
      const currentTexture = this.scoreDisplays[type].texture.key;

      // Check if a flickering sequence is already in progress
      if (
        !this.scoreDisplays[type].flickering &&
        currentTexture !== newTexture
      ) {
        // Set the flickering flag to true to prevent overlapping sequences
        this.scoreDisplays[type].flickering = true;

        const originalY = this.scoreDisplays[type].y;
        const offsetY = 10; // Amount of jiggle

        // Define flicker and jiggle sequences
        const flickerSequence = [
          { delay: 300, texture: currentTexture }, // Flicker back to current texture
          { delay: 300, texture: newTexture }, // Flicker up to new texture
          { delay: 300, texture: currentTexture }, // Flicker down to current texture
          { delay: 300, texture: newTexture }, // Final change to new texture
        ];

        const jiggleSequence = [
          { delay: 300, jiggle: originalY + offsetY }, // Jiggle up
          { delay: 300, jiggle: originalY }, // Jiggle back to original Y
          { delay: 300, jiggle: originalY + offsetY }, // Jiggle up again
          { delay: 300, jiggle: originalY }, // Back to original Y
        ];

        // Loop through flicker and jiggle sequences
        flickerSequence.forEach(({ delay, texture }, index) => {
          this.time.delayedCall(delay * (index + 1), () => {
            this.scoreDisplays[type].setTexture(texture);
          });
        });

        jiggleSequence.forEach(({ delay, jiggle }, index) => {
          this.time.delayedCall(delay * (index + 1), () => {
            this.scoreDisplays[type].y = jiggle;
            this.scoreTexts[type2idx[type]].y = jiggle + 20;
          });
        });

        // After the final flicker, reset the flickering flag and position
        const totalDuration = 1200; // Total time for 4 cycles of flickering and jiggle
        this.time.delayedCall(totalDuration, () => {
          this.scoreDisplays[type].flickering = false;
          this.scoreDisplays[type].y = originalY; // Ensure the Y position is reset
          this.scoreTexts[type2idx[type]].y = originalY + 20;
        });
      }
    }
  });
}

function updateLivesDisplay() {
  // Update heart display according to current lives
  this.lives.forEach((heart, index) => {
    if (index < this.livesCount) {
      heart.setTexture("heart_full");
    } else {
      heart.setTexture("heart_empty");
    }
  });
}

function collectScoreItem(player, scoreItem) {
  const currentTextureKey = scoreItem.texture.key;
  const newTextureKey = currentTextureKey.replace("sale", "sold");

  if (currentTextureKey !== newTextureKey) {
    scoreItem.setTexture(newTextureKey);
    //get last letter of the texture key
    const amount = parseInt(currentTextureKey.slice(0));
    // console.log(amount);
    this.addToScore(100 * amount);
    this.sound.play("coinSound");
  }
}

function addToScore(amount) {
  if (this.currentLevel === 1) {
    checkingScore += amount;
    savingsScore += amount * 1.5;
  } else if (this.currentLevel === 2) {
    checkingScore += amount;
    businessScore += amount * 3;
    savingsScore += amount * 1.5;
  } else if (this.currentLevel === 3) {
    checkingScore += amount;
    businessScore += amount * 3;
    savingsScore += amount * 1.5;
    retirementScore += amount * 6;
  }

  this.updateScoreDisplay();
}

function createScoreDisplay(type, x, y) {
  this.scoreDisplays[type] = this.add.image(x, y, `${type}_0`).setOrigin(0, 0);
  this.scoreDisplays[type].setScale(0.5);
  this.scoreDisplays[type].setScrollFactor(0);

  const typeDict = {
    checking: "Direct\nDeposit",
    savings: "Saving For\nTaxes",
    business: "Investments",
    retirement: "Retirement",
  };
  //add text for the type
  this.scoreTexts.push(
    this.add
      .text(x, y + 20, typeDict[type], { fontSize: "14px", fill: "#000" })
      .setScrollFactor(0)
  );
}

function subtractFromScore(amount) {
  if (checkingScore >= amount) {
    checkingScore -= amount;
  } else if (savingsScore >= amount) {
    savingsScore -= amount;
  } else if (businessScore >= amount && this.currentLevel >= 2) {
    businessScore -= amount;
  } else if (retirementScore >= amount && this.currentLevel >= 3) {
    retirementScore -= amount;
  }

  this.updateScoreDisplay();
}
function loseLife() {
  this.livesCount--;

  this.updateLivesDisplay();

  if (this.livesCount <= 0) {
    this.gameOver();
  }
}

function gameOver() {
  this.isGameOver = true; // Set the game over flag to true
  this.player.setVelocity(0); // Stop the player from moving during the animation

  // Play the die animation
  // console.log('playing die animation');
  this.player.anims.play("die", true);

  // Wait for the animation to complete before transitioning to the GameOverScene
  this.player.on("animationcomplete", () => {
    // Delay clearing the level after the animation is complete
    //this.clearLevel();
    //this.selectedCharacter = null;
    this.scene.start("GameOverScene", {
      checkingScore,
      savingsScore,
      businessScore,
      retirementScore,
      character: this.selectedCharacter,
    });
  });
}

const tileSets = [];
const tileNames = [];
function clearLevel() {
  if (this.map) {
    this.map.destroy();
  }
  if (this.platforms) {
    this.platforms.destroy();
  }
  if (this.player) {
    this.player.destroy();
  }
  if (this.tongoCards) {
    this.tongoCards.clear(true, true);
  }
  if (this.balloons) {
    this.balloons.clear(true, true);
  }
  if (this.platformColliders) {
    this.platformColliders.clear(true, true);
  }

  if (this.scoreItems) {
    this.scoreItems.clear(true, true);
  }

  // Ensure all score displays are removed from the scene
  if (this.scoreDisplays) {
    Object.values(this.scoreDisplays).forEach((display) => display.destroy());
    this.scoreDisplays = {}; // Reset the scoreDisplays object
  }

  // Reset the lives display as well
  if (this.lives) {
    this.lives.forEach((heart) => heart.destroy());
    this.lives = [];
  }
}

function addBackground(scene, key) {
  const mapWidth = scene.map.widthInPixels; // Full map width in pixels
  const screenHeight = scene.game.config.height; // Visible screen height

  // Get the original dimensions of the background image
  const imageWidth = scene.textures.get(key).getSourceImage().width;
  const imageHeight = scene.textures.get(key).getSourceImage().height;

  // Compute the scale factor to fit the screen height
  const scaleY = scene.map.heightInPixels / imageHeight;

  // Scale the width proportionally to maintain the aspect ratio of the image
  const scaledImageWidth = imageWidth * scaleY;

  // Calculate how many background images are needed to fill the map width
  const numTiles = Math.ceil(mapWidth / scaledImageWidth);

  // Loop to add each tile
  for (let i = 0; i < numTiles; i++) {
    // Add the background image at the appropriate x position
    const bg = scene.add.image(i * scaledImageWidth, 0, key);

    // Apply the scaling
    bg.setScale(scaleY);

    // Set origin to top-left so it aligns properly
    bg.setOrigin(0, 0);
  }
}

let checkingScore = 0;
let savingsScore = 0;
let businessScore = 0;
let retirementScore = 0;

function loadNextLevel() {
  this.hasLoaded = false;
  const checkCondition = setInterval(() => {
    if (this.assetsLoaded) {
      clearInterval(checkCondition);

      this.createPlayerAnimations = createPlayerAnimations.bind(this);
      this.createBalloonAnimations = createBalloonAnimations.bind(this);
      this.createCardAnimations = createCardAnimations.bind(this);

      this.createPlayerAnimations(this.selectedCharacter);
      this.createBalloonAnimations();
      this.createCardAnimations();

      this.isShooting = false; // Add this flag to track shooting state
      if (this.currentLevel > 0) {
        clearLevel(this);
      }
      if (this.currentLevel > this.maxLevel) {
        this.scene.start("end");
        return;
      }

      // Load the tilemap and create the platforms
      const levelKey = `level${this.currentLevel}`;
      this.map = this.make.tilemap({ key: levelKey });

      addBackground(this, "sky");
      const bgKey = `background${this.currentLevel}`;
      addBackground(this, bgKey);
      if (this.currentLevel == 1) {
        this.tileNames.forEach((tileName) => {
          const tilesetKey = "tiles/" + tileName + ".png";
          const image = this.textures.get(tileName).getSourceImage();
          const t = this.map.addTilesetImage(
            tilesetKey,
            tileName,
            image.width,
            image.height
          );
          tileSets.push(t);
          tileNames.push(tileName);
        });
      }

      // console.log(tileSets);

      this.foreground = this.map.createLayer(
        "Foreground Tiles",
        tileSets,
        0,
        0
      );
      this.platforms = this.map.createLayer("Platforms", tileSets, 0, 0);
      this.portals = this.map.createLayer("Portals", tileSets, 0, 0);
      this.platformColliders = this.physics.add.staticGroup();

      this.platforms.forEachTile((tile) => {
        if (tile.index !== -1) {
          const worldX = this.map.tileToWorldX(tile.x);
          const worldY = this.map.tileToWorldY(tile.y);

          const collider = this.add.zone(
            worldX + tile.width / 8,
            worldY + tile.height / 8,
            tile.width * 0.25,
            tile.height * 0.25
          );
          this.physics.add.existing(collider, true);
          collider.body.setSize(tile.width * 0.25, tile.height * 0.25);
          this.platformColliders.add(collider);
        }
      });

      this.scoring = this.map.getObjectLayer("Scoring");
      this.scoreItems = this.physics.add.staticGroup();

      this.scoring.objects.forEach((object) => {
        // console.log(object);
        const x = object.x;
        const y = object.y;
        const width = object.width * 0.75;
        const height = object.height * 0.75;
        const gid = object.gid;
        const name = object.name;

        const objectSprite = this.add.sprite(x, y, name);
        objectSprite.setOrigin(0, 1);
        objectSprite.displayWidth = width;
        objectSprite.displayHeight = height;
        this.scoreItems.add(objectSprite);
      });
      // console.log(this.scoreItems);

      this.physics.world.setBounds(
        0,
        0,
        this.map.widthInPixels,
        this.map.heightInPixels
      );

      const playerKey =
        this.selectedCharacter === "male" ? "malePlayer" : "femalePlayer";
      console.log("CREATINGG SPRITE FOR", playerKey);
      //Only load next level when assets are loaded
      this.player = this.physics.add.sprite(100, 100, playerKey);
      this.player.setCollideWorldBounds(true);
      this.player.setScale(0.75);

      // Manually resize the player's physics body to match the sprite dimensions
      this.player.body.setSize(64, 128); // Adjust these numbers to fit the actual sprite size

      //Bring the player to the front
      this.player.setDepth(1);

      // If the physics body is offset (not centered), adjust the offset
      this.player.body.setOffset(32, 0); // Adjust these numbers to fit the actual sprite size

      this.player.anims.play("idle", true);

      this.physics.add.collider(this.player, this.platforms);
      this.physics.add.collider(this.player, this.platformColliders);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.spaceBar = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );

      this.tongoCards = this.physics.add.group();
      this.balloons = this.physics.add.group();

      this.physics.add.overlap(
        this.tongoCards,
        this.balloons,
        this.popBalloon,
        null,
        this
      );
      this.physics.add.overlap(
        this.player,
        this.scoreItems,
        this.collectScoreItem,
        null,
        this
      );

      this.cameras.main.setBounds(
        0,
        0,
        this.map.widthInPixels,
        this.map.heightInPixels
      );
      this.cameras.main.startFollow(this.player);

      console.log("Current level:", this.currentLevel);
      this.scoreTexts = [];
      createScoreDisplay.call(this, "checking", 10, 10);
      createScoreDisplay.call(this, "savings", 130, 10);

      if (this.currentLevel >= 2) {
        createScoreDisplay.call(this, "business", 250, 10);
      }
      if (this.currentLevel >= 3) {
        createScoreDisplay.call(this, "retirement", 370, 10);
      }

      // Lives display
      this.lives = [];
      this.livesCount = 3;
      for (let i = 0; i < 3; i++) {
        const heart = isMobileDevice() ? 
					this.add
          .image(this.game.config.width - 60 - i * 50, 10, "heart_full")
          .setOrigin(0, 0)
					: this.add
          .image(730 - i * 70, 10, "heart_full")
          .setOrigin(0, 0);
        heart.setScale(isMobileDevice() ? 0.5 : 0.75);
        heart.setScrollFactor(0);
        this.lives.push(heart);
      }
      this.hasLoaded = true;
      this.isGameOver = false;
    }
  }, 100);
}

function popBalloon(tongoCard, balloon) {
  tongoCard.destroy(); // Destroy the Tongo card after hitting the balloon

  // Check if it's the boss balloon with health
  if (balloon.texture.key === "boss_balloon") {
    balloon.health -= 1;

    if (balloon.health <= 0) {
      // If health is 0 or less, pop the balloon and destroy it
      balloon.anims.play(`${balloon.texture.key}_pop`, true);
      this.time.delayedCall(1000, function () {
        balloon.destroy();
      });
      this.sound.play("popSound");
    }
  } else {
    // For normal balloons, pop and destroy immediately
    balloon.anims.play(`${balloon.texture.key}_pop`, true);
    this.time.delayedCall(1000, function () {
      balloon.destroy();
    });
    this.sound.play("popSound");
  }
  // Play the pop sound
}

function spawnBalloon() {
  const balloonDict = {
    boss: ["boss_balloon"],
    large: [
      "rent_balloon",
      "ski_balloon",
      "tuition_balloon",
      "jewelry_balloon",
    ],
    medium: ["car_balloon", "medical_balloon"],
    small: ["groceries_balloon", "staging_balloon", "phone_balloon"],
  };

  const random = Math.random();
  let balloonType;

  if (random < 0.05) {
    balloonType = "boss";
  } else if (random < 0.2) {
    balloonType = "large";
  } else if (random < 0.5) {
    balloonType = "medium";
  } else {
    balloonType = "small";
  }

  const balloonTexture = Phaser.Utils.Array.GetRandom(balloonDict[balloonType]);
  const mapHeight = this.map.heightInPixels;

  //calculate new x as the current x position of the cameras right edge
  //make the time longer on the first level
  if (this.currentLevel === 1) {
    const x = this.cameras.main.scrollX + this.game.config.width + 200;
    const balloon = this.balloons.create(
      x,
      Phaser.Math.Between(mapHeight * 0.2, mapHeight * 0.8),
      balloonTexture
    );
    balloon.setVelocityX(-100);
    balloon.body.allowGravity = false;
    balloon.anims.play(`${balloonTexture}_move`, true);
    balloon.refreshBody();
    // Assign health to the boss balloon
    if (balloonType === "boss") {
      balloon.health = 3; // Boss balloon takes 3 hits
    }
  } else {
    const x = this.cameras.main.scrollX + this.game.config.width + 50;
    const balloon = this.balloons.create(
      x,
      Phaser.Math.Between(mapHeight * 0.2, mapHeight * 0.8),
      balloonTexture
    );
    balloon.setVelocityX(-100);
    balloon.body.allowGravity = false;
    balloon.anims.play(`${balloonTexture}_move`, true);
    balloon.refreshBody();
    // Assign health to the boss balloon
    if (balloonType === "boss") {
      balloon.health = 3; // Boss balloon takes 3 hits
    }
  }
}

// UPDATE FUNCTION
function update(time, delta) {
  console.log("UPDATE", this.hasLoaded, this.isGameOver);
  if (!this.hasLoaded) return;
  if (this.isGameOver) return;

  // Prevent movement or animation changes while shooting
  if (!this.isShooting) {
    // Reset X velocity first
    this.player.setVelocityX(0);

    // Track if the player is moving horizontally
    let isMovingHorizontally = false;

    // Handle left/right movement
    if (this.isLeftPressed || this.cursors.left.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.setFlipX(true);
      isMovingHorizontally = true;

      if (
        this.player.body.blocked.down &&
        !this.isJumpPressed &&
        !this.cursors.up.isDown
      ) {
        this.player.anims.play("run", true); // Play run if on the ground and not jumping
      }
    } else if (this.isRightPressed || this.cursors.right.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.setFlipX(false);
      isMovingHorizontally = true;

      if (
        this.player.body.blocked.down &&
        !this.isJumpPressed &&
        !this.cursors.up.isDown
      ) {
        this.player.anims.play("run", true); // Play run if on the ground and not jumping
      }
    }

    // Handle idle state (not moving)
    if (
      !isMovingHorizontally &&
      this.player.body.blocked.down &&
      !this.isJumpPressed &&
      !this.cursors.up.isDown
    ) {
      this.player.anims.play("idle", true); // Play idle when not moving and on the ground
    }

    // Handle jump input (this part is updated)
    if (
      (this.isJumpPressed || this.cursors.up.isDown) &&
      this.player.body.blocked.down
    ) {
      this.player.setVelocityY(-this.jh); // Jump only if on the ground
      this.player.anims.play("jump", true); // Start jump animation when jumping
      this.sound.play("jumpSound");
    }

    // Handle airborne state (jumping/falling)
    if (!this.player.body.blocked.down) {
      this.player.anims.play("jump", true); // Play jump animation while airborne
    }
  }
  if ((this.spaceBar.isDown || this.isShootPressed) && this.canShoot) {
    this.shootTongoCard();
  }

  if (time > this.nextBalloonTime) {
    this.spawnBalloon();
    this.nextBalloonTime = time + this.balloonInterval;
  }

  this.checkBalloons();
  this.updateScoreDisplay();
}

function shootTongoCard() {
  const d = 200;
  if (checkingScore <= d && savingsScore <= d && this.currentLevel == 1) return;
  if (
    checkingScore <= d &&
    savingsScore <= d &&
    businessScore <= d &&
    this.currentLevel == 2
  )
    return;
  if (
    checkingScore <= d &&
    savingsScore <= d &&
    businessScore <= d &&
    retirementScore <= d &&
    this.currentLevel == 3
  )
    return;
  if (!this.canShoot || this.isShooting) return;

  this.subtractFromScore(d);
  this.canShoot = false;
  this.isShooting = true; // Player is now shooting

  // Stop any other animations
  this.player.anims.stop();

  // Play the shooting animation
  this.player.anims.play("shoot", true).once("animationcomplete", () => {
    // Shooting complete, return to idle or run
    this.isShooting = false; // Shooting is complete
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      this.player.anims.play("run", true);
    } else {
      this.player.anims.play("idle", true);
    }
  });

  // Determine the direction the player is facing
  const facingRight = !this.player.flipX;

  // Create the card at the player's position
  const tongoCard = this.tongoCards.create(
    this.player.x,
    this.player.y,
    "tongo_card"
  );

  // Set the velocity based on the facing direction
  tongoCard.setVelocityX(facingRight ? 600 : -600);
  tongoCard.body.allowGravity = false;
  tongoCard.anims.play("rotate", true);

  // Flip the card based on direction
  tongoCard.setFlipX(!facingRight); // Flip the card's sprite if facing left

  // Play the shooting sound
  this.sound.play("shootSound");

  // Set cooldown before next shot
  this.time.delayedCall(
    this.shootCooldown,
    function () {
      this.canShoot = true;
    }.bind(this)
  );
}

function checkBalloons() {
  this.balloons.getChildren().forEach((balloon) => {
    if (balloon.x < 0) {
      if (balloon.texture.key === "boss_balloon") {
        this.loseLife();
        this.loseLife();
        this.loseLife();
        this.sound.play("hitSound");
        balloon.destroy();
      } else {
        this.loseLife();
        //play hit sound
        this.sound.play("hitSound");
        balloon.destroy();
      }
    }
  });
}

function createMobileButtons() {
  // Add button sprites or graphics for controls
  this.leftButton = this.add
    .sprite(50, this.game.canvas.height - 50, "mobile_left")
    .setInteractive(); // Adjust position
  this.rightButton = this.add
    .sprite(100, this.game.canvas.height - 50, "mobile_right")
    .setInteractive();
  this.jumpButton = this.add
    .sprite(
      this.game.canvas.width - 100,
      this.game.canvas.height - 50,
      "mobile_jump"
    )
    .setInteractive();
  this.shootButton = this.add
    .sprite(
      this.game.canvas.width - 50,
      this.game.canvas.height - 50,
      "mobile_shoot"
    )
    .setInteractive();

  this.leftButton.setScrollFactor(0);
  this.rightButton.setScrollFactor(0);
  this.jumpButton.setScrollFactor(0);
  this.shootButton.setScrollFactor(0);

  this.leftButton.setDepth(10);
  this.rightButton.setDepth(10);
  this.jumpButton.setDepth(10);
  this.shootButton.setDepth(10);

  // Detect touch/click events on buttons
  this.leftButton.on("pointerdown", () => {
    this.isLeftPressed = true;
  });
  this.leftButton.on("pointerup", () => {
    this.isLeftPressed = false;
  });

  this.rightButton.on("pointerdown", () => {
    this.isRightPressed = true;
  });
  this.rightButton.on("pointerup", () => {
    this.isRightPressed = false;
  });

  this.jumpButton.on("pointerdown", () => {
    this.isJumpPressed = true;
  });
  this.jumpButton.on("pointerup", () => {
    this.isJumpPressed = false;
  });

  this.shootButton.on("pointerdown", () => {
    this.isShootPressed = true;
  });
  this.shootButton.on("pointerup", () => {
    this.isShootPressed = false;
  });

  // Variables to track input state
  this.isLeftPressed = false;
  this.isRightPressed = false;
  this.isJumpPressed = false;
  this.isShootPressed = false;
}

function positionStartScreenElements() {
  const width = this.game.canvas.width;
  const height = this.game.canvas.height;
  const insetFactor = 0.8;
  const rectangleWidth = width * insetFactor;
  const rectangleHeight = height * insetFactor;
  const centerX = width / 2;
  const centerY = height / 2;

  this.bg.setPosition(centerX, centerY).setDisplaySize(width, height);

  this.welcomeImage.setPosition(centerX, centerY - rectangleHeight * 0.13);
  this.fitToContainer(
    this.welcomeImage,
    rectangleWidth * 1.5,
    rectangleHeight * 0.6
  );

  this.leftButton.setPosition(
    centerX - rectangleWidth * 0.15,
    centerY + rectangleHeight * 0.3
  );
  this.fitToContainer(this.leftButton, 48, 48);

  this.rightButton.setPosition(
    centerX + rectangleWidth * 0.15,
    centerY + rectangleHeight * 0.3
  );
  this.fitToContainer(this.rightButton, 48, 48);

  this.whiteRectangle
    .setPosition(centerX, centerY)
    .setSize(rectangleWidth, rectangleHeight);
}

class BaseLevelScene extends Phaser.Scene {
  constructor(sceneKey) {
    super({ key: sceneKey });
    this.maxLevel = 3;
    this.canShoot = true;
    this.shootCooldown = 500;
    this.balloonInterval = 5000;
    this.speed = 330;
    this.jh = 300;
    this.scoreDisplays = {};
  }

  init(data) {
    // Initialize common properties
    this.livesCount = data.livesCount || this.livesCount;
    this.selectedCharacter = data.character || "male";
  }

  preload() {
    this.load.image("heart_full", "path/to/heart_full.png");
    this._preload = _preload.bind(this);
    this._preload();
  }

  create() {
    this.setupGame();
    this.loadNextLevel();

    // Setup event listeners for cleanup
    this.events.on("shutdown", this.cleanup, this);
    this.events.on("destroy", this.cleanup, this);

    // Setup mobile-specific controls (if shared across all levels)
    if (isMobileDevice()) {
      this.createMobileButtons = createMobileButtons.bind(this);
      this.createMobileButtons();
    }
  }

  setupGame() {
    this.loadNextLevel = loadNextLevel.bind(this);
    this.shootTongoCard = shootTongoCard.bind(this);
    this.popBalloon = popBalloon.bind(this);
    this.spawnBalloon = spawnBalloon.bind(this);
    this.collectScoreItem = collectScoreItem.bind(this);
    this.checkBalloons = checkBalloons.bind(this);
    this.updateScoreDisplay = updateScoreDisplay.bind(this);
    this.addToScore = addToScore.bind(this);
    this.subtractFromScore = subtractFromScore.bind(this);
    this.loseLife = loseLife.bind(this);
    this.updateLivesDisplay = updateLivesDisplay.bind(this);
    this.gameOver = gameOver.bind(this);
    this.clearLevel = clearLevel.bind(this);

    this.canShoot = true;
    this.shootCooldown = 500;
    this.balloonInterval = 5000;
    this.nextBalloonTime = 0;
    this.scoreDisplays = {};

    this.jh = 330;

    this.lives = [];
    for (let i = 0; i < this.livesCount; i++) {
      const heart = this.add
        .image(730 - i * 70, 10, "heart_full")
        .setOrigin(0, 0);
      heart.setScale(0.75);
      heart.setScrollFactor(0);
      this.lives.push(heart);
    }
  }

  playBackgroundMusic(musicKey) {
    // Handle background music consistently across levels
    if (backgroundMusic) {
      backgroundMusic.stop();
    }

    backgroundMusic = this.sound.add(musicKey, { loop: true });
    backgroundMusic.play();
    backgroundMusic.setVolume(0.75);
  }

  sceneStart(sceneKey) {
    if (this.player.x >= this.physics.world.bounds.width - 50) {
      this.clearLevel();
      this.scene.start(sceneKey, {
        livesCount: this.livesCount,
        character: this.selectedCharacter,
        checkingScore: checkingScore,
        savingsScore: savingsScore,
        businessScore: businessScore,
        retirementScore: retirementScore,
      });
    }
  }

  cleanup() {
    // Common cleanup logic
    if (backgroundMusic) {
      backgroundMusic.stop();
      backgroundMusic.destroy();
    }

    // Remove timers
    this.time.removeAllEvents();

    // Destroy game objects
    this.children.list.forEach((child) => {
      if (child.active) {
        child.destroy();
      }
    });

    // Kill tweens
    if (this.tweens) {
      this.tweens.killAll();
    }
  }
}

class Level1Scene extends BaseLevelScene {
  constructor() {
    super("Level1Scene");
    this.currentLevel = 1;
  }

  create() {
    super.create();
    this.speed = 330;
    super.playBackgroundMusic("level1Music");
  }

  update(time, delta) {
    if (!this.hasLoaded) return;
		if (!this.assetsLoaded) return;
    update.call(this, time, delta);
		super.sceneStart("Level2Transition")
  }
}

class Level2Scene extends BaseLevelScene {
  constructor() {
    super("Level2Scene");
    this.currentLevel = 2;
  }

  create() {
    super.create();
    this.speed = 450;
    super.playBackgroundMusic("level2Music");
  }

  update(time, delta) {
    if (!this.hasLoaded) return;
		if (!this.assetsLoaded) return;
    update.call(this, time, delta);
		super.sceneStart("Level3Transition");
  }
}

class Level3Scene extends BaseLevelScene {
  constructor() {
    super("Level3Scene");
    this.currentLevel = 3;
  }

  create() {
    super.create();
    this.speed = 500;
    super.playBackgroundMusic("level3Music");
  }

  update(time, delta) {
    if (!this.hasLoaded) return;
    if (!this.assetsLoaded) return;
    update.call(this, time, delta);

    if (this.player.x >= this.physics.world.bounds.width - 50) {
      this.clearLevel();
      this.selectedCharacter = null;
      this.scene.start("YouWonScene", {
        checkingScore: checkingScore,
        savingsScore: savingsScore,
        businessScore: businessScore,
        retirementScore: retirementScore,
      });
    }
  }
}

class StartScreen extends Phaser.Scene {
  constructor() {
    super({ key: "StartScreen" });
  }

  preload() {
    this._preload = _preload.bind(this);
    this._preload(); // Preload assets for Level 3

    this.clearLevel = clearLevel.bind(this);
    this.clearLevel();
    this.load.image("background", "assets/background/sky.png");
    this.load.image("welcome", "assets/ui/templates/welcome.png");
    this.load.image("welcomeMobile", "assets/ui/mobile/welcome.png");
    this.load.image("leftButton", "assets/ui/buttons/left_button.png");
    this.load.image("rightButton", "assets/ui/buttons/right_button.png");
  }

  create() {
    this.bg = this.add
      .image(this.scale.width / 2, this.scale.height / 2, "background")
      .setDisplaySize(this.scale.width, this.scale.height);

    // Create white rectangle
    const insetFactor = 0.8;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const rectangleWidth = this.scale.width * insetFactor;
    const rectangleHeight = this.scale.height * insetFactor;
    this.whiteRectangle = this.add
      .rectangle(centerX, centerY, rectangleWidth, rectangleHeight, 0xffffff)
      .setStrokeStyle(4, 0x000000);

    // Initiate graphics
		const _welcomeImage = isMobileDevice() ? "welcomeMobile" : "welcome";
    this.welcomeImage = this.add.image(0, 0, _welcomeImage);
    this.leftButton = this.add.image(0, 0, "leftButton");
    this.rightButton = this.add.image(0, 0, "rightButton");

    this.leftButton
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        // console.log('Opening Player Select Screen');
        this.scene.start("PlayerSelectScreen");
      });

    this.rightButton
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        // console.log('Opening Tutorial Screen');
        this.scene.start("TutorialScreen");
      });

    if (backgroundMusic && backgroundMusic.key !== "lobbyMusic") {
      backgroundMusic.stop();
    }

    if (!backgroundMusic || backgroundMusic.key !== "lobbyMusic") {
      backgroundMusic = this.sound.add("lobbyMusic", { loop: true });
      backgroundMusic.play();
    }

    this.positionStartScreenElements = positionStartScreenElements.bind(this);
    this.positionStartScreenElements();
    this.scale.on("resize", this.positionStartScreenElements, this);
  }

  fitToContainer(image, maxWidth, maxHeight) {
    const scaleX = maxWidth / image.width;
    const scaleY = maxHeight / image.height;
    const scale = Math.min(scaleX, scaleY);
    image.setScale(scale);
  }

  cleanup() {
    // Common cleanup logic
    if (backgroundMusic) {
      backgroundMusic.stop();
      backgroundMusic.destroy();
    }

    // Remove timers
    this.time.removeAllEvents();

    // Destroy game objects
    this.children.list.forEach((child) => {
      if (child.active) {
        child.destroy();
      }
    });

    // Kill tweens
    if (this.tweens) {
      this.tweens.killAll();
    }
  }
}

class TutorialScreen extends Phaser.Scene {
  constructor() {
    super({ key: "TutorialScreen" });
  }

  preload() {
    this.load.image("background", "assets/background/sky.png");
    this.load.image("howToPlay", "assets/ui/templates/howtoplay.png");
    this.load.image("howToPlayMobile", "assets/ui/mobile/howtoplay.png");
    this.load.image("leftButton", "assets/ui/buttons/left_button.png");
    this.load.image("rightButton", "assets/ui/buttons/right_button.png");
  }

  create() {
    const bg = this.add
      .image(this.scale.width / 2, this.scale.height / 2, "background")
      .setDisplaySize(this.scale.width, this.scale.height);

    const insetFactor = 0.8;
    const rectangleWidth = this.scale.width * insetFactor;
    const rectangleHeight = this.scale.height * insetFactor;
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const whiteRectangle = this.add
      .rectangle(centerX, centerY, rectangleWidth, rectangleHeight, 0xffffff)
      .setStrokeStyle(4, 0x000000);

		const _howToPlayImage = isMobileDevice() ? "howToPlayMobile" : "howToPlay"
    const howToPlayImage = this.add.image(
      centerX,
      centerY - rectangleHeight * 0.1,
			_howToPlayImage
    );
    this.fitToContainer(
      howToPlayImage,
      rectangleWidth * 0.9,
      rectangleHeight * 0.6
    );

    const leftButton = this.add.image(
      centerX - rectangleWidth * 0.15,
      centerY + rectangleHeight * 0.3,
      "leftButton"
    );
    this.fitToContainer(leftButton, 48, 48);

    const rightButton = this.add.image(
      centerX + rectangleWidth * 0.15,
      centerY + rectangleHeight * 0.3,
      "rightButton"
    );
    this.fitToContainer(rightButton, 48, 48);

    leftButton.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      // console.log('Returning to Start Screen');
      this.scene.start("StartScreen");
    });

    rightButton
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        // console.log('Proceeding to Player Select Screen');
        this.scene.start("PlayerSelectScreen");
      });
  }

  fitToContainer(image, maxWidth, maxHeight) {
    const scaleX = maxWidth / image.width;
    const scaleY = maxHeight / image.height;
    const scale = Math.min(scaleX, scaleY);
    image.setScale(scale);
  }

  cleanup() {
    // Common cleanup logic
    if (backgroundMusic) {
      backgroundMusic.stop();
      backgroundMusic.destroy();
    }

    // Remove timers
    this.time.removeAllEvents();

    // Destroy game objects
    this.children.list.forEach((child) => {
      if (child.active) {
        child.destroy();
      }
    });

    // Kill tweens
    if (this.tweens) {
      this.tweens.killAll();
    }
  }
}

class PlayerSelectScreen extends Phaser.Scene {
  constructor() {
    super({ key: "PlayerSelectScreen" });
    this.selectedCharacter = null;
  }

  preload() {
    this.load.image("background", "assets/background/sky.png");
    this.load.image("femaleCharacter", "assets/ui/female.png");
    this.load.image("maleCharacter", "assets/ui/male.png");
    this.load.image("playButton", "assets/ui/buttons/play.png");
    this.load.image("chooseYourCharacter", "assets/ui/templates/cyc.png");
  }

  create() {
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "background"
    );
    bg.setDisplaySize(this.scale.width, this.scale.height);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;
    const bannerHeight = 400;
    const bannerWidth = 600;

    const whiteRectangle = this.add
      .rectangle(centerX, centerY, bannerWidth, bannerHeight, 0xffffff)
      .setStrokeStyle(4, 0x000000);
    const cycImage = this.add.image(
      centerX,
      centerY - bannerHeight / 2 + 50,
      "chooseYourCharacter"
    );
    cycImage.setDisplaySize(400, 25);

    const characterSize = 150;
    const characterOffset = bannerWidth * 0.2;

    const femaleCharacter = this.add
      .image(centerX - characterOffset, centerY, "femaleCharacter")
      .setDisplaySize(characterSize, characterSize)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectedCharacter = "female";
        highlightSelected(femaleCharacter, maleCharacter);
      });

    const maleCharacter = this.add
      .image(centerX + characterOffset, centerY, "maleCharacter")
      .setDisplaySize(characterSize, characterSize)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.selectedCharacter = "male";
        highlightSelected(maleCharacter, femaleCharacter);
      });

    const playButton = this.add
      .image(centerX, centerY + bannerHeight * 0.35, "playButton")
      .setDisplaySize(120, 40)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    function highlightSelected(selected, other) {
      selected.setTint(0x00ff00);
      other.clearTint();
      playButton.setVisible(true);
    }

    playButton.on("pointerdown", () => {
      if (this.selectedCharacter) {
        console.log("Starting Level 1 with character:", this.selectedCharacter);
        this.scene.start("Level1Scene", { character: this.selectedCharacter });
      }
    });
  }

  cleanup() {
    // Common cleanup logic
    if (backgroundMusic) {
      backgroundMusic.stop();
      backgroundMusic.destroy();
    }

    // Remove timers
    this.time.removeAllEvents();

    // Destroy game objects
    this.children.list.forEach((child) => {
      if (child.active) {
        child.destroy();
      }
    });

    // Kill tweens
    if (this.tweens) {
      this.tweens.killAll();
    }
  }
}

class Level2Transition extends Phaser.Scene {
  constructor() {
    super({ key: "Level2Transition" });
  }

  init(data) {
    this.livesCount = data.livesCount;
    this.selectedCharacter = data.character;
  }

  preload() {
    this.load.image("skyBackground", "assets/background/sky.png");
    this.load.image("transitionImage2", "assets/ui/templates/level2.png");
    this.load.image("playButton", "assets/ui/buttons/play.png");
  }

  create() {
    //play transition music
    if (backgroundMusic) {
      backgroundMusic.stop();
    }
    this.sound.play("levelUpSound");
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "skyBackground"
    );
    bg.setDisplaySize(this.scale.width, this.scale.height);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const whiteRectangle = this.add
      .rectangle(centerX, centerY, 380, 460, 0xffffff)
      .setStrokeStyle(4, 0x000000);
    const transitionImage2 = isMobileDevice() ? this.add
      .image(centerX, centerY - 40, "transitionImage2")
      .setDisplaySize(200, 200) : 
			this.add
      .image(centerX, centerY - 20, "transitionImage2")
      .setDisplaySize(320, 325);

    const playButton = isMobileDevice()
      ? this.add
          .image(centerX, centerY + 100, "playButton")
          .setDisplaySize(120, 40)
          .setInteractive({ useHandCursor: true })
      : this.add
          .image(centerX, centerY + 200, "playButton")
          .setDisplaySize(120, 40)
          .setInteractive({ useHandCursor: true });

    playButton.on("pointerdown", () => {
      this.scene.start("Level2Scene", {
        livesCount: this.livesCount,
        character: this.selectedCharacter,
      });
    });
  }
}

class Level3Transition extends Phaser.Scene {
  constructor() {
    super({ key: "Level3Transition" });
  }

  init(data) {
    this.livesCount = data.livesCount;
    this.selectedCharacter = data.character;
  }

  preload() {
    this.load.image("skyBackground", "assets/background/sky.png");
    this.load.image("transitionImage3", "assets/ui/templates/level3.png");
    this.load.image("playButton", "assets/ui/buttons/play.png");
  }

  create() {
    //play transition music
    if (backgroundMusic) {
      backgroundMusic.stop();
    }
    this.sound.play("levelUpSound");
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "skyBackground"
    );
    bg.setDisplaySize(this.scale.width, this.scale.height);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const whiteRectangle = this.add
      .rectangle(centerX, centerY, 380, 460, 0xffffff)
      .setStrokeStyle(4, 0x000000);

    const transitionImage3 = isMobileDevice()
      ? this.add
          .image(centerX, centerY - 40, "transitionImage3")
          .setDisplaySize(200, 200)
      : this.add
          .image(centerX, centerY - 20, "transitionImage3")
          .setDisplaySize(320, 325);

		const playButton = isMobileDevice()
      ? this.add
          .image(centerX, centerY + 100, "playButton")
          .setDisplaySize(120, 40)
          .setInteractive({ useHandCursor: true })
      : this.add
          .image(centerX, centerY + 200, "playButton")
          .setDisplaySize(120, 40)
          .setInteractive({ useHandCursor: true });

    playButton.on("pointerdown", () => {
      this.scene.start("Level3Scene", {
        livesCount: this.livesCount,
        character: this.selectedCharacter,
      });
    });
  }
}

class YouWonScene extends Phaser.Scene {
  constructor() {
    super({ key: "YouWonScene" });
  }

  init(data) {
    // Accept the four score attributes passed into this scene
    this.checkingScore = data.checkingScore || 0;
    this.savingsScore = data.savingsScore || 0;
    this.businessScore = data.businessScore || 0;
    this.retirementScore = data.retirementScore || 0;
  }

  preload() {
    // Load static assets
    this.load.image("background", "assets/background/sky.png");
    this.load.image("gameOverBanner", "assets/ui/templates/youWon.png");
    this.load.image("playAgainButton", "assets/ui/buttons/playagain.png");

    // Load benefit meter textures
    for (let i = 1; i <= 5; i++) {
      this.load.image(
        `benefitPurple-${i}`,
        `assets/ui/scoring/tongo_UI_benefit-meter_purple-0${i - 1}.png`
      );
      this.load.image(
        `benefitGreen-${i}`,
        `assets/ui/scoring/tongo_UI_benefit-meter_green-0${i - 1}.png`
      );
      this.load.image(
        `benefitYellow-${i}`,
        `assets/ui/scoring/tongo_UI_benefit-meter_yellow-0${i - 1}.png`
      );
      this.load.image(
        `benefitRed-${i}`,
        `assets/ui/scoring/tongo_UI_benefit-meter_red-0${i - 1}.png`
      );
    }
  }

  create() {
    if (backgroundMusic) {
      backgroundMusic.stop();
    }
    //play you won music
    // this.sound.play("youWonSound");
    const { width, height } = this.scale;

    // Add the sky background
    const bg = this.add
      .image(width / 2, height / 2, "background")
      .setDisplaySize(width, height);

    // Create the white rectangle with initial border properties
    const rectWidth = width * 0.85;
    const rectHeight = height * 0.85;
    const whiteRectangle = this.add
      .rectangle(width / 2, height / 2, rectWidth, rectHeight, 0xffffff)
      .setStrokeStyle(4, 0x000000); // Start with border thickness 4 and black color

    this.time.addEvent({
      delay: 0.333, // Delay of 1 second between toggles
      loop: true, // Repeat the toggle indefinitely
      callback: () => {
        if (whiteRectangle.strokeColor === 0x000000) {
          // Change to purple thin border
          whiteRectangle.setStrokeStyle(4, 0x6d0dd5); // Thin purple border
        } else {
          // Change to black thick border
          whiteRectangle.setStrokeStyle(6, 0x000000); // Thick black border
        }
      },
    });

    // Add the "You Won" banner
    const banner = this.add
      .image(width / 2, height * 0.28, "gameOverBanner")
      .setDisplaySize(rectWidth * 1.1 * 0.85, rectHeight * 0.5 * 0.85);

    // Define score attributes
    const scoreAttributes = [
      {
        label: "Direct\nDeposit",
        score: this.checkingScore,
        color: "benefitPurple",
      },
      {
        label: "Savings For\nTaxes",
        score: this.savingsScore,
        color: "benefitGreen",
      },
      {
        label: "Investments",
        score: this.businessScore,
        color: "benefitYellow",
      },
      { label: "Retirement", score: this.retirementScore, color: "benefitRed" },
    ];

    // Define columns for vertical layout
    const columns = scoreAttributes.length;
    const columnWidth = rectWidth / columns;

    scoreAttributes.forEach((attr, index) => {
      const colX =
        index * columnWidth + width / 2 - rectWidth / 2 + columnWidth / 2;
      const colYStart = height / 2 - rectHeight / 4 + (isMobileDevice() ? 70 : 130);

      // Display the attribute label
      this.add
        .text(colX, colYStart, attr.label, {
          fontFamily: "pixelFont",
          fontSize: isMobileDevice() ? "10px" : "14px",
          color: "#000000",
          align: "center",
        })
        .setOrigin(0.5);

      // Display the score value below the label
      const scoreValue = `$${attr.score}k`;
      this.add
        .text(colX, colYStart + (isMobileDevice() ? 20 : 40), scoreValue, {
          fontFamily: "pixelFont",
          fontSize: isMobileDevice() ? "14px" : "17px",
          color: "#000000",
          align: "center",
        })
        .setOrigin(0.5);

      // Display the meter below the score value
      const meterTexture = this.getMeterTexture(attr.color, attr.score);
      const meterImage = this.add.image(
        colX,
        colYStart + (isMobileDevice() ? 40 : 80),
        meterTexture
      );
      isMobileDevice() ? meterImage.setDisplaySize(80, 20).setOrigin(0.5) : meterImage.setDisplaySize(120, 30).setOrigin(0.5);
    });

    // Add Total Score below the columns
    const totalScore =
      this.checkingScore +
      this.savingsScore +
      this.businessScore +
      this.retirementScore;
    const totalScoreY = height * (isMobileDevice() ? 0.7 : 0.75);
    this.add
      .text(width / 2, totalScoreY, `Total Score: $${totalScore}k`, {
        fontFamily: "pixelFont",
        fontSize: "22px",
        color: "#000000",
        align: "center",
      })
      .setOrigin(0.5);

    // Play Again button
    const playButton = this.add
      .image(width / 2, height * 0.85, "playAgainButton")
      .setDisplaySize(220, 60)
      .setInteractive();

    playButton.on("pointerdown", () => {
      this.scene.start("StartScreen", { character: this.selectedCharacter });
    });
  }

  // Utility function to get the appropriate meter texture based on the score
  getMeterTexture(color, score) {
    const level = Math.ceil(score / 200); // Assuming scores are out of 1000
    return `${color}-${Math.max(1, Math.min(5, level))}`;
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  init(data) {
    // Accept the four score attributes passed into this scene
    this.checkingScore = data.checkingScore || 0;
    this.savingsScore = data.savingsScore || 0;
    this.businessScore = data.businessScore || 0;
    this.retirementScore = data.retirementScore || 0;
    this.selectedCharacter = data.character;
  }

  preload() {
    // Load static assets for the UI elements
    this.load.image("youLose", "assets/ui/templates/gameOver.png");
    this.load.image("playAgainButton", "assets/ui/buttons/playagain.png");

    // Load benefit meter textures
    for (let i = 1; i <= 5; i++) {
      this.load.image(
        `benefitPurple-${i}`,
        `assets/ui/scoring/tongo_UI_benefit-meter_purple-0${i - 1}.png`
      );
      this.load.image(
        `benefitGreen-${i}`,
        `assets/ui/scoring/tongo_UI_benefit-meter_green-0${i - 1}.png`
      );
      this.load.image(
        `benefitYellow-${i}`,
        `assets/ui/scoring/tongo_UI_benefit-meter_yellow-0${i - 1}.png`
      );
      this.load.image(
        `benefitRed-${i}`,
        `assets/ui/scoring/tongo_UI_benefit-meter_red-0${i - 1}.png`
      );
    }
  }

  create() {
    if (backgroundMusic) {
      backgroundMusic.stop();
    }
    //play game over music
    // this.sound.play("gameOverSound");
    const { width, height } = this.scale;

    // Create a black rectangle to fill the entire screen
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

    // After a 3-second delay, show the white rectangle and other UI elements
    this.time.delayedCall(3000, () => {
      // Add the white rectangle for the UI boundary
      const rectWidth = width * 0.85;
      const rectHeight = height * 0.85;
      const whiteRectangle = this.add
        .rectangle(width / 2, height / 2, rectWidth, rectHeight, 0xffffff)
        .setStrokeStyle(4, 0x000000);

      // Add the game over banner
      const banner = this.add
        .image(width / 2, height * 0.27 + 20, "youLose")
        .setDisplaySize(rectWidth * 0.9, rectHeight * 0.3 + 30);

      // Define score attributes
      const scoreAttributes = [
        {
          label: "Direct\nDeposit",
          score: this.checkingScore,
          color: "benefitPurple",
        },
        {
          label: "Saving For\nTaxes",
          score: this.savingsScore,
          color: "benefitGreen",
        },
        {
          label: "Investments",
          score: this.businessScore,
          color: "benefitYellow",
        },
        {
          label: "Retirement",
          score: this.retirementScore,
          color: "benefitRed",
        },
      ];

      // Define columns for layout
      const columns = scoreAttributes.length;
      const columnWidth = rectWidth / columns;

      // Layout each score attribute in a vertical stack (name, value, meter) within its own column
      scoreAttributes.forEach((attr, index) => {
        const colX =
          index * columnWidth + width / 2 - rectWidth / 2 + columnWidth / 2;
				const colYStart = height / 2 - rectHeight / 4 + (isMobileDevice() ? 70 : 130);

        // Display the attribute label
        this.add
          .text(colX, colYStart, attr.label, {
            fontFamily: "pixelFont",
            fontSize: isMobileDevice() ? "10px" : "14px",
            color: "#000000",
            align: "center",
          })
          .setOrigin(0.5);

        // Display the score value below the label
        const scoreValue = `$${attr.score}k`;
        this.add
				  .text(colX, colYStart + (isMobileDevice() ? 20 : 40), scoreValue, {
            fontFamily: "pixelFont",
            fontSize: isMobileDevice() ? "14px" : "17px",
            color: "#000000",
            align: "center",
          })
          .setOrigin(0.5);

        // Display the meter below the score value
        const meterTexture = this.getMeterTexture(attr.color, attr.score);
				const meterImage = this.add.image(
          colX,
          colYStart + (isMobileDevice() ? 40 : 80),
          meterTexture
        );
				isMobileDevice() ? meterImage.setDisplaySize(80, 20).setOrigin(0.5) : meterImage.setDisplaySize(120, 30).setOrigin(0.5);
      });

      // Add Total Score below the columns
      const totalScore =
        this.checkingScore +
        this.savingsScore +
        this.businessScore +
        this.retirementScore;
			const totalScoreY = height * (isMobileDevice() ? 0.7 : 0.75);
      this.add
        .text(width / 2, totalScoreY, `Total Score: $${totalScore}k`, {
          fontFamily: "pixelFont",
          fontSize: "22px",
          color: "#000000",
          align: "center",
        })
        .setOrigin(0.5);

      // Play Again button
      const playButton = this.add
        .image(width / 2, height * 0.85, "playAgainButton")
        .setDisplaySize(260, 60)
        .setInteractive();

      playButton.on("pointerdown", () => {
        this.scene.start("StartScreen", { character: this.selectedCharacter });
      });
    });
  }

  // Utility function to get the appropriate meter texture based on the score
  getMeterTexture(color, score) {
    const level = Math.ceil(score / 200); // Assuming scores are out of 1000
    return `${color}-${Math.max(1, Math.min(5, level))}`;
  }
}

// Main Phaser configuration for the game
const config = {
  type: Phaser.AUTO,
  width: isMobileDevice() ? window.innerWidth : 800, // Set width to the full width of the window
  height: isMobileDevice() ? window.innerHeight : 600, // Set height to the full height of the window
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 250 },
    },
  },
  scene: [
    StartScreen,
    PlayerSelectScreen,
    TutorialScreen,
    Level1Scene,
    Level2Transition,
    Level2Scene,
    Level3Transition,
    Level3Scene,
    YouWonScene,
    GameOverScene,
  ],
  scale: isMobileDevice()
    ? {
        mode: Phaser.Scale.RESIZE,
      }
    : null,
  autoCenter: true,
  pixelArt: !isMobileDevice(),
  backgroundColor: "#1b1b1b",
};

function checkOrientation() {
  if (window.screen.orientation.type.startsWith("portrait")) {
    // Show a message to rotate the device
    document.getElementById("orientation-message").style.display = "block";
  } else {
    // Hide the message when in landscape
    document.getElementById("orientation-message").style.display = "none";
  }
}

function adjustGameSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const adjustedWidth = Math.max(width, document.documentElement.clientWidth);
  const adjustedHeight = Math.max(
    height,
    document.documentElement.clientHeight
  );

  if (game) {
    game.scale.resize(adjustedWidth, adjustedHeight);
  }
}

function destroyGame() {
  const oldContainer = document.getElementById("gameContainer");
  if (oldContainer) {
    oldContainer.remove(); // Remove the container from the DOM
  }
  const newContainer = document.createElement("div");
  newContainer.id = "gameContainer";
  document.body.appendChild(newContainer); // Add new container to the DOM
}

function initializeGame(config) {
  config.parent = "gameContainer";
  game = new Phaser.Game(config);
}

function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

// Initialize the Phaser game with the config
if (!isMobileDevice()) {
	initializeGame(config)
}
if (isMobileDevice()) {
	if(isLandscape()) {
		initializeGame(config);
	} else {
		pleaseRotate.style.display = "flex";
	}
}

// Function to handle game reinitialization
function handleOrientationChange() {
  if (isMobileDevice()) {
		if(isLandscape()) {
			pleaseRotate.style.display = "none";
			destroyGame();
  		config.width = window.innerWidth;
  		config.height = window.innerHeight;
  		initializeGame(config);
  	} else {
			pleaseRotate.style.display = "flex";
			destroyGame();
		}
	}
}

// Listen for the resize event to handle orientation changes
window.addEventListener("resize", () => {
  clearTimeout(window.resizing);
  window.resizing = setTimeout(() => {
		handleOrientationChange();
		adjustGameSize();
	}, 200);
});

/*
window.addEventListener("load", function () {
  setTimeout(function () {
    window.scrollTo(0, 1);
  }, 0);
});
*/
