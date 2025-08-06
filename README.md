Translate a table by using the Translator API. See https://developer.chrome.com/docs/ai/translator-api and https://developer.mozilla.org/en-US/docs/Web/API/Translator_and_Language_Detector_APIs.

# Usage

First initiate an `TableCsvTranslation` instance with the id of the table:

```
const tableCsvTranslation = new TableCsvTranslation('my-table');
```

The table *must* have a thead with cells. Each cell should have a `data-name` attribute and a `data-target` attribute with the namne of the cell that this cell should be translated to. The rows with the content *must* be inside a tbody.

For example if the cell `question` should be translated to cell `question_translation`:

````
<table id="my-table">
    <thead>
        <tr>
            <th data-name="question" data-target="question_translation">Question</th>
            <th data-name="question_translation">Question translation</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>What is your name?</td>
            <td></td>
        </tr>
        <tr>
            <td>How much do you like going to the movies?</td>
            <td></td>
        </tr>
        <tr>
            <td>What's your favourite hobby?</td>
            <td></td>
        </tr>
    </tbody>
</table>
````

Now you can automatically translate all `question` columns to the `question_translation` columns:

```
await tableCsvTranslation.translate('en', 'nl', function(e) {
    console.log(e);
});
```

To download the table to a CSV file:

```
tableCsvTranslation.download('table-nl.csv');
```