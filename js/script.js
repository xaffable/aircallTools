var apiId = null;
var token = null;
var apiLoggedIn= false;
var headers = new Headers()

//checks if connected to API account and if so, checks if a message URL is entered
//and numbers are selected before enabling the Update Numbers button
function validate(){
  const submitButton = document.getElementById('submit')
  let  number = document.getElementById('numbers').selectedIndex
  let messageValue =document.getElementById('message').value;
if(messageValue != "" && number>=0 && apiLoggedIn==true) {
submitButton.className = 'button enabledButton'
submitButton.disabled=false;
}
else{
submitButton.className = 'button disabledButton'
submitButton.disabled=true;
}};

//Check if API ID and Token has been entered. If both have, enable Save button.
function validateApi (){
apiId = apiId = document.getElementById('apiId').value;
token = document.getElementById('token').value
const apiButton = document.getElementById('apiSave');
let apiAuth= null
  if((apiId !="" || null)&&(token != "" || null)){
    apiButton.className = 'button enabledButton'
    apiButton.disabled=false;
    apiAuth=true;
  } else {
    apiButton.className= 'button disabledButton'
    apiButton.disabled=true;
    apiAuth=false;
  }
};

// Verify credentials entered are correct with Aircall and display company name if so.

 function getCompany(){
 apiId = apiId = document.getElementById('apiId').value;
 token = document.getElementById('token').value
  let apiButton = document.getElementById('apiSave');
  let companyName = null;
  let error = null;
      if (apiAuth=true && apiButton.value=='Save' && apiLoggedIn==false){
    headers.set('Authorization', 'Basic ' + btoa(apiId + ":" + token))
    headers.append('Content-Type', 'application/json');
 fetch('https://api.aircall.io/v1/company',{
        method:'GET',
        headers: headers
      })
      .then(resp=> {
        if (!resp.ok){
          error = true
        }
        return resp.json()
      }
    )
      .then(data => {
        if (error == true){
          apiLoggedIn = false;
          document.getElementById('apiId').disabled=false;
          document.getElementById('token').disabled=false;
          document.getElementById('alert').className='alert alert-danger';
          document.getElementById('alert').innerHTML=(`<button type="button" class="close" aria-label="Close" onclick="clearAlert()"><span aria-hidden="true">&times;</span></button><strong>Error:</strong> ${data.error} - ${data.troubleshoot}`);
          validate();
          throw Error(`${data.error} - ${data.troubleshoot}`)
        } else{
      document.getElementById('apiDropdown').innerHTML = data.company.name,
      apiButton.value='Change Account',
      document.getElementById('apiId').disabled=true,
      document.getElementById('token').disabled=true,
      apiLoggedIn = true,
      document.getElementById('alert').className='',
      document.getElementById('alert').innerHTML='',
      getNumbers()
    }})
      .catch((error) => {
        console.error(error)
      })
}else{
   apiButton.value='Save'
   document.getElementById('apiId').disabled=false;
   document.getElementById('token').disabled=false;
   document.getElementById('apiDropdown').innerHTML = 'Connect to an Account';
   apiLoggedIn=false;
   validate();
}}

