const date = document.getElementById('date'),
  time = document.getElementById('time'),
  greeting = document.getElementById('greeting'),
  name = document.getElementById('name'),
  focus = document.getElementById('focus'),
  quote = document.getElementById('quote'),
  listContainer = document.getElementById('listContainer'),
  todoInput = document.getElementById('todoInput'),
  focusQuestion = document.getElementById('focusQuestion'),
  modal = document.getElementById("myModal"),
  btn = document.getElementById("todoBtn");

const dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthArr = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];

let quoteGlobal = "";
let quoteArr = [
  '“Wisdom is not a product of schooling but of the lifelong attempt to acquire it.” ―Albert Einstein',
  '“We do not learn from experience, we learn from reflecting on experience.” ―John Dewey',
  '“The only source of knowledge is experience.” ―Albert Einstein',
  '“The only source of knowledge is experience.” ―Albert Einstein',
  '“If you can dream it, you can do it.” ―Walt Disney',
  '“You don’t have to play masculine to be a strong woman.” ―Mary Elizabeth Winstead',
  '“Yesterday is gone. Tomorrow has not yet come. We have only today. Let us begin.” ―Mother Theresa'];

let todoArr = [];

quoteArr = JSON.parse(localStorage.getItem('quote')) || quoteArr;
todoArr = JSON.parse(localStorage.getItem('todo')) || todoArr;

focusQuestion.textContent = localStorage.getItem('focusLabel') || "What is your focus today?"

let hour = new Date().getHours();

function setBackground(){
  if (hour < 12){
    document.body.style.backgroundImage = 'url(images/day.jpg)';
    greeting.textContent = 'Good morning,';
  }
  else if (hour < 18){
    document.body.style.backgroundImage = 'url(images/day.jpg)';
    greeting.textContent = 'Good afternoon,';
  }
  else{
    document.body.style.backgroundImage = 'url(images/night.jpg)';
    greeting.textContent = 'Good evening,';
    document.body.style.color = 'white';
    focus.style.color = 'white';
    btn.style.color = 'white';
  }
}

function showDate(){
  let today = new Date(),
    day = dayArr[today.getDay()],
    month = monthArr[today.getMonth()],
    dateToday = today.getDate();

  date.innerHTML = `${day}<span>, </span>${month}<span> </span>${dateToday}`;

  let e = new Date();
  let msTillMidnight = 86400000 - (today - e.setHours(0,0,0,0));
  
  showQuote();

  setTimeout(showDate, msTillMidnight);
}

function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes();

  const amPm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12;

  time.innerHTML = `${hour}<span>:</span>${addZero(min)}`;
  
  setTimeout(showTime, 1000);
}

function showQuote(){
  quote.textContent = quoteArr[randomNumber(0, quoteArr.length)];
  quoteGlobal = quote.textContent;
}

function transformToTextBox(elementToBeReplaced,addToArray,idName){
  const editTextBox = document.createElement('input');
  editTextBox.setAttribute('type', 'text');
  editTextBox.setAttribute('value', elementToBeReplaced.textContent);
  editTextBox.setAttribute('id', 'editInput');

  if (idName === "focus"){
    const focusLabelValue = "What is your main focus for today?";
    localStorage.setItem("focusLabel", focusLabelValue);
    
    focusQuestion.textContent = focusLabelValue; 
  }

  if (hour >= 18){
    editTextBox.style.color = 'white';
    editTextBox.style.borderColor = 'white';
  }
  else {
    editTextBox.style.color = 'black';
    editTextBox.style.borderColor = 'black';
  }
  
  editTextBox.addEventListener('keyup', (e) => {
    if(e.key === 'Enter'){
      transformToSpan(editTextBox,addToArray,idName)
    }
  });

  elementToBeReplaced.parentNode.replaceChild(editTextBox, elementToBeReplaced);
}

function transformToSpan(editTextBox,addToArray,idName){
  const newSpanValue = editTextBox.value;

  if(addToArray){
    quoteArr.push(newSpanValue);
  }

  const newSpan = document.createElement('span');
  newSpan.setAttribute('id', idName);
  newSpan.textContent = newSpanValue;
  newSpan.addEventListener('click', function(){transformToTextBox(newSpan,addToArray,idName)})

  editTextBox.parentNode.replaceChild(newSpan, editTextBox);

  if (idName === "focus"){
    const focusLabelValue = "Today,";
    localStorage.setItem("focusLabel", focusLabelValue);
    newSpan.style.borderBottom = ".2vw solid transparent";
    
    focusQuestion.textContent = focusLabelValue; 
  }

  if (idName === "quote") {
    saveQuotes(idName);
  } else {
    saveData(newSpan, idName);
  }
}

function addTask(){
  if(todoInput.value === ''){
    alert('You must write something!');
  }
  else{
    let li = document.createElement('li');
    li.innerHTML = todoInput.value;
    listContainer.appendChild(li);
    
    let span = document.createElement('span');
    span.innerHTML = '\u00d7';
    span.setAttribute("class", "delete")
    li.appendChild(span);
  }
    todoInput.value = '';
    saveData(listContainer, "data")
}

function showTask(){
  listContainer.innerHTML = localStorage.getItem('data');
  focus.innerHTML = localStorage.getItem('focus');
}

function saveData(itemToBeSaved, idName){
  localStorage.setItem(idName, itemToBeSaved.innerHTML);
}

function saveQuotes(idName){
  localStorage.setItem(idName, JSON.stringify(quoteArr));
}

function showData(itemToDisplay, idName, type){
  if(type === "textbox"){
    itemToDisplay.value = localStorage.getItem(idName);
  } else if (type === "span"){
    itemToDisplay.innerHTML = localStorage.getItem(idName);
  } else if (type === "array"){
    itemToDisplay.innerHTML = quoteGlobal;
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function addZero(min) {
  return (min < 10 ? '0' : '') + min;
}

function show(){
  if(localStorage.getItem('name') != null){
    showData(name, 'name', "span");
  }
  if(localStorage.getItem('quote') != null){
    showData(quote, 'quote', "array");
  }
  if(localStorage.getItem('focus') != null){
    showData(focus, 'focus', "textbox");
  }
}

quote.addEventListener('click', function(){transformToTextBox(quote,true,'quote')});

name.addEventListener('click', function(){transformToTextBox(name,false,'name')});

focus.addEventListener('click', function(){transformToTextBox(focus,false,'focus')});

listContainer.addEventListener('click', function(e){
  if(e.target.tagName === 'LI'){
    e.target.classList.toggle('checked');
    saveData(listContainer, "data")
  }
  else if(e.target.tagName === 'SPAN'){
    e.target.parentElement.remove();
    saveData(listContainer, "data")
  }
}, false);

todoInput.addEventListener('keyup', (e) => {
  if(e.key === 'Enter'){
    addTask()
  }
});

btn.onclick = function() {
  if(modal.style.display === "block"){
    modal.style.display = "none"
  }
  else {
  modal.style.display = "block";
  }
}

showDate();
showTime();
setBackground();
show();
showTask();