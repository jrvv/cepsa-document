var utils = (function () {
    //  let _observers = [];
    let _sicronizeSelecs = (origin, target) => {
        let divOrigin = ibiCompound.drawObjectsPtr[origin].objs,
            divTarget = ibiCompound.drawObjectsPtr[target].objs;
        let changeEvent = () => {
            divOrigin.querySelector('select')?.addEventListener('change', (e) => {

                let value = e.srcElement.value,
                    targetSelect = divTarget.querySelector('select');
                targetSelect.value = value;
                if (targetSelect.value == '') {
                    targetSelect.value = targetSelect.querySelector('option:first-child').value;
                }
                ibiCompound.drawObjectsPtr[target].updateValues();
                ibiCompound.drawObjectsPtr[target].doFilter()

            })
        }
        let callback = function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    changeEvent();
                }
                else if (mutation.type == 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }
        };
        changeEvent();
        let observer = new MutationObserver(callback);
        let config = { attributes: true, childList: true };
        observer.observe(divOrigin, config);

    }
    let _setValueSelect = (idSelect, value) => {
        let divSelect = ibiCompound.drawObjectsPtr[idSelect].objs,
            select = divSelect.querySelector('select');
        select.value = value;
        ibiCompound.drawObjectsPtr[idSelect].updateValues();
        ibiCompound.drawObjectsPtr[idSelect].doFilter()
    }
    return {
        sincronizeSelects: _sicronizeSelecs,
        setValueSelect: _setValueSelect
    }
})()