const submit = document.getElementById('submit')

if (submit !== null) {
  submit.onclick = (event: Event) => {
    event.preventDefault()
    console.log(event)
    console.log('hello')
  }
}
console.log('hello')
