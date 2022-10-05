const puppeteer = require("puppeteer");
let email = "aashima270796@gmail.com";
let password = "18aashima";
// let {ans} = require("./codes");
let cTab;
let browserOpenPromise = puppeteer.launch({
  headless : false,  // can see browser opening
  defaultViewport : null, // how much screen area should cover
  args : ["--start-maximized"], // way to maximized window while opening browseer
})
browserOpenPromise
.then(function(browser){
  console.log('browser is open');
//an array of all open pages inside the browser
//returns an array with all the pages in all browser context
let allTabsPromise = browser.pages();
return allTabsPromise;
})
.then(function(allTabArr){
  cTab = allTabArr[0];
  console.log('newTab');
  let visitingLoginPagePromise = cTab.goto("https://www.hackerrank.com/auth/login");
  return visitingLoginPagePromise;
})
.then(function(){
  console.log('hackerRank login page open');
  let emailWillBeTypedPromise = cTab.type("input[name = 'username']",email,{delay:100});
  return emailWillBeTypedPromise;
})
.then(function(){
  console.log("email will be typed");
  let passwordWillBeTypedPromise = cTab.type("input[type = 'password']",password,{delay:100});
  return passwordWillBeTypedPromise;
})
.then(function(){
console.log("password is typed");
let submitButtonPressPromise = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
return submitButtonPressPromise;
})
.then(function(){
  console.log("login to hackerRank succesfully");
  let algorithimTabWillBeOpenedPromise = waitAndClick("div[data-automation = 'alogorithms']");
  return algorithimTabWillBeOpenedPromise;
})
.then(function(){
  console.log("algorithims is opened");
  let solveQuestionsPromise = cTab.waitforSelector('a[data-analytics="ChallengeListChallengeName"]');
  return solveQuestionsPromise;
})
.then(function(){
  function getAllQuestionLink(){
    let allEleArr=document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
    let linksarr = []
    for(let i = 0;i < allEleArr.length;i++){
      linksarr.push(allEleArr[i].getAttribute("href"));
    }
    return linksarr;
  }
  let linksarrpromise = cTab.evaluate(getAllQuestionLink);
  return linksarrpromise;
})
.then(function(linksarr){
    console.log("recive all question links");
    let allQuestionSolvePromise = questionSolver(linksarr[0],0);
    for(let i = 1;i < linksarr.length;i++){
    allQuestionSolvePromise = allQuestionSolvePromise.then(function(){
      return questionSolver(linksarr[i],i);
    })
  }
  return allQuestionSolvePromise;
})
.then(function(){
  console.log("Question is solved");
})
.catch(function(err){
console.log(err);
})
function waitAndClick(algobtn){
  let waitclikpromise = new Promise(function(resolve,reject){
    let waitforSelectorPromise = cTab.waitforSelector(algobtn);
    waitforSelectorPromise 
    .then(function(){
      console.log("algobtn is found");
      let clickPromise = cTab.click(algobtn);
      return clickPromise;
    })
.then(function(){
  console.log("algo button is clicked");
  resolve();
})
.catch(function(err){
  console.log(err);
})
});
return waitclikpromise;
}

