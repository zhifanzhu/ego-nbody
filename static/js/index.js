import { AgendaWrapper } from './agenda_utils.js'


let agenda = null;
let agendaReady = false;
const agenda_path = "data/P06-20240510-121619.zone120.verified.json";

const original = document.getElementById('single-video');
const parallel = document.getElementById('parallel-video');

async function loadMapping() {
    const res = await fetch(
        agenda_path);
    agenda = await res.json();
    agenda = new AgendaWrapper(agenda);
    agendaReady = true;

    window.agenda = agenda;  // for debugging
}

function syncSourceToParallel() {
    const syncBtn = document.getElementById('sync-to-parallel');
    const popup = document.getElementById('sync-popup');
    let popupTimer = null;

    if (syncBtn && original && parallel) {
        syncBtn.addEventListener('click', () => {
            // 1. Get current time from the Single Person video
            const currentTime = original.currentTime;
            const parallelTime = agenda.toParallelTime(currentTime);
            
            // 2. Set the Parallel Execution video to that time
            if (parallelTime) {
                parallel.currentTime = parallelTime.time;
            }
            
            // 3. (Optional) Make sure target plays if source is playing
            if (!original.paused) {
                parallel.play();
            }

            // if (popup) { // for debugging
            if (popup && parallelTime == null) {
                popup.classList.add('show');
                if (popupTimer) {
                    clearTimeout(popupTimer);
                }
                popupTimer = setTimeout(() => {
                    popup.classList.remove('show');
                }, 800);  // Hide after 0.5 seconds
            }

            // printout src => tgt time mapping
             if (parallelTime) {
                console.log(`Source  ${currentTime}s => ${parallelTime.time}s for person ${parallelTime.person}`);
            } else {
                console.log(`Source  ${currentTime}s is not covered in parallel`);
            }
        });
    }
};

function syncPersonOneToSource() {
    const syncBtn = document.getElementById('sync-from-p1');
    if (syncBtn && original && parallel) {
        syncBtn.addEventListener('click', () => {
            const currentTime = parallel.currentTime;
            const sourceTime = agenda.toSourceTime('P1', currentTime);
            if (sourceTime) {
                original.currentTime = sourceTime;
            }
            if (!parallel.paused) {
                original.play();
            }
            console.log(`P1  ${currentTime}s => ${sourceTime}s`);
        });
    }
}

function syncPersonTwoToSource() {
    const syncBtn = document.getElementById('sync-from-p2');
    if (syncBtn && original && parallel) {
        syncBtn.addEventListener('click', () => {
            const currentTime = parallel.currentTime;
            const sourceTime = agenda.toSourceTime('P2', currentTime);
            if (sourceTime) {
                original.currentTime = sourceTime;
            }
            if (!parallel.paused) {
                original.play();
            }
            console.log(`P2  ${currentTime}s => ${sourceTime}s`);
        });
    }
}



async function init() {
    await loadMapping();

    // Any other initialization code can go here
    console.log("Initialization complete");
}

// Run init once DOM is ready
document.addEventListener("DOMContentLoaded", init);
document.addEventListener('DOMContentLoaded', syncSourceToParallel);
document.addEventListener('DOMContentLoaded', syncPersonOneToSource);
document.addEventListener('DOMContentLoaded', syncPersonTwoToSource);