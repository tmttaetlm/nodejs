const express = require('express');
const app = express();
const path = require('path');
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const fs = require("fs");

var cash = 0,
    kicks = 0,
    power = 0,
    maxPower = fs.readFileSync("power.txt", "utf8");
    min = 0.2,
    max = 1.2,
    game_started = 0;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Defining the serial port
var port_name = '/dev/ttyS1';
const port = new SerialPort(port_name, {
    baudRate: 115200,
});

// The Serial port parser
const spparser = new Readline();
port.pipe(spparser);

// Read the data from the serial port
spparser.on("data", (line) => {
    console.log(line);
    if (line.indexOf(':') >= 0) {
        var cmd = line.slice(0, line.indexOf(':'));
        var data = line.slice(line.indexOf(':')+2, line.length-1);
    } else {
        var cmd = line.trim();
    }
    //console.log(cmd);
    switch (cmd) {
        case 'cash':
            cash += parseInt(data);
            console.log('Total = '+cash);
            kicks = cash / 100;
            /*app.get('/', (req, res) => {
                res.render('index', {
                    kicks: kicks,
                    power: power,
                    maxPower: maxPower,
                    game_started: game_started,
                }); 
            });*/
            break;
        case 'millis':
            if (game_started == 1) {
                /*app.get('/', (req, res) => {
                    res.render('index', {
                        kicks: kicks,
                        power: power,
                        maxPower: maxPower,
                        game_started: game_started,
                    }); 
                });*/
                game_started = 2;
            } else {
                if (data < min) power = 999;
                if (data > max) power = 0;
                if (data > min && data < max) power = Math.round(-999 * data + (max*999));
                if (power > maxPower) {
                    fs.writeFileSync("power.txt", String(power));
                }
                kicks -= 1;
                game_started = 0;
                /*app.get('/', (req, res) => {
                    console.log(game_started);
                    res.render('index', {
                        kicks: kicks,
                        power: power,
                        maxPower: maxPower,
                        game_started: game_started,
                    }); 
                });*/
            }
            break;
        case 'start game':
            game_started = 1;
            /*app.get('/', (req, res) => {
                res.render('index', {
                    game_started: game_started,
                }); 
            });*/
            break;
    }
});

app.get('/', (req, res) => {
    res.render('index', {
        kicks: kicks,
        power: power,
        maxPower: maxPower,
        game_started: game_started,
    }); 
});
app.listen(8080, () => { console.log('Application listening on port 8080!'); });