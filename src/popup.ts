const SAVE = 'submit'
const CORNER_BUTTON = 'cornerButton'
const save = document.getElementById(SAVE)
const cornerButton = document.getElementById(CORNER_BUTTON)

if (save !== null) {
  save.onclick = (event: Event) => {
    event.preventDefault()
    handleSaveButton(event)
  }
}

if (cornerButton !== null) {
  cornerButton.onclick = (event: Event) => {
    event.preventDefault()
    handleCloseButton(event)
  }
}

type ResumeInfo = {
  'fname': string,
  'lname': string,
  'email': string,
  'phone': string,
  'linkedin': string
}

// Saves ResumeInfo object to sync storage
const saveInfo = async (resumeInfo : ResumeInfo) => {
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
  for (const input in inputs) {
    if (inputs[input].type !== 'submit' && hasKey(resumeInfo, inputs[input].name)) {
      const name = inputs[input].name
      resumeInfo[name as keyof ResumeInfo] = inputs[input].value
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

const handleSaveButton = (event : Event) => {
  // Parse each input and...
  const resumeInfo = parseForm()
  saveInfo(resumeInfo)
  // Save info to sync storage API
  displayInfo(resumeInfo)
  changeCornerButton('edit')
}

const handleCloseButton = (event : Event) => {
  const resumeInfo = parseForm()
  displayInfo(resumeInfo)
  changeCornerButton('close')
}

const handleEditButton = (event : Event) => {
  const resumeInfo = parseForm()
  displayInfo(resumeInfo)
  changeCornerButton('close')
}

const displayInfo = (resumeInfo : ResumeInfo) => {
  const main = document.getElementById('main')
  if (main === null) {
    // error
    return
  }
  console.log(resumeInfo)

  if (!Object.entries) {
    Object.entries = function (obj : any) {
      const ownProps = Object.keys(obj)
      let i = ownProps.length
      const resArray = new Array(i) // preallocate the Array
      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]]
      }
      return resArray
    }
  }
  main.firstElementChild?.remove()
  const infoContainer = document.createElement('div')
  infoContainer.id = 'infoContainer'
  for (const [key, value] of Object.entries(resumeInfo)) {
    const name = document.createElement('h3')
    name.innerHTML = key
    const valueHeader = document.createElement('h4')
    valueHeader.innerHTML = value

    const container = document.createElement('div')
    container.id = key + 'Container'
    container.appendChild(name)
    container.appendChild(valueHeader)
    infoContainer.appendChild(container)
  }
  main.appendChild(infoContainer)
}

const changeCornerButton = (action : string) => {
  const button = document.getElementById('cornerButton')
  if (button === null) return
  button.innerHTML = action
  switch (action) {
    case 'edit' : {
      button.onclick = (event: Event) => {
        console.log('edit')
        handleEditButton(event)
      }
      break
    }
    case 'close' : {
      button.onclick = (event: Event) => {
        handleCloseButton(event)
      }
      console.log('close')
      break
    }
    default : console.log('error')
  }
}
