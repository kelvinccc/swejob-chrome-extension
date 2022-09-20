const DEBUG = false
const INFO_ITEMS = {
  fname: '',
  lname: '',
  email: '',
  phone: '',
  linkedin: ''
}

type ResumeI = {
  'fname': string,
  'lname': string,
  'email': string,
  'phone': string,
  'linkedin': string
}

let info = {
  fname: '',
  lname: '',
  email: '',
  phone: '',
  linkedin: ''
}

chrome.runtime.onStartup.addListener(async () => {
  const resumeInfo = await getStorageItem(info as ResumeI)
  if (typeof resumeInfo === 'undefined') {
    await setStorageItem(INFO_ITEMS)
  } else {
    info = resumeInfo as ResumeI
  }
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'saveInfo') {
    await setStorageItem(message.resumeInfo)
    await setResumeInfo(message.resumeInfo)
    sendResponse(true)
    return true // return true to indicate to have sendResponse be called asynchronously
  } else if (message.action === 'getInfo') {
    sendResponse(info)
    return true
  }
})

type StorageItem = {}

const setStorageItem = async (item : StorageItem) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set((item), () => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      return resolve(true)
    })
  })
}

const getStorageItem = async (keys: string | string[] | ResumeI) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(keys, (items) => {
      if (DEBUG) {
        console.log(items)
        console.log(keys)
      }
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      // Pass the data retrieved from storage down the promise chain.
      return resolve(items)
    })
  })
}

const setResumeInfo = async (resumeInfo : ResumeI) => {
  info = resumeInfo
}

const getResumeInfo = async () => {
  return info
}
