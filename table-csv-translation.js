(function () {

    /**
     * Main object.
     * 
     * @param {String} id Id of table element.
     */
    const TableCsvTranslation = function (id) {

        /**
         * The table DOM element.
         */
        this.table = document.getElementById(id);

        /**
         * Maps source cell index to target cell index for columns that need to be translated.
         */
        this.cellIndexMap = {};

        // Get indexes of source and target columns to translate
        const cellMap = {};
        Array.prototype.forEach.call(this.table.tHead.rows[0].cells, function (cell, index) {
            cellMap[cell.dataset.name] = {
                index,
                target: cell.dataset.target ?? null
            };
        });

        for (let map in cellMap) {
            const cellInfo = cellMap[map];
            if (cellInfo.target) {
                this.cellIndexMap[cellInfo.index] = cellMap[cellInfo.target].index;
            }
        }
    };

    /**
     * Enumerated status values when translating.
     */
    TableCsvTranslation.status = {
        initial: 'initial',
        downloading: 'downloading',
        translating: 'translating',
        completed: 'completed'
    };

    /**
     * Downloads the table as a CSV file.
     * 
     * @param {String} filename Filename for CSV file.
     */
    TableCsvTranslation.prototype.download = function (filename) {
        const rows = [];
        let r = [];
        for (let cell of this.table.tHead.rows[0].cells) {
            r.push('"' + cell.dataset.name + '"');
        }
        rows.push(r);
        for (let row of this.table.tBodies[0].rows) {
            let r = [];
            for (let cell of row.cells) {
                r.push('"' + cell.innerText + '"');
            }
            rows.push(r);
        }

        let blob = new Blob([rows.map((row) => row.join(',')).join("\n")], { type: 'text/csv' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        a.remove();
        a = null;
        URL.revokeObjectURL(url);
        url = null;
        blob = null;
    };

    /**
     * Translate all defined cells from the source to target locale.
     * 
     * @param {String} sourceLocale Locale of source text.
     * @param {String} targetLocale Locale of target text.
     * @param {Function} onProgress Callback for monitoring the progress.
     */
    TableCsvTranslation.prototype.translate = async function (sourceLocale, targetLocale, onProgress) {

        onProgress({
            type: TableCsvTranslation.status.initial
        });

        const availability = await Translator.availability({
            sourceLanguage: sourceLocale,
            targetLanguage: targetLocale
        });

        if (availability === 'unavailable') {
            throw new Error(`Model for translation from ${sourceLocale} to ${targetLocale} is unavailable`);
        }

        const translator = await Translator.create({
            sourceLanguage: sourceLocale,
            targetLanguage: targetLocale,
            monitor: function (m) {
                m.addEventListener('downloadprogress', function (e) {
                    onProgress({
                        type: TableCsvTranslation.status.downloading,
                        progress: e.loaded
                    });
                });
            }
        });

        for (let rowIndex = 0; rowIndex < this.table.tBodies[0].rows.length; rowIndex++) {
            const row = this.table.tBodies[0].rows[rowIndex];
            for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                if (cellIndex in this.cellIndexMap) {
                    onProgress({
                        type: TableCsvTranslation.status.translating,
                        row: rowIndex,
                        cell: cellIndex
                    });
                    row.cells[this.cellIndexMap[cellIndex]].innerText = await translator.translate(row.cells[cellIndex].innerText);
                }
            }
        }

        onProgress({
            type: TableCsvTranslation.status.completed
        });
    };

    /**
     * Make this object globally available.
     */
    self.TableCsvTranslation = TableCsvTranslation;

}());