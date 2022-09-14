// Retrieves object that contains resume info
async function infoObject () {
  return chrome.storage.sync.get('infoObject').then((items) => {
    if (Object.keys(items).length === 0) {
      // Form has never been filled in yet,
      // Display pop up to fill in
      return {}
    }
    return items
  })
}

console.log(infoObject())
