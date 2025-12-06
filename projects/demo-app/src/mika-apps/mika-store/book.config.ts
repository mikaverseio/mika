import { Validators } from "@angular/forms";
import { MikaEntityConfig } from "@mikaverse/core";

export const bookConfig: MikaEntityConfig = {
    contentType: 'books',
    endpoints: {
        base: 'books'
    },
    singular: 'book',
    actions: {
        items: {
            edit: true,
            delete: true,
            create: true,
            search: true
        }
    },
    sidebarConfig: {
        sidebarGroup: 'Inventory',
        order: 1,
        icon: 'book'
    },
    table: {
        sortable: true,
        filters: [
            {
                key: 'category',
                label: 'Category',
                type: 'select',
                options: [
                    { label: 'Technology', value: 'tech' },
                    { label: 'Fiction', value: 'fiction' },
                    { label: 'Science', value: 'science' }
                ]
            }
        ],
        columns: [
            {
                key: 'cover',
                label: 'Cover',
                renderType: 'image',
                sortable: false
            },
            {
                key: 'title',
                label: 'Title',
                sortable: true
            },
            {
                key: 'author',
                label: 'Author',
                sortable: true
            },
            {
                key: 'price',
                label: 'Price',
                renderType: 'text', // Assuming your engine supports this, or use number
                sortable: true
            },
            {
                key: 'stock',
                label: 'Stock',
                renderType: 'text',
                sortable: true
            },
            {
                key: 'category',
                label: 'Category',
                renderType: 'chip'
            }
        ]
    },
    form: {
        fields: [
            // --- Details ---
            {
                key: 'title',
                label: 'Book Title',
                group: 'Details',
                type: 'text',
                validators: [Validators.required]
            },
            {
                key: 'author',
                label: 'Author',
                group: 'Details',
                type: 'text',
                validators: [Validators.required]
            },
            {
                key: 'category',
                label: 'Category',
                group: 'Details',
                type: 'select',
                validators: [Validators.required],
                options: [
                    { label: 'Technology', value: 'tech' },
                    { label: 'Fiction', value: 'fiction' },
                    { label: 'Science', value: 'science' }
                ]
            },

            // --- Pricing ---
            {
                key: 'price',
                label: 'Price ($)',
                group: 'Pricing',
                type: 'number',
                validators: [Validators.required, Validators.min(0)]
            },
            {
                key: 'stock',
                label: 'Stock Count',
                group: 'Pricing',
                type: 'number',
                defaultValue: 0,
                validators: [Validators.required, Validators.min(0)]
            },

            // --- Media ---
            {
                key: 'cover',
                label: 'Cover Image URL',
                group: 'Media',
                type: 'text', // v2: type: 'file'
                validators: [Validators.required]
            }
        ]
    }
}
