/**
 * Configuration object for the EmulatorJS instance.
 * @typedef {Object} EmulatorJSConfig
 * @property {string} gameUrl - The URL of the game.
 * @property {string} dataPath - The path to the data folder.
 * @property {string} system - The system of the game.
 * @property {string} biosUrl - The URL of the BIOS file.
 * @property {string} gameName - The name of the game.
 * @property {string} color - The color of the emulator.
 * @property {string} adUrl - The URL of the ad.
 * @property {string} adMode - The mode of the ad.
 * @property {number} adTimer - The timer of the ad.
 * @property {number} adSize - The size of the ad.
 * @property {boolean} alignStartButton - Whether to align the start button.
 * @property {Object} VirtualGamepadSettings - The settings for the virtual gamepad.
 * @property {Object} buttonOpts - The options for the buttons.
 * @property {number} volume - The volume of the emulator.
 * @property {Object} defaultControllers - The default controllers.
 * @property {boolean} startOnLoad - Whether to start the game on load.
 * @property {boolean} fullscreenOnLoad - Whether to go fullscreen on load.
 * @property {Object} filePaths - The file paths.
 * @property {string} loadState - The URL of the load state.
 * @property {number} cacheLimit - The cache limit.
 * @property {Object} cheats - The cheats.
 * @property {Object} defaultOptions - The default options.
 * @property {string} gamePatchUrl - The URL of the game patch.
 * @property {string} gameParentUrl - The URL of the game parent.
 * @property {string} netplayUrl - The URL of the netplay server.
 * @property {string} gameId - The ID of the game.
 * @property {string} backgroundImg - The URL of the background image.
 * @property {number} backgroundBlur - The blur of the background.
 * @property {string} backgroundColor - The color of the background.
 * @property {string} controlScheme - The control scheme.
 * @property {number} threads - The number of threads.
 * @property {boolean} disableCue - Whether to disable the cue.
 * @property {string} startBtnName - The name of the start button.
 * @property {boolean} softLoad - Whether to soft load.
 * @property {boolean} screenRecording - Whether to record the screen.
 * @property {Object} externalFiles - The external files.
 * @property {boolean} disableDatabases - Whether to disable the databases.
 * @property {boolean} disableLocalStorage - Whether to disable the local storage.
 * @property {string} language - The language of the emulator.
 * @property {Object} langJson - The JSON of the language.
 */

/**
 * Self-invoking function that loads scripts and styles, handles missing files, and initializes the EmulatorJS instance.
 */
