import Questions from './json-files/questions.json' with { type: 'json' };

for(let i=1; i<=4; i++){
    let mainContainer = document.querySelector('#game-container');
    let imgElement = document.createElement('img');
    let buttonEle = document.createElement('button');
    let locationLabel = document.createElement('h4');
    buttonEle.className= `location-icon icon-placement${i}`;
    buttonEle.id=`location_${i-1}`;
    buttonEle.disabled=true;
    imgElement.src = "./assets/location-pin.png";
    locationLabel.className = 'location-label'
    locationLabel.innerText = `${i}`;
    buttonEle.appendChild(locationLabel);
    buttonEle.appendChild(imgElement);
    mainContainer.appendChild(buttonEle)
}

const theThing = document.querySelector("lord-icon"),
      locationPins = document.querySelectorAll(".location-icon"),
      questionSection = document.getElementById("questionText"),
      modalSubmitBtn = document.getElementById("submitBtn"),
      optionsSection = document.querySelectorAll('.option button'),
      optionBtn = document.querySelectorAll('.option .optn-btn'),
      alertContainer = document.querySelector('.alert-container');

let getLocationIndex,
    quiz,
    selectedOption="",
    correctAns,
    gameScore = 0;

locationPins.forEach((el,index)=>{
    if(index === 0){
        let startHint = document.createElement('h5');
            startHint.className = "hint";
            startHint.innerText = "Click here to start";
        // el.appendChild(startHint);
        el.removeAttribute('disabled');
    }
    el.addEventListener("click",(e)=>{
        theThing.style.top = (el.getBoundingClientRect().y + 25) + "px";
        theThing.style.left = (el.getBoundingClientRect().x - 5) + "px";
        setTimeout(()=>{
            $('#staticBackdrop').modal('show');
            showQuestion1(e, index);
        },1000)
    });
})
const showQuestion1 =(e, index)=>{
    if(e.target.parentElement.id === `location_${index}`){
        selectedOption = "";
        getLocationIndex = index;
        quiz = Questions[index][0];
        questionSection.innerHTML = `#${quiz.no} ${quiz.question}`;
        correctAns = quiz.correctAns;
        showOptions(optionsSection, quiz.options);
    }
}
const showQuestion2 = (index)=>{
    selectedOption = "";
    quiz = Questions[index][1];
    questionSection.innerHTML = `#${quiz.no} ${quiz.question}`;
    correctAns = quiz.correctAns;
    showOptions(optionsSection, quiz.options);
}

const showOptions = (elements, optionsArray)=>{
    Array.from(elements).forEach((optionEl, i) => {
        optionEl.innerHTML = optionsArray[i]
    });
}

modalSubmitBtn.addEventListener("click",()=>{
    if(selectedOption === ""){
        alertContainer.classList.remove('d-none');
    }else if(selectedOption === correctAns){
        gameScore += 1
    }

    if(selectedOption !== ""){
        alertContainer.classList.add('d-none');
        if((quiz.no % 2) === 0){
            $('#staticBackdrop').modal('hide');
            document.getElementById(`location_${getLocationIndex}`)?.setAttribute('disabled',"true");
            document.getElementById(`location_${getLocationIndex+1}`)?.removeAttribute('disabled');
            document.querySelector('.hint')?.remove();
        }
        else{
            setTimeout(()=>{
                showQuestion2(getLocationIndex);
            },100)
        }

        if(quiz.no === 8){
            $('#chartModal').modal('show');
            displayResult();
        }
    }
})


optionBtn.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        selectedOption = btn.innerHTML;
    })
})

const displayResult = ()=>{
    google.charts.load('current', {'packages':['corechart']});
    setTimeout(()=>{
        google.charts.setOnLoadCallback(drawChart);
    },200)
   
}

const drawChart = ()=>{
    // Set Data
    const data = google.visualization.arrayToDataTable([
        ['category', 'value'],
        [gameScore+"Correct", gameScore],
        [(8-gameScore)+"Incorrect",(8-gameScore)],
    ]);
  
  // Set Options
  const options = {
    legend:'none',
    width: 450,
    height: 500,
    colors: ['#0c97e8', '#c5c7c7'],
    pieSliceTextStyle: {
        color: 'black'
    },
    slices: [{textStyle : 'white'},{textStyle :'black'}],
    pieSliceText:'label',
    legend: { position: 'bottom' }
  };
  
  // Draw
  const chart = new google.visualization.PieChart(document.getElementById('myChart'));
  chart.draw(data, options);
}