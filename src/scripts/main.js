
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
    const usernameInput = /** @type {HTMLInputElement} */ (document.getElementById("username"));
    const passwordInput = /** @type {HTMLInputElement} */ (document.getElementById("password"));
    const destinationInput = /** @type {HTMLInputElement} */ (document.getElementById("destination"));
    const uploadButton = /** @type {HTMLInputElement} */ (document.getElementById("upload"));

    const form = document.querySelector("form");

    let origin = undefined;
    let data = undefined;

    uploadButton.addEventListener("click", async (event) => {
        try {
            uploadButton.disabled = true;
            const username = usernameInput.value;
            const password = passwordInput.value;
            const destination = destinationInput.value;

            // get site info and upload file
            const querying = fetch("https://neocities-cors.glitch.me/api/info?sitename=" + username).then((response) => response.json());
            const uploading = upload(username, password, destination, data).then((response) => response.text())
            const [info, result] = await Promise.all([querying, uploading]);

            // tell the caller the final upload url
            const url = `https://${info.info.domain}/${destination}`;
            window.opener.postMessage({ url }, origin);
            
            // submit the form so the browser offers to remember the password
            form.submit();
        } catch (error) {
            // the the caller an error occurred
            window.opener.postMessage({ error }, origin);
        }
    });

    window.addEventListener("message", (event) => {
        const { name, html } = event.data;
        const filename = name.replace(/[^a-z0-9]/gi, '_');

        origin = event.origin;
        data = new Blob([html], { type: "text/html" });
        destinationInput.value = `${filename}.html`;
    });   
    window.opener.postMessage("ready", "*");
}
