const EditTableType = {
   /*不可编辑列*/
    UN_EDITABLE : 'UN_EDITABLE',
    /*输入框编辑*/
    INPUT : 'INPUT',
    /*下拉框编辑,需要提供options: [], props: { multiple: true, clearable: true }  */
    SELECT : 'SELECT',

    /*下拉框编辑；只有0，-1*/
    SWITCH : 'SWITCH',

    /*数字类型；可提供  props: { max: 35, min: 18 } */
    INPUT_NUMBER :'INPUT_NUMBER',
    /* 日期类型； 需要提供   props: { type: 'date', format: 'yyyy/MM/dd' } */
    DATE_PICKER :'DATE_PICKER',

    /*自动填充类型；{fetchSuggestions []}  可提供 props: { fetchSuggestions: this.roleFetchSuggestions } */
    AUTO_COMPLETE :'AUTO_COMPLETE',
    /*其他类型，可以通过具体字段名来生成 */
    ELSE:'ELSE'
}

export default EditTableType