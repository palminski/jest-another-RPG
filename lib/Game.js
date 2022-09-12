const inquirer = require("inquirer");
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function() {
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    this.currentEnemy = this.enemies[0];

    inquirer
        .prompt({
            type: 'text',
            name: 'name',
            message: 'Whate is your name?'
        })
        .then(({name}) => {
            this.player = new Player(name);
            this.startNewBattle(this.currentEnemy, this.player);
        });
};

Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    }
    else
    {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows:');
    console.table(this.player.getStats());

    console.log(this.currentEnemy.getDescription());
    this.battle();
};

Game.prototype.battle = function() {
  if   (this.isPlayerTurn) {
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['Attack!','Use Potion']
    })
    .then(({ action}) => {
        if (action === 'Use Potion') {
            if (!this.player.getInventory()) {
                console.log("Thou hasn't any potions to speak of!");
                return this.checkEndOfBattle();
            }
            
            inquirer.prompt ({
                type: "list",
                message: 'Which potion would thou like to use?',
                name: 'action',
                choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
            })
            .then(({action}) => {
                const potionDetails = action.split(': ');
                this.player.usePotion(potionDetails[0] - 1);
                console.log(`You used a potion of ${potionDetails[1]}!`);
                this.checkEndOfBattle();
            })
        }
        else
        {
            const damage = this.player.getAttackValue();
            this.currentEnemy.reduceHealth(damage);

            console.log(`You struck the ${this.currentEnemy.name} with your Vorpal Sword!`);
            console.log('Snicker-Snack!');
            console.log(`${this.currentEnemy.getHealth()}`);
            this.checkEndOfBattle();
        }
    })
  }
  else
  {
    const damage = this.currentEnemy.getAttackValue();
    this.player.reduceHealth(damage);

    console.log(`You were attacked by the ${this.currentEnemy.name}! Ouch!`);
    console.log(`${this.player.getHealth()}`);
    this.checkEndOfBattle();
  }
};

Game.prototype.checkEndOfBattle = function() {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    }
    else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`The foul ${this.currentEnemy.name} has been slain!`);

        
        
        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.player.addPotion(this.currentEnemy.potion);
            console.log(`Lo! ${this.player.name} found a potion of ${this.currentEnemy.potion.name} on the ${this.currentEnemy.name}'s corpse! What luck!`);

            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        }
        else
        {
            console.log('You have vanquished all the foul monsters in the dungeon!');
            console.log('Victory is yours!');
        }
    }
    else {
        console.log(`You were slain by the ${this.currentEnemy.name}.`);
        console.log('This dungeon will forever be your grave...');
    }
}

module.exports = Game;