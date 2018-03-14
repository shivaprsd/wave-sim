var c = document.getElementById('screen');
var btn = document.getElementById('btn');
var rst = document.getElementById('reset-btn');

var a1,a2,T1,T2,v; // Variables for holding wave parameters
var t = 0,start = 0,d = 0,loop;
var fun = sin;
var wave = [];

var scr = c.getContext('2d');
var maxx = c.width - 100; // Length of the x-axis
var maxy = c.height;

/* Initialises the screen with the axes and the wave */
function initscr() {
    /* Initial styles */
    scr.font = '20px sans-serif';
    scr.textAlign = 'center';
    scr.strokeStyle = '#000000';
    scr.fillStyle = '#f24200';

    /* y-axes */
    scr.beginPath();
    scr.moveTo(50,maxy/6);
    scr.lineTo(50,maxy*5/6);
    scr.stroke();
    scr.moveTo(maxx+50,maxy/6);
    scr.lineTo(maxx+50,maxy*5/6);
    scr.stroke();
    scr.fillText('y',50,maxy/6 - 20);

    /* x-axis */
    scr.beginPath();
    scr.moveTo(50,maxy/2);
    scr.lineTo(maxx+50,maxy/2);
    scr.stroke();

    /* Draw the arrow tips at ends of each axes */
                                    // axis: y = 1 || x = -1.
    drawArrow(50,maxy/6,1,1);       // ori = 1 for upright(in y) and
    drawArrow(50,maxy*5/6,1,-1);    // right-pointing(in x) arrows.
    drawArrow(maxx+50,maxy/6,1,1); // ori = -1 for upside-down(in y)
    drawArrow(maxx+50,maxy*5/6,1,-1); // and left-pointing(x) arrows

    /* Mark the sources */
    scr.fillText('S1',20,maxy/2 + 7);
    scr.fillStyle = '#00f200';
    scr.fillText('S2',maxx+84,maxy/2 + 7);

    /* Axes values */
    scr.font = '14px sans-serif';
    scr.fillStyle = '#666666';
    scr.strokeStyle = '#666666';

    for (i=1; i<=maxx/50; i++) {
        scr.fillText(i*50,i*50+50,maxy/2 + 20);
        scr.moveTo(i*50+50, maxy/2 - 5);
        scr.lineTo(i*50+50, maxy/2 + 5);
        scr.stroke();
    }
    for (i=-2; i<=2; i++) {
        for (j=0; j<=2; j++) {
            scr.textAlign = j ? 'left': 'right';
            scr.fillText(i*50,(maxx+20)*j + 40,maxy/2 - i*50 + 5);
            scr.moveTo(maxx*j + 45, maxy/2 - i*50);
            scr.lineTo(maxx*j + 55, maxy/2 - i*50);
            scr.stroke();
        }
    }
    scr.moveTo(50,maxy/2); // Move cursor to S1
}

/* Function to draw an arrow-tip in given axis and orientation */
function drawArrow(xPos,yPos,axis,ori) {
    scr.beginPath();

    scr.moveTo(xPos - ori*8, yPos + ori*axis*8);
    scr.lineTo(xPos,yPos);
    scr.lineTo(xPos + ori*axis*8, yPos + ori*8);

    scr.stroke();
}

/* Function to update the values of a,T and v */
function updateParameters () {
    a1 = document.getElementById('amp1').value;
    a2 = document.getElementById('amp2').value;
    T1 = document.getElementById('prd1').value;
    T2 = document.getElementById('prd2').value;
    v = document.getElementById('vel').value;
}

/* Calculate the waves at a given time upto a given dist */
function calcWaves(time,dist) {
    // Arrays to hold the temp wave points
    var arr1 = [];
    var arr2 = [];

    var x,y,s,c;
    updateParameters();

    for(x=0; x<=dist; x++) {
        arr1[x] = fun(x,time,a1,T1,v);
        arr2[x] = fun(x,time,a2,T2,v);
    }

    /* Loop to add the individual waves and store it in 'wave' */
    x = 0;
    s = c = maxx;
    while(x <= maxx) {
        if(arr1[x] !== undefined) {
            if(arr2[maxx-x] === undefined) {
                wave[x] = arr1[x];
            } else {
                wave[x] = arr1[x] + arr2[maxx-x];
                if(x < c) { c = x; }
            }
        } else {
            if(arr1[maxx-x] !== undefined) {
                wave[x] = arr2[maxx-x];
                if(x < s) { s = x; }
            } else {
                wave[x] = undefined;
                if(x < c) { c = x; }
            }
        }
        x++;
    }
    wave[x] = c;
    wave[x+1] = s;
    wave[x+2] = maxx;
}

