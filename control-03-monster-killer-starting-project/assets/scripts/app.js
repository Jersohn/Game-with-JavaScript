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
const enteredNumber = prompt("Maximum life for you and the monster!");

let chosenMaxLife = parseInt(enteredNumber);
let battleLog = [];

if (isNaN(enteredNumber) || enteredNumber <= 0) {
  chosenMaxLife = 100;
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
  if (ev === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = "Monster";
  } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "Monster";
  } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = "Player";
  } else if (ev === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = "Player";
  }
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
  let maxDamage;
  let logEvent;
  if (mode === MODE_ATTACK) {
    maxDamage = dealMonsterDamage(ATTACK_VALUE);
    logEvent=LOG_EVENT_PLAYER_ATTACK
  } else {
    maxDamage = dealMonsterDamage(STRONG_ATTACK_VALUE);
    logEvent=LOG_EVENT_PLAYER_STRONG_ATTACK
  }
  currentMonsterHealth -= maxDamage;
  writeToLog(
    logEvent,
    maxDamage,
    currentMonsterHealth,
    currentPlayerHealth
  )
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
  )
  endRound();
}
function printLogHandler() {
  console.log(battleLog);
}
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
