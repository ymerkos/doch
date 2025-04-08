//B"H

import {marked} from "/static/js/marked.esm.js";
function markdownToHTML(md) {
	return marked.parse(md);
}
    
    export default markdownToHTML;