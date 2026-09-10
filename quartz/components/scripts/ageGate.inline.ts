// The age notice is independent of analytics on the Hindi site.
const ageKey = "catoblepas_hi_age_confirmed"
let confirmedThisVisit = false

function showAgeNotice() {
  if (confirmedThisVisit || document.getElementById("age-gate")) return
  try {
    if (localStorage.getItem(ageKey) === "confirmed") return
  } catch {
    /* Confirmation remains available when storage is blocked. */
  }

  const gate = document.createElement("dialog")
  gate.id = "age-gate"
  gate.className = "age-gate"
  gate.lang = "hi-IN"
  gate.setAttribute("aria-labelledby", "age-gate-title")
  gate.setAttribute("aria-describedby", "age-gate-description")
  gate.innerHTML = `<div class="age-gate__dialog">
    <p class="age-gate__mark" aria-hidden="true">18+</p>
    <h2 id="age-gate-title">कृपया अपनी आयु की पुष्टि करें</h2>
    <p id="age-gate-description">इस वेबसाइट की सामग्री केवल 18 वर्ष या उससे अधिक आयु के पाठकों के लिए है।</p>
    <button type="button" data-age-confirm>मेरी आयु 18 वर्ष या उससे अधिक है</button>
  </div>`
  gate.addEventListener("cancel", (event) => event.preventDefault())
  gate.querySelector("button")!.addEventListener("click", () => {
    confirmedThisVisit = true
    try {
      localStorage.setItem(ageKey, "confirmed")
    } catch {
      /* Session only. */
    }
    gate.close()
    gate.remove()
    document.documentElement.classList.remove("age-gate-open")
  })
  document.body.append(gate)
  document.documentElement.classList.add("age-gate-open")
  gate.showModal()
}

document.addEventListener("nav", showAgeNotice)
showAgeNotice()

export default ""
