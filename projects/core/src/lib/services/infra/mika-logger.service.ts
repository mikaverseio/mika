import { Injectable, inject } from '@angular/core';
import { MikaContextService } from '../engine/mika-context.service'; // To check debug flag

/**
 * Service facade for logging activity within the Mika Engine.
 * Allows centralized control and filtering of console output based on config.
 */
@Injectable({ providedIn: 'root' })
export class MikaLoggerService {

    private debugMode = false; // Default safe state

    constructor() {
        // Use a computed property or effect to update debugMode based on context.
        // For simplicity now, you can keep it simple:
        // this.debugMode = this.context.getSetting('debugMode', false);
    }

	setDebugMode(debugFlag: boolean) {
		this.debugMode = debugFlag;
	}

    private checkDebug(): boolean {
        return this.debugMode;
    }

    log(source: string, message: any, ...optionalParams: any[]): void {
        if (this.checkDebug()) {
            console.log(`[${source}] ${message}`, ...optionalParams);
        }
    }

    info(source: string, message: any, ...optionalParams: any[]): void {
        if (this.checkDebug()) {
            console.info(`[Mika][${source}] ${message}`, ...optionalParams);
        }
    }

    warn(source: string, message: any, ...optionalParams: any[]): void {
        if (this.checkDebug()) {
            console.warn(`[${source}] ${message}`, ...optionalParams);
        }
    }

    error(source: string, message: any, ...optionalParams: any[]): void {
        if (this.checkDebug()) {
            console.error(`[${source}] ${message}`, ...optionalParams);
        }
    }
}
