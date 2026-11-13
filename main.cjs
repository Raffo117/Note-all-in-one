"use strict";

const { app, BrowserWindow, Menu, nativeImage, protocol, session } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const APP_SCHEME = "noteallinone";
const APP_ORIGIN = `${APP_SCHEME}://app`;
const APP_URL = `${APP_ORIGIN}/index.html`;
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "script-src-attr 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'none'",
  "media-src 'none'",
  "object-src 'none'",
  "frame-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'"
].join("; ");

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      allowServiceWorkers: false
    }
  }
]);

const profileRoot = app.commandLine.getSwitchValue("user-data-dir") || app.getPath("appData");
app.setPath("userData", path.join(profileRoot, "Note-all-in-one"));

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  const appFiles = new Map([
    ["/index.html", ["index.html", "text/html; charset=utf-8"]],
    ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
    ["/vendor/mermaid.min.js", ["vendor/mermaid.min.js", "text/javascript; charset=utf-8"]]
  ]);

  function isAllowedAppUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === `${APP_SCHEME}:`
        && url.hostname === "app"
        && appFiles.has(url.pathname);
    } catch {
      return false;
    }
  }

  async function registerAppProtocol(targetSession) {
    const root = app.getAppPath();
    targetSession.protocol.handle(APP_SCHEME, async (request) => {
      const url = new URL(request.url);
      const entry = url.hostname === "app" ? appFiles.get(url.pathname) : undefined;
      if (!entry || request.method !== "GET") {
        return new Response("Not found", { status: 404 });
      }

      const body = await fs.readFile(path.join(root, entry[0]));
      return new Response(body, {
        headers: {
          "Content-Type": entry[1],
          "Content-Security-Policy": CSP,
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "no-referrer",
          "Cache-Control": "no-store"
        }
      });
    });
  }

  function lockDownSession(targetSession) {
    targetSession.webRequest.onBeforeRequest({ urls: ["<all_urls>"] }, (details, callback) => {
      const allowed = isAllowedAppUrl(details.url)
        || details.url.startsWith("data:")
        || details.url.startsWith("blob:");
      callback({ cancel: !allowed });
    });
    targetSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    targetSession.setPermissionCheckHandler(() => false);
  }

  function createWindow() {
    const iconPath = app.isPackaged
      ? path.join(process.resourcesPath, "build-resources", "note-all-in-one.png")
      : path.join(app.getAppPath(), "build-resources", "note-all-in-one.png");
    const icon = nativeImage.createFromPath(iconPath);
    const win = new BrowserWindow({
      width: 1360,
      height: 900,
      minWidth: 820,
      minHeight: 600,
      show: false,
      icon,
      autoHideMenuBar: true,
      webPreferences: {
        partition: "persist:note-all-in-one",
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false,
        contextIsolation: true,
        sandbox: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        webviewTag: false,
        plugins: false,
        navigateOnDragDrop: false,
        devTools: !app.isPackaged
      }
    });

    win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    win.webContents.on("will-navigate", (event, url) => {
      if (!isAllowedAppUrl(url)) event.preventDefault();
    });
    win.webContents.on("will-redirect", (event, url) => {
      if (!isAllowedAppUrl(url)) event.preventDefault();
    });
    win.webContents.on("will-attach-webview", (event) => event.preventDefault());
    win.once("ready-to-show", () => win.show());
    win.loadURL(APP_URL);
  }

  app.on("second-instance", () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(async () => {
    Menu.setApplicationMenu(null);
    const appSession = session.fromPartition("persist:note-all-in-one");
    lockDownSession(appSession);
    await registerAppProtocol(appSession);
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  }).catch((error) => {
    console.error("Note-all-in-one could not start securely:", error);
    app.quit();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}
