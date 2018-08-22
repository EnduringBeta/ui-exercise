// Functionality for email client

var protocol = "http://";
var serverUrl = "localhost:8080/";

var xhr;

var currentEmail = "jobApplicant@salesloft.com";

var origEmailList = [];
var tagsList = [];
var tagsColorRotation = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

function readEmails(filename) {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var newEmails = parseJson(xhr.responseText);

            newEmails.messages.forEach(function (email) {
                origEmailList.push(email);
                tryAddNewTags(email.tags);
                addEmail(email);
            });

            updateFooterCount(
                origEmailList.length, origEmailList.length);
        }
    };
    xhr.open("GET", protocol + serverUrl + filename);
    xhr.send();
}

function parseJson(rawJson) {
    var emails = {};
    try {
        var emails = JSON.parse(rawJson);
    }
    catch (e) {
        console.log(e);
        return "Error: invalid JSON format!";
    }
    console.log(emails);
    return emails;
}

function tryAddNewTags(tags) {
    tags.forEach(function (newTag) {
        if (tagsList.find(function (tag) {
            return newTag.toLocaleLowerCase() === tag.name;
        }) === undefined) {
            tagsList.push({
                name: newTag.toLocaleLowerCase(),
                color: tagsColorRotation[tagsList.length % tagsColorRotation.length]
            });
            addTag(newTag.toLocaleLowerCase());
        }
    });
}

function addTag(tag) {
    var sidebarTagsEl = document.getElementById("sidebar-tags");
    var tagEl = document.createElement("div");
    tagEl.innerHTML = "<h3>" + tag + "</h3>";
    tagEl.className = "sidebar-option sidebar-tag";
    tagEl.onclick = function () {
        document.getElementById("search-bar").value = tag;
        searchText();
    }

    sidebarTagsEl.appendChild(tagEl);
}

function addEmail(emailObj) {
    var list = document.getElementById("email-list");

    var entry = document.createElement("div");
    entry.setAttribute("id", emailObj.id);
    entry.setAttribute("date", emailObj.date);
    entry.setAttribute("sender", emailObj.sender);
    entry.setAttribute("subject", emailObj.subject);
    entry.className = "email";

    var checkboxEl = document.createElement("div");
    checkboxEl.className = "checkbox";
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkboxEl.appendChild(checkbox);

    var emailInfoEl = document.createElement("div");
    emailInfoEl.className = "email-info";
    emailInfoEl.addEventListener("click", function () {
        openEmail(emailObj.id);
    });

    var senderText = document.createElement("div");
    senderText.innerHTML = emailObj.sender;
    senderText.className = "sender-text";

    var infoEl = document.createElement("div");
    infoEl.title = emailObj.subject;
    infoEl.className = "info-text";

    if (emailObj.tags.length > 0) {
        emailObj.tags.forEach(function (tag) {
            var tagSpan = document.createElement("span");
            tagSpan.innerHTML = tag;
            tagSpan.className = "tag";
            var bgColor = tagsList.find(function (origTag) {
                return tag === origTag.name;
            }).color;
            tagSpan.setAttribute("style", "background-color: " + bgColor);
            infoEl.appendChild(tagSpan);
        });
    }

    var subjectText = document.createElement("span");
    subjectText.innerHTML = emailObj.subject;
    var bodyText = document.createElement("span");
    bodyText.innerHTML = " - " + simplifyBodyText(emailObj.body);
    bodyText.className = "body-text";
    infoEl.appendChild(subjectText);
    infoEl.appendChild(bodyText);

    var dateText = document.createElement("div");
    var date = new Date(emailObj.date);
    dateText.innerHTML = date.toLocaleString("en-US");
    dateText.className = "date-text";

    //var deleteButton = document.createElement("button");
    //deleteButton.innerHTML = "X";
    //deleteButton.className = "button delete-button";

    emailInfoEl.appendChild(senderText);
    emailInfoEl.appendChild(infoEl);
    emailInfoEl.appendChild(dateText);
    //emailInfoEl.appendChild(deleteButton);

    entry.appendChild(checkboxEl);
    entry.appendChild(emailInfoEl);

    // TODO: Implement sorting
    list.appendChild(entry);

    // From: https://stackoverflow.com/a/5002618
    function simplifyBodyText(rawHtml) {
        var div = document.createElement("div");
        div.innerHTML = rawHtml;
        return div.textContent || div.innerText || "";
    }
}

