const submit = document.getElementById('submit')

if (submit !== null) {
  submit.onclick = (event: Event) => {
    event.preventDefault()
    // Parse each input and...
    saveInfo(parseForm())
    // Save info to sync storage API
  }
}

let ResumeInfo : {
  fname: string,
  lname: string,
  email: string,
  phone: string,
  linkedin: string
}

// Saves ResumeInfo object to sync storage
const saveInfo = async (resumeInfo : typeof ResumeInfo) => {
  console.log(resumeInfo)
  chrome.runtime.sendMessage({ action: 'saveInfo', resumeInfo })
}

// Takes each input and builds a ResumeInfo object
const parseForm = () => {
  const resumeInfo = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    linkedin: ''
  }

  const inputs = document.querySelectorAll('input')
  for (const input of inputs) {
    if (input.type !== 'submit' && hasKey(resumeInfo, input.name)) {
      resumeInfo[input.name] = input.value
    } else {
      // return some error here
    }
  }

  return resumeInfo
}

// Typescript workaround for key indexing objects to make sure compiler doesn't complain
function hasKey<O> (obj : O, key : PropertyKey) : key is keyof O {
  return key in obj
}
