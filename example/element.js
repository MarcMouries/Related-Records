import '../src/x-snc-related-records';
//import {TASK_LIST} from '../src/x-snc-related-records/sample_data';


const el = document.createElement('DIV');
document.body.appendChild(el);


/*
task 0586453e1bb39114ce2b6579b04bcb63
caller_id
category
service_offering
*/

el.innerHTML = `
<x-snc-related-records
   table="incident"
   id="0586453e1bb39114ce2b6579b04bcb63"
   fields="category,opened_by,service_offering"
   displayFields="short_description,category,opened_by,service_offering">
</x-snc-related-records>`;