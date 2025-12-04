import { FormGroup } from "@angular/forms";
import { FilterConfig } from "../field/filter-config.interface";
import { ResponseProps } from "./entity-table-response.interface";
import { HookRegistry } from "../hooks/hook-registry.interface";

export interface GlobalEntityConfig extends HookRegistry  {
	/**
	* Configuration for filtering the entity list.  Each `FilterConfig`
	* defines a filter field and its options.  These are global filters
	*/
   filters?: Array<FilterConfig>;

   /**
	* Determines when filters are applied.
	* 'onChange': Apply filters whenever a filter value changes.
	* 'onSubmit': Apply filters only when a submit button is clicked.
	* null: No specific filter submit mode.
	*/
   filterSubmitMode?: 'onChange' | 'onSubmit' | null;

   /**
	 * Configuration for how properties are nested in the response
	 */
   responseProps?: ResponseProps;

   /**
	* Enables caching of API requests for this entity.
	*/
   cacheRequests?: boolean;
}
