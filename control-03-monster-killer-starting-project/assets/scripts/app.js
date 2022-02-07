const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 10;

const MODE_ATTACK = "ATTACK";
const STRONG_MODE_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
let battleLog = [];

function getMaxLife() {
  const enteredNumber = prompt("Maximum life for you and the monster!");
  const parsedNunmber = parseInt(enteredNumber);
  if (isNaN(parsedNunmber) || parsedNunmber <= 0) {
    throw {
      message: "invalid user input , not a number !",
    };
  }
  return parsedNunmber;
}
let chosenMaxLife;
try {
  chosenMaxLife = getMaxLife();
} catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert("your entered a wrong number , so default value of 100 was chosen");
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    envent: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "Monster";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "Monster";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "Player";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "Player";
      break;

    default:
  }
  /*if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = "Monster";
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "Monster";
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = "Player";
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = "Player";
  }*/
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  let initialplayerHealth = currentPlayerHealth;
  const playerdamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerdamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerdamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialplayerHealth;
    alert("you would die but the bonus life saved you!");
    setPlayerHealth(initialplayerHealth);
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("you won !");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Player won",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("you lost !");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Monster won",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("you have a draw !");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A draw",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if (currentPlayerHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}
function attackMonster(mode) {
  const maxDamage =
    mode === MODE_ATTACK
      ? dealMonsterDamage(ATTACK_VALUE)
      : dealMonsterDamage(STRONG_ATTACK_VALUE);
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  currentMonsterHealth -= maxDamage;
  writeToLog(logEvent, maxDamage, currentMonsterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(STRONG_MODE_ATTACK);
}
function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("sorry you can't heal to more than your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}
function printLogHandler() {
  console.log(battleLog);
}
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
