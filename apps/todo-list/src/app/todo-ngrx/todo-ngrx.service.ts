import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

@Injectable({
    providedIn: 'root'
})
export class TodoNgrxService {
    private store = inject(Store);


}
