var apiId = null;
var token = null;
var apiAuth= null;
var apiLoggedIn = false;
var number =null;
var request = new XMLHttpRequest();

//checks if connected to API account and if so, checks if a message URL is entered
//and numbers are selected before enabling the Update Numbers button
function validate(){
  var message =document.getElementById('message');
  var messageValue = message.value;
  const submitButton = document.getElementById('submit')

  if (apiLoggedIn==true){
    number = document.getElementById('numbers').selectedIndex
  }
if(messageValue != "" && number>=0 && apiLoggedIn==true) {
submitButton.className = 'button enabledButton'
submitButton.disabled=false;
}
else{
submitButton.className = 'button disabledButton'
submitButton.disabled=true;
}};

function validateApi (){
var apiId = apiId = document.getElementById('apiId').value;
var token = document.getElementById('token').value
const apiButton = document.getElementById('apiSave');

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


 function getCompany(){
  var apiId = apiId = document.getElementById('apiId').value;
  var token = document.getElementById('token').value
  const apiButton = document.getElementById('apiSave');

  if (apiAuth=true && apiButton.value=='Save' && apiLoggedIn==false){
    request.open('GET', 'https://api.aircall.io/v1/company')
        request.setRequestHeader("Authorization", "Basic " + btoa(apiId + ":" + token))

    request.onload = function () {
    var data = JSON.parse(this.response)

    if (request.status >= 200 && request.status < 400) {
    companyName = (data.company.name);
    document.getElementById('apiDropdown').innerHTML = companyName;
    apiButton.value='Change Account';
    document.getElementById('apiId').disabled=true;
    document.getElementById('token').disabled=true;
    apiLoggedIn = true;
    document.getElementById('alert').className='';
    document.getElementById('alert').innerHTML='';
    getNumbers();
    } else {
      apiLoggedIn = false;
      document.getElementById('apiId').disabled=false;
      document.getElementById('token').disabled=false;
      document.getElementById('alert').className='alert alert-danger';
      document.getElementById('alert').innerHTML=('<button type="button" class="close" aria-label="Close" onclick="clearAlert()"><span aria-hidden="true">&times;</span></button><strong>Error:</strong> '+data.error+' - '+data.troubleshoot);


      validate();
    }};
request.send();

}else{
   apiButton.value='Save'
   document.getElementById('apiId').disabled=false;
   document.getElementById('token').disabled=false;
   document.getElementById('apiDropdown').innerHTML = 'Connect to an Account';
   apiLoggedIn=false;
   validate();
}

};


// Verify credentials entered are correct with Aircall and display company name if so.
/*
 function getCompany(){
  let headers = new Headers();
  var apiId = apiId = document.getElementById('apiId').value;
  var token = document.getElementById('token').value
  let apiButton = document.getElementById('apiSave');
  let companyName = null;
      if (apiAuth=true && apiButton.value=='Save' && apiLoggedIn==false){
    headers.set({'Authorization', 'Basic ' + btoa(apiId + ":" + token)},{'Content-Type': 'application/json'})
 fetch('https://api.aircall.io/v1/company',{
        method:'GET',
        headers: headers

      })
      .then(resp=> {
        resp.json()
      if (!resp.ok){
        console.log(resp);
        throw Error(resp);
      } else{
              return resp.json()
      }
    })
      .then(data => {
      document.getElementById('apiDropdown').innerHTML = data.company.name,
      apiButton.value='Change Account',
      document.getElementById('apiId').disabled=true,
      document.getElementById('token').disabled=true,
      apiLoggedIn = true,
      document.getElementById('alert').className='',
      document.getElementById('alert').innerHTML='',
      getNumbers()
    })
      .catch((error) => {
        console.error(error);
      })

}else{
   apiButton.value='Save'
   document.getElementById('apiId').disabled=false;
   document.getElementById('token').disabled=false;
   document.getElementById('apiDropdown').innerHTML = 'Connect to an Account';
   apiLoggedIn=false;
   validate();
} }


/*
fetch('https://api.aircall.io/v1/company',
{
  method:'GET',
  headers: headers

}).then(response =>

    console.log(response),
  document.getElementById('apiDropdown').innerHTML = (response),
  apiButton.value='Change Account',
  document.getElementById('apiId').disabled=true,
  document.getElementById('token').disabled=true,
  apiLoggedIn = true,
  document.getElementById('alert').className='',
  document.getElementById('alert').innerHTML='',
  getNumbers())
}}
*/

function getNumbers(){
  apiId = apiId = document.getElementById('apiId').value;
  token = document.getElementById('token').value
  var page = 1;
const get50Numbers = async function(page = 1) {
let url=`https://api.aircall.io/v1/numbers?order=asc&page=+${page}+&per_page=50`;
            let headers = new Headers();
            headers.set('Authorization', 'Basic ' + btoa(apiId + ":" + token));
            var apiResults= await fetch(url,{
              method:'GET',
              headers: headers

            })
            .then(resp=>{
            return resp.json();
            });

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
              }
            };
(async ()=>{
    const entireList=await getAllNumbers();
                document.getElementById('numbers2').innerHTML='<select id="numbers" multiple="multiple" onchange="validate()"></select>';
                entireList.forEach(element => {
                  var digits = toString(element.digits)
                  document.getElementById('numbers').insertAdjacentHTML('afterbegin','<option value="'+element.id+'">'+element.name+' '+element.digits+'</option>');
                      })
                      //intializes Multiselect plugin
                      $(document).ready(function() {
                          $('#numbers').multiselect({
                              enableFiltering: true,
                              includeFilterClearBtn: false,
                              enableCaseInsensitiveFiltering: true,
                              includeSelectAllOption: true,
                              buttonWidth: '400px'
                  })})


})();

          };



