const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];
let rockets = [];
let balloons = [];

function randomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.exploded = false;
        this.particles = [];
        this.size = 8;  // Increased initial size
        this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * -4 - 2 }; // Adjusted velocity for more height
        this.gravity = 0.05;
    }

    update() {
        if (!this.exploded) {
            this.size -= 0.1;
            this.y += this.velocity.y;
            this.x += this.velocity.x;
            this.velocity.y += this.gravity;

            if (this.size <= 0) {
                this.exploded = true;
                this.createParticles();
            }
        } else {
            for (let particle of this.particles) {
                particle.update();
            }
        }
    }

    createParticles() {
        for (let i = 0; i < 250; i++) {  // Increased number of particles for larger area
            this.particles.push(new Particle(this.x, this.y));
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.fillStyle = randomColor();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            for (let particle of this.particles) {
                particle.draw();
            }
        }
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.velocity = {
            x: (Math.random() - 0.5) * 8, // Increased spread
            y: (Math.random() - 0.5) * 8
        };
        this.gravity = 0.1;
        this.alpha = 1;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += this.gravity;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Rocket {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.velocity = { x: 0, y: -6 }; // Increased rocket speed
    }

    update() {
        this.y += this.velocity.y;
        if (this.y < canvas.height / 2) {
            fireworks.push(new Firework(this.x, this.y));
            rockets.splice(rockets.indexOf(this), 1);
        }
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.size, this.y + this.size * 2);
        ctx.lineTo(this.x + this.size, this.y + this.size * 2);
        ctx.closePath();
        ctx.fill();
    }
}

class Balloon {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 15;
        this.velocity = { x: (Math.random() - 0.5) * 2, y: -1 + Math.random() * -2 };
    }

    update() {
        this.y += this.velocity.y;
        this.x += this.velocity.x;
        if (this.y < 0) {
            balloons.splice(balloons.indexOf(this), 1);
        }
    }

    draw() {
        ctx.fillStyle = 'lightblue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x - 1, this.y, 2, 10); // Balloon string
    }
}

function createFirework() {
    const firework = new Firework(Math.random() * canvas.width, canvas.height);
    fireworks.push(firework);
}

function createRocket() {
    const rocket = new Rocket(Math.random() * canvas.width, canvas.height);
    rockets.push(rocket);
}

function createBalloon() {
    const balloon = new Balloon(Math.random() * canvas.width, canvas.height);
    balloons.push(balloon);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let firework of fireworks) {
        firework.update();
        firework.draw();
    }
    
    for (let rocket of rockets) {
        rocket.update();
        rocket.draw();
    }
    
    for (let balloon of balloons) {
        balloon.update();
        balloon.draw();
    }

    fireworks = fireworks.filter(firework => !firework.exploded || firework.particles.length > 0);
    requestAnimationFrame(animate);
}

// Create fireworks, rockets, and balloons at different intervals
setInterval(createFirework, 500);
setInterval(createRocket, 500); // Increased rocket creation frequency
setInterval(createBalloon, 700); // Balloons every 700 milliseconds

animate();
