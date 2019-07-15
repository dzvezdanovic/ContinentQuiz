

function showRankings() {
    let results = localStorage.getItem("results");
    results = JSON.parse(results);

    let html = "";
    if (results !== null && results.length > 0) {
        for (let i = 0; i < results.length; i++) {
            html += `
                <div class="ranking">
                    <div class="no">
                        #${ i + 1 }
                    </div>
                    <div class="score">
                        <div class="date">
                            on ${ new Date(results[i].date).toLocaleDateString() }
                        </div>
                        <div class="pts">
                            ${ results[i].pts } pts
                        </div>
                    </div>
                </div>
            `;
        }
    } else {
        html = "You have not played this game yet!";
    }
    
    document.getElementById("rankings").innerHTML = html;
}

function submit(pts) {
    addScoreToLS({
        date: new Date(),
        pts: parseInt(pts)
    });
}

function redirectToGame() {
    window.location = "game.html";
}