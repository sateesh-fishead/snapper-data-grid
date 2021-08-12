# GridExportCsvOptions Interface

<p class="description">The options to apply on the CSV export.</p>

## Import

```js
import { GridExportCsvOptions } from '@material-ui/x-grid';
// or
import { GridExportCsvOptions } from '@material-ui/data-grid';
```

## Properties

| Name                                                                                          | Type                                    | Default                                                  | Description                                                                                                                                      |
| :-------------------------------------------------------------------------------------------- | :-------------------------------------- | :------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| <span class="prop-name optional">allColumns<sup><abbr title="optional">?</abbr></sup></span>  | <span class="prop-type">boolean</span>  | <span class="prop-default">false<br /></span>            | If `true`, the hidden columns will also be exported.                                                                                             |
| <span class="prop-name optional">delimiter<sup><abbr title="optional">?</abbr></sup></span>   | <span class="prop-type">string</span>   | <span class="prop-default">','<br /></span>              | The character used to separate fields.                                                                                                           |
| <span class="prop-name optional">fields<sup><abbr title="optional">?</abbr></sup></span>      | <span class="prop-type">string[]</span> |                                                          | The columns exported in the CSV.<br />This should only be used if you want to restrict the columns exports.                                      |
| <span class="prop-name optional">fileName<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">string</span>   | <span class="prop-default">`document.title`<br /></span> | The string used as the file name.                                                                                                                |
| <span class="prop-name optional">utf8WithBom<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">boolean</span>  | <span class="prop-default">false<br /></span>            | If `true`, the UTF-8 Byte Order Mark (BOM) prefixes the exported file.<br />This can allow Excel to automatically detect file encoding as UTF-8. |
