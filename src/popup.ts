const SAVE = 'submit'
const CORNER_BUTTON = 'cornerButton'
const save = document.getElementById(SAVE)
const cornerButton = document.getElementById(CORNER_BUTTON)

type ResumeInfo = {
  'fname': string,
  'lname': string,
  'email': string,
  'phone': string,
  'linkedin': string
}

const init = () => {
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
}

init()

/*
  Saves ResumeInfo object to sync storage && updates resumeInfo object in background.js
*/
const saveInfo = async (resumeInfo : ResumeInfo) => {
  chrome.runtime.sendMessage({ action: 'saveInfo', resumeInfo })
}

/*
  Grab current state of resumeInfo from background.js
*/
const getInfo = async () => {
  const info = await chrome.runtime.sendMessage({ action: 'getInfo' })
  return info
}

// Takes each input and builds a ResumeInfo object
const parseForm = () => {
  const resumeInfo : ResumeInfo = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    linkedin: ''
  }

  // Grab inputs from the form and append values to resumeInfo. Ignores the submit button (A little janky, come back to fix later)
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

// Event handlers:

const handleSaveButton = (event : Event) => {
  // Parse each input and...
  const resumeInfo = parseForm()
  // Save info to sync storage API
  saveInfo(resumeInfo)
  // Display onto popup.html
  displayInfo(resumeInfo, () => generateInfoHTML(resumeInfo, 'info'))
  changeCornerButton('edit')
}

const handleCloseButton = async (event : Event) => {
  const resumeInfo = await getInfo()
  displayInfo(resumeInfo, () => generateInfoHTML(resumeInfo, 'info'))
  changeCornerButton('edit')
}

const handleEditButton = async (event : Event) => {
  const resumeInfo = await getInfo()
  displayInfo(resumeInfo, () => generateFormHTML(resumeInfo, 'form'))
  changeCornerButton('close')
}

const displayInfo = (resumeInfo : ResumeInfo, generateFn : () => HTMLElement) => {
  const main = document.getElementById('main')
  if (main === null) {
    // error
    return
  }

  // Double checking to see if this entries exists, otherwise polyfills it.
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
  const container = generateFn()
  main.appendChild(container)
}

const generateFormHTML = (resumeInfo : ResumeInfo, containerId : string) => {
  const container = document.createElement('form')
  container.id = containerId
  for (const [key, value] of Object.entries(resumeInfo)) {
    const label = document.createElement('label')
    label.htmlFor = key
    label.innerHTML = key
    const input = document.createElement('input')
    input.value = value
    input.id = key
    input.name = key
    input.type = 'text'

    // Incredibly janky loophole here, come back and fix elegantly :)
    if (key === 'email') {
      input.type = 'email'
    }

    const formContainer = document.createElement('div')
    formContainer.id = key + 'Container'
    formContainer.appendChild(label)
    formContainer.appendChild(input)
    container.appendChild(formContainer)
  }
  const saveButton = document.createElement('input')
  saveButton.type = 'submit'
  saveButton.value = 'save'
  saveButton.id = 'submit'

  saveButton.onclick = (event: Event) => {
    event.preventDefault()
    handleSaveButton(event)
  }

  container.appendChild(saveButton)
  return container
}

const generateInfoHTML = (resumeInfo : ResumeInfo, containerId : string) => {
  const container = document.createElement('div')
  container.id = containerId
  for (const [key, value] of Object.entries(resumeInfo)) {
    const name = document.createElement('h3')
    name.innerHTML = key
    const valueHeader = document.createElement('h4')
    valueHeader.innerHTML = value

    const infoContainer = document.createElement('div')
    infoContainer.id = key + 'Container'
    infoContainer.appendChild(name)
    infoContainer.appendChild(valueHeader)
    container.appendChild(infoContainer)
  }
  return container
}

const changeCornerButton = (action : string) => {
  const button = document.getElementById('cornerButton')
  if (button === null) throw Error('cornerbutton is null')
  button.innerHTML = action
  switch (action) {
    case 'edit' : {
      button.onclick = (event: Event) => {
        handleEditButton(event)
      }
      break
    }
    case 'close' : {
      button.onclick = (event: Event) => {
        handleCloseButton(event)
      }
      break
    }
    default : console.log('error')
  }
}
