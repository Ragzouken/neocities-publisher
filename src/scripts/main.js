
async function upload(username, password, destination, blob) {
    const headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(username + ":" + password));

    const body = new FormData();
    body.append(destination, blob);

    return fetch("https://neocities.org/api/upload", {
        method: "POST",
        headers,
        body,
        mode: "no-cors",
        redirect: "follow",
    });
}

async function start() {
    const usernameInput = /** @type {HTMLInputElement} */ (document.getElementById("username"));
    const passwordInput = /** @type {HTMLInputElement} */ (document.getElementById("password"));
    const destinationInput = /** @type {HTMLInputElement} */ (document.getElementById("destination"));
    const uploadButton = document.getElementById("upload");

    let data = undefined;

    window.addEventListener("message", (event) => {
        const { name, html } = event.data;
        const filename = name.replace(/[^a-z0-9]/gi, '_');

        const blob = new Blob([html], { type: "text/html" });
        data = blob;
        //console.log(Math.ceil(blob.size / 1024) + "KiB");

        destinationInput.value = `flicksy/${filename}.html`;
    });   
    if (window.opener) window.opener.postMessage("ready", "*");

    uploadButton.addEventListener("click", async () => {
        const response = await upload(
            usernameInput.value, 
            passwordInput.value, 
            destinationInput.value,
            data,
        );
    });
}
