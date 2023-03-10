// Player Controller
const PlayerController = (function () {
  const Player = function (id, name) {
    this.id = id;
    this.name = name;
  };

  const data = {
    players: [],
    options: ["rock", "paper", "scissors"],
    playerScore: 0,
    computerScore: 0,
    playerChoices: [],
    computerChoices: [],
    round: 5,
    paperMsg: "Paper covers rock",
    rockMsg: "Rock crushes scissors",
    scissorsMsg: "Scissors cut paper",
    tieMsg: "Tie",
    equalityMsg: "Try again",
    lostMsg: "You Lost:(",
    winMsg: "You win :)",
  };

  return {
    getData: function () {
      return data;
    },
    getPlayers: function () {
      return data.players;
    },
    getOptions: function () {
      return data.options;
    },
    getTieMsg: function () {
      return data.tieMsg;
    },
    getPaperMsg: function () {
      return data.paperMsg;
    },
    getRockMsg: function () {
      return data.rockMsg;
    },
    getScissorsMsg: function () {
      return data.scissorsMsg;
    },
    getLostMsg: function () {
      return data.lostMsg;
    },
    getWinMsg: function () {
      return data.winMsg;
    },
    getEqualityMsg: function () {
      return data.equalityMsg;
    },
    addNewPlayer: function (name, round) {
      let id;

      if (data.players.length > 0) {
        id = data.players[data.players.length - 1].id + 1;
      } else {
        id = 0;
      }

      const newPlayer = new Player(id, name);
      data.players.push(newPlayer);
      data.round = round;
      return data;
    },
    incPlayerScore: function () {
      data.playerScore += 1;
    },
    incComputerScore: function () {
      data.computerScore += 1;
    },
    addMovesToData: function (computer, player) {
      data.computerChoices.push(computer);
      data.playerChoices.push(player);
    },
    decreaseRound: function () {
      data.round = data.round - 1;
    },
  };
})();

//UI Controller
const UIController = (function (PlayerCtrl) {
  const Selectors = {
    username: ".username",
    playerScore: ".p_score",
    round: ".round",
    computerScore: ".c_score",
    buttons: ".buttons",
    btn: ".btn",
    rock: "rock",
    paper: "paper",
    scissors: "scissors",
    popup: ".popup",
    close: "#close",
    start: "#start",
    main: ".main",
    username_input: "#username",
    round_input: "#round",
    result: ".result",
    p_last3moves: ".p_last3moves",
    c_last3moves: ".c_last3moves",
  };

  return {
    getSelectors: function () {
      return Selectors;
    },
    setGame: function (data) {
      document.querySelector(Selectors.username).innerHTML =
        data.players[0].name;
      document.querySelector(Selectors.round).innerHTML = data.round;
    },

    //Update UI after every move
    updateUI: function (data) {
      //console.log(data);
      // update Player last moves
      let pLast3Moves = "";
      if (data.playerChoices.length < 3) {
        data.playerChoices.forEach((choice) => {
          pLast3Moves += `
            <img class="rsp" src="./assets/${choice}.png" alt="" />
            `;
        });
      } else {
        data?.playerChoices
          .slice(data?.playerChoices.length - 3, data?.playerChoices.length)
          .forEach((choice) => {
            pLast3Moves += `
          <img class="rsp" src="./assets/${choice}.png" alt="" />
          `;
          });
      }

      // update computer last moves
      let cLast3Moves = "";
      if (data.computerChoices.length < 3) {
        data.computerChoices.forEach((choice) => {
          cLast3Moves += `
            <img class="rsp" src="./assets/${choice}.png" alt="" />
            `;
        });
      } else {
        data?.computerChoices
          .slice(data?.computerChoices.length - 3, data?.computerChoices.length)
          .forEach((choice) => {
            cLast3Moves += `
          <img class="rsp" src="./assets/${choice}.png" alt="" />
          `;
          });
      }

      // update scores
      document.querySelector(Selectors.computerScore).innerHTML =
        data.computerScore;
      document.querySelector(Selectors.playerScore).innerHTML =
        data.playerScore;

      // update Round
      document.querySelector(Selectors.round).innerHTML = data.round;

      document.querySelector(Selectors.p_last3moves).innerHTML = pLast3Moves;
      document.querySelector(Selectors.c_last3moves).innerHTML = cLast3Moves;
    },

    // write info messages on UI after every move
    writeMsg: function (msg1, msg2) {
      PlayerCtrl.decreaseRound();
      if (msg2 == PlayerCtrl.getWinMsg()) {
        PlayerCtrl.incPlayerScore();
      } else if (msg2 == PlayerCtrl.getLostMsg()) {
        PlayerCtrl.incComputerScore();
      }

      const data = PlayerCtrl.getData();
      this.updateUI(data);

      if (data.round > 0) {
        let html = `
        <h2>${msg1}</h2>
        <h3>${msg2}</h3>
        `;
        document.querySelector(Selectors.result).innerHTML = html;
      } else {
        let html = "";
        if (data.computerScore == data.playerScore) {
          html += `
        <h2>${PlayerCtrl.getTieMsg()}</h2>
        <h3>Your total score is :${data.playerScore}</h3>
        `;
        } else if (data.computerScore > data.playerScore) {
          html += `
        <h2>${PlayerCtrl.getLostMsg()}</h2>
        <h3>Your total score is :${data.playerScore}</h3>
        `;
        } else {
          html += `
            <h2>${PlayerCtrl.getWinMsg()}</h2>
            <h3>Your total score is :${data.playerScore}</h3>
            `;
        }
        document
          .querySelectorAll(Selectors.btn)
          .forEach((btn) => (btn.disabled = true));
        document.querySelector(Selectors.result).innerHTML = html;
      }
    },
  };
})(PlayerController);

