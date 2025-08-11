Translate cells of a table to other cells by using the Translator API. See https://developer.chrome.com/docs/ai/translator-api and https://developer.mozilla.org/en-US/docs/Web/API/Translator_and_Language_Detector_APIs.

# Usage

First initiate an `TableCsvTranslation` instance with the `id` of the table:

```js
const tableCsvTranslation = new TableCsvTranslation('my-table');
```

The table *must* have a `thead` with cells. Each cell should have a `data-name` attribute. Each cell that you want to be translated to another cell, *must* have a `data-target` attribute with the namne of the cell that this cell should be translated to. The rows with the content *must* be inside a `tbody`.

For example if the cell `question` should be translated to cell `question_translation`:

```html
<table id="my-table">
    <thead>
        <tr>
            <th>ID</th>
            <th data-name="question" data-target="question_translation">Question</th>
            <th data-name="question_translation">Question translation</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>128<td>
            <td>What is your name?</td>
            <td></td>
        </tr>
        <tr>
            <td>789<td>
            <td>How much do you like going to the movies?</td>
            <td></td>
        </tr>
        <tr>
            <td>989<td>
            <td>What's your favourite hobby?</td>
            <td></td>
        </tr>
    </tbody>
</table>
```

Now you can automatically translate all `question` cells to the `question_translation` cells:

```js
await tableCsvTranslation.translate('en', 'nl', function(e) {
    console.log(e);
});
```

The third parameter is a callback that will be called during the different phases of the translation. The paremeter `e` is an object with a `type` property, that can be one of:

- `initial`
- `downloading` - The browser is downloading the AI model for the specified language (the property `progress` indicates the progress of the download)
- `translating` - Translation is now taking place (the properties `row` and `cell` indicates the index of the row and cell that are currently translated)
- `completed` - Translation is completed

To download the table to a CSV file:

```js
tableCsvTranslation.download('table-nl.csv');
```