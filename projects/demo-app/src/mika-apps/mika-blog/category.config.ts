import { Validators } from "@angular/forms";
import { MikaEntityConfig } from "@mikaverse/core";

export const categoryConfig: MikaEntityConfig = {
    contentType: 'categories',
    endpoints: {
        base: 'categories'
    },
    singular: 'category',
    localizable: false, // Categories in this demo are simple strings
    actions: {
        items: {
            edit: true,
            delete: true,
            create: true,
            search: true
        }
    },
    sidebarConfig: {
        sidebarGroup: 'Content',
        order: 1,
        icon: 'folder-open'
    },
    table: {
        sortable: true,
        columns: [
            {
                key: 'id',
                label: 'ID',
                sortable: true,
            },
            {
                key: 'name',
                label: 'Name',
                sortable: true,
            }
        ],
    },
    form: {
        fields: [
            {
                key: 'name',
                label: 'Category Name',
                group: 'General',
                type: 'text',
                validators: [Validators.required]
            },
            {
                key: 'id',
                label: 'Slug (ID)',
                group: 'General',
                type: 'text',
                validators: [Validators.required, Validators.pattern('[a-z0-9-]+')],
            }
        ]
    }
}
