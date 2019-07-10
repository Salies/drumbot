document.querySelectorAll('.drumkit button').forEach((el)=>{
    el.addEventListener('click', ()=>{
        playDrums(el.className);
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
    let el = document.querySelector(`.${piece}`);
    el.classList.add('bg1');
    setTimeout(()=>{
        el.classList.remove('bg1');
    }, 100);
    return true;
}

function arrayPlay(arr){
    let sounds = [];
    arr.forEach((piece)=>{
        sounds.push(function(){playDrums(piece)});
    });

    async.parallel(sounds);
}

var interval;
function fetchPlay(style){
    fetch(`https://api.noopschallenge.com/drumbot/patterns/${style}`).then((res) => res.json()).then((data)=> {
        let tune = [];
        for(i=0;i<data.stepCount;i++){
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
        interval = setInterval(()=>{
            arrayPlay(tune[x]);
        
            if(x < tune.length - 1) x++;
            else x = 0;
        }, bps);

    });
}

document.addEventListener('keydown', (event)=>{
    let d;
    switch(event.keyCode){
        case 65:
        case 83:{
            d = 'kick';
            break;
        }
        case 85:
        case 73:{
            d = 'hihat';
            break;
        }
        case 79:
        case 80:{
            d = 'snare';
            break;
        }
        case 8:{
            d = 'crash';
            break;
        }
        case 75:
        case 76:{
            d = 'ride';
            break;
        }
        case 77:
        case 78:{
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

    if(d===undefined){
        return;
    }

    playDrums(d);
});