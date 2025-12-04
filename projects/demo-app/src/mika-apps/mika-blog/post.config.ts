import { Validators } from "@angular/forms";
import { MikaEntityConfig } from "@mikaverse/core";

export const postConfig: MikaEntityConfig = {
    contentType: 'posts',
    endpoints: {
        base: 'posts'
    },
    singular: 'post',
    localizable: true,
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
        order: 2,
        icon: 'newspaper'
    },
    table: {
        sortable: true,
        filters: [
            {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                    { label: 'Published', value: 'published' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' }
                ]
            },
            {
                key: 'category',
                label: 'Category',
                type: 'select',
                optionsSource: 'categories', // Links to the category config
                localizeKey: 'name'
            }
        ],
        columns: [
            {
                key: 'coverImage',
                label: 'Cover',
                sortable: false,
                renderType: 'image', // SHOWCASE: Image rendering
            },
            {
                key: 'title',
                label: 'Title',
                sortable: true,
                localizable: true,
            },
            {
                key: 'category',
                label: 'Category',
                sortable: true,
                renderType: 'chip', // Optional: Render category as a small chip
            },
            {
                key: 'views',
                label: 'Views',
                sortable: true,
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                renderType: 'chip', // SHOWCASE: Color mapping
            },
            {
                key: 'publishedAt',
                label: 'Published',
                sortable: true,
                renderType: 'date',
                format: 'mediumDate'
            }
        ],
    },
    form: {
        fields: [
            // --- General Group ---
            {
                key: 'title',
                label: 'Post Title',
                group: 'General',
                type: 'text',
                localizable: true,
                validators: [Validators.required]
            },
            {
                key: 'status',
                label: 'Status',
                group: 'General',
                type: 'select',
                defaultValue: 'draft',
                options: [
                    { label: 'Published', value: 'published' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' }
                ],
                validators: [Validators.required]
            },

            // --- Media Group ---
            {
                key: 'coverImage',
                label: 'Cover Image URL',
                group: 'Media',
                type: 'text', // In v2 this would be type: 'file'
                validators: [Validators.required],
            },

            // --- Meta Group ---
            {
                key: 'category',
                label: 'Category',
                group: 'Meta',
                type: 'select',
                validators: [Validators.required],
                optionsSource: 'categories', // Relational lookup
            },
            {
                key: 'publishedAt',
                label: 'Publish Date',
                group: 'Meta',
                type: 'date',
                validators: [Validators.required]
            },
            {
                key: 'views',
                label: 'View Count',
                group: 'Meta',
                type: 'number',
                defaultValue: 0
            }
        ]
    }
}
