// ==UserScript==
// @name         Access Token Fetcher
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Fetch and display access token from a specific URL
// @match        *://new.oaifree.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and display the floating panel
    function createFloatingPanel(token) {
        GM_log("Creating floating panel with token: " + token);
        const panel = document.createElement('div');
        panel.id = 'floating-panel';
        panel.innerHTML = `
            <div style="background-color: white; padding: 10px; border: 1px solid black; position: fixed; top: 10px; right: 10px; z-index: 10000; max-width: 300px;">
                <p>Access Token:</p>
                <textarea id="access-token" rows="4" cols="50" style="width: 100%;">${token}</textarea>
                <br/>
                <button id="copy-button" style="margin-right: 10px;">Copy</button>
                <button id="cancel-button">Cancel</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('copy-button').addEventListener('click', () => {
            const textarea = document.getElementById('access-token');
            textarea.select();
            document.execCommand('copy');
            alert('Token copied to clipboard');
        });

        document.getElementById('cancel-button').addEventListener('click', () => {
            document.body.removeChild(panel);
        });
    }

    // Function to fetch the access token
    function fetchAccessToken() {
        GM_log("Fetching access token...");
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://chatgpt.com/api/auth/session',
            onload: function(response) {
                GM_log("Response received: " + response.status);
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    GM_log("Parsed data: " + JSON.stringify(data));
                    const accessToken = data.accessToken;
                    if (accessToken) {
                        GM_log("Access token found: " + accessToken);
                        if (document.body.innerText.includes('Pandora')) {
                            GM_log("'pandora' found in page text");
                            createFloatingPanel(accessToken);
                        } else {
                            GM_log("'pandora' not found in page text");
                        }
                    } else {
                        GM_log("Access token not found in response");
                    }
                } else {
                    GM_log("Failed to fetch the access token, status code: " + response.status);
                }
            },
            onerror: function(err) {
                GM_log("Request error: " + err);
            }
        });
    }

    // Inject CSS for the floating panel
    GM_addStyle(`
        #floating-panel {
            font-family: Arial, sans-serif;
        }
        #access-token {
            width: 100%;
            box-sizing: border-box;
        }
    `);

    // Start the script
    fetchAccessToken();
})();
