
const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("subBtn").addEventListener("click", () => {
    document.getElementById("input").classList.add("hidden");
    let x;
    try {
        x = JSON.parse(document.getElementById("quizxcode").value);
    } catch (error) {
        console.log(error)
        x = false;
    }

    if (x && (JSON.parse(document.getElementById("quizxcode").value))[0]?.title != undefined && (JSON.parse(document.getElementById("quizxcode").value))[0]?.answers != undefined && (JSON.parse(document.getElementById("quizxcode").value))[0]?.correct != undefined) {
        main(JSON.parse(document.getElementById("quizxcode").value));
    } else {
        document.getElementById("answerPage").classList.add("hidden");
        document.getElementById("questionPage").classList.add("hidden");
        document.getElementById("correctPage").classList.remove("hidden");
        document.getElementById("msg").textContent = "Please use a valid QuizX! files";
    }
})


document.getElementById("useTemp").addEventListener("click", () => {
    let temp = `[{"title":"What does HTML stand for?","answers":["Hyper Text Markdown Language","How To Make Lunch","Hyper Text Markup Language","HTTP Text Markup Language"],"correct":2},{"title":"What does the <hr> tag do?","answers":["Draw a round circle around it's children","Draw a straight line across the page","Makes you eat Lunch","Nothing. That's not a real tag."],"correct":1},{"title":"What header goes at the top of the file?","answers":["<!DOCTYPE html>","<html>","<I wanna eat lunch>","<!DOCTYPE xml>"],"correct":0},{"title":"What doth CSS stand for.","answers":["Cooky styling sheets","Cooking slunch slunch (They Misplet Lunch)","Cat Sick Sick","Cascading Style Sheets"],"correct":3}]`
    document.getElementById("quizxcode").value = temp;
});

const main = async function (questions) {
    let answer = undefined;
    let score = 0;
    let oldscore = 0;


    document.getElementById("btn1").addEventListener('click', () => { answer = 0 });
    document.getElementById("btn2").addEventListener('click', () => { answer = 1 });
    document.getElementById("btn3").addEventListener('click', () => { answer = 2 });
    document.getElementById("btn4").addEventListener('click', () => { answer = 3 });

    for (let i = 0; i < questions.length; i++) {
        document.getElementById("answerPage").classList.add("hidden");
        document.getElementById("questionPage").classList.remove("hidden");
        document.getElementById("correctPage").classList.add("hidden");
        const e = questions[i];
        document.getElementById("question").textContent = e.title;
        document.getElementById("btn1").textContent = e.answers[0];
        document.getElementById("btn2").textContent = e.answers[1];
        document.getElementById("btn3").textContent = e.answers[2];
        document.getElementById("btn4").textContent = e.answers[3];
        await sleep(1000);
        answer = undefined;

        document.getElementById("questionPage").classList.add("hidden");
        document.getElementById("answerPage").classList.remove("hidden");

        const p = new Promise((resolve, reject) => {
            let id, tmid;
            let time = 10000;
            id = window.setInterval(() => {
                if (answer !== undefined) {
                    window.clearInterval(id);
                    window.clearTimeout(tmid);
                    resolve((Math.round(time / 100)) * 10);
                }
                time -= 50;
                document.getElementById("time").textContent = (Math.round(time / 1000)).toString();
            }, 50);
            tmid = window.setTimeout(() => {
                window.clearInterval(id);
                reject();
            }, 10000);
        });

        let msg;
        let scoreToAdd;
        try {
            scoreToAdd = await p;
            if (answer == e.correct) {
                msg = "Correct!";
            } else if (answer != undefined) {
                msg = "Incorrect!";
                scoreToAdd = 0;
            }
        } catch (e) {
            msg = "Time's up!";
            scoreToAdd = 0;
        }
        oldscore = score;
        score += scoreToAdd;
        document.getElementById("answerPage").classList.add("hidden");
        document.getElementById("correctPage").classList.remove("hidden");
        document.getElementById("msg").textContent = msg;
        await sleep(1000);
        oldscore = await addScore(score, oldscore);
        await sleep(1000);

    }
    document.getElementById("msg").textContent = score;
}

const addScore = function (score, oldscore) {
    return new Promise((resolve, reject) => {
        document.getElementById("msg").textContent = oldscore;
        let int = setInterval(() => {
            document.getElementById("msg").textContent = oldscore;
            if (oldscore === score) {
                clearInterval(int);
                resolve(oldscore);
            }
            oldscore++;
        }, 1);
    });
}
main();
