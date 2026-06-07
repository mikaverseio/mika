# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0-alpha.1] - Unreleased

### Added
- `@mikaverse/core` — headless engine with config-driven CRUD, multi-tenant support, i18n, auth, hooks, permissions
- `@mikaverse/ui-material` — Angular Material implementation with table, form, all CRUD pages
- Demo app (`apps/demo-material`) with blog and store entity configs
- Mock API servers for local development
- Nx monorepo structure with module boundary enforcement

### Architecture
- Zero-UI-dependency core engine
- `MikaUiPort` DI token for UI-agnostic confirm/toast/loading
- Signal-based reactive state throughout
- `noAuth` bypass mode for demo/prototyping

## [0.0.1-alpha.1] - 2024-12-01

Initial library extraction from production codebase. Published as `@mikaverse/core` via standard Angular workspace (now superseded by this Nx monorepo).
