# Mika

**One Config To Rule Them All.**
The open-source engine that turns TypeScript configs into native mobile apps and admin panels.

[Website](https://mikaverse.io) · [Issues](https://github.com/mikaverseio/mika/issues) · [Contributing](#contributing)

![npm version](https://img.shields.io/npm/v/@mikaverse/core.svg?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![status](https://img.shields.io/badge/status-alpha-orange.svg?style=flat-square)
![Angular](https://img.shields.io/badge/Angular-Standalone-red?style=flat-square&logo=angular)

---

> [!WARNING]
> **Status: Pre-Alpha / Active Development**
> Mika is currently in heavy development. APIs are subject to breaking changes. Do not use in production yet.

---

## What is Mika?

Mika is not just a UI library. It is a **headless app engine** built on **Angular Standalone** and **Capacitor**.

Instead of writing repetitive component code (HTML templates, CSS, API services), you define your application logic in strict **TypeScript configurations**. The engine handles the rendering, state management, validation, and platform compilation (Mobile/Web) automatically.

**Why use Mika?**
* **📱 Native First:** Compiles to real iOS/Android binaries with offline sync support.
* **🧠 AI Ready:** The schema-driven architecture is optimized for AI generation.
* **⚡ Zero Boilerplate:** Stop building "Edit" modals and Data Grids by hand.
* **🏢 Enterprise Grade:** Native support for Multi-tenancy, RBAC, and i18n.

## Installation

```bash
npm install @mikaverse/core
```

## Quick Start

Mika abstracts the UI layer. You simply define a MikaEntityConfig object, and the engine generates the List View, Form View, and Navigation.

```ts
import { MikaEntityConfig } from '@mikaverse/core';
import { Validators } from '@angular/forms';

export const SlideConfig: MikaEntityConfig = {
  contentType: 'sliders',
  endpoints: { base: 'sliders' },
  
  // 1. Define the Data Grid
  table: {
    sortable: true,
    columns: [
      { key: 'title', label: 'Title', sortable: true },
      { key: 'active', label: 'Status', renderType: 'chip' },
      { key: 'image', label: 'Preview', renderType: 'image' }
    ]
  },

  // 2. Define the Form
  form: {
    groups: ['General', 'Media'],
    fields: [
      {
        key: 'title',
        label: 'Slide Title',
        group: 'General',
        type: 'text',
        validators: [Validators.required]
      },
      {
        key: 'image',
        label: 'Slide Image',
        group: 'Media',
        type: 'file', // Handles upload logic automatically
        validators: [Validators.required]
      }
    ]
  }
};
```
## Local Development
To run the repository locally with the demo app:

1. Clone the repo:
```bash
git clone https://github.com/mikaverse/mika.git
cd mika
```
2. Install dependencies:
```bash 
npm install
```
3. Run the Mock API (JSON Server):
```bash
npm run api
```
4. Run the Demo App:
```bash
ng serve demo-app
```
Navigate to `http://localhost:4200`.

## Contributing
We welcome contributions! Please see our CONTRIBUTING.md for details on how to submit pull requests, report issues, and request features.

## License
Mika is open-source software licensed under the MIT license.
---
Built with ❤️ by the MikaVerse Team.
