const Potion = require('./Potion');
const Character = require('./Character');



class Enemy extends Character{
    constructor(name, weapon) {
        super(name);

        
        this.weapon = weapon;
        this.potion = new Potion();

        
    }

    //Enemy description
    getDescription = function () {
        return `A wild ${this.name} holding a ${this.weapon} appeared!`;
    };

}

Enemy.prototype = Object.create(Character.prototype);





module.exports = Enemy;