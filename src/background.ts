const DEBUG = false

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'saveInfo') {
    await setStorageItem(message.resumeInfo)
    sendResponse(true)
    return true // return true to indicate to have sendResponse be called asynchronously
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

const getStorageItem = async (keys: string | string[]) => {
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