//retrieve all numbers associated with the Aircall account. If more than 50, send multiple GET requests until all numbers have been retrieved.
function getNumbers(){
  apiId = apiId = document.getElementById('apiId').value;
  token = document.getElementById('token').value
  let page = 1;
  let error = null;
const get50Numbers = async function(page = 1) {
            headers.set('Authorization', 'Basic ' + btoa(apiId + ":" + token));
            let apiResults= await fetch(`https://api.aircall.io/v1/numbers?order=asc&page=+${page}+&per_page=50`,{
              method:'GET',
              headers: headers
            })
            .then(resp=>{
              if (!resp.ok) {
                error = true
              }
            return resp.json()
          }).then(data => {
            if (error == true){
              document.getElementById('alert').className='alert alert-danger';
              document.getElementById('alert').innerHTML=(`<button type="button" class="close" aria-label="Close" onclick="clearAlert()"><span aria-hidden="true">&times;</span></button><strong>Error:</strong> ${data.error} - ${data.troubleshoot}`)
              throw Error(`${data.error} - ${data.troubleshoot}`)}
return data
})
              .catch((error) => {
                console.error(error)
              })
            return apiResults;
            }
            const getAllNumbers = async function(page = 1) {
              const results = await get50Numbers(page);
              nextPage = results.meta.next_page_link
              let totalNumbers = results.meta.total
              let currentNumbers = page*50
              if (nextPage != null) {
                document.getElementById('alert').className='alert alert-info';
                document.getElementById('alert').innerHTML=(`<strong>Loading numbers:</strong> ${currentNumbers} out of ${totalNumbers} loaded so far`);
                return results.numbers.concat(await getAllNumbers(page+1));
              }
              if ((nextPage == null) && page==1){
                return results.numbers;
              }
              else {
                document.getElementById('alert').className='alert alert-info';
                document.getElementById('alert').innerHTML=(`<button type="button" class="close" aria-label="Close" onclick="clearAlert()"><span aria-hidden="true">&times;</span></button>All numbers loaded successfully!`);
return results.numbers;
              }};
(async ()=>{
    const entireList=await getAllNumbers();
                document.getElementById('numbers2').innerHTML='<select id="numbers" multiple="multiple" onchange="validate()"></select>';
                entireList.forEach(element => {
                  let digits = toString(element.digits)
                  document.getElementById('numbers').insertAdjacentHTML('afterbegin','<option value="'+element.id+'">'+element.name+' '+element.digits+'</option>');
                      })
                      //intializes Multiselect plugin
                      $(document).ready(function() {
                          $('#numbers').multiselect({
                              enableFiltering: true,
                              enableCaseInsensitiveFiltering: true,
                              includeSelectAllOption: true,
                              buttonWidth: '400px'
                  })})
})()};

//Clear Success, Error, or Info Alerts when the X button is clicked
      function clearAlert(){
        document.getElementById('alert').innerHTML=('');
        document.getElementById('alert').className='';
      }

      // Update numbers on the Aircall account when the Update Numbers button is pressed
            function postUpdate(){
              apiId = apiId = document.getElementById('apiId').value;
              token = document.getElementById('token').value
              let messageType =document.getElementById('type').value;
              let messageValue =document.getElementById('message').value;
              let numbersValue = $('#numbers').val();
              let totalNumbers = numbersValue.length;
              let payload = `{"messages": {"${messageType}":"${messageValue}"}}`
              let counter = 0;
              let error = null;
                                numbersValue.forEach(element => {
                                  headers.set('Authorization', 'Basic ' + btoa(apiId + ":" + token))
                                  headers.append('Content-Type', 'application/json')
fetch(`https://api.aircall.io/v1/numbers/${element}`, {
  method:'PUT',
  headers: headers,
  body: payload
}).then(resp =>{
  if (!resp.ok) {
    error = true
  }
return resp.json()
}).then(data =>{
  if (error != true) {
    counter+=1
    document.getElementById('alert').className='alert alert-success';
    document.getElementById('alert').innerHTML=('<button type="button" class="close" aria-label="Close" onclick="clearAlert()"><span aria-hidden="true">&times;</span></button>'+counter+' out of '+totalNumbers+' numbers successfully updated');
  }else{
    let troubleshoot = data.troubleshoot
    if (troubleshoot==''){
      troubleshoot=' Invalid Message or Music URL'
    }
    document.getElementById('alert').innerHTML=('<button type="button" class="close" aria-label="Close" onclick="clearAlert()"><span aria-hidden="true">&times;</span></button><strong>Error:</strong> '+data.error+' - '+troubleshoot);
    document.getElementById('alert').className='alert alert-danger';
    throw Error(`${data.error} - ${troubleshoot}`)
  }}).catch((error) => {
    console.error(error)
  })
})}
