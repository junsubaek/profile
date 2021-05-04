(() => {
  const canvas = document.querySelector(".profile canvas");
  const canvasContainer = document.querySelector(".canvas-container");
  const ctx = canvas.getContext("2d");
  const screenBackground = new Image();
  const blueScreenImage = new Image();
  const modeControlBtn = document.querySelector(".mode-control");
  const backGround = document.querySelectorAll(".background");
  let startFlag = false;
  let shutDownFlag = false;
  let moveArrowFlag = true;
  let lines = [];
  let lineAnimationCount = 0;
  let changeColorWeight = 0;
  let changeColorStart = 0;
  let directionCount = 0;
  let emptyAnimationCount = 0;
  screenBackground.src = "screenBackground.png";
  blueScreenImage.src = "bluescreen.png";

  modeControlBtn.addEventListener("click", (e) => {
    if (e.target.dataset.mode === "light") {
      changeBackgroundImage("#72cbf7", "#7fac70", "url(background2.png)");
    } else {
      changeBackgroundImage("#1c246d", "#242056", "url(background.png)");
    }
  });

  const changeBackgroundImage = (topColor, bottomColor, otherSideColor) => {
    backGround.forEach((wall) => {
      if (wall.classList.contains("top")) {
        wall.style.backgroundColor = topColor;
      } else if (wall.classList.contains("bottom")) {
        wall.style.backgroundColor = bottomColor;
      } else if (wall.classList.contains("left")) {
        wall.style.backgroundImage = otherSideColor;
      } else if (wall.classList.contains("right")) {
        wall.style.backgroundImage = otherSideColor;
      } else {
        wall.style.backgroundImage = otherSideColor;
      }
    });
  };

  const drawStartScreen = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#80ff02";
    ctx.font = "bold 25px sans-serif";
    ctx.fillText("MANUAL", canvas.width * 0.1, canvas.height * 0.2);
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("START: 시작", canvas.width * 0.1, canvas.height * 0.35);
    ctx.fillText("SHUTDOWN: 종료", canvas.width * 0.1, canvas.height * 0.45);
    ctx.fillText("PREV: 화살표 이동", canvas.width * 0.1, canvas.height * 0.55);
    ctx.fillText("NEXT: 화살표 이동", canvas.width * 0.1, canvas.height * 0.65);
    ctx.fillText(
      "ENTER: 페이지 들어가기",
      canvas.width * 0.1,
      canvas.height * 0.75
    );
    ctx.fillText(
      "ESC: 페이지 나가기",
      canvas.width * 0.1,
      canvas.height * 0.85
    );
  };

  const initializeScreeen = () => {
    drawStartScreen();
    shutDownFlag = false;
    startFlag = false;
  };

  const setSizeCanvas = () => {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
    initializeScreeen();
  };

  setSizeCanvas();
  window.addEventListener("resize", setSizeCanvas);

  const makeBlueLines = () => {
    if (lines.length < 10) {
      lines.push({
        x: 0,
        y: 0,
        speed: Math.random() * 3,
        width: canvas.width,
        height: Math.random() * 2,
        color: "#0041C2",
      });
    }
  };

  const updateBlueLines = () => {
    for (let line of lines) {
      line.y += line.speed;
    }
  };

  const killBlueLines = () => {
    for (let line of lines) {
      if (line.y > canvas.height) {
        line.y = 0;
      }
    }
  };

  const drawBlueLines = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let line of lines) {
      ctx.fillStyle = line.color;
      ctx.fillRect(line.x, line.y, line.width, line.height);
    }
  };

  const lineLoop = () => {
    const lineAnimation = window.requestAnimationFrame(lineLoop);
    makeBlueLines();
    updateBlueLines();
    killBlueLines();
    drawBlueLines();
    lineAnimationCount++;
    if (lineAnimationCount === 250) {
      window.cancelAnimationFrame(lineAnimation);
      ctx.drawImage(blueScreenImage, 0, 0, canvas.width, canvas.height);
      setTimeout(() => {
        invertBackgroundImage();
        window.requestAnimationFrame(changeColorLoop);
        lines = [];
        lineAnimationCount = 0;
      }, 2000);
    }
  };

  const invertBackgroundImage = () => {
    ctx.drawImage(screenBackground, 0, 0, canvas.width, canvas.height);
    const screenBackgroundData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    for (let i = 0; i < canvas.width * canvas.height; i++) {
      const index = i * 4;
      screenBackgroundData.data[index] = 255 - screenBackgroundData.data[index];
      screenBackgroundData.data[index + 1] =
        255 - screenBackgroundData.data[index + 1];
      screenBackgroundData.data[index + 2] =
        255 - screenBackgroundData.data[index + 2];
    }
    ctx.putImageData(screenBackgroundData, 0, 0);
  };

  const changeColorLoop = () => {
    const screenBackgroundData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    const changeColorAnimation = window.requestAnimationFrame(changeColorLoop);
    for (
      let i = changeColorStart;
      i < canvas.width * changeColorWeight;
      i += 4
    ) {
      screenBackgroundData.data[i] = 255 - screenBackgroundData.data[i];
      screenBackgroundData.data[i + 1] = 255 - screenBackgroundData.data[i + 1];
      screenBackgroundData.data[i + 2] = 255 - screenBackgroundData.data[i + 2];
    }
    changeColorStart = canvas.width * changeColorWeight;

    changeColorWeight += 10;
    ctx.putImageData(screenBackgroundData, 0, 0);

    if (changeColorWeight > canvas.height * 4) {
      window.cancelAnimationFrame(changeColorAnimation);
      changeColorWeight = 0;
      changeColorStart = 0;
      startFlag = true;
      shutDownFlag = true;
      drawArrow();
    }
  };

  const titleInfo = [
    {
      //PROFILE
      width: canvas.width * 0.1,
      height: canvas.height * 0.2,
    },
    {
      //SKILL
      width: canvas.width * 0.1,
      height: canvas.height * 0.3,
    },
    {
      //PROJECT
      width: canvas.width * 0.1,
      height: canvas.height * 0.4,
    },
    {
      //CONTACT
      width: canvas.width * 0.1,
      height: canvas.height * 0.5,
    },
  ];

  const arrowInfo = {
    width: canvas.width * 0.05,
  };

  const drawArrow = (direction) => {
    ctx.drawImage(screenBackground, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 17px sans-serif";
    ctx.fillStyle = "black";
    switch (direction) {
      case "next":
        directionCount++;
        if (directionCount === 4) {
          directionCount = 0;
        }
        ctx.fillText("=>", arrowInfo.width, titleInfo[directionCount].height);
        break;
      case "prev":
        {
          directionCount--;
          if (directionCount === -1) {
            directionCount = 3;
          }
          ctx.fillText("=>", arrowInfo.width, titleInfo[directionCount].height);
        }
        break;
      default:
        ctx.fillText("=>", arrowInfo.width, titleInfo[directionCount].height);
        break;
    }
    ctx.fillStyle = "#0041C2";
    ctx.fillText("PROFILE", titleInfo[0].width, titleInfo[0].height);
    ctx.fillText("SKILL", titleInfo[1].width, titleInfo[1].height);
    ctx.fillText("PROJECT", titleInfo[2].width, titleInfo[2].height);
    ctx.fillText("CONTACT", titleInfo[3].width, titleInfo[3].height);
  };

  const drawProfilePage = () => {
    ctx.fillStyle = "#0041C2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f7e600";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("PROFILE", canvas.width * 0.1, canvas.height * 0.25);
    ctx.fillStyle = "white";
    ctx.font = "bold 17px sans-serif";
    ctx.fillText("NAME: BAEK JIN SU", canvas.width * 0.1, canvas.height * 0.4);
    ctx.fillText(
      "DATE-OF-BIRTH: MAY 2, 1993",
      canvas.width * 0.1,
      canvas.height * 0.5
    );
    ctx.fillText("AGE: 29", canvas.width * 0.1, canvas.height * 0.6);
    ctx.fillText("SEX: M", canvas.width * 0.1, canvas.height * 0.7);
    ctx.fillText(
      "ROOMMATE: CAT(REY,F,3)",
      canvas.width * 0.1,
      canvas.height * 0.8
    );
  };

  const gaugeInfo = {
    X: canvas.width * 0.25,
    Y: canvas.height * 0.28,
    Y2: canvas.height * 0.45,
    Y3: canvas.height * 0.62,
    Y4: canvas.height * 0.79,
    BAR_WIDTH: canvas.width * 0.5,
    BAR_HEIGHT: canvas.height * 0.07,
    JS: { width: 0, score: 0 },
    HTML_CSS: { width: 0, score: 0 },
    REACT: { width: 0, score: 0 },
    VUE: { width: 0, score: 0 },
    SCORE_X: canvas.width * 0.8,
  };

  const drawGauge = () => {
    ctx.fillStyle = "#0041C2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      gaugeInfo.X,
      gaugeInfo.Y,
      gaugeInfo.BAR_WIDTH,
      gaugeInfo.BAR_HEIGHT
    );
    ctx.strokeRect(
      gaugeInfo.X,
      gaugeInfo.Y2,
      gaugeInfo.BAR_WIDTH,
      gaugeInfo.BAR_HEIGHT
    );
    ctx.strokeRect(
      gaugeInfo.X,
      gaugeInfo.Y3,
      gaugeInfo.BAR_WIDTH,
      gaugeInfo.BAR_HEIGHT
    );
    ctx.strokeRect(
      gaugeInfo.X,
      gaugeInfo.Y4,
      gaugeInfo.BAR_WIDTH,
      gaugeInfo.BAR_HEIGHT
    );

    ctx.font = "bold 27px sans-serif";
    ctx.fillStyle = "#f7e600";
    ctx.fillText("SKILL", canvas.width * 0.42, canvas.height * 0.2);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("JS", canvas.width * 0.15, canvas.height * 0.34);
    ctx.fillText(`HTML`, canvas.width * 0.11, canvas.height * 0.47);
    ctx.fillText(`CSS`, canvas.width * 0.13, canvas.height * 0.55);
    ctx.fillText("REACT", canvas.width * 0.09, canvas.height * 0.68);
    ctx.fillText("VUE", canvas.width * 0.13, canvas.height * 0.85);

    ctx.fillText(gaugeInfo.JS.score, gaugeInfo.SCORE_X, canvas.height * 0.34);
    ctx.fillText(
      gaugeInfo.HTML_CSS.score,
      gaugeInfo.SCORE_X,
      canvas.height * 0.51
    );
    ctx.fillText(
      gaugeInfo.REACT.score,
      gaugeInfo.SCORE_X,
      canvas.height * 0.68
    );
    ctx.fillText(gaugeInfo.VUE.score, gaugeInfo.SCORE_X, canvas.height * 0.85);

    ctx.fillStyle = "#80ff02";
    ctx.fillRect(
      gaugeInfo.X,
      gaugeInfo.Y,
      gaugeInfo.JS.width,
      gaugeInfo.BAR_HEIGHT
    );
    ctx.fillRect(
      gaugeInfo.X,
      gaugeInfo.Y2,
      gaugeInfo.HTML_CSS.width,
      gaugeInfo.BAR_HEIGHT
    );
    ctx.fillRect(
      gaugeInfo.X,
      gaugeInfo.Y3,
      gaugeInfo.REACT.width,
      gaugeInfo.BAR_HEIGHT
    );
    ctx.fillRect(
      gaugeInfo.X,
      gaugeInfo.Y4,
      gaugeInfo.VUE.width,
      gaugeInfo.BAR_HEIGHT
    );
  };

  const expandGaugeWidth = () => {
    if (gaugeInfo.JS.width <= gaugeInfo.BAR_WIDTH * 0.64) {
      gaugeInfo.JS.width += 2;
    }
    if (gaugeInfo.HTML_CSS.width <= gaugeInfo.BAR_WIDTH * 0.63) {
      gaugeInfo.HTML_CSS.width += 2;
    }
    if (gaugeInfo.REACT.width <= gaugeInfo.BAR_WIDTH * 0.24) {
      gaugeInfo.REACT.width += 2;
    }
    if (gaugeInfo.VUE.width <= gaugeInfo.BAR_WIDTH * 0.06) {
      gaugeInfo.VUE.width += 2;
    }
  };

  const increaseScore = () => {
    if (gaugeInfo.JS.score <= 64) {
      gaugeInfo.JS.score += 1;
    }
    if (gaugeInfo.HTML_CSS.score <= 63) {
      gaugeInfo.HTML_CSS.score += 1;
    }
    if (gaugeInfo.REACT.score < 24) {
      gaugeInfo.REACT.score += 1;
    }
    if (gaugeInfo.VUE.score < 6) {
      gaugeInfo.VUE.score += 1;
    }
  };

  const drawSkillPage = () => {
    const gaugeAnimation = window.requestAnimationFrame(drawSkillPage);
    drawGauge();
    expandGaugeWidth();
    increaseScore();
    if (
      gaugeInfo.JS.width > gaugeInfo.BAR_WIDTH * 0.64 &&
      gaugeInfo.JS.score > 64
    ) {
      window.cancelAnimationFrame(gaugeAnimation);
      gaugeInfo.JS.width = 0;
      gaugeInfo.JS.score = 0;
      gaugeInfo.HTML_CSS.width = 0;
      gaugeInfo.HTML_CSS.score = 0;
      gaugeInfo.REACT.width = 0;
      gaugeInfo.REACT.score = 0;
      gaugeInfo.VUE.width = 0;
      gaugeInfo.VUE.score = 0;
    }
  };

  const drawEmptyScreen = () => {
    const emptyAnimation = window.requestAnimationFrame(drawEmptyScreen);
    const colors = [
      "#FAEB2C",
      "#F52789",
      "#E900FF",
      "#1685F8",
      "#3D144C",
      "#00F92A",
    ];

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < canvas.width; i += canvas.width / 100) {
      for (let j = 0; j < canvas.height; j += canvas.height / 100) {
        ctx.fillStyle = colors[parseInt(Math.random() * colors.length)];
        ctx.fillRect(i, j, canvas.width / 100, canvas.height / 100);
      }
    }

    ctx.fillStyle = "white";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText("EMPTY", canvas.width * 0.35, canvas.height * 0.55);

    emptyAnimationCount++;
    if (emptyAnimationCount > 120) {
      window.cancelAnimationFrame(emptyAnimation);
      drawArrow();
      moveArrowFlag = true;
      emptyAnimationCount = 0;
    }
  };

  const drawProjectPage = () => {
    window.requestAnimationFrame(drawEmptyScreen);
  };

  const drawContactPage = () => {
    ctx.fillStyle = "#0041C2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "bold 30px sans-serif";
    ctx.fillStyle = "#f7e600";
    ctx.fillText("CONTACT", canvas.width * 0.1, canvas.height * 0.25);
    ctx.font = "bold 17px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(
      "MOBILE: 010-3387-5167",
      canvas.width * 0.1,
      canvas.height * 0.5
    );
    ctx.fillText(
      "E-MAIL: bjinsu93@gmail.com",
      canvas.width * 0.1,
      canvas.height * 0.6
    );
    ctx.fillText(
      "GITHUB: github.com/junsubaek",
      canvas.width * 0.1,
      canvas.height * 0.7
    );
  };

  const shutDownRectInfo = {
    rectColor: "black",
    rect1: {
      x: 0,
      y: 0,
      width: canvas.width,
      height: 0,
    },
    rect2: {
      x: 0,
      y: canvas.height,
      width: canvas.width,
      height: 0,
    },
  };

  const updateShutDownRect = () => {
    shutDownRectInfo.rect1.height += 20;
    shutDownRectInfo.rect2.y -= 20;
    shutDownRectInfo.rect2.height += 20;
  };

  const drawShutDownRect = () => {
    ctx.fillStyle = shutDownRectInfo.rectColor;
    ctx.fillRect(
      shutDownRectInfo.rect1.x,
      shutDownRectInfo.rect1.y,
      shutDownRectInfo.rect1.width,
      shutDownRectInfo.rect1.height
    );
    ctx.fillRect(
      shutDownRectInfo.rect2.x,
      shutDownRectInfo.rect2.y,
      shutDownRectInfo.rect2.width,
      shutDownRectInfo.rect2.height
    );
  };

  const shutDownLoop = () => {
    const shutDownAnimation = window.requestAnimationFrame(shutDownLoop);
    drawShutDownRect();
    updateShutDownRect();
    if (
      shutDownRectInfo.rect1.height > canvas.height / 2 &&
      shutDownRectInfo.rect2.y < canvas.height / 2 &&
      shutDownRectInfo.rect2.height > canvas.height / 2
    ) {
      window.cancelAnimationFrame(shutDownAnimation);
      shutDownRectInfo.rect1.height = 0;
      shutDownRectInfo.rect2.y = canvas.height;
      shutDownRectInfo.rect2.height = 0;
      lastScreenLoop();
    }
  };

  const lastScreenInfo = {
    x: canvas.width,
    y: canvas.height * 0.53,
  };

  const updateLastScreen = () => {
    lastScreenInfo.x -= 2;
  };

  const drawLastScreen = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#80ff02";
    ctx.font = "bold 40px sans-serif";
    ctx.fillText("GOOD BYE!", lastScreenInfo.x, lastScreenInfo.y);
  };

  const lastScreenLoop = () => {
    const lastScreenAnimation = window.requestAnimationFrame(lastScreenLoop);
    drawLastScreen();
    updateLastScreen();
    if (lastScreenInfo.x === -canvas.width) {
      window.cancelAnimationFrame(lastScreenAnimation);
      drawStartScreen();
      lastScreenInfo.x = canvas.width;
      shutDownFlag = false;
      startFlag = false;
    }
  };

  const enterPage = () => {
    switch (titleInfo[directionCount].height) {
      case titleInfo[0].height:
        drawProfilePage();
        moveArrowFlag = false;
        break;
      case titleInfo[1].height:
        window.requestAnimationFrame(drawSkillPage);
        moveArrowFlag = false;
        break;
      case titleInfo[2].height:
        drawProjectPage();
        moveArrowFlag = false;
        break;
      case titleInfo[3].height:
        drawContactPage();
        moveArrowFlag = false;
        break;
      default:
        break;
    }
  };

  window.onload = () => {
    const controlButtons = {
      startBtn: document.querySelector(".start"),
      shutDownBtn: document.querySelector(".shut-down"),
      enterBtn: document.querySelector(".enter"),
      escBtn: document.querySelector(".esc"),
      nextBtn: document.querySelector(".next"),
      prevBtn: document.querySelector(".prev"),
    };

    drawStartScreen();

    controlButtons.startBtn.addEventListener("click", () => {
      if (!startFlag) lineLoop();
    });

    controlButtons.shutDownBtn.addEventListener("click", () => {
      if (shutDownFlag) {
        window.requestAnimationFrame(shutDownLoop);
        directionCount = 0;
      }
    });

    controlButtons.escBtn.addEventListener("click", () => {
      if (startFlag) {
        drawArrow();
        moveArrowFlag = true;
      }
    });

    controlButtons.enterBtn.addEventListener("click", () => {
      if (startFlag) enterPage();
    });

    controlButtons.nextBtn.addEventListener("click", (e) => {
      if (startFlag && moveArrowFlag) drawArrow(e.target.dataset.control);
    });

    controlButtons.prevBtn.addEventListener("click", (e) => {
      if (startFlag && moveArrowFlag) drawArrow(e.target.dataset.control);
    });
  };
})();
