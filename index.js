(function () {

    const tableCsvTranslation = new self.TableCsvTranslation('my-table');
    const select = document.getElementById('select-locale');
    select.addEventListener('change', doTranslate);

    const button = document.getElementById('csv-button');
    button.addEventListener('click', function () {
        tableCsvTranslation.download('table-' + select.value + '.csv');
    });

    const statusEl = document.getElementById('status');

    async function doTranslate() {

        statusEl.innerText = '';
        button.setAttribute('disabled', true);

        if (!select.value) {
            return;
        }
        try {
            await tableCsvTranslation.translate('en', select.value, function (e) {
                switch (e.type) {
                    case self.TableCsvTranslation.status.downloading:
                        statusEl.innerText = `${e.type} - ${e.progress}`;
                        break;
                    case self.TableCsvTranslation.status.translating:
                        statusEl.innerText = `${e.type} - ${e.row} / ${e.cell}`;
                        break;
                    default:
                        statusEl.innerText = e.type;
                }
                if (e.type === self.TableCsvTranslation.status.completed) {
                    button.removeAttribute('disabled');
                }
            });
        } catch (error) {
            alert(error);
        }
    }

    doTranslate();


}());