# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension (Manifest V3) that copies URLs of selected browser tabs to the clipboard in Markdown format. When the extension icon is clicked, it generates a Markdown list of all highlighted tabs in the current window.

**Extension Name:** Copy URLs to Markdown
**Manifest Version:** 3

## Architecture

### Core Components

1. **background.js** - Service worker (background script)
   - Main entry point: `chrome.action.onClicked` listener
   - Queries highlighted tabs using `chrome.tabs.query()`
   - Generates Markdown formatted list: `- [title](url)`
   - Handles clipboard operations via injected scripts
   - Shows temporary badge notification ("✓") for 1.5 seconds after copying

2. **content.js** - Content script (not currently used in manifest)
   - Contains UI notification code for displaying success messages
   - Note: This file exists but is not registered in manifest.json

3. **manifest.json** - Extension configuration
   - Permissions: `tabs`, `clipboardWrite`, `scripting`, `activeTab`
   - Service worker: background.js
   - No browser action popup - uses click handler instead

### Key Implementation Details

**Clipboard Access Pattern:**
Since Manifest V3 service workers cannot directly access `navigator.clipboard`, the extension uses `chrome.scripting.executeScript()` to inject the `copyTextToClipboard` function into the active tab, which then performs the actual clipboard write.

**Markdown Escaping:**
The `escapeMarkdown()` function in background.js:18 escapes special Markdown characters (`[]()>*#+\-_.!`) to prevent formatting issues in titles.

**Tab Selection:**
Uses `chrome.tabs.query({ highlighted: true, currentWindow: true })` to get all selected/highlighted tabs, not just the active tab.

## Development Commands

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `/Users/ginga/repos/chrome-ext-clip-tabs-md` directory

### Testing

Manually test by:
1. Selecting multiple tabs (Cmd+Click on macOS, Ctrl+Click on Windows)
2. Clicking the extension icon
3. Pasting clipboard content to verify Markdown format

### Modifying Icons

Icons are located in the `icons/` directory:
- Source SVG: `icon-svg.svg`
- Required sizes: 16x16, 48x48, 128x128 PNG files

After modifying icons, reload the extension in `chrome://extensions/`.

## Code Notes

**Language:** The codebase contains Japanese comments and descriptions.

**Potential Issues:**
- content.js is not registered in manifest.json, so its notification UI code is unused
- The clipboard injection targets only the active tab, which may fail if the active tab has restricted permissions (e.g., chrome:// pages)
