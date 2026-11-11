const $=id=>document.getElementById(id);
const subjects={
 "9":["English","Gujarati","Urdu","Mathematics","Science","Social Science"],
 "10":["English","Gujarati","Urdu","Mathematics","Science","Social Science"],
 "11":["English","Urdu","Statistics","Accountancy","Economics","Business Administration (BA)","Secretarial Practice (SP)"]
};
const starterTopics={
 "English":["Grammar","Writing skills","Reading comprehension","Literature"],
 "Urdu":["نثر","نظم","قواعد","مضمون نویسی"],
 "Gujarati":["વ્યાકરણ","નિબંધ","ગદ્ય","પદ્ય"],
 "Mathematics":["Algebra","Geometry","Statistics","Mensuration"],
 "Science":["Chemical reactions","Life processes","Electricity","Environment"],
 "Social Science":["History","Geography","Civics","Economics"],
 "Statistics":["Collection of data","Classification and tabulation","Measures of central tendency","Dispersion","Correlation"],
 "Accountancy":["Accounting concepts","Accounting equation","Journal","Ledger","Trial balance","Cash book","Bank reconciliation"],
 "Economics":["Introduction to economics","Demand","Supply","Elasticity","Market","Statistics in economics"],
 "Business Administration (BA)":["Nature of business","Forms of business organisation","Management","Business environment"],
 "Secretarial Practice (SP)":["Office management","Communication","Meetings","Company secretary","Business correspondence"]
};
const quotes=[
"Start where you are. Use what you have. Do what you can.",
"Small progress every day adds up to big results.",
"Your marks can improve when your methods improve.",
"Consistency beats last-minute panic.",
"One focused hour is better than three distracted hours.",
"Do not fear a difficult chapter. Break it into smaller parts.",
"Every question you practise makes the next one easier.",
"Learn to understand, not just to memorise.",
"Your future is shaped by the habits you repeat.",
"Make today useful, even if it is not perfect.",
"Discipline is doing the work even when it feels boring.",
"Confusion is a signal to slow down and learn the basics.",
"Read it once, explain it twice, practise it three times.",
"Your only competition is the version of you that stopped trying.",
"An honest mistake can teach more than a lucky guess.",
"Do the small task now; do not let it become a big worry.",
"Good preparation makes exam day feel familiar.",
"Progress is quiet. Keep showing up.",
"Ask questions until the idea becomes clear.",
"Build strong basics; advanced topics become easier.",
"Do not count study hours only. Count what you understood.",
"Take breaks with purpose, then return with focus.",
"One page at a time. One concept at a time.",
"Practice turns information into skill.",
"Your effort today is an investment in tomorrow.",
"Do not wait for motivation. Begin with five minutes.",
"Being stuck is temporary; refusing to practise keeps you stuck.",
"Keep your notes simple enough to revise quickly.",
"Make fewer promises and keep more study sessions.",
"Every chapter has a starting point. Find it and begin.",
"Slow learning that lasts is better than fast learning you forget.",
"Check your errors. They show you what to work on next.",
"Be curious enough to ask why.",
"Make your timetable realistic, not impressive.",
"Focus on the next useful step, not the whole mountain.",
"Learning is not a race. Understanding matters.",
"Prepare before you feel ready.",
"Small daily revision protects you from big exam stress.",
"Turn difficult words into simple explanations.",
"Do not just read the solution; try it yourself first.",
"Your notebook should show your thinking, not just copied answers.",
"Use mistakes as feedback, not as a reason to quit.",
"Study with a clear target for each session.",
"Ten solved questions can teach more than ten reread pages.",
"Keep your phone away during your focus session.",
"Strong basics are a superpower in every subject.",
"Make time for revision before you forget.",
"Learn one definition, then write it without looking.",
"Be patient with the subjects that challenge you.",
"Start now. Future-you will appreciate it.",
"Understanding is the first step; practice is the second.",
"Keep going even when progress feels slow.",
"Make a question list whenever a topic feels confusing.",
"Study actively: recall, write, solve, explain.",
"Your preparation improves one honest session at a time.",
"Take responsibility for your learning, one day at a time.",
"Use your time carefully; you cannot store it for later.",
"Do not compare chapters. Give each one proper attention.",
"Learn from feedback and adjust your method.",
"Finish today's priority before adding five new ones.",
"Small habits create strong results."
];
const today=new Date();$("todayDate").textContent=today.toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"});
const dayIndex=Math.floor(Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())/86400000)%quotes.length;
$("quoteText").textContent="“"+quotes[dayIndex]+"”";$("quoteBy").textContent="— SUMAN SMART";
let toastTimeout;function toast(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$("toast").classList.remove("show"),2200)}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function safeUrl(s=""){try{let u=new URL(s);return ["https:","http:"].includes(u.protocol)?u.href:"#"}catch{return "#"}}
function getClass(){return $("classSelect").value}
function getSubjects(){return subjects[getClass()]||subjects["11"]}
function fillSubjectSelects(){
 const opts=getSubjects().map(s=>`<option>${escapeHtml(s)}</option>`).join("");
 ["quickSubject","workspaceSubject","quizSubject"].forEach(id=>$(id).innerHTML=opts);
 renderSubjectCards();
}
function renderSubjectCards(){
 const cls=getClass();$("subjectHeading").textContent=cls==="11"&&$("streamSelect").value==="commerce"?"Class 11 Commerce":"Class "+cls;
 $("subjectCards").innerHTML=getSubjects().map(s=>`<button class="subject-card" data-subject="${escapeHtml(s)}"><b>${escapeHtml(s)}</b><small>${escapeHtml((starterTopics[s]||["Your textbook chapters"]).slice(0,3).join(" · "))}</small></button>`).join("");
 document.querySelectorAll(".subject-card").forEach(b=>b.addEventListener("click",()=>{$("workspaceSubject").value=b.dataset.subject;$("workspaceTopic").focus();toast(b.dataset.subject+" selected")}));
}
$("classSelect").addEventListener("change",fillSubjectSelects);$("streamSelect").addEventListener("change",fillSubjectSelects);fillSubjectSelects();
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav-btn,.view").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("view-"+b.dataset.view).classList.add("active")}));