/*function removeEmail(emailIds) {
    emailIds.forEach(function (id) {
        var list = document.getElementById("email-list");
        var email = list.querySelectorAll(String.format("div[{0}]", id));
        list.removeChild(email);
    });
}*/

function deleteSelectedEmail() {
    var list = document.getElementById("email-list");

    // Work backwards since removing elements from list
    for (var i = list.children.length - 1; i >= 0; i--) {
        var id = list.children[i].id;
        // Assuming checkbox is first child
        if (list.children[i].children[0].children[0].checked) {
            list.removeChild(list.children[i]);
            origEmailList.splice(origEmailList.indexOf(
                origEmailList.find(function (email) {
                    return email.id === id;
                })), 1);
        }
    }

    searchText();
}

function removeAllEmail() {
    var list = document.getElementById("email-list");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function openEmail(emailId) {
    var list = document.getElementById("email-list");
    list.setAttribute("hidden", true);
    var view = document.getElementById("email-view");
    view.removeAttribute("hidden");
    var comp = document.getElementById("email-compose");
    comp.setAttribute("hidden", true);

    var emailObj = origEmailList.find(function (email) {
        return email.id === emailId;
    });

    console.log(emailObj);

    document.getElementById("view-subject").innerHTML = emailObj.subject;
    document.getElementById("view-from").innerHTML = emailObj.sender;
    document.getElementById("view-to").innerHTML = currentEmail;
    document.getElementById("view-tags").innerHTML =
    emailObj.tags.length > 0 ? emailObj.tags : "None";
    document.getElementById("view-body").innerHTML = emailObj.body;
}

function closeEmail() {
    var list = document.getElementById("email-list");
    list.removeAttribute("hidden");
    var view = document.getElementById("email-view");
    view.setAttribute("hidden", true);
    var comp = document.getElementById("email-compose");
    comp.setAttribute("hidden", true);
}

function composeEmail() {
    var list = document.getElementById("email-list");
    list.setAttribute("hidden", true);
    var view = document.getElementById("email-view");
    view.setAttribute("hidden", true);
    var comp = document.getElementById("email-compose");
    comp.removeAttribute("hidden");

    document.getElementById("compose-from").value = currentEmail;
}

function replyEmail() {
    composeEmail();

    document.getElementById("compose-to").value =
    document.getElementById("view-from").innerHTML
    document.getElementById("compose-subject").value =
    "Re: " + document.getElementById("view-subject").innerHTML;
    document.getElementById("compose-body").value = "\r\n\r\n---\r\n\r\n" +
    (document.getElementById("view-body").textContent ||
        document.getElementById("view-body").innerText);
}

function sendEmail() {
    console.log("Sent email!");
    closeEmail();
}

/*
function selectEmail(emailId) {
    console.log("Selected: " + emailId);
}
*/

function searchText() {
    var text = document.getElementById("search-bar").value.toLocaleLowerCase();

    removeAllEmail();

    closeEmail();

    var count = 0;
    if (text === "") {
        origEmailList.forEach(function (email) {
            addEmail(email);
        });
        count = origEmailList.length;
    }
    else {
        origEmailList.forEach(function (email) {
            if (email.subject.toLocaleLowerCase().includes(text) ||
                email.body.toLocaleLowerCase().includes(text) ||
                email.sender.toLocaleLowerCase().includes(text) ||
                email.tags.find(function (tag) {
                    return tag.toLocaleLowerCase().includes(text);
                })) {
                addEmail(email);
                count++;
            }
        });
    }

    updateFooterCount(count, origEmailList.length);
}

function updateFooterCount(num, max) {
    var footerEl = document.getElementById("count-text");
    footerEl.innerHTML = String.format("Showing {0} of {1} emails",
        num, max);
}

function goHome() {
    closeEmail();
    document.getElementById("search-bar").value = "";
    searchText();
}

// For testing
// From here: https://github.com/ideaq/learn-mocha
emails = {
    parseJson: parseJson
}
//module.exports = emails;
