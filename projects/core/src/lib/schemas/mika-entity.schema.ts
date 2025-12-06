import { Validators } from "@angular/forms";

// This file defines the JSON Schema that guides the AI model.
// It is derived from the MikaEntityConfig TypeScript interface.

export const MikaEntitySchema = {
    type: "OBJECT",
    properties: {
        contentType: { "type": "STRING", "description": "The singular name of the data entity (e.g., 'products')." },
        endpoints: {
            "type": "OBJECT",
            "properties": {
                "base": { "type": "STRING", "description": "The base API path (e.g., 'api/products')." }
            },
            "required": ["base"]
        },
        table: {
            "type": "OBJECT",
            "properties": {
                "columns": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "key": { "type": "STRING" },
                            "label": { "type": "STRING" },
                            "renderType": { "type": "STRING", "enum": ["text", "number", "date", "chip", "image", "currency"] }
                        },
                        "required": ["key", "label"]
                    }
                }
            },
            "required": ["columns"]
        },
        form: {
            "type": "OBJECT",
            "properties": {
                "fields": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "key": { "type": "STRING" },
                            "label": { "type": "STRING" },
                            "type": { "type": "STRING", "enum": ["text", "number", "select", "date", "textarea", "file", "checkbox"] },
                            "validators": { "type": "ARRAY", "description": "Use Validators.required for non-empty fields." }
                        },
                        "required": ["key", "label", "type"]
                    }
                }
            }
        }
    },
    "required": ["contentType", "endpoints", "table", "form"]
};