(async function() {
    /**
     * Returns the folder path from a given path.
     * @param {string} path - The full path.
     * @returns {string} The folder path.
     */
    const folderPath = (path) => path.substring(0, path.length - path.split('/').pop().length);
    
    /**
     * The path to the script.
     * @type {string}
     */
    let scriptPath = (typeof window.EJS_pathtodata === "string") ? window.EJS_pathtodata : folderPath((new URL(document.currentScript.src)).pathname);
    if (!scriptPath.endsWith('/')) scriptPath+='/';
    
    /**
     * Loads a JavaScript file.
     * @param {string} file - The name of the file to load.
     * @returns {Promise} A promise that resolves when the script is loaded.
     */
    function loadScript(file) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script');
            script.src = function() {
                if ('undefined' != typeof EJS_paths && typeof EJS_paths[file] === 'string') {
                    return EJS_paths[file];
                } else {
                    return scriptPath+file;
                }
            }();
            script.onload = resolve;
            script.onerror = () => {
                filesmissing(file).then(e => resolve());
            }
            document.head.appendChild(script);
        })
    }

    /**
     * Loads a CSS file.
     * @param {string} file - The name of the file to load.
     * @returns {Promise} A promise that resolves when the style is loaded.
     */
    function loadStyle(file) {
        return new Promise(function(resolve, reject) {
            let css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = function() {
                if ('undefined' != typeof EJS_paths && typeof EJS_paths[file] === 'string') {
                    return EJS_paths[file];
                } else {
                    return scriptPath+file;
                }
            }();
            css.onload = resolve;
            css.onerror = () => {
                filesmissing(file).then(e => resolve());
            }
            document.head.appendChild(css);
        })
    }

    /**
     * Handles missing files and attempts to load non-minified versions if applicable.
     * @param {string} file - The name of the missing file.
     */
    async function filesmissing(file) {
        console.error("Failed to load " + file);
        let minifiedFailed = file.includes(".min.") && !file.includes("socket");
        console[minifiedFailed?"warn":"error"]("Failed to load " + file + " beacuse it's likly that the minified files are missing.\nTo fix this you have 3 options:\n1. You can download the zip from the latest release here: https://github.com/EmulatorJS/EmulatorJS/releases/latest - Stable\n2. You can download the zip from here: https://cdn.emulatorjs.org/latest/data/emulator.min.zip and extract it to the data/ folder. (easiest option) - Beta\n3. You can build the files by running `npm i && npm run build` in the data/minify folder. (hardest option) - Beta\nNote: you will probably need to do the same for the cores, extract them to the data/cores/ folder.");
        if (minifiedFailed) {
            console.log("Attempting to load non-minified files");
            if (file === "emulator.min.js") {
                await loadScript('emulator.js');
                await loadScript('nipplejs.js');
                await loadScript('shaders.js');
                await loadScript('storage.js');
                await loadScript('gamepad.js');
                await loadScript('GameManager.js');
                await loadScript('socket.io.min.js');
            } else {
                await loadStyle('emulator.css');
            }
        }
    }
    
    if (('undefined' != typeof EJS_DEBUG_XX && true === EJS_DEBUG_XX)) {
        await loadScript('emulator.js');
        await loadScript('nipplejs.js');
        await loadScript('shaders.js');
        await loadScript('storage.js');
        await loadScript('gamepad.js');
        await loadScript('GameManager.js');
        await loadScript('socket.io.min.js');
        await loadStyle('emulator.css');
    } else {
        await loadScript('emulator.min.js');
        await loadStyle('emulator.min.css');
    }

    /**
     * Configuration object for the EmulatorJS instance.
     * @type {EmulatorJSConfig}
     * 
     */
    const config = {};
    config.gameUrl = window.EJS_gameUrl;
    config.dataPath = scriptPath;
    config.system = window.EJS_core;
    config.biosUrl = window.EJS_biosUrl;
    config.gameName = window.EJS_gameName;
    config.color = window.EJS_color;
    config.adUrl = window.EJS_AdUrl;
    config.adMode = window.EJS_AdMode;
    config.adTimer = window.EJS_AdTimer;
    config.adSize = window.EJS_AdSize;
    config.alignStartButton = window.EJS_alignStartButton;
    config.VirtualGamepadSettings = window.EJS_VirtualGamepadSettings;
    config.buttonOpts = window.EJS_Buttons;
    config.volume = window.EJS_volume;
    config.defaultControllers = window.EJS_defaultControls;
    config.startOnLoad = window.EJS_startOnLoaded;
    config.fullscreenOnLoad = window.EJS_fullscreenOnLoaded;
    config.filePaths = window.EJS_paths;
    config.loadState = window.EJS_loadStateURL;
    config.cacheLimit = window.EJS_CacheLimit;
    config.cheats = window.EJS_cheats;
    config.defaultOptions = window.EJS_defaultOptions;
    config.gamePatchUrl = window.EJS_gamePatchUrl;
    config.gameParentUrl = window.EJS_gameParentUrl;
    config.netplayUrl = window.EJS_netplayServer;
    config.gameId = window.EJS_gameID;
    config.backgroundImg = window.EJS_backgroundImage;
    config.backgroundBlur = window.EJS_backgroundBlur;
    config.backgroundColor = window.EJS_backgroundColor;
    config.controlScheme = window.EJS_controlScheme;
    config.threads = window.EJS_threads;
    config.disableCue = window.EJS_disableCue;
    config.startBtnName = window.EJS_startButtonName;
    config.softLoad = window.EJS_softLoad;
    config.screenRecording = window.EJS_screenRecording;
    config.externalFiles = window.EJS_externalFiles;
    config.disableDatabases = window.EJS_disableDatabases;
    config.disableLocalStorage = window.EJS_disableLocalStorage;
    
    /**
     * Initializes the EmulatorJS instance and sets up event handlers.
     */
    if (typeof window.EJS_language === "string" && window.EJS_language !== "en-US") {
        try {
            let path;
            if ('undefined' != typeof EJS_paths && typeof EJS_paths[window.EJS_language] === 'string') {
                path = EJS_paths[window.EJS_language];
            } else {
                path = scriptPath+"localization/"+window.EJS_language+".json";
            }
            config.language = window.EJS_language;
            config.langJson = JSON.parse(await (await fetch(path)).text());
        } catch(e) {
            config.langJson = {};
        }
    }
    
    /**
     * @type {EmulatorJS} The EmulatorJS instance.
     */
    window.EJS_emulator = new EmulatorJS(window.EJS_player, config);
    
    /**
     * Handles ad blocking.
     * @param {string} url - The URL of the ad.
     * @param {boolean} del - Whether to delete the ad.
     */
    window.EJS_adBlocked = (url, del) => window.EJS_emulator.adBlocked(url, del);
    if (typeof window.EJS_ready === "function") {
        window.EJS_emulator.on("ready", window.EJS_ready);
    }
    if (typeof window.EJS_onGameStart === "function") {
        window.EJS_emulator.on("start", window.EJS_onGameStart);
    }
    if (typeof window.EJS_onLoadState === "function") {
        window.EJS_emulator.on("loadState", window.EJS_onLoadState);
    }
    if (typeof window.EJS_onSaveState === "function") {
        window.EJS_emulator.on("saveState", window.EJS_onSaveState);
    }
    if (typeof window.EJS_onLoadSave === "function") {
        window.EJS_emulator.on("loadSave", window.EJS_onLoadSave);
    }
    if (typeof window.EJS_onSaveSave === "function") {
        window.EJS_emulator.on("saveSave", window.EJS_onSaveSave);
    }
})();
