let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")
const downloadBtn = document.getElementById("download-btn")
const fileTypeSelector = document.getElementById("fileType")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    myLeads.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    render(myLeads)
})

downloadBtn.addEventListener("click", function() {
    const selectedFileType = fileTypeSelector.value

    if (selectedFileType === "csv") {
        downloadAsCSV()
    } else if (selectedFileType === "pdf") {
        downloadAsPDF()
    } else if (selectedFileType === "txt") {
        downloadAsTXT()
    }
})

function downloadAsCSV() {
    const csvContent = "data:text/csv;charset=utf-8," + myLeads.join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "leads.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function downloadAsTXT() {
    const txtContent = "data:text/plain;charset=utf-8," + encodeURIComponent(myLeads.join("\n"))
    const link = document.createElement("a")
    link.setAttribute("href", txtContent)
    link.setAttribute("download", "leads.txt")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

function downloadAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    for (let i = 0; i < myLeads.length; i++) {
        doc.text(myLeads[i], 10, 10 + (i * 10));
    }
    
    doc.save('leads.pdf');
}