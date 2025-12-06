import { Validators } from "@angular/forms";
import { MikaEntityConfig } from "@mikaverse/core";

export const orderConfig: MikaEntityConfig = {
    contentType: 'orders',
    endpoints: {
        base: 'orders'
    },
    singular: 'order',
    actions: {
        items: {
            edit: true,   // Allow editing status
            delete: true,
            create: false, // Orders usually created by customers, not admins
            search: true
        }
    },
    sidebarConfig: {
        sidebarGroup: 'Sales',
        order: 2,
        icon: 'apps'
    },
    table: {
        sortable: true,
        filters: [
            {
                key: 'status',
                label: 'Status',
                type: 'select',
                options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Shipped', value: 'shipped' },
                    { label: 'Delivered', value: 'delivered' },
                    { label: 'Cancelled', value: 'cancelled' }
                ]
            }
        ],
        columns: [
            {
                key: 'id',
                label: 'Order ID',
                sortable: true
            },
            {
                key: 'customer',
                label: 'Customer',
                sortable: true
            },
            {
                key: 'date',
                label: 'Date',
                sortable: true,
                renderType: 'date',
                format: 'shortDate'
            },
            {
                key: 'total',
                label: 'Total',
                sortable: true,
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                renderType: 'chip',
            }
        ]
    },
    form: {
        fields: [
            // --- Info (Read Only) ---
            {
                key: 'id',
                label: 'Order ID',
                group: 'Order Info',
                type: 'text',
            },
            {
                key: 'customer',
                label: 'Customer Name',
                group: 'Order Info',
                type: 'text',
            },
            {
                key: 'total',
                label: 'Total Amount',
                group: 'Order Info',
                type: 'number',
            },
            {
                key: 'date',
                label: 'Order Date',
                group: 'Order Info',
                type: 'date',
            },

            // --- Management (Editable) ---
            {
                key: 'status',
                label: 'Order Status',
                group: 'Management',
                type: 'select',
                validators: [Validators.required],
                options: [
                    { label: 'Pending', value: 'pending' },
                    { label: 'Processing', value: 'processing' },
                    { label: 'Shipped', value: 'shipped' },
                    { label: 'Delivered', value: 'delivered' },
                    { label: 'Cancelled', value: 'cancelled' }
                ]
            }
        ]
    }
}
