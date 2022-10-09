const DEBUG = true

// Type declaration for the object representing information to input onto resume
type ResumeI = {
  'fname': string,
  'lname': string,
  'email': string,
  'phone': string,
  'linkedin': string
}

type db = {resumeInfo : ResumeI}

// current state of resumeInfo
let resumeInfo : ResumeI = {
  fname: '',
  lname: '',
  email: '',
  phone: '',
  linkedin: ''
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'saveInfo') {
    console.log(message.resumeInfo)
    await setStorageItem(message.resumeInfo)
    await setResumeInfo(message.resumeInfo)
    sendResponse(true)
    return true // return true to indicate to have sendResponse be called asynchronously
  } else if (message.action === 'getInfo') {
    console.log('message recieved to get info...')
    sendResponse(resumeInfo)
    return true
  }
})

type StorageItem = {}

// Save resumeInfo to storage
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

// Get resumeInfo from storage
const getStorageItem = async (keys: string | string[] | ResumeI | null) => {
  return new Promise((resolve : (res : db | PromiseLike<db>) => void, reject) => {
    chrome.storage.sync.get(keys, (items) => {
      if (DEBUG) {
        console.log('items, keys')
        console.log(items)
        console.log(keys)
      }

      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      // Pass the data retrieved from storage down the promise chain.
      return resolve(items as db)
    })
  })
}
// Initialization - get resumeinfo object from storage
// if it has not been initialized, set it to initial state (defined as the info object above)
getStorageItem('resumeInfo').then((res) => {
  console.log('getting resume info from sync. heres the res : ')
  console.log(res)
  if ('resumeInfo' in res) {
    console.log('got resume info! : ')
    resumeInfo = res.resumeInfo
    console.log(resumeInfo)
  } else {
    console.log('doesnt exist yet')
    initStorageWithResumeInfo()
  }
  return res
}).catch((rej) => {
  console.log('failed to retrieve resumeInfo from sync storage')
  return rej
})

const initStorageWithResumeInfo = async () => {
  await setStorageItem({ resumeInfo })
  if (DEBUG) {
    await debugInfo()
  }
  return true
}

// update resumeInfo object for current session
const setResumeInfo = async (info : ResumeI) => {
  resumeInfo = info
}

const debugInfo = async () => {
  console.log('checking db state...')
  await getStorageItem(null)
}
