
async function upload(username, password, destination, blob) {
    const headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(username + ":" + password));

    const body = new FormData();
    body.append(destination, blob);

    return fetch("https://neocities-cors.glitch.me/api/upload", {
        method: "POST",
        headers,
        body,
        mode: "cors",
    });
}

async function start() {
    console.log("START")
    const usernameInput = /** @type {HTMLInputElement} */ (document.getElementById("username"));
    const passwordInput = /** @type {HTMLInputElement} */ (document.getElementById("password"));
    const destinationInput = /** @type {HTMLInputElement} */ (document.getElementById("destination"));
    const uploadButton = /** @type {HTMLInputElement} */ (document.getElementById("upload"));

    const form = document.querySelector("form");

    let data = undefined;

    uploadButton.addEventListener("click", async (event) => {
        uploadButton.disabled = true;
        try {
            const username = usernameInput.value;
            const password = passwordInput.value;
            const destination = destinationInput.value;

            await upload(username, password, destination, data).then((response) => response.text());

            window.opener.postMessage({ url: `https://${username}.neocities.org/${destination}` }, "*");
            form.submit();
        } catch (error) {
            window.opener.postMessage({ error }, "*");
        }
    });

    window.addEventListener("message", (event) => {
        const { name, html } = event.data;
        const filename = name.replace(/[^a-z0-9]/gi, '_');

        data = new Blob([html], { type: "text/html" });
        destinationInput.value = `${filename}.html`;
    });   
    window.opener.postMessage("ready", "*");
}