async function callAI(prompt,button,output,defaultLabel){
 if(!prompt.trim()){toast("Pehle details enter karo.");return}
 button.disabled=true;button.textContent="Working…";output.classList.remove("hidden");output.textContent="Preparing…";
 try{const r=await fetch("/.netlify/functions/study-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt})});const d=await r.json();if(!r.ok)throw Error(d.error||"Request failed");output.textContent=d.answer||"No answer returned."}
 catch(e){output.textContent=e.message+" — Netlify mein OPENAI_API_KEY set karke redeploy karo."}
 finally{button.disabled=false;button.textContent=defaultLabel}
}
$("quickRevision").addEventListener("click",()=>callAI(`For a Class ${getClass()} student, create concise revision notes for ${$("quickSubject").value}. Include key concepts, definitions, 5 important points, and 3 self-check questions. Use simple Hinglish where useful.`, $("quickRevision"),$("quickOutput"),"Make revision notes"));
$("explainTopic").addEventListener("click",()=>callAI(`Teach this topic to a Class ${getClass()} student in simple Hinglish: Subject ${$("workspaceSubject").value}; Topic ${$("workspaceTopic").value}. Explain from basics, give examples, common mistakes, then a short exam-style answer.`, $("explainTopic"),$("workspaceOutput"),"Explain topic"));
$("makeQuestions").addEventListener("click",()=>callAI(`Create important exam-style questions and answers for Class ${getClass()}, subject ${$("workspaceSubject").value}, topic ${$("workspaceTopic").value}. Include MCQs, short and long answers. Do not claim these are guaranteed exam questions.`, $("makeQuestions"),$("workspaceOutput"),"Make exam questions"));
$("makeMindmap").addEventListener("click",()=>callAI(`Create a clear text mind map for Class ${getClass()}, subject ${$("workspaceSubject").value}, topic ${$("workspaceTopic").value}. Use a central topic and branches with short keywords.`, $("makeMindmap"),$("workspaceOutput"),"Make mind map"));
$("makeTimetable").addEventListener("click",()=>callAI(`Create a realistic daily study timetable for a Class ${getClass()} student with ${$("studyHours").value} hours available. Subjects: ${getSubjects().join(", ")}. Include short breaks and revision. Do not assume school timings.`, $("makeTimetable"),$("timetableOutput"),"Create my timetable"));
$("generateQuiz").addEventListener("click",()=>callAI(`Create ${$("quizCount").value} multiple-choice practice questions for Class ${getClass()}, subject ${$("quizSubject").value}, topic ${$("quizTopic").value}. Give four options each, answer key and short explanations at the end.`, $("generateQuiz"),$("quizOutput"),"Generate quiz"));
$("formulaHelp").addEventListener("click",()=>callAI(`Explain the formula or method for ${$("formulaTopic").value} in ${$("formulaSubject").value} for a Class ${getClass()} student. Define symbols, show a worked simple example, and list common mistakes.`, $("formulaHelp"),$("quizOutput"),"Explain formula / method"));
$("weeklyPlan").addEventListener("click",()=>callAI(`Create a 7-day study plan for Class ${getClass()} using subjects ${getSubjects().join(", ")}. Daily available time: ${$("weeklyHours").value} minutes. Include revision, practice and one lighter day.`, $("weeklyPlan"),$("weeklyOutput"),"Generate weekly plan"));

const dictionary={
 "શાળા":["اسکول","تعلیم حاصل کرنے کی جگہ"],
 "પાણી":["پانی","پینے یا استعمال کرنے کا پانی"],
 "પુસ્તક":["کتاب","پڑھنے کی چیز"],
 "વિદ્યાર્થી":["طالب علم","پڑھنے والا شخص"],
 "શિક્ષક":["استاد","پڑھانے والا شخص"],
 "મિત્ર":["دوست","ساتھ رہنے یا مدد کرنے والا"],
 "ઘર":["گھر","رہنے کی جگہ"],
 "સમય":["وقت","گھڑی یا مدت"],
 "પ્રેમ":["محبت","پیار اور اپنائیت"],
 "પરિવાર":["خاندان","گھر کے افراد"],
 "મહેનત":["محنت","لگن سے کام کرنا"],
 "જ્ઞાન":["علم","جانکاری اور سمجھ"],
 "સફળતા":["کامیابی","مقصد حاصل کرنا"],
 "આભાર":["شکریہ","احسان ماننے کا لفظ"],
 "સુંદર":["خوبصورت","اچھا اور دلکش"],
 "ખોરાક":["کھانا","غذا"],
 "આકાશ":["آسمان","زمین کے اوپر نظر آنے والی فضا"],
 "સૂર્ય":["سورج","دن میں روشنی دینے والا ستارہ"],
 "ચંદ્ર":["چاند","رات میں نظر آنے والا قدرتی سیارہ"],
 "વૃક્ષ":["درخت","تنا اور شاخوں والا پودا"],
 "રસ્તો":["راستہ","جانے کا طریقہ یا سڑک"],
 "શહેર":["شہر","آبادی والا بڑا مقام"],
 "ગામ":["گاؤں","چھوٹی آبادی"],
 "પ્રશ્ન":["سوال","پوچھی جانے والی بات"],
 "જવાબ":["جواب","سوال کا حل"],
 "સ્વાસ્થ્ય":["صحت","تندرستی"],
 "શાંતિ":["امن","سکون اور لڑائی نہ ہونا"],
 "વિચાર":["خیال","ذہن میں آنے والی بات"],
 "શિક્ષણ":["تعلیم","علم حاصل کرنے کا عمل"],
 "સ્વચ્છતા":["صفائی","صاف رکھنے کی حالت"]
};
function renderDictionary(){ $("dictionaryChips").innerHTML=Object.keys(dictionary).map(w=>`<button class="chip-btn" data-word="${w}">${w}</button>`).join("");document.querySelectorAll(".chip-btn").forEach(b=>b.addEventListener("click",()=>{$("gujaratiInput").value=b.dataset.word;showDictionary(b.dataset.word)}))}
function showDictionary(word){const d=dictionary[word];if(!d)return false;$("translationOutput").classList.remove("hidden");$("translationOutput").innerHTML=`<b>اردو معنی:</b> ${escapeHtml(d[0])}<br><b>سادہ وضاحت:</b> ${escapeHtml(d[1])}<br><small>Starter dictionary entry</small>`;return true}
renderDictionary();
$("translateBtn").addEventListener("click",()=>{const w=$("gujaratiInput").value.trim();if(!w){toast("Gujarati word likho.");return}if(showDictionary(w))return;callAI(`Translate this Gujarati word or sentence into Urdu. Output: (1) Urdu translation in Urdu script, (2) simple Urdu explanation, (3) one example sentence in Gujarati with Urdu translation. If spelling is ambiguous, mention possible meanings. Gujarati text: ${w}`, $("translateBtn"),$("translationOutput"),"Translate into Urdu")});
$("clearTranslate").addEventListener("click",()=>{$("gujaratiInput").value="";$("translationOutput").textContent="";$("translationOutput").classList.add("hidden")});

let tasks=JSON.parse(localStorage.getItem("ss4_tasks")||"[]");
function saveTasks(){localStorage.setItem("ss4_tasks",JSON.stringify(tasks));renderTasks()}
function renderTasks(){$("taskList").innerHTML="";tasks.forEach((t,i)=>{const li=document.createElement("li");li.className=t.done?"done":"";const c=document.createElement("input");c.type="checkbox";c.checked=t.done;c.addEventListener("change",()=>{tasks[i].done=c.checked;saveTasks()});const s=document.createElement("span");s.textContent=t.text;const d=document.createElement("button");d.textContent="×";d.setAttribute("aria-label","Delete task");d.onclick=()=>{tasks.splice(i,1);saveTasks()};li.append(c,s,d);$("taskList").append(li)})}
$("taskForm").addEventListener("submit",e=>{e.preventDefault();const v=$("taskInput").value.trim();if(v){tasks.push({text:v,done:false});$("taskInput").value="";saveTasks()}});renderTasks();

let remaining=1500,timer=null;
function showTimer(){ $("timerDisplay").textContent=String(Math.floor(remaining/60)).padStart(2,"0")+":"+String(remaining%60).padStart(2,"0")}
function stopTimer(){clearInterval(timer);timer=null;$("timerStart").textContent="Start"}
$("timerStart").addEventListener("click",()=>{if(timer){stopTimer();return}if(remaining<=0)remaining=Number($("focusMinutes").value||25)*60;$("timerStart").textContent="Pause";timer=setInterval(()=>{remaining--;showTimer();if(remaining<=0){stopTimer();toast("Focus session complete. Take a short break!")}},1000)});
$("timerReset").addEventListener("click",()=>{stopTimer();remaining=Math.max(1,Math.min(120,Number($("focusMinutes").value)||25))*60;showTimer()});
$("focusMinutes").addEventListener("change",()=>{stopTimer();remaining=Math.max(1,Math.min(120,Number($("focusMinutes").value)||25))*60;showTimer()});showTimer();

// Flashcards
let cards=JSON.parse(localStorage.getItem("ss4_cards")||"[]"),cardIndex=0,showBack=false;
function renderCard(){const box=$("flashcardArea");if(!cards.length){box.innerHTML='<p class="muted tiny">No cards saved yet.</p>';return}const c=cards[cardIndex%cards.length];box.innerHTML=`<div class="flashcard"><small>${showBack?"ANSWER":"QUESTION"} · ${cardIndex+1}/${cards.length}</small><p>${escapeHtml(showBack?c.back:c.front)}</p><div class="row"><button id="flipCard" class="btn outline">Flip</button><button id="nextCard" class="btn outline">Next</button><button id="deleteCard" class="btn outline">Delete</button></div></div>`;$("flipCard").onclick=()=>{showBack=!showBack;renderCard()};$("nextCard").onclick=()=>{cardIndex=(cardIndex+1)%cards.length;showBack=false;renderCard()};$("deleteCard").onclick=()=>{cards.splice(cardIndex,1);localStorage.setItem("ss4_cards",JSON.stringify(cards));cardIndex=0;showBack=false;renderCard()}}
$("addCard").addEventListener("click",()=>{const front=$("cardFront").value.trim(),back=$("cardBack").value.trim();if(!front||!back){toast("Front aur back dono likho.");return}cards.push({front,back});localStorage.setItem("ss4_cards",JSON.stringify(cards));$("cardFront").value="";$("cardBack").value="";renderCard();toast("Flashcard saved")});renderCard();

const vocab=[
["Curious","Eager to know or learn something.","She was curious about how the machine worked."],
["Accurate","Correct and free from mistakes.","Write an accurate answer in the exam."],
["Improve","To make something better.","Daily revision can improve your understanding."],
["Essential","Very important or necessary.","Practice is essential for learning mathematics."],
["Observe","To watch carefully and notice details.","Observe the pattern before solving the sum."],
["Confident","Feeling sure about your ability.","Preparation made him more confident."],
["Analyse","To examine something carefully.","Analyse the question before writing an answer."],
["Consistent","Doing something regularly.","Consistent study is more useful than cramming."]
];
$("newVocab").addEventListener("click",()=>{const v=vocab[dayIndex%vocab.length];$("vocabOutput").classList.remove("hidden");$("vocabOutput").innerHTML=`<b>${v[0]}</b><p>${v[1]}</p><i>${v[2]}</i>`});

// Notes, exam date, marks
$("personalNotes").value=localStorage.getItem("ss4_notes")||"";$("personalNotes").addEventListener("input",()=>localStorage.setItem("ss4_notes",$("personalNotes").value));
$("examDate").value=localStorage.getItem("ss4_exam")||"";$("examDate").addEventListener("change",()=>{localStorage.setItem("ss4_exam",$("examDate").value);renderCountdown()});
function renderCountdown(){if(!$("examDate").value){$("countdown").textContent="Choose your exam date.";return}const target=new Date($("examDate").value+"T00:00:00");const n=Math.ceil((target-new Date(new Date().toDateString()))/86400000);$("countdown").textContent=n<0?"Exam date has passed.":n===0?"Your exam is today!":`${n} day${n===1?"":"s"} left`};renderCountdown();
let marks=JSON.parse(localStorage.getItem("ss4_marks")||"[]");
function renderMarks(){const total=marks.reduce((a,m)=>a+m.total,0),got=marks.reduce((a,m)=>a+m.got,0);$("marksSummary").textContent=marks.length?`Overall: ${got}/${total} · ${(got/total*100).toFixed(1)}%`:"No marks added yet."; $("marksList").innerHTML=marks.map((m,i)=>`<div class="mark-row"><span>${escapeHtml(m.subject)} — ${m.got}/${m.total} (${(m.got/m.total*100).toFixed(1)}%)</span><button class="link-btn" data-del="${i}">Remove</button></div>`).join("");document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{marks.splice(Number(b.dataset.del),1);localStorage.setItem("ss4_marks",JSON.stringify(marks));renderMarks()})}
$("marksForm").addEventListener("submit",e=>{e.preventDefault();const subject=$("markSubject").value.trim(),got=Number($("markGot").value),total=Number($("markTotal").value);if(!subject||!Number.isFinite(got)||!Number.isFinite(total)||total<=0||got<0||got>total){toast("Marks check karo: obtained total se zyada nahi ho sakte.");return}marks.push({subject,got,total});localStorage.setItem("ss4_marks",JSON.stringify(marks));$("marksForm").reset();renderMarks()});renderMarks();

// Streak based on daily completed tasks or focus sessions. No false auto-increment.
let activity=JSON.parse(localStorage.getItem("ss4_activity")||"{}");
function todayKey(){return new Date().toISOString().slice(0,10)}
function updateStreak(){let streak=0,d=new Date();for(let i=0;i<365;i++){const k=new Date(d.getFullYear(),d.getMonth(),d.getDate()-i).toISOString().slice(0,10);if(activity[k])streak++;else break}$("streakBadge").textContent="🔥 "+streak+" day streak"}
function markActivity(){activity[todayKey()]=true;localStorage.setItem("ss4_activity",JSON.stringify(activity));updateStreak()}
$("timerStart").addEventListener("click",()=>{if(!timer)markActivity()});$("taskForm").addEventListener("submit",markActivity);updateStreak();

async function loadNews(){const box=$("newsList");box.innerHTML='<p class="muted">Loading current headlines…</p>';try{const r=await fetch("/.netlify/functions/news");if(!r.ok)throw Error();const d=await r.json();if(!d.items?.length)throw Error();box.innerHTML=d.items.slice(0,4).map(x=>`<div class="news-item"><a href="${safeUrl(x.link)}" target="_blank" rel="noopener">${escapeHtml(x.title)}</a><small>${escapeHtml(x.source||d.source||"News")} · ${escapeHtml(x.date||"Latest feed item")}</small></div>`).join("");$("newsMeta").textContent="Source: "+(d.source||"RSS feed")+". Open publisher links for full reports."}catch(e){box.innerHTML='<p class="muted">News feed unavailable right now. Try refreshing later.</p>';$("newsMeta").textContent="Requires internet access."}}
$("refreshNews").addEventListener("click",loadNews);loadNews();

let installPrompt;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("installBtn").classList.remove("hidden")});$("installBtn").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("installBtn").classList.add("hidden")});
if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/service-worker.js").catch(()=>{}));
