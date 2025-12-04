import { FormGroup } from "@angular/forms";
import { MikaFilterConfig } from "../field/mika-filter-config.interface";
import { MikaResponseConfig } from "./mika-response-config.interface";
import { MikaHookRegistry } from "../hooks/mika-hook-registry.interface";

export interface MikaGlobalEntityConfig extends MikaHookRegistry  {
	/**
	* Configuration for filtering the entity list.  Each `FilterConfig`
	* defines a filter field and its options.  These are global filters
	*/
   filters?: Array<MikaFilterConfig>;

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
   responseConfig?: MikaResponseConfig;

   /**
	* Enables caching of API requests for this entity.
	*/
   cacheRequests?: boolean;
}
