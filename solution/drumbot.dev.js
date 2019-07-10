document.querySelectorAll('.drumkit button').forEach((el)=>{
    el.addEventListener('click', ()=>{
        playDrums(el.className);
        //drums(el.className).play();
    })
});

document.querySelector('.playRythm').addEventListener('click', ()=>{
    if(interval!==undefined){
        clearInterval(interval);
    }
    fetchPlay(document.querySelector('input[name=drums]:checked').value);
});

document.querySelector('.stopRythm').addEventListener('click', ()=>{
    if(interval!==undefined){
        clearInterval(interval);
    }
});

function playDrums(piece){
    new Audio(`samples/${piece}.ogg`).play();
    //console.log(`Playing ${piece}.`);
    let el = document.querySelector(`.${piece}`);
    el.classList.add('bg1');
    setTimeout(()=>{
        el.classList.remove('bg1');
    }, 100);
    return true;
}

//EXAMPLE ARRAY: ["hihat", "snare"] - ALL WILL BE PLAYED AT THE SAME TIME
function arrayPlay(arr){
    let sounds = [];
    arr.forEach((piece)=>{
        sounds.push(function(){playDrums(piece)});
    });

    async.parallel(sounds);
}

var interval; //declare as global so it can be cleared anywhere
function fetchPlay(style){
    fetch(`https://api.noopschallenge.com/drumbot/patterns/${style}`).then((res) => res.json()).then((data)=> {
        console.log(data);
        let tune = [];
        for(i=0;i<data.stepCount;i++){ //populate array with arrays
            tune.push([]);
        }
        data.tracks.forEach(instrument => {
            for(i=0;i<data.stepCount;i++){
                if(instrument.steps[i]===0){
                    continue;
                }
                else{
                    tune[i].push(instrument.instrument);
                }
            }
        });

        let x = 0, bps = ((60 / data.beatsPerMinute) / data.stepCount * (data.stepCount / 4)) * 1000; //I don't fucking know what the hell I did here. don't ask me.
        console.log('BPS', bps);
        interval = setInterval(()=>{
            console.log('TUNE LENGTH = ' + tune.length);
            arrayPlay(tune[x]);
            console.log(tune[x]);
        
            if(x < tune.length - 1) x++;
            else x = 0;
        }, bps);

    });
}

/*function drums(piece){
    //console.log(`Playing ${piece}.`);
    let el = document.querySelector(`.${piece}`);
    el.classList.add('bg1');
    setTimeout(()=>{
        el.classList.remove('bg1');
    }, 100);
    return new Audio(`samples/${piece}.ogg`);
}*/

document.addEventListener('keydown', (event)=>{
    console.log(event.keyCode);
    let d;
    switch(event.keyCode){
        case 65: //A
        case 83:{ //S
            d = 'kick';
            break;
        }
        case 85: //U
        case 73:{ //I
            d = 'hihat';
            break;
        }
        case 79://O
        case 80:{ //P
            d = 'snare';
            break;
        }
        case 8:{ //BACKSPACE
            d = 'crash';
            break;
        }
        case 75: //K
        case 76:{ // L
            d = 'ride';
            break;
        }
        case 77: ///M
        case 78:{ //N
            d = 'tom';
            break;
        }
        case 49:{
            d = 'cowbell';
            break;
        }
        case 50:{
            d = 'clap';
            break;
        }
        case 51:{
            d = 'rim';
            break;
        }
    }

    if(d===undefined /*|| d===null*/){
        return;
    }

    //drums(d).play();
    playDrums(d);
});