// Game Controller
const Game = (function (PlayerCtrl, UICtrl) {
  const UISelectors = UICtrl.getSelectors();

  // Load all events
  const loadEventListeners = function () {
    //popup box
    window.addEventListener("load", function () {
      setTimeout(function open(event) {
        document.querySelector(UISelectors.popup).style.display = "block";
        document
          .querySelectorAll(UISelectors.btn)
          .forEach((btn) => (btn.disabled = true));
      }, 100);
    });

    // popup box close
    document
      .querySelector(UISelectors.close)
      .addEventListener("click", function () {
        document.querySelector(UISelectors.popup).style.display = "none";
      });

    // Set initial state
    document
      .querySelector(UISelectors.start)
      .addEventListener("click", setNameAndRound);

    // Btn events //
    document
      .querySelector(UISelectors.buttons)
      .addEventListener("click", playGame);
  };

  const setNameAndRound = function (e) {
    const username = document.querySelector(UISelectors.username_input).value;
    const round = document.querySelector(UISelectors.round_input).value;
    if (username !== "" && round !== "") {
      //set name and round
      const data = PlayerCtrl.addNewPlayer(username, round);

      UICtrl.setGame(data);

      document.querySelector(UISelectors.popup).style.display = "none";
      document
        .querySelectorAll(UISelectors.btn)
        .forEach((btn) => (btn.disabled = false));
    }
    e.preventDefault();
  };

  const playGame = function (e) {
    const options = PlayerCtrl.getOptions();
    const computerChoice = options[Math.floor(Math.random() * 3)];

    if (e.target.classList.contains(UISelectors.rock)) {
      PlayerCtrl.addMovesToData(computerChoice, "rock");

      if (computerChoice == "rock") {
        UICtrl.writeMsg(PlayerCtrl.getTieMsg(), PlayerCtrl.getEqualityMsg());
      } else if (computerChoice == "paper") {
        UICtrl.writeMsg(PlayerCtrl.getPaperMsg(), PlayerCtrl.getLostMsg());
      } else {
        UICtrl.writeMsg(PlayerCtrl.getRockMsg(), PlayerCtrl.getWinMsg());
      }
    } else if (e.target.classList.contains(UISelectors.paper)) {
      PlayerCtrl.addMovesToData(computerChoice, "paper");

      if (computerChoice == "paper") {
        UICtrl.writeMsg(PlayerCtrl.getTieMsg(), PlayerCtrl.getEqualityMsg());
      } else if (computerChoice == "rock") {
        UICtrl.writeMsg(PlayerCtrl.getPaperMsg(), PlayerCtrl.getWinMsg());
      } else {
        UICtrl.writeMsg(PlayerCtrl.getScissorsMsg(), PlayerCtrl.getLostMsg());
      }
    } else if (e.target.classList.contains(UISelectors.scissors)) {
      PlayerCtrl.addMovesToData(computerChoice, "scissors");

      if (computerChoice == "scissors") {
        UICtrl.writeMsg(PlayerCtrl.getTieMsg(), PlayerCtrl.getEqualityMsg());
      } else if (computerChoice == "rock") {
        UICtrl.writeMsg(PlayerCtrl.getRockMsg(), PlayerCtrl.getLostMsg());
      } else {
        UICtrl.writeMsg(PlayerCtrl.getScissorsMsg(), PlayerCtrl.getWinMsg());
      }
    }
  };

  return {
    init: () => {
      console.log("Game starting...");
      const players = PlayerCtrl.getPlayers();

      loadEventListeners();
    },
  };
})(PlayerController, UIController);

Game.init();