/* Function to draw the wave */
function drawWave() {
    var x = 0,lim;

    for(lim=0; lim<3; lim++) {
        switch(lim) {
            case 0: scr.strokeStyle = scr.fillStyle = '#f24200';
            break;

            case 1: scr.strokeStyle = scr.fillStyle = '#0042f2';
            break;

            case 2: scr.strokeStyle = scr.fillStyle = '#00f200';
            break;
        }

        scr.beginPath();
        while(x < wave[maxx+lim+1]) {
            if(wave[x] !== undefined) {
                scr.lineTo(50+x, maxy/2-wave[x]);
            }
            x++;
        }
        scr.stroke();

        // Draw oscillating source point
        if (lim != 1) {
            scr.beginPath();
            scr.arc(50 + maxx*lim/2, maxy/2 - wave[maxx*lim/2], 3, 0, 2*Math.PI);
            scr.fill();
        }
    }
    // Display global time
    scr.font = '16px monospace';
    scr.textAlign = 'left';
    scr.fillStyle = '#0042f2';
    scr.fillText('Time: ' + t.toFixed(2) + 's', 45, maxy-20);
}

/* Function to clear the screen */
function clrscr() {
    scr.fillStyle = "#ffffff";
    scr.fillRect(0,0,maxx+100,maxy);
    scr.fillStyle = "#f24200"; // Resets the fill color
}

/* Update the wave on changing the parameter-inputs */
function updateWave() {
    clrscr();
    initscr();

    if(start === 0) {
        if(d === 0) {
            calcWaves(t,150);
        } else {
            calcWaves(t,d);
        }
    }
    drawWave();
}
for(i=0; i<5; i++) {
    document.querySelectorAll('input')[i].oninput = updateWave;
}

/* Function to Start/Pause the wave */
function refreshWave() {
    if(!start) {
        loop = setInterval(function() {
            clrscr();
            initscr();

            //t = (d/v)===t ? t : d/v;
            d = (v*t)<maxx ? v*t : maxx;
            calcWaves(t,d);
            drawWave();
            t = t+0.01; // Frame rate = 50fps; 1s/50 = 0.02s
        }, 10); // 50fps x 20ms = 1000ms = 1s

        btn.innerHTML = 'Pause';
        start = 1;
    }
    else {
        clearInterval(loop);
        btn.innerHTML = 'Start';
        start = 0;
    }
}

document.getElementById('fun').onchange = function() {
    switch (this.value) {
        case 'Saw Tooth':
            fun = saw;
            break;
        case 'Triangular':
            fun = tri;
            break;
        case 'Square':
            fun = sqr;
            break;
        case 'Sine':
        default:
            fun = sin;
            break;
    }
    updateWave();
}

/* Start the wave when user clicks the 'Start' button */
btn.onclick = function() {
    refreshWave();
};

/* Start the wave if user press space bar */
document.onkeypress = function() {
    /*  We don't want to trigger animation if Space bar was pressed
        while one of the input fields has focus (user accidently
        pressed Space bar while inputing one of the parameters */
    if(document.activeElement.tagName !== 'INPUT'
            && event.keyCode === 32) { // Unicode value of Space bar

            refreshWave(); // Start/pause the wave if both conditions
                         // are satisfied
            event.preventDefault();  // Prevent scrolling of page as
                                     // happens in some browsers
    }
};

/* Reset the wave when the user clicks the 'Reset' button */
function reset() {
    t = 0;
    d = 0;
    start = 1; // So that refreshWave() will stop it no matter what
    refreshWave(); // Stop the wave

    // Reset parameters
    document.getElementById('amp1').value = document.getElementById('amp2').value = 50;
    document.getElementById('prd1').value = document.getElementById('prd2').value = 1;
    document.getElementById('vel').value = 150;
    document.getElementById('fun').selectedIndex = 0;
    fun = sin;

    clrscr();
    initscr();
    calcWaves(1,150);
    drawWave();
};
rst.onclick = reset;
reset();

/* Various wave functions */
function sin(x, t, a, T, v) {
    return a * Math.sin(2*Math.PI * (t-x/v)/T); // Standard eq of a sine wave
}
function saw(x, t, a, T, v) {
    return 2*a * ((t-x/v)/T - Math.floor((t-x/v)/T) - 1/2);
}
function sqr(x, t, a, T, v) {
    return a * Math.pow(-1, Math.floor((t-x/v) / T));
}
function tri(x, t, a, T, v) {
    return -2 * (Math.abs(saw(x,t,a,T,v)) - a/2);
}