//Clear Success, Error, or Info Alerts when the X button is clicked
      function clearAlert(){
        document.getElementById('alert').innerHTML=('');
        document.getElementById('alert').className='';
      }

// Update numbers on the Aircall account when the Update Numbers button is pressed
      function postUpdate(){
        var apiId = apiId = document.getElementById('apiId').value;
        var token = document.getElementById('token').value
        var message =document.getElementById('message');
        var messageType =document.getElementById('type');
        messageType = messageType.value;
        var messageValue = message.value;
        var numbersValue = $('#numbers').val();
        var totalNumbers = numbersValue.length;
        var payload = `{"messages": {"${messageType}":"${messageValue}"}}`
        var counter = 0;
                          numbersValue.forEach(element => {
var request = new XMLHttpRequest();
                                  request.open('PUT', 'https://api.aircall.io/v1/numbers/'+element)
                                      request.setRequestHeader("Authorization", "Basic " + btoa(apiId + ":" + token))
                                      request.setRequestHeader("Content-Type", "application/json")
                                      request.onload = function () {
                                        var data = JSON.parse(this.response)
                                        if (this.readyState == 4 && this.status >= 200 && this.status < 400) {
                                          counter+=1
                                          document.getElementById('alert').className='alert alert-success';
                                          document.getElementById('alert').innerHTML=('<button type="button" class="close" aria-label="Close" onclick="clearAlert()"><span aria-hidden="true">&times;</span></button>'+counter+' out of '+totalNumbers+' numbers successfully updated');
                                        }else{
                                          var troubleshoot = data.troubleshoot;
                                          if (troubleshoot==''){
                                            troubleshoot=' Invalid Message or Music URL'
                                          }
                                          document.getElementById('alert').innerHTML=('<button type="button" class="close" aria-label="Close" onclick="clearAlert()"><span aria-hidden="true">&times;</span></button><strong>Error:</strong> '+data.error+' - '+troubleshoot);
                                          document.getElementById('alert').className='alert alert-danger';
                                          console.error(' '+data.error+' - '+troubleshoot);
                                        }}

request.send(payload);
                                  })

      }
