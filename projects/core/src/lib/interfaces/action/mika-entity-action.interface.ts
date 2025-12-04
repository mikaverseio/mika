import { MikaExecutableAction } from "../../types/mika-app.type";
import { MikaBaseAction } from "./mika-base-action.interface";

/**
 * Configuration for entity actions.  These actions are typically displayed
 * as buttons or links in the entity's table or form views.
 */
export interface MikaEntityActionMap {
    /**
     * Enable/disable the default edit action.
     */
    edit?: boolean | MikaBaseAction;
    /**
     * Enable/disable the default delete action.
     */
    delete?: boolean;
    /**
      * Enable/disable the default create action.
      */
    create?: boolean;
    /**
     * Enable/disable the default view action.
     */
    view?: boolean;
    /**
     * Enable/disable the default search action.
     */
    search?: boolean;
     /**
     * Enable/disable the default print action.
     */
    print?: boolean;
    /**
     * Enable/disable the default export action.
     */
    export?: boolean;
    /**
     * Enable/disable the default export PDF action.
     */
    exportPdf?: boolean;
    /**
     * Enable/disable the default export Excel action.
     */
    exportExcel?: boolean;
    /**
     * An array of custom actions to display.  Each action is defined using
     * the `MikaEntityCustomAction` interface.  These actions can perform
     * any custom logic.
     */
    custom?: Array<MikaExecutableAction>;

    /**
     * An array of custom actions to display under a 'More' dropdown.
     * Each action is defined using the `MikaEntityCustomAction` interface.
     */
    more?: Array<MikaExecutableAction>;
}
