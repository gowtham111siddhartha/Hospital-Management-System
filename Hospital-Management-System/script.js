let role="patient";
let currentUser=null;

const demoUsers={
  patient:{email:"patient@careplus.com",password:"1234",name:"Rahul Kumar"},
  doctor:{email:"doctor@careplus.com",password:"1234",name:"Dr. Priya Sharma"}
};

const defaultData={
 patients:[
  {name:"Rahul Kumar",age:"28",problem:"Fever",doctor:"Dr. Priya Sharma"},
  {name:"Ananya Rao",age:"34",problem:"Migraine",doctor:"Dr. Arjun Rao"},
  {name:"Vikram Singh",age:"45",problem:"Diabetes",doctor:"Dr. Meera Singh"}
 ],
 appointments:[
  {patient:"Rahul Kumar",doctor:"Dr. Priya Sharma",date:"2026-10-08",time:"10:00",status:"Confirmed"},
  {patient:"Ananya Rao",doctor:"Dr. Arjun Rao",date:"2026-10-09",time:"11:30",status:"Confirmed"}
 ],
 prescriptions:[
  {patient:"Rahul Kumar",medicine:"Paracetamol",dosage:"500 mg",duration:"3 days"},
  {patient:"Ananya Rao",medicine:"Sumatriptan",dosage:"50 mg",duration:"5 days"}
 ],
 bills:[
  {patient:"Rahul Kumar",service:"Consultation",amount:"500",status:"Pending"},
  {patient:"Ananya Rao",service:"Laboratory Test",amount:"1200",status:"Paid"}
 ]
};


function getAccounts(){
  return JSON.parse(localStorage.getItem("careplusAccounts")) || [];
}

function showSignup(){
  if(role!=="patient"){
    alert("Create Account is available for patients only.");
    return;
  }
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("signupBox").classList.remove("hidden");
  document.getElementById("signupMessage").textContent="";
}

function showLogin(){
  document.getElementById("signupBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
  document.getElementById("loginMessage").textContent="";
}

function createAccount(){
  const name=document.getElementById("signupName").value.trim();
  const email=document.getElementById("signupEmail").value.trim().toLowerCase();
  const password=document.getElementById("signupPassword").value;
  const age=document.getElementById("signupAge").value.trim();

  if(!name||!email||!password||!age){
    document.getElementById("signupMessage").textContent="Please fill all details.";
    return;
  }

  const accounts=getAccounts();
  if(accounts.some(a=>a.email===email) || Object.values(demoUsers).some(a=>a.email===email)){
    document.getElementById("signupMessage").textContent="An account with this email already exists.";
    return;
  }

  accounts.push({name,email,password,age,role:"patient"});
  localStorage.setItem("careplusAccounts",JSON.stringify(accounts));

  const d=data();
  d.patients.push({name,age,problem:"No medical condition added",doctor:"Not assigned"});
  save(d);

  alert("Account created successfully! You can now login with your details.");

  document.getElementById("email").value=email;
  document.getElementById("password").value=password;
  showLogin();
}

function initData(){
 if(!localStorage.getItem("careplusData"))
   localStorage.setItem("careplusData",JSON.stringify(defaultData));
}
function data(){return JSON.parse(localStorage.getItem("careplusData"))}
function save(d){localStorage.setItem("careplusData",JSON.stringify(d))}
initData();

function selectRole(r){
 role=r;
 document.querySelectorAll(".role").forEach(b=>b.classList.remove("active"));
 event.target.classList.add("active");
 document.getElementById("loginTitle").textContent=r==="doctor"?"Doctor Login":"Patient Login";
 document.getElementById("loginMessage").textContent="";
}
function login(){
 const email=document.getElementById("email").value.trim().toLowerCase();
 const pass=document.getElementById("password").value;

 if(role==="doctor"){
   const u=demoUsers.doctor;
   if(email===u.email && pass===u.password){
     currentUser={role:"doctor",name:u.name};
     localStorage.setItem("careplusSession",JSON.stringify(currentUser));
     openApp();
   }else{
     document.getElementById("loginMessage").textContent="Invalid doctor credentials.";
   }
   return;
 }

 const accounts=getAccounts();
 const registered=accounts.find(a=>a.email===email && a.password===pass);

 if(registered){
   currentUser={role:"patient",name:registered.name,email:registered.email,age:registered.age};
   localStorage.setItem("careplusSession",JSON.stringify(currentUser));
   openApp();
   return;
 }

 const demo=demoUsers.patient;
 if(email===demo.email && pass===demo.password){
   currentUser={role:"patient",name:demo.name,email:demo.email,age:"28"};
   localStorage.setItem("careplusSession",JSON.stringify(currentUser));
   openApp();
 }else{
   document.getElementById("loginMessage").textContent="Invalid patient credentials.";
 }
}
function openApp(){
 document.getElementById("loginScreen").classList.add("hidden");
 document.getElementById("app").classList.remove("hidden");
 document.getElementById("profileName").textContent=currentUser.name;
 document.getElementById("profileRole").textContent=currentUser.role==="doctor"?"Doctor":"Patient";
 document.getElementById("avatar").textContent=currentUser.role==="doctor"?"D":"P";
 document.getElementById("sideRole").textContent=currentUser.role==="doctor"?"Doctor Portal":"Patient Portal";
 document.getElementById("navPatient").classList.toggle("hidden",currentUser.role!=="patient");
 document.getElementById("navDoctor").classList.toggle("hidden",currentUser.role!=="doctor");
 document.getElementById("heroTitle").textContent=currentUser.role==="doctor"?"Welcome, Doctor":"Your Health, Our Priority";
 document.getElementById("welcomeText").textContent=currentUser.role==="doctor"?"Manage patients and appointments":"Manage your healthcare information";
 document.getElementById("appointmentFormPanel").classList.toggle("hidden",currentUser.role==="doctor");
 document.getElementById("prescriptionFormPanel").classList.toggle("hidden",currentUser.role==="patient");
 renderAll();
 showPage("dashboard");
}
function logout(){
 localStorage.removeItem("careplusSession");
 currentUser=null;
 document.getElementById("app").classList.add("hidden");
 document.getElementById("loginScreen").classList.remove("hidden");
 document.getElementById("email").value="";
 document.getElementById("password").value="";
}
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
 document.querySelectorAll(".nav-btn").forEach(b=>{
   if(b.getAttribute("onclick")?.includes(id)) b.classList.add("active");
 });
 document.getElementById("pageTitle").textContent=id.charAt(0).toUpperCase()+id.slice(1);
 renderAll();
}
function visibleAppointments(){
 const d=data();
 if(currentUser.role==="doctor") return d.appointments;
 return d.appointments.filter(a=>a.patient===currentUser.name);
}
function visiblePrescriptions(){
 const d=data();
 if(currentUser.role==="doctor") return d.prescriptions;
 return d.prescriptions.filter(x=>x.patient===currentUser.name);
}
function renderPatientProfile(){
 const box=document.getElementById("patientProfile");
 if(currentUser.role==="patient"){
   box.classList.remove("hidden");
   document.getElementById("patientWelcome").textContent="Welcome, "+currentUser.name;
   document.getElementById("patientDetails").textContent=
     "Age: "+(currentUser.age||"Not provided")+"  •  Email: "+(currentUser.email||"Demo account")+"  •  Patient ID: CP-"+String(currentUser.name.length*137).padStart(4,"0");
 }else{
   box.classList.add("hidden");
 }
}

function renderAll(){
 renderPatientProfile();
 const d=data();
 const apps=visibleAppointments(), rxs=visiblePrescriptions();
 document.getElementById("statAppointments").textContent=apps.length;
 document.getElementById("statPrescriptions").textContent=rxs.length;
 document.getElementById("statPatients").textContent=currentUser?.role==="doctor"?d.patients.length:1;
 document.getElementById("statBills").textContent=d.bills.filter(b=>b.status==="Pending" && (currentUser.role==="doctor"||b.patient===currentUser.name)).length;

 const da=document.getElementById("dashboardAppointments");
 da.innerHTML=apps.slice(0,3).map(a=>`<div class="doctor-mini"><div><b>${a.patient}</b><small>${a.doctor} · ${a.date} · ${a.time}</small></div><span class="status">${a.status}</span></div>`).join("") || '<div class="empty">No upcoming appointments.</div>';

 document.getElementById("patientTable").innerHTML=d.patients.map(p=>`<tr><td>${p.name}</td><td>${p.age}</td><td>${p.problem}</td><td>${p.doctor}</td></tr>`).join("");

 document.getElementById("appointmentTable").innerHTML=apps.map(a=>`<tr><td>${a.patient}</td><td>${a.doctor}</td><td>${a.date}</td><td>${a.time}</td><td><span class="status">${a.status}</span></td></tr>`).join("") || '<tr><td colspan="5" class="empty">No appointments.</td></tr>';

 document.getElementById("rxTable").innerHTML=rxs.map(x=>`<tr><td>${x.patient}</td><td>${x.medicine}</td><td>${x.dosage}</td><td>${x.duration}</td></tr>`).join("") || '<tr><td colspan="4" class="empty">No prescriptions.</td></tr>';

 const bills=currentUser.role==="doctor"?d.bills:d.bills.filter(b=>b.patient===currentUser.name);
 document.getElementById("billTable").innerHTML=bills.map(b=>`<tr><td>${b.patient}</td><td>${b.service}</td><td>₹${b.amount}</td><td><span class="status">${b.status}</span></td></tr>`).join("") || '<tr><td colspan="4" class="empty">No bills.</td></tr>';
}
function addPatient(){
 const name=document.getElementById("newPatientName").value.trim();
 const age=document.getElementById("newPatientAge").value.trim();
 const problem=document.getElementById("newPatientProblem").value.trim();
 if(!name||!age||!problem)return alert("Please enter all patient details.");
 const d=data(); d.patients.push({name,age,problem,doctor:"Dr. Priya Sharma"}); save(d);
 document.getElementById("newPatientName").value="";document.getElementById("newPatientAge").value="";document.getElementById("newPatientProblem").value="";
 alert("Patient added successfully.");renderAll();
}
function addAppointment(){
 const patient=document.getElementById("apptPatient").value.trim();
 const doctor=document.getElementById("apptDoctor").value;
 const date=document.getElementById("apptDate").value;
 const time=document.getElementById("apptTime").value;
 if(!patient||!date||!time)return alert("Please complete appointment details.");
 const d=data();d.appointments.push({patient,doctor,date,time,status:"Confirmed"});save(d);
 document.getElementById("apptMessage").textContent="Appointment booked successfully.";
 renderAll();
}
function addPrescription(){
 const patient=document.getElementById("rxPatient").value.trim();
 const medicine=document.getElementById("rxMedicine").value.trim();
 const dosage=document.getElementById("rxDosage").value.trim();
 const duration=document.getElementById("rxDuration").value.trim();
 if(!patient||!medicine||!dosage||!duration)return alert("Please complete prescription details.");
 const d=data();d.prescriptions.push({patient,medicine,dosage,duration});save(d);
 document.getElementById("rxMessage").textContent="Prescription saved successfully.";
 renderAll();
}
window.addEventListener("load",()=>{
 const s=localStorage.getItem("careplusSession");
 if(s){currentUser=JSON.parse(s);openApp();}
});